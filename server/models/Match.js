const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    date:       {type: Date, required: true}, // used also for time of match
    venue:      {type: String, required: true},
    maxPlayers: {type: Number, required: true},
    createdBy:  {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    players:    [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // array of users in the queue
    waitlist:   [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}], // array of users on waitlist
    status:     {type: String, enum: ['open', 'closed', 'ongoing', 'cancelled'], required: true, default: 'open'} 
}, {collection: 'Matches'});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
