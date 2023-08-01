import express from "express";
import dotenv from 'dotenv';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();

app.use(express.json());

// to read .env file
dotenv.config();

// connect to atlas
conectarDB();

app.use('/api/veterinarios', veterinarioRoutes );
app.use('/api/pacientes', pacienteRoutes );

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server ok in ${PORT}`);
});

