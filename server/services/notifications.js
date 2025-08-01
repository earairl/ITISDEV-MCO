const Notification = require('../models/Notification');
const User = require('../models/User')

const createNotification = async (userId, type, title, message, data = {}) => {
    try {
        const notification = new Notification({
            userId,
            type,
            title,
            message,
            data
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

const getUserNotifications = async (req, res) => {
    const username = req.params.userId;

    try {
        const user = await User.findOne({ 'credentials.username': username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const currentlyQueuedGameIds = user.currentlyQueued;

        console.log(`currentlyQueuedGameIds: ${currentlyQueuedGameIds}`);

        const notifications = await Notification.find({
            $or: [
                {
                    type: { $in: ['match_change', 'match_cancellation'] },
                    'data.gameId': { $in: currentlyQueuedGameIds }
                }
            ]
        }).sort({ createdAt: -1 });

        console.log(`notifications: ${notifications}`);

        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
    }
};

module.exports = { createNotification, getUserNotifications };