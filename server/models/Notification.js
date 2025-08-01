const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['match_change', 'match_cancellation', 'slot_granted', 'position_change'],
        required: true 
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed }, // Additional data like gameId, old/new values
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'Notifications' });

module.exports = mongoose.model('Notification', notificationSchema);