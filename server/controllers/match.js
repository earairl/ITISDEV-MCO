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
                { path: 'players', select: 'ceredentials.username' },
                { path: 'waitlist', select: 'ceredentials.username' },
            ])
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const getFormattedGames = async (req, res) => {
    try {
        const initialGames = await Match.find()
            .populate([
                { path: 'players', select: 'ceredentials.username' },
                { path: 'waitlist', select: 'ceredentials.username' },
            ])
            .lean()

        const games = initialGames.map(game => {
            const initialDate = new Date(game.date)
            return {
                ...game,
                date: initialDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
                time: initialDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            }
        })
        res.json(games)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const createMatch = async (req, res) => {
    const { date, time, venue, maxPlayers, userId } = req.body;

    try {
        const matchDateTime = new Date(`${date}T${time}`);
        const parsedMaxPlayers = parseInt(maxPlayers, 10);
        
        const user = await User.findOne({ 'credentials.userId': userId });
        const member = await serverGetMemberInfo(userId);

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

module.exports = { createMatch, getGames, getFormattedGames };