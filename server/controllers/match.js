const Match = require('../models/Match');
const User = require('../models/User');
const { serverGetMemberInfo } = require('./member');
const { serverGetUser } = require('./user');
const logAudit = require('../utils/auditLogger');
const { createNotification } = require('../services/notifications');

const getGames = async (res) => {
    try {
        await autoCloseMatches()
        const games = await Match.find({
            status: { $in: ['open', 'ongoing', 'full'] },
            })
            .populate([
                { path: 'players', select: 'credentials.username' },
                { path: 'waitlist', select: 'credentials.username' },
            ])
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getFormattedGame = async (req, res) => {
    try {
        await autoCloseMatches()
        
        const initialGame = await Match.findById(req.params.gameId)
            .populate([
                { path: 'players', select: 'credentials.username' },
                { path: 'waitlist', select: 'credentials.username' },
            ])
            .lean()

        const initialDate = new Date(initialGame.start)
        const game = {
            ...initialGame,
            date: initialDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' }),
            start: initialDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            end: initialGame.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        }

        game.players = game.players.map(u => ({
            _id: u._id,
            username: u.credentials.username
        }))
        game.waitlist = game.waitlist.map(u => ({
            _id: u._id,
            username: u.credentials.username
        }))

        res.json(game)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getFormattedGames = async (req, res) => {
    try {
        await autoCloseMatches()
        const initialGames = await Match.find().lean()

        const games = initialGames.map(game => {
            const initialDate = new Date(game.start)
            return {
                ...game,
                date: initialDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' }),
                start: initialDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                end: game.end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            }
        })
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const editMatch = async (req, res) => {
    const { date, start, end, venue, maxPlayers, allowOutsiders, gameId, userId } = req.body;

    try {
        const matchDateTimeStart = new Date(`${date}T${start}`);
        const matchDateTimeEnd = new Date(`${date}T${end}`);
        const oneHourBefore = new Date(matchDateTimeStart.getTime() - 59 * 60 * 1000);
        const oneHourAfter = new Date(matchDateTimeEnd.getTime() + 59 * 60 * 1000);
        const parsedMaxPlayers = parseInt(maxPlayers, 10);
        
        const user = await User.findOne({ 'credentials.userId': userId });
        const member = await serverGetMemberInfo(userId);
        const conflictingMatch = await Match.findOne({
            venue: venue,
            date: { $gte: oneHourBefore, $lte: oneHourAfter },
            status: { $in: ['open', 'ongoing', 'full'] }
        });

        let position = '';
        if (member){
            position = member.memberInfo.position;
        }

        if (!user || position !== 'officer') {
            return res.status(400).json({ message: 'You are not eligible to edit a queueing match schedule.' });
        }

        if (matchDateTimeStart < new Date()) {
            return res.status(400).json({ message: 'Invalid schedule. Match cannot be set in the past.' });
        }
        
        if (conflictingMatch) {
            return res.status(400).json({
                message: `Schedule conflict: There is already a match scheduled at ${venue} within 1 hour of the selected time.`
            });
        }

        if (parsedMaxPlayers <= 1) {
            return res.status(400).json({ message: 'You need at least two players to set a match.' });
        }

        const fields = ['start', 'end', 'venue', 'maxPlayers', 'allowOutsiders']
        const initialMatch = await Match.findById(gameId)
        const newMatch = new Match({
            start: matchDateTimeStart,
            end: matchDateTimeEnd,
            venue,
            maxPlayers,
            allowOutsiders,
        });

        const hasChanges = fields.some(field => {
            return initialMatch[field] !== newMatch[field]
        })

        if (hasChanges) {
            const changes = {};
            const oldStart = initialMatch.start;
            const oldEnd = initialMatch.end;
            const oldVenue = initialMatch.venue;

            if (oldStart.getTime() !== matchDateTimeStart.getTime()) 
                changes.start = { old: oldStart, new: matchDateTimeStart };
            if (oldEnd.getTime() !== matchDateTimeEnd.getTime()) 
                changes.end = { old: oldEnd, new: matchDateTimeEnd };
            if (oldVenue !== venue) 
                changes.venue = { old: oldVenue, new: venue };

            const scheduleChanged = oldStart.getTime() !== matchDateTimeStart.getTime() || oldEnd.getTime() !== matchDateTimeEnd.getTime();
            const venueChanged = oldVenue !== venue;

            initialMatch.start = matchDateTimeStart;
            initialMatch.end = matchDateTimeEnd;
            initialMatch.venue = venue;
            initialMatch.maxPlayers = maxPlayers;
            initialMatch.allowOutsiders = allowOutsiders;

            if (initialMatch.players.length > maxPlayers) {
                const remaining = initialMatch.players.slice(0, maxPlayers);
                const waitlisted = initialMatch.players.slice(maxPlayers);
                initialMatch.players = remaining;
                initialMatch.waitlist = [...waitlisted, ...initialMatch.waitlist];
            }

            await initialMatch.save();

            const readableDate = matchDateTimeStart.toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric', weekday: 'long'
            });
            const readableStart = matchDateTimeStart.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true
            });
            const readableEnd = matchDateTimeEnd.toLocaleTimeString('en-US', {
                hour: 'numeric', minute: '2-digit', hour12: true
            });

            let title = 'Match Schedule Changed';
            let message = `Your match at ${venue} has been rescheduled to ${readableDate} | ${readableStart} – ${readableEnd}`;
            let data = {
                gameId: initialMatch._id,
                newStart: matchDateTimeStart,
                newEnd: matchDateTimeEnd,
                oldStart,
                oldEnd
            };

            if (scheduleChanged && venueChanged) {
                title = 'Match Schedule and Venue Changed';
                message = `Your match has moved from ${oldVenue} to ${venue} and has been rescheduled to ${readableDate} | ${readableStart} – ${readableEnd}`;
                data = {
                    gameId: initialMatch._id,
                    oldVenue,
                    newVenue: venue,
                    newStart: matchDateTimeStart,
                    newEnd: matchDateTimeEnd,
                    oldStart,
                    oldEnd
                };
            } else if (venueChanged) {
                title = 'Match Venue Changed';
                message = `Your match on ${readableDate} has moved from ${oldVenue} to ${venue}`;
                data = {
                    gameId: initialMatch._id,
                    oldVenue,
                    newVenue: venue
                };
            }

            await createNotification(
                user._id,
                'match_change',
                title,
                message,
                data
            );

            return res.status(200).json({ message: 'Match updated successfully!' });
        }

        else res.status(200).json({ message: 'No changes detected.' });

    } catch (error) {
        console.error('Error updating match:', error);
        return res.status(500).json({ message: 'Error updating match.', error });
    }
}

const joinMatch = async (req, res) => {
    const { username, gameId } = req.body

    function checkStatus(len, max) {
        if (len === max) return 'full'
        return 'open'
    }

    try {
        await autoCloseMatches()

        const user = await User.findOne({ 'credentials.username': username })
        const game = await Match.findById(gameId)

        const memberInfo = await serverGetMemberInfo(user.credentials.userId)
        const isMember = memberInfo && memberInfo.memberInfo // check for BadSoc Member

        if (!isMember && !game.allowOutsiders) {
            return res.status(403).json({ message: 'This game is only open to BadSoc members.' });

        }

        const newStart = game.start;
        const newEnd = game.end;

        const conflictingMatch = await Match.findOne({
            _id: { $ne: gameId }, //exclude current game
            $and: [
                {
                    $or: [ // user is either queued or on waitlist
                        { players: user._id },
                        { waitlist: user._id }
                    ],
                },
                {
                    start: { $lte: newEnd }, //<=
                    end: { $gte: newStart }, //>=
                }
            ]
        });

        if (conflictingMatch) {
            return res.status(409).json({ message: 'Conflicting timeslot with another game.' });
        }

        if (game.players.includes(user._id) || game.waitlist.includes(user._id))
            return res.status(409).json({ message: 'Already registered for this game.' })

        if (game.players.length < game.maxPlayers) {
            game.players.push(user._id);
            game.status = checkStatus(game.players.length, game.maxPlayers)
            user.currentlyQueued.push(game._id)
            await user.save()
            await game.save();
            return res.status(200).json({ message: 'Successfully joined the game!', user: await serverGetUser(user._id) });
        }
        
        game.waitlist.push(user._id);
        await game.save();
        return res.status(200).json({ message: 'Added to the waitlist.' });
    } catch (error) {
        console.error('Error joining match:', error);
        res.status(500).json({ message: 'Error joining match.', error });
    }
}

// call whenever a user backs out from a full match
async function refreshQueue(game) {
    const player = game.waitlist[0]
    const user = await User.findById(player._id)
    game.waitlist.pull(player)
    game.players.push(player)
    user.currentlyQueued.push(game._id)

    return await game.save()
}

// frontend must validate that user is registered in the match
const leaveMatch = async (req, res) => {
    const { username, gameId } = req.body

    try {
        await autoCloseMatches()

        const user = await User.findOne({ 'credentials.username': username })
        const game = await Match.findById(gameId)

        const isFull = game.players.length === game.maxPlayers ? true : false

        // jic lang pero validations should be performed in frontend guro to be safe
        if (!game.players.includes(user._id) && !game.waitlist.includes(user._id))
            return res.status(409).json({ message: 'Did not register for this game.' })

        if (game.players.includes(user._id)) {
            game.players.pull(user._id)
            user.currentlyQueued.pull(game._id)
            await user.save()
        }
        else if (game.waitlist.includes(user._id)) game.waitlist.pull(user._id)

        await game.save()

        if (isFull && game.waitlist.length) await refreshQueue(game)
        
        return res.status(200).json({ message: 'Successfully withdrew from the game.', user: await serverGetUser(user._id) })
    } catch (error) {
        console.error('Error leaving match:', error);
        res.status(500).json({ message: 'Error leaving match.', error });
    }
}

const createMatch = async (req, res) => {
    const { date, start, end, venue, maxPlayers, allowOutsiders, userId } = req.body;

    try {
        const matchDateTimeStart = new Date(`${date}T${start}`);
        const matchDateTimeEnd = new Date(`${date}T${end}`);
        const oneHourBefore = new Date(matchDateTimeStart.getTime() - 59 * 60 * 1000);
        const oneHourAfter = new Date(matchDateTimeEnd.getTime() + 59 * 60 * 1000);
        const parsedMaxPlayers = parseInt(maxPlayers, 10);
        
        const user = await User.findOne({ 'credentials.userId': userId });
        const member = await serverGetMemberInfo(userId);
        const conflictingMatch = await Match.findOne({
            venue: venue,
            date: { $gte: oneHourBefore, $lte: oneHourAfter },
            status: { $in: ['open', 'ongoing', 'full'] }
        });

        let position = '';
        if (member){
            position = member.memberInfo.position;
        }

        if (!user || position !== 'officer') {
            return res.status(400).json({ message: 'You are not eligible to create a queueing match schedule.' });
        }

        if (matchDateTimeStart < new Date()) {
            return res.status(400).json({ message: 'Invalid schedule. Match cannot be set in the past.' });
        }
        
        if (conflictingMatch) {
            return res.status(400).json({
                message: `Schedule conflict: There is already a match scheduled at ${venue} within 1 hour of the selected time.`
            });
        }

        if (parsedMaxPlayers <= 1) {
            return res.status(400).json({ message: 'You need at least two players to set a match.' });
        }

        const newMatch = new Match({
            start: matchDateTimeStart,
            end: matchDateTimeEnd,
            venue,
            maxPlayers,
            createdBy: user,
            players: [],
            waitlist: [],
            status: 'open',
            allowOutsiders,
        });

        await newMatch.save();
        res.status(201).json({ message: 'Match created successfully!', matchId: newMatch._id });

    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Error creating match.', error });
    }
};

const updateMatchStatus = async (req, res) => {
    const { gameId, status } = req.body

    try {
        const game = await Match.findById(gameId)
        const previousStatus = game.status
        game.status = status

        if ((status === "closed" || status === "completed") && 
            previousStatus !== "closed" && previousStatus !== "completed") {
            for (const playerId of game.players) {
                const user = await User.findById(playerId)
                if (user) {
                    user.currentlyQueued.pull(gameId)

                    if (!user.matchHistory.includes(gameId))
                        user.matchHistory.push(gameId)

                    await user.save()
                }
            }
        }

        if (status === 'cancelled' && previousStatus !== 'cancelled') {
            const readableDate = game.start.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' });
            const readableStartTime = game.start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

            await createNotification(
                game.createdBy,
                'match_cancellation',
                'Match Cancelled',
                `Match Cancelled: ${game.venue} - ${readableDate} | ${readableStartTime}`,
                { gameId: game._id }
            );
        }

        await game.save()
        return res.status(200).json({ message: 'Match status updated successfully!' })
    } catch (err) {
        console.error('Error updating match status: ', error);
        return res.status(500).json({ message: 'Error updating match status.', error });
    }
}

const autoCloseMatches = async () => {
    try {
        const now = new Date();
        
        // optimization
        const expiredCount = await Match.countDocuments({
            end: { $lt: now },
            status: { $in: ['open', 'full', 'ongoing'] }
        });
        
        if (expiredCount === 0) 
            return 0; // No work needed, return immediately

        // expensive operation
        const expiredMatches = await Match.find({
            end: { $lt: now }, // Mongodb operator, less than
            status: { $in: ['open', 'full', 'ongoing'] } // in array
        });

        console.log(`Checking for expired matches: ${expiredMatches.length} found`);

        for (const match of expiredMatches) {
            console.log(`Auto-closing expired match ${match._id}`);
            
            // Update match status
            match.status = 'closed';
            
            // Move players from queue to history
            for (const playerId of match.players) {
                const user = await User.findById(playerId);
                if (user) {
                    user.currentlyQueued.pull(match._id);
                    if (!user.matchHistory.includes(match._id)) {
                        user.matchHistory.push(match._id);
                    }
                    await user.save();
                }
            }
            
            await match.save();
        }
        
        return expiredMatches.length;
    } catch (error) {
        console.error('Error closing expired matches:', error);
        return 0;
    }
}

module.exports = { updateMatchStatus, editMatch, joinMatch, leaveMatch, createMatch, getGames, getFormattedGame, getFormattedGames, autoCloseMatches };