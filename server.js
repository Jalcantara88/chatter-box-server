const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';
const express = require('express');
const socketIO = require('socket.io');
var cors = require('cors');

const server = express();
/*
  server.options('/socket.io', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
  */
  //server.use(cors());

  //server.options('*', cors());
  //.use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  

  

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));


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


