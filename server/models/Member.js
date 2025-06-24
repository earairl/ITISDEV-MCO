const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    idNum:          {type: String, unique: true, required: true},
    firstName:      {type: String, required: true},
    lastName:       {type: String, required: true},
    college:        {type: String, required: true},
    position:       {type: String},
    dateJoined:     {type: Date},
    lastMatchJoined:{type: Date},
    deleted:        {type: Boolean, default: false}
}, {collection: 'Members'});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;