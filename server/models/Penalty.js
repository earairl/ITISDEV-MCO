const mongoose = require('mongoose');

const penaltySchema = new mongoose.Schema({
    penaltyId:      {type: String, unique: true, default: uuidv4},
    userId:         {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reason:         {type: String},
    dateIssued:     {type: Date, required: true},
    matchId:        {type: mongoose.Schema.Types.ObjectId, ref: 'Match'},
    status:         {type: String}
}, {collection: 'Penalties'});

const Penalty = mongoose.model('Penalty', penaltySchema);
module.exports = Penalty;