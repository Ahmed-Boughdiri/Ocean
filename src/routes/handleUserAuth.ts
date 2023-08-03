import express from "express";
import { 
    validateUserData,
    encryptPassword,
    validateUserLoginData
} from "../utils";
import { User } from "../schemas";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const route = express.Router();

interface DataProps {
    name: String,
    email: String,
    id: String
}

async function generateToken(data: DataProps): Promise<String> {
    const token = await jwt.sign({
        name: data.name,
        email: data.email,
        id: data.id
    }, process.env.JWT_SECRET || "");
    return token;
} 

// CREATING AN ACCOUNT
route.post("/create", async(req, res) =>{
    try {
        const {
            username,
            email,
            password
        } = req.body;
        // Vlidating Data
        const { error } = await validateUserData({
            username,
            email,
            password
        });
        if(error)
            return res.status(400).send({ err: error });
        // Encrypting Password
        const encryptedPassword = await encryptPassword(password);
        const user = new User({
            name: username,
            email,
            password: encryptedPassword,
            thumbnail: "uploads/unknown.png"
        });
        await user.save();
        // Generating New Token
        const token = await generateToken({
            name: username,
            email,
            id: user._id
        })
        return res.status(201).send({
            name: user.name,
            email: user.email,
            id: user._id,
            token
        })
    } catch(err) {
        console.log("Error: ", err)
        return res.status(500).send({ 
            err: JSON.stringify(err)
        });
    }
});

// LOGIN TO YOUR ACCOUNT
route.post("/login", async (req, res) =>{
    try {
        const {
            email,
            password
        } = req.body;
        // Validating Data
        const { error } = validateUserLoginData({
            email,
            password
        });
        if(error)
            return res.status(400).send({
                error
            });
        const user = await User.findOne({ email });
        if(!user)
            return res.status(500).send({
                error: "Incorrect Email"
            });
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword)
            return res.status(400).send({
                error: "Incorrect Password"
            });
        const token = await jwt.sign({
            username: user.name,
            email,
            id: user._id
        }, process.env.JWT_SECRET || "");
        return res.status(200).send({
            username: user.name,
            email,
            id: user._id,
            token
        });
    } catch(err) {
        return res.status(500).send({
            error: "An Error Has Occured Please Try Again"
        });
    }
});

// TOKEN LOGIN
route.post("/token", async(req, res) =>{
    const { token } = req.body;
    if(!token)
        return res.status(400).send({
            error: "Token Needs To Be Provided"
        });
    const user:any = await jwt.verify(token, process.env.JWT_SECRET || "");
    if(!user)
        return res.status(400).send({
            error: "Invalid Token"
        });
    return res.status(200).send({
        username: user.username,
        email: user.email,
        id: user.id
    })
})

export default route;
