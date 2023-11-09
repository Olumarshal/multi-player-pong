const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const PORT = process.env.PORT || 3000;


// Serve static files
app.use(express.static(__dirname + "/public")); // Change 'public' to your directory name

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });


server.listen(3000, () => {
    console.log(`Listening on port ${PORT}`);
});

let readyPlayerCount = 0;

const pongNamespace = io.of('/pong');
pongNamespace.on("connection", (socket) => {
    let room;
    console.log("a user connected", socket.id);

    socket.on('ready', () => {
        room = 'room' + Math.floor(readyPlayerCount / 2);
        socket.join(room);

        console.log('Player ready', socket.id, room);

        readyPlayerCount++;

        if(readyPlayerCount % 2 === 0) {
            pongNamespace.in(room).emit('startGame', socket.id);
        }
    });

    socket.on('paddleMove', (paddleData) => {
        socket.to(room).emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
        socket.to(room).emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
        socket.leave(room);
    });
  });