import dotenv from "dotenv"
import express, { type Request, type Response }  from 'express'
import authRouter from "./routes/auth.routes.js"
import etapesRouteur from "./routes/etapes.routes.js"
import voyagesRouter from "./routes/voyages.routes.js"

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json())

app.use('/auth',authRouter)

app.use('/api/etapes',etapesRouteur)
app.use('/api/voyages',voyagesRouter)

app.listen(PORT, ()=> {console.log(`Serveur prêt sur port ${PORT}`)})

app.use("/auth", authRouter);

app.use("/pays", paysRouter);

app.listen(PORT, () => {
  console.log(`Serveur prêt sur port ${PORT}`);
});
