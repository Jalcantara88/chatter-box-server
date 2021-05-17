const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require('express');
const socketIO = require('socket.io');
var cors = require('cors');

const server = express()
  .use(cors())
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);


io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on("message-submitted", (msg) => {
      //echo the message back to the user
      socket.emit("message", msg);
      
      //broadcast message to everyone else
      socket.broadcast.emit("message", msg);
      
  });


    socket.on('disconnect', () => console.log('Client disconnected'));
  });

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


