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
    question: {
        type: Object,
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
        expires: 3600,
        default: Date.now
    }
});

const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;