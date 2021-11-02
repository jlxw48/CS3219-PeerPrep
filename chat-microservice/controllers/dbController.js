const Chat = require('../models/Chat');

// Saves the chat message to chat history
const saveNewMessage = (newMessage) => {
    Chat.findOne({
        interviewId: newMessage.interviewId
    })
    .then(result => {
        const message = newMessage.contents;
        if (!result) {
            const chat = new Chat({
                interviewId: newMessage.interviewId,
                history: [message]
            });
            chat.save()
            .then(saveResult => {
                console.log("saved chat message successfully");
            })
            .catch((err) => {
                console.log(err);
            });
        } else {
            Chat.findOneAndUpdate({
                interviewId: newMessage.interviewId
            }, {
                $push: {history: message}
            })
            .then(updateResult => {
                console.log("saved chat message successfully");
            })
            .catch((err) => {
                console.log(err);
            });
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = {
    saveNewMessage,
};