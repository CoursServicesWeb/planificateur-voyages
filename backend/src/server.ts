import dotenv from "dotenv"
import express, { type Request, type Response }  from 'express'
import authRouter from "./routes/auth.routes.js"

dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.json())

app.use('/auth',authRouter)

app.listen(PORT, ()=> {console.log(`Serveur prêt sur port ${PORT}`)})



