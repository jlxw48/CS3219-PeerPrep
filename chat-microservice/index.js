require("dotenv").config();

const express = require('express');
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var corsOptions = {
    origin: ['https://peerprep.ml', 'https://peerprep-g5.tk', 'http://localhost:3000'],
    credentials: true 
};
app.use(cors(corsOptions));
const server = http.createServer(app);

const dbController = require('./controllers/dbController')
const chatApiRoutes = require('./routes/chatApiRoutes');
const responseStatus = require('./common/status/responseStatus');
const clientErrors = require('./common/errors/clientErrors');
const clientMessages = require('./common/messages/clientMessages');

const io = new Server(server, {
    path: "/api/chat/create",
    cors: {
        origin: ['https://peerprep.ml', 'https://peerprep-g5.tk', 'http://localhost:3000'],
        methods: ["GET", "POST", "DELETE"],
        credentials: true
    },
    pingInterval: 3000,
    pingTimeout: 8000
});

// Connect to mongodb
var dbURI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "test") {
    dbURI = process.env.TEST_MONGODB_URI;
}

const REDIS_HOST = process.env.REDIS_HOST || "redis";
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const REDIS_PW = process.env.REDIS_PW;
const pubClient = createClient({
    port: REDIS_PORT,
    host: REDIS_HOST,
    auth_pass: REDIS_PW
});

// Event 'connection': Fired upon a connection from client
io.on("connection", socket => {
    console.log("a user connected");

    const subClient = createClient({
        port: REDIS_PORT,
        host: REDIS_HOST,
        auth_pass: REDIS_PW
    });

    subClient.on("message", (channel, data) => {
        const publishMessageData = JSON.parse(data);
        const eventName = publishMessageData.event;
        const messageContent = publishMessageData.contents;
        socket.emit(eventName, messageContent);
    })

    socket.on("joinRoom", interviewId => {
        subClient.subscribe(interviewId);
        const publishMessage = {
            event: "notification",
            contents: {
                senderEmail: "server",
                message: PARTNER_CONNECTED
            }
        }
        pubClient.publish(interviewId, JSON.stringify(publishMessage))
    });


    socket.on("message", newMessage => {
        // Saves the chat message to chat history
        dbController.saveNewMessage(newMessage);
        const interviewId = newMessage.interviewId;
        const publishMessage = {
            event: "message",
            contents: newMessage.contents
        }
        pubClient.publish(interviewId, JSON.stringify(publishMessage))
    });

    socket.on("notification", newMessage => {
        const interviewId = newMessage.interviewId;
        const publishMessage = {
            event: "notification",
            contents: newMessage.contents
        }
        pubClient.publish(interviewId, JSON.stringify(publishMessage))
    })

    socket.on('disconnect', function(reason){
        console.log('User 1 disconnected because '+reason);
     });
     

    socket.on("end_interview", endInterviewMessage => {
        // If partner has ended interview, send a message to inform the other buddy
        const interviewId = endInterviewMessage.interviewId;
        const publishMessage = {
            event: "notification",
            contents: newMessage.contents
        }
        pubClient.publish(interviewId, JSON.stringify(publishMessage))
    });

    socket.on("disconnect", () => {
        delete subClient;
    })
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