const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    interviewId: {
        type: String,
        required: true
    },
    history: {
        type: [Object],
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,  // expires after 1h
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;