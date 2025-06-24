const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    credentials: {
        userId:         {type: String, unique: true, default: uuidv4},
        username:       {type: String, required: true, unique: true},
        email:          {type: String, required: true, unique: true},
        passwordSalt:   {type: String, required: function () { return !this.deleted; }},
        passwordHash:   {type: String, required: function () { return !this.deleted; }}
    },
    penalties:          [{ type: mongoose.Schema.Types.ObjectId, ref: 'Penalty' }],
    currentlyQueued:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    matchHistory:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    deleted:            { type: Boolean, default: false }
}, {collection: 'Users'});

const User = mongoose.model('User', userSchema);
module.exports = User;