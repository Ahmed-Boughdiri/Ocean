import mongoose from "mongoose";
import { RoomProps } from "../types";


const RoomSchema = new mongoose.Schema<RoomProps>({
    name: String,
    users: [{
        ref: "User",
        type: mongoose.SchemaTypes.ObjectId
    }],
    messages: [{
        sender: {
            ref: "User",
            type: mongoose.SchemaTypes.ObjectId
        },
        content: String
    }],
    thumbnail: String
});

export default mongoose.model("Room", RoomSchema);
