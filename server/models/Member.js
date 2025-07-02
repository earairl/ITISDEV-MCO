const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    idNum:          {type: String, unique: true, required: true},
    firstName:      {type: String, required: true},
    lastName:       {type: String, required: true},
    college:        {type: String, required: true},
    position:       {
        type: String,
        enum: ['member', 'officer'], // only allow these values
    },
    dateJoined:     {type: Date},
    lastMatchJoined:{type: Date},
    isActive:       {type: Boolean, default: true}
}, {collection: 'Members'});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
