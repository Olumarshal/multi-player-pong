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

io.on("connection", (socket) => {
  console.log("a user connected");
});

server.listen(3000, () => {
    console.log(`Listening on port ${PORT}`);
});
