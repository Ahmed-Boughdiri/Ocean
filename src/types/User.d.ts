import mongoose from "mongoose";

export default interface UserProps extends mongoose.Document {
    name: String,
    email: String,
    password: String,
    thumbnail: String
}
