const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true }
});

module.exports = mongoose.model('Vote', voteSchema);
