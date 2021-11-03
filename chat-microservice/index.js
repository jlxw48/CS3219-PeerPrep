require("dotenv").config();

const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose');
const dbController = require('./controllers/dbController')
const chatApiRoutes = require('./routes/chatApiRoutes');

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const io = new Server(server, {
    path: "/chat/create",
    cors: {
        origin: "*",
        methods: ["GET", "POST", "DELETE"]
    }
});

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PW = process.env.REDIS_PW;
const pubClient = createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
    auth_pass: REDIS_PW
});

const subClient = createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
    auth_pass: REDIS_PW
});
io.adapter(createAdapter(pubClient, subClient));

// Event 'connection': Fired upon a connection from client
io.on("connection", socket => {
    console.log("a user connected");

    socket.on("joinRoom", interviewId => {
        socket.join(interviewId);
    });

    socket.on("message", newMessage => {
        // Saves the chat message to chat history
        dbController.saveNewMessage(newMessage);
        io.to(newMessage.interviewId).emit("message", newMessage.contents);
    });

    socket.on("end_interview", endInterviewMessage => {
        socket.leave(endInterviewMessage.interviewId);
        // If partner has ended interview, send a message to inform the other buddy
        io.to(endInterviewMessage.interviewId).emit("end_interview", endInterviewMessage.contents);
    });
});

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

const port = process.env.PORT || 8002;
server.listen(port, async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB');
        console.log(`Chat microservice listening on port ${port}`);
    } catch (err) {
        console.log(err)
    }
});

// Use the chat API routes
app.use('/api/chat', chatApiRoutes);

// Export app for testing purposes
module.exports = app;