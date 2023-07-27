import express from "express";
import conectarDB from "./config/db.js";

const app = express();

// to read .env file
dotenv.config();

// connect to atlas
conectarDB();

app.use('/', (req, res) => {
    res.send("Hola Mundos");
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log("Server ok");
});

