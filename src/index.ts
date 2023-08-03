import express, { json } from "express";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import {
    handleUserAuth,
    rooms,
    users
} from "./routes";
import { Room, User } from "./schemas";

dotenv.config();

// SETTING UP THE EXPRESS SERVER
const app = express();
const server = http.createServer(app);
const PORT = 5000;
app.use(json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, '../public')));
app.use("/uploads", express.static(path.join(__dirname, '../uploads')));

app.get("/", (req, res) =>{
    return res.sendFile(path.join((__dirname), "../public/index.html"));
});

app.get("/signup/", (req, res) =>{
    return res.sendFile(path.join((__dirname), "../public/signup.html"));
});

app.get("/login", (req, res) =>{
    return res.sendFile(path.join(__dirname, "../public/login.html"));
})

server.listen(
    process.env.PORT || PORT, 
    () => console.log(`SERVER RUNNING ON PORT ${PORT}...`)
);

// CONNECTING TO THE DATABASE
mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rimnobs.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    () => console.log("DB CONNECTED ...")
);

// SETTING UP THE SOCKET SERVER
const io = new Server(server);

io.on("connection", socket => {
    socket.on("join-room", roomID =>{
        socket.join(roomID);
    });
    socket.on("chat-message", async data =>{
        try {
            const sender = await User.findById(data.senderID);
            let senderName = "";
            if(!sender)
                senderName = "Unknown";
            else 
                senderName = sender.name;
            const room = await Room.findById(data.room);
            if(!room)
                throw Error("Invalid Room ID");
            await Room.updateOne(
                {
                    _id: data.room
                },
                {
                    $addToSet: {
                        messages: {
                            sender: data.senderID,
                            content: data.message
                        }
                    }
                }
            );
            socket.to(data.room).emit(
                "sent-message", 
                {
                    msg: data.message,
                    sender: senderName
                }
            );
        } catch(err) {
            throw err;
        }
    });
});

// ROUTES
app.use("/user/", handleUserAuth);
app.use("/rooms/", rooms);
app.use("/users/", users);
