import dotenv from "dotenv"
import express, { type Request, type Response }  from 'express'
dotenv.config()

const PORT = process.env.PORT || 3000;

const app = express()

app.use(express.json())

app.get('/',(req:Request,res:Response)=>{
    res.json('Projet planificateur voyages')
})

app.listen(PORT, ()=> {console.log(`Serveur prêt sur port ${PORT}`)})



