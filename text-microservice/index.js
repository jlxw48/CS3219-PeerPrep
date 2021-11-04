const responseStatus = require('./common/responseStatus');
const clientSuccessMessages = require('./common/clientSuccess');
const clientErrorMessages = require('./common/clientErrors');
const dbErrorMessages = require('./common/dbErrors');
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
require("dotenv").config();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 3005;
var server = app.listen(port, () => {
  console.log(`Text microservice is listening on port ${port} `);
});

const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");

const io = new Server(server, {
  path: "/api/editor/create",
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST", "DELETE"],
    credentials: true
  }
});

var redis_endpoint = process.env.REDIS_ENDPOINT;
var redis_pw = process.env.REDIS_PASSWORD;

var redis = require("redis"),

  pubClient = redis.createClient({
    host: redis_endpoint,
    port: 6379,
    auth_pass: redis_pw
  });

pubClient.on("connect", () => console.log("pubClient connected to Redis"));

pubClient.on("error", function (error) {
  console.error(error);
});

app.get("/api/editor/get_text", (req, res) => {
  const sessionId = req.query.interviewId;

  pubClient.get(sessionId, (err, response) => {

    if (response === null) {
      pubClient.set(sessionId, '');
      res.status(404).json({
        status: responseStatus.FAILURE,
        data: {
          message: clientErrorMessages.TEXT_NOT_FOUND
        }
      });
    } else {
      console.log(response);
      res.status(200).json({
        status: responseStatus.SUCCESS,
        data: {
          message: response
        }
      });
    }
  });
});

app.delete("/api/editor/end-session", (req, res) => {
  const sessionId = req.query.interviewId;
  pubClient.get(sessionId, (err, response) => {
    if (response === null) {
      res.status(404).json({
        status: responseStatus.FAILURE,
        data: {
          message: clientErrorMessages.SESSION_NOT_FOUND
        }

      });
    } else {
      pubClient.del(sessionId, (err, response) => {
        console.log("Deleted ", sessionId);
        res.status(200).json({
          status: responseStatus.SUCCESS,
          data: {
            message: clientSuccessMessages.DELETE_SESSION + sessionId
          }
        });
      });
    }
  });
});

//This function is for testing to populate dummy data
app.post("/api/editor/save-text", (req, res) => {
  const sessionId = req.body.interviewId;
  const text = req.body.text;
  pubClient.set(sessionId, text, redis.print);
  pubClient.get(sessionId, (err, response) => {
    if (response === null) {
      res.status(404).json({
        status: responseStatus.FAILURE,
        data: {
          message: clientErrorMessages.SAVE_TEXT_ERROR
        }

      });
    } else {
      res.status(201).json({
        status: responseStatus.SUCCESS,
        data: {
          message: clientSuccessMessages.SAVE_TEXT
        }
      });
    }
  });
});

const saveText = (newText) => {
  const sessionId = newText.interviewId;
  const text = newText.text;
  console.log(JSON.stringify(newText))
  pubClient.set(sessionId, JSON.stringify(newText), redis.print);
};

io.sockets.on("connection", socket => {
  var sessionId = '';
  console.log("Server connected");
  subClient = redis.createClient({
    host: redis_endpoint,
    port: 6379,
    auth_pass: redis_pw
  });

  subClient.on("connect", () => console.log("subClient connected to Redis"));

  subClient.on("error", function (error) {
    console.error(error);
  });

  subClient.on('message', function (channel, message) {
    socket.send(message);
  });

  socket.on("newMessage", message => {
    console.log(message);
    saveText(message);

    const interviewId = message.interviewId;
    console.log(JSON.stringify(message));
    pubClient.publish(interviewId, JSON.stringify(message), redis.print);
  });

  socket.on('unsubscribe', packet => {
    var interviewId = packet.interviewId;
    subClient.unsubscribe(interviewId);
    console.log("Client unsubscribed from session: " + interviewId);
  });

  socket.on('subscribe', packet => {
    var interviewId = packet.interviewId;
    sessionId = interviewId;
    subClient.subscribe(interviewId);
    console.log("Client subscribed to session: " + interviewId);
  });

  socket.on('disconnect', socket => {
    delete subClient;
  });
});



app.use((req, res) => {
  res.status(404).json({
    status: responseStatus.FAILURE,
    data: {
      message: "invalid API endpoint"
    }
  });
});

// Export app for testing purposes
module.exports = app;