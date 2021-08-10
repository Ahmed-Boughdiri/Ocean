import mongoose from "mongoose";

export default interface RoomProps extends mongoose.Document {
    name: String,
    users: String[],
    messages: String[]    
}
