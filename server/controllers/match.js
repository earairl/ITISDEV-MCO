const Match = require('../models/Match');
const User = require('../models/User');
const { serverGetMemberInfo } = require('./member');
const logAudit = require('../utils/auditLogger');

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

module.exports = { createMatch };