const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const { v4: uuidV4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public")); // Serve frontend files

io.on("connection", (socket) => {
    console.log("New user connected");

    // When user joins a room
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);

        socket.on("text-update", (data) => {
            socket.to(roomId).emit("text-update", data);
        });
    });
});

app.get("/new-room", (req, res) => {
    res.json({ roomId: uuidV4() });
});
server.listen(3000, "0.0.0.0", () => {
    console.log("Server running on your local network!");
    console.log("Find your local IP and open: http://192.168.29.32:3000");
});