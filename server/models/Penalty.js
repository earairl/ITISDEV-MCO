const mongoose = require('mongoose');

const penaltySchema = new mongoose.Schema({
  memberId:     {type: String/*type: mongoose.Schema.Types.ObjectId ref: 'Member'*/, required: true},
  reason:       {type: String, required: true},
  dateIssued:   {type: Date, required: true, default: Date.now},
  matchId:      {type: String /*mongoose.Schema.Types.ObjectId, ref: 'Match'*/, required: true},
  status:       {type: String, enum: ['active', 'cleared'], required: true, default: 'active'}
}, {collection: 'Penalties'});

const Penalty = mongoose.model('Penalty', penaltySchema);
module.exports = Penalty;
