const PORT = process.env.PORT || 3000;
//const path = require("path");

const express = require('express');
//const socketIO = require('socket.io');
var cors = require('cors');

const app = express();
/*
  server.options('/socket.io', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
  */
  app.use(cors());

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

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));



const io = require('socket.io')(server);

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


