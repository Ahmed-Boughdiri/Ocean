import express from "express";
import { Room, User } from "../schemas";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";


const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
        cb(null, `uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`)
    }
});

const upload = multer({ storage }).single("thumbnail")

const route = express.Router();

async function verifyToken(token: String) {
    try {
        if(!token)
            return {
                error: "Token Needs To Be Provided"
            }
        const validToken = await jwt.verify(
            token as string, 
            process.env.JWT_SECRET || ""
        );
        if(!validToken)
            return {
                error: "Invalid Token"
            }
        return {
            error: false
        }
    } catch(err) {
        return {
            error: "An Error Has Occured Please Try Again Later"
        }
    }
}

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
                id: user._id
            })),
            messages: room.messages,
            thumbnail: room.thumbnail
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

export default route;
