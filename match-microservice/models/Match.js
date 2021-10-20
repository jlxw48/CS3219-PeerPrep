const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchSchema = new Schema({
    email: {
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
    partnerEmail: {
        type: String
    },
    interviewId: {
        type: String
    },
    questionTitle: {
        type: String
    },
    questionDescription: {
        type: String
    }
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;