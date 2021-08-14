import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { User } from "../schemas";

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

route.post(
    "/upload/thumbnail", 
    upload,
    async (req, res) =>{
        try {
            const { userID } = req.body;
            if(!userID)
                return res.status(400).send({
                    error: "User ID Needs To Be Provided"
                });
            const user = await User.findById(userID);
            if(!user)
                return res.status(400).send({
                    error: "Invalid User ID"
                });
            await User.updateOne(
                {
                    _id: userID
                },
                {
                    $set: {
                        thumbnail: req.file?.path || "/uploads/unknown.png"
                    }
                }
            );
            return res.status(200).send("Done");
        } catch(err) {
            return res.status(500).send({
                error: "An Error Has Occured Please Try Again"
            })
        }
    }
);

export default route;
