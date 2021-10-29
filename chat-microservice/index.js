require("dotenv").config();

const express = require('express');
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
const mongoose = require('mongoose');
const dbController = require('./controllers/dbController')
const chatApiRoutes = require('./routes/chatApiRoutes');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
    path: "/api/chat/create",
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Event 'connection': Fired upon a connection from client
io.on("connection", socket => {
    console.log("a user connected");
    socket.on("message", newMessage => {
        // If partner has ended interview, send a message to inform the other buddy
        if (newMessage.contents.message === "/end_interview") {
            const endMessageContents = {
                userEmail: newMessage.contents.userEmail,
                message: "Your partner has ended the interview"
            }
            io.emit(newMessage.interviewId, endMessageContents);
            return;
        }

        // Saves the chat message to chat history
        dbController.saveNewMessage(newMessage);
        io.emit(newMessage.interviewId, newMessage.contents);
    });
});

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

mongoose.connect(dbURI)
    .then((result) => {
        console.log('Connected to MongoDB');

        const port = process.env.PORT || 8002;
        server.listen(port, () => {
            console.log(`Chat microservice listening on port ${port}`);
        });
    })
    .catch((err) => console.log(err));

// Use the chat API routes
app.use('/api/chat', chatApiRoutes);

// Export app for testing purposes
module.exports = app;