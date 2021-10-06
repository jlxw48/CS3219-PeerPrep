const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    partnerUsername: {
        type: String
    },
    interviewId: {
        type: String
    }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;