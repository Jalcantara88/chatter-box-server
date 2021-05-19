const PORT = process.env.PORT || 3000;
const path = require("path");
const INDEX = '/index.js';
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
  server.use(cors());

  //server.options('*', cors());
//.use((req, res) => res.sendFile(INDEX, { root: __dirname }))

/*
server.get("/", (req, res) => {
  res.sendFile(path.join(_dirname, "index.html"));
});
*/
   
/*
const io = socketIO(server, {
  cors: {
    origin: false,
    //methods: ["GET", "POST"]
  }
});
*/

server.listen(PORT, () => console.log(`Listening on ${PORT}`));



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

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


