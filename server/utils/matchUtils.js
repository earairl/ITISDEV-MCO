
const Match = require('../models/Match');
const User = require('../models/User');
const { createNotification } = require('../utils/notifications');

async function refreshQueue(game) {
    if (game.waitlist.length > 0) {
        const player = game.waitlist[0]
        const user = await User.findById(player._id)
        game.waitlist.pull(player)
        game.players.push(player)
        user.currentlyQueued.push(game._id)

        const readableDate = game.start.toLocaleDateString('en-US', { 
            month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' 
        });
        const readableTime = game.start.toLocaleTimeString('en-US', { 
            hour: 'numeric', minute: '2-digit', hour12: true 
        });

        await createNotification(
            player._id,
            'slot_granted',
            'You\'re In!',
            `Great news! A spot opened up and you've been moved from the waitlist to the match on ${readableDate} at ${game.venue} (${readableTime}).`,
            { 
                gameId: game._id,
                venue: game.venue,
                date: readableDate,
                time: readableTime
            }
        );

        await user.save()
    }

    if (game.players.length < game.maxPlayers) game.status = 'open'

    return await game.save();
}

const serverLeaveMatches = async (id) => {
    try {
        const games = await Match.find({ 
            $or: [
                { players: { $in: [id] } },
                { waitlist: { $in: [id] } },
            ]
        })

        console.log(games)

        for (const game of games) {
            if (game.players.includes(id)) game.players.pull(id)
            if (game.waitlist.includes(id)) game.waitlist.pull(id)
            await refreshQueue(game)
        }
        
        return { success: true }
    } catch (error) {
        console.log('Error in leaving game (server side): ', error);
        return { success: false };
    }
}

module.exports = { serverLeaveMatches }