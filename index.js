import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express();

app.use(express.json());

// to read .env file
dotenv.config();

// connect to atlas
conectarDB();

// cors configuration
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback){
        if(dominiosPermitidos.indexOf(origin) !== -1){
            //Request allow
            callback(null, true);
        }else {
            callback(new Error("No permitido por CORS"))
        }
    },
};

app.options('*', cors(corsOptions)); // Add this line to handle preflight requests

app.use(cors(corsOptions)); // Move this line after app.options


app.use('/api/veterinarios', veterinarioRoutes );
app.use('/api/pacientes', pacienteRoutes );

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Server ok in ${PORT}`);
});

