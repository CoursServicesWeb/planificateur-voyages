import dotenv from "dotenv";
import express, { type Request, type Response }  from 'express';
import authRouter from "./routes/auth.routes.js";
import voyagesRouter from "./routes/voyages.routes.js";
import etapesRouteur from "./routes/etapes.routes.js";
import destinationsRouteur from "./routes/destinations.routes.js";
import avisRouteur from "./routes/avis.routes.js";

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.json())

app.use('/auth',authRouter);
app.use('/voyages', voyagesRouter);
app.use('/etapes', etapesRouteur);
app.use('/destinations', destinationsRouteur);
app.use('/avis', avisRouteur);

app.listen(PORT, ()=> {console.log(`Serveur prêt sur port ${PORT}`)})



