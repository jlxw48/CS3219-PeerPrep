require("dotenv").config();

const express = require('express');
var cors = require('cors');
const mongoose = require('mongoose');
const dbController = require('./controllers/dbController')
const chatApiRoutes = require('./routes/chatApiRoutes');
const responseStatus = require('./common/status/responseStatus');
const clientErrors = require('./common/errors/clientErrors');

const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const { PARTNER_CONNECTED } = require("./common/messages/clientMessages");

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
const server = http.createServer(app);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
    path: "/api/chat/create",
    cors: {
        origin: "http://localhost",
        methods: ["GET", "POST", "DELETE"],
        credentials: true
    },
    pingInterval: 8000,
    pingTimeout: 8000
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
        if (io.sockets.adapter.rooms.get(interviewId).size === 2) {
            io.to(interviewId).emit("notification", {
                senderEmail: "server",
                message: PARTNER_CONNECTED
            })
        }
    });

    socket.on("message", newMessage => {
        // Saves the chat message to chat history
        dbController.saveNewMessage(newMessage);
        io.to(newMessage.interviewId).emit("message", newMessage.contents);
    });

    socket.on("notification", newMessage => {
        io.to(newMessage.interviewId).emit("notification", newMessage.contents);
    })

    socket.on("end_interview", endInterviewMessage => {
        socket.leave(endInterviewMessage.interviewId);
        // If partner has ended interview, send a message to inform the other buddy
        io.to(endInterviewMessage.interviewId).emit("notification", endInterviewMessage.contents);
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

app.use((req, res) => {
    res.status(404).json({
        status: responseStatus.FAILED,
        data: {
            message: clientErrors.INVALID_API_ENDPOINT
        }
    });
});

// Export app for testing purposes
module.exports = app;