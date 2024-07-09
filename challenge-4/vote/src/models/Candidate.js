const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
    username: { type: String, required: true,unique: true },
    votes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Candidate', candidateSchema);
