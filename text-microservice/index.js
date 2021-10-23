require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");

const io = new Server(server, {
     path: "/editor/create",
     cors: {
         origin: "*",
         methods: ["GET", "POST"]
     }
 });

var redis_endpoint = process.env.REDIS_ENDPOINT;
var redis_pw = process.env.REDIS_PASSWORD;

var redis = require("redis"),

  subClient = redis.createClient({
  	host: redis_endpoint,
  	port:6379,
  	auth_pass: redis_pw
  }),

  pubClient = redis.createClient({
    host: redis_endpoint,
    port:6379,
    auth_pass: redis_pw
  });

io.adapter(createAdapter(pubClient, subClient));

pubClient.on("connect", () => console.log("pubClient connected to Redis"));

pubClient.on("error", function (error) {
  console.error(error);
});

app.get("/editor/get_text", (req, res) => {
	const sessionId = req.query.interviewId;

  pubClient.get(sessionId, (err, response) => {

    if (response === null) {

     res.status(400).json({
      	status: "failure",
      	data: {
      		message: "No prior text history"
      	}
      });
    } else {
      console.log(response);
    	res.status(200).json({
    		status: "success",
    		data: {
    			message: response
    		}
    	});
    }
  });
});

app.get('/editor/find-session', (req, res) => {
  const sessionId = req.query.interviewId;
  pubClient.get(sessionId, (err, response) => {
  	if (response === null) {
  		res.status(400).json({
      	status: "failure",
      	data: {
      		message: "No such session exists"
      	}
      });
  	} else {
  		res.status(200).json({
		    status: "success",
		    data: {
		    	message: "Session in progress"
			}
		});
  	}
  });
});

app.get("/editor/end-session", (req, res) => {
  const sessionId = req.query.interviewId;
  pubClient.get(sessionId, (err, response) => {
    if (response === null) {
      res.status(400).json({
      	status: "failure",
      	data: {
      		message: "No such session exists"
      	}

      });
    } else {
    	pubClient.del(sessionId, (err, response) => {
		    console.log("Deleted ", sessionId);
		    res.status(200).json({
		    	status: "success",
		    	data: {
		    		message: "Session deleted"
				}
		    });
		});
    }
  });  
});

const saveText = (newText) => {
  const sessionId = newText.interviewId;
  const text = newText.text;
  pubClient.set(sessionId, text, redis.print);
};

io.on("connection", socket => {
  console.log("connected");

	socket.on("message", message => {
    console.log(message);
    saveText(message);
    const interviewId = message.interviewId;
    io.emit(message.interviewId, message.text);
	});
});

const port = process.env.PORT || 3005;
server.listen(port, () => {
	console.log(`Text microservice is listening on port ${port} `);
});