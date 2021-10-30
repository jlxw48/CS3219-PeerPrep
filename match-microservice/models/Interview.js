const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewSchema = new Schema({
    interviewId: {
        type: String,
        required: true,
        unique: true
    },
    difficulty: {
        type: String,
        required: true
    },
    questionTitle: {
        type: String,
        required: true
    },
    questionDescription: {
        type: String,
        required: true
    },
    firstUserEmail: {
        type: String
    },
    secondUserEmail: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;