import express, { json } from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";

// SETTING UP THE EXPRESS SERVER
const app = express();
const server = http.createServer(app);
const PORT = 5000;
app.use(json());
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) =>{
    return res.render("index");
});

server.listen(
    process.env.PORT || PORT, 
    () => console.log(`SERVER RUNNING ON PORT ${PORT}...`)
);

// SETTING UP THE SOCKET SERVER
const io = new Server(server);

io.on("connection", socket => {
    socket.on("join-room", roomID =>{
        console.log(`User Have Joined Room ${roomID}`);
        socket.join(roomID);
    });
    socket.on("chat-message", data =>{
        socket.to(data.room).emit("sent-message", data.message);
    });
});
