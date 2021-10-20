require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

var redis_endpoint = process.env.REDIS_ENDPOINT;
var redis_pw = process.env.REDIS_PASSWORD;

const io = new Server(server, {
     cors: {
         origin: "*",
         methods: ["GET", "POST"]
     }
});


const redis = require("redis");
const client = redis.createClient({
	host: redis_endpoint,
	port:6379,
	auth_pass: redis_pw
});

client.on("connect", () => console.log("Connected to Redis"));
client.on("error", function (error) {
  console.error(error);
});


app.get("/editor/new-session", (req, res) => {
	const sessionId = req.query.sessionId;
	const qnsId = req.query.questionId;
  console.log(req.query);
  if (!sessionId) {
    res.status(400).json("No parameters");
  }
  client.get(sessionId, (err, response) => {
    if (response === null) {
      client.set(sessionId, qnsId);
  	  res.sendFile(__dirname + '/page.html');

     /* res.status(200).json({
      	status: "success",
      	data: {
      		message: "New session created"
      	}

      });*/
    } else {
    	res.sendFile(__dirname + '/page.html');

    	/*res.status(200).json({
    		status: "success",
    		data: {
    			message: "Session in progress"
    		}
    	});*/
    }
  });
});



app.get('/editor/find-session', (req, res) => {
  const sessionId = req.query.sessionId;
  client.get(sessionId, (err, response) => {
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
  const sessionId = req.query.sessionId;
  client.get(sessionId, (err, response) => {
    if (response === null) {
      res.status(400).json({
      	status: "failure",
      	data: {
      		message: "No such session exists"
      	}

      });
    } else {
    	client.del(sessionId, (err, response) => {
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

io.on("connection", socket => {
	socket.on("message", message => {
		io.emit(message.sessionId, message.text);
	});
});

const port = process.env.PORT || 3005;
server.listen(port, () => {
	console.log(`Text microservice is listening on port ${port} `);
});