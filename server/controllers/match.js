const Match = require('../models/Match');
const User = require('../models/User');
const { serverGetMemberInfo } = require('./member');
const logAudit = require('../utils/auditLogger');

const getGames = async (res) => {
    try {
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
        const initialGame = await Match.findById(req.params.gameId)
            .populate([
                { path: 'players', select: 'credentials.username' },
                { path: 'waitlist', select: 'credentials.username' },
            ])
            .lean()

        const initialDate = new Date(initialGame.date)
        const game = {
            ...initialGame,
            date: initialDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' }),
            time: initialDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
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
        const initialGames = await Match.find().lean()

        const games = initialGames.map(game => {
            const initialDate = new Date(game.date)
            return {
                ...game,
                date: initialDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'long' }),
                time: initialDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            }
        })
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const joinMatch = async (req, res) => {
    const { username, gameId } = req.body

    function checkStatus(len, max) {
        if (len === max) return 'full'
        return 'open'
    }

    try {
        const user = await User.findOne({ 'credentials.username': username })
        const game = await Match.findById(gameId)

        if (game.players.includes(user._id) || game.waitlist.includes(user._id))
            return res.status(409).json({ message: 'Already registered for this game.' })

        if (game.players.length < game.maxPlayers) {
            game.players.push(user._id);
            game.status = checkStatus(game.players.length, game.maxPlayers)
            await game.save();
            return res.status(200).json({ message: 'Successfully joined the game!' });
        }
        
        game.waitlist.push(user._id);
        await game.save();
        return res.status(200).json({ message: 'Added to the waitlist.' });
    } catch (error) {
        console.error('Error joining match:', error);
        res.status(500).json({ message: 'Error joining match.', error });
    }
}

const createMatch = async (req, res) => {
    const { date, time, venue, maxPlayers, userId } = req.body;

    try {
        const matchDateTime = new Date(`${date}T${time}`);
        const oneHourBefore = new Date(matchDateTime.getTime() - 59 * 60 * 1000);
        const oneHourAfter = new Date(matchDateTime.getTime() + 59 * 60 * 1000);
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

        if (matchDateTime < new Date()) {
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
            date: matchDateTime,
            venue,
            maxPlayers,
            createdBy: user,
            players: [],
            waitlist: [],
            status: 'open'
        });

        await newMatch.save();
        res.status(201).json({ message: 'Match created successfully!', matchId: newMatch._id });

    } catch (error) {
        console.error('Error creating match:', error);
        res.status(500).json({ message: 'Error creating match.', error });
    }
};

module.exports = { joinMatch, createMatch, getGames, getFormattedGame, getFormattedGames };