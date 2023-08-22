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
    console.log("a user connected", socket.id);

    socket.on('ready', () => {
        console.log('Player ready', socket.id);

        readyPlayerCount++;

        if(readyPlayerCount % 2 === 0) {
            pongNamespace.emit('startGame', socket.id);
        }
    });

    socket.on('paddleMove', (paddleData) => {
        socket.broadcast.emit('paddleMove', paddleData);
    });

    socket.on('ballMove', (ballData) => {
        socket.broadcast.emit('ballMove', ballData);
    });

    socket.on('disconnect', (reason) => {
        console.log(`Client ${socket.id} disconnected: ${reason}`);
    });
  });