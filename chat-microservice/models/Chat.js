const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    interviewId: {
        type: String,
        required: true
    },
    history: {
        type: [{userEmail : String, message: String}],
        required: true
    },
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;