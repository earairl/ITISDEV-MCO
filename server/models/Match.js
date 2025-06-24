const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchId:        {type: String, unique: true, default: uuidv4},
    matchDate:      {type: Date, required: true},
    venue:          {type: String, required: true},
    createdBy:      {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    maxPlayers:     {type: String},
    players:        [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    waitlist:       [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    status:         {type: String}
}, {collection: 'Matches'});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;