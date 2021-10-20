const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {path: '/chat/create', cors: { origin: "*"}});
const namespace = io.of('/chat');
var cors = require('cors');
app.use(cors())

namespace.on('connection', socket => {
    console.log("connected");
    // when socket receives a new message from client, will emit to all connected clients based on session id
    socket.on('message', msg => {
      io.emit('message', {interviewId: msg.interviewId, content: msg.content});
      io.emit('message', {interviewId: msg.interviewId, content: {
        senderEmail: "benny@benny.com",
        message: "blabla"
      }})
    });
});

server.listen(3003, () => {  console.log('listening on *:3003');});