import express, { json } from "express";
import path from "path";

const app = express();
const PORT = 5000;
app.use(json());
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) =>{
    return res.render("index");
});

app.listen(
    process.env.PORT || PORT, 
    () => console.log(`SERVER RUNNING ON PORT ${PORT}...`)
);
