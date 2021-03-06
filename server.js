const PORT = process.env.PORT || 3000;
//const path = require("path");

const express = require('express');
const socketIO = require('socket.io');
//var cors = require('cors');

var allUsers = [];

const app = express();
/*
  server.options('/socket.io', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  });
  */
  //app.use(cors());

  //app.options('*', cors());
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

var rooms = [];

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));



const io = socketIO(server, {
  cors: {
    origin: "https://chatter-box-io.netlify.app",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
    console.log('Client connected');

    //socket.emit("connect", socket);

    socket.on("join-room", (roomName) => {
      socket.join(roomName);
    });

    socket.on("leave-room", (roomName) => {
      socket.leave(roomName);
    });

    socket.on("create-room", (roomName) => {
      rooms.push(roomName);
    });


    socket.on("message-submitted", (msg) => {
      //echo the message back to the user
      const newMessage = {
        username,
        message
      };
      socket.emit("message", msg);
      //socket.to(roomName).emit("message", newMessage);
      
      //broadcast message to everyone else
      socket.broadcast.emit("message", msg);
      
  });

    socket.on("user-joined",(username) => {
      //const newUser = { socket: socket, username: username};
      
      allUsers.push(username);
      socket.emit("all-users-update", allUsers);
      socket.broadcast.emit("all-users-update", allUsers);

    })

    socket.on("user-left", (username) => {
      allUsers = allUsers.filter(item => item != username);
      socket.broadcast.emit("all-users-update", allUsers);
    })


    socket.on('disconnect', () => {
      //allUsers.splice(allUsers.findIndex(item => item.socket.id), 1);
      //socket.broadcast.emit("all-users-update", allUsers);
      console.log('Client disconnected');});
  });

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);


