import mongoose from "mongoose";
import { UserProps } from "../types";

const UserSchema = new mongoose.Schema<UserProps>({
    name: String,
    email: String,
    password: String,
    thumbnail: String
});

export default mongoose.model("User", UserSchema);

