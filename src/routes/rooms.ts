import express from "express";
import { Room, User } from "../schemas";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "../utils";


const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, `uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
    }
});

const upload = multer({ storage }).single("thumbnail");

const route = express.Router();

route.post("/get", async (req, res) =>{
    try {
        const { token } = req.body;
        // Validate Token
        const { error } = await verifyToken(token);
        if(error)
            return res.status(400).send({
                error
            });
        const rooms = await Room.find().populate("users");
        if(!rooms)
            return res.status(200).send({
                rooms: []
            });
        const result = rooms.map((room: any) =>({
            name: room.name,
            users: room.users.map((user: any) =>({
                name: user.name,
                email: user.email,
                id: user._id,
                thumbnail: user.thumbnail
            })),
            messages: room.messages,
            thumbnail: room.thumbnail,
            id: room._id
        }));
        return res.status(200).send({
            rooms: result
        })
    } catch(err) {
        return res.status(500).send({
            error: "An Error Has Occured Please Try Again Later"
        })
    }
});

route.post(
    "/create", 
    upload,
    async (req, res) =>{
    try {
        const {
            name,
            userID,
            token
        } = req.body;
        if(!name)
            return res.status(400).send({
                error: "Room Name Needs To Be Provided"
            });
        if(!userID)
            return res.status(400).send({
                error: "User ID Needs To Be Provided"
            });
        const { error } = await verifyToken(token);
        if(error)
            return res.status(400).send({
                error
            });
        const user = await User.findById(userID);
        if(!user)
            return res.status(400).send({
                error: "Invalid User ID"
            })
        const room = new Room({
            name,
            messages: [],
            users: [
                userID
            ],
            thumbnail: req.file?.path || "uploads/conversation.png"
        });
        await room.save();
        return res.status(201).send({
            name,
            id: room.id,
            users: [
                {
                    name: user.name,
                    email: user.email,
                    id: user._id
                }
            ],
            thumbnail: req.file?.path || "uploads/conversation.png",
            messages: []
        });
    } catch(err) {
        return res.status(500).send({
            error: "An Error Has Occured Please Try Again"
        });
    }
});

route.post("/messages/get", async (req, res) =>{
    try {
        const { token, roomID } = req.body;
        const { error } = await verifyToken(token);
        if(error)
            return res.status(400).send({
                error: "Invalid Token"
            });
        if(!roomID)
            return res.status(400).send({
                error: "Room ID Needs To Be Provided"
            });
        const room = await Room.findById(roomID).populate("users");
        if(!room)
            return res.status(400).send({
                error: "Invalid Room ID"
            });
        const result:any[] = await Promise.all(room.messages.map(async (message:any) =>{
            const sender = await User.findById(message.sender);
            if(!sender)
                return {}
            return {
                content: message.content,
                sender: {
                    name: sender.name,
                    email: sender.email,
                    id: sender._id
                }
            }
        }));
        return res.status(200).send({
            messages: result
        })
    } catch(err) {
        return res.status(500).send({
            error: "An Error Has Occured Please Try Again"
        })
    }
});

export default route;
