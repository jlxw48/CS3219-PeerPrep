require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var corsOptions = {
    origin: 'https://peerprep.ml',
    credentials: true 
};
app.use(cors(corsOptions));

const dbController = require('./controllers/dbController')
const chatApiRoutes = require('./routes/chatApiRoutes');
const responseStatus = require('./common/status/responseStatus');
const clientErrors = require('./common/errors/clientErrors');
const clientMessages = require('./common/messages/clientMessages')


const io = new Server(server, {
    path: "/api/chat/create",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

// Don't catch connection error, since chat microservice shouldn't work if can't connect.
mongoose.connect(dbURI)
    .then((result) => {
        console.log('Connected to MongoDB');
    })

// Use the chat API routes
app.use('/api/chat', chatApiRoutes);

app.use((req, res) => {
    res.status(404).json({
        status: responseStatus.FAILED,
        data: {
            message: clientErrors.INVALID_API_ENDPOINT
        }
    });
});

const port = process.env.PORT || 8002;
var server = app.listen(port, () => {
    console.log(`Chat microservice listening on port ${port}`);
});

// Event 'connection': Fired upon a connection from client
io.sockets.on("connection", socket => {
    console.log("a user connected");
    socket.on("message", newMessage => {
        // If partner has ended interview, send a message to inform the other buddy
        if (newMessage.contents.message === "/end_interview") {
            const endMessageContents = {
                userEmail: newMessage.contents.userEmail,
                message: clientMessages.PARTNER_ENDED_INTERVIEW
            }
            io.sockets.emit(newMessage.interviewId, endMessageContents);
            return;
        }

        // Saves the chat message to chat history
        dbController.saveNewMessage(newMessage);
        console.log(newMessage);
        io.sockets.emit(newMessage.interviewId, newMessage.contents);
    });
});

// Export app for testing purposes
module.exports = app;