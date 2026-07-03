import dotenv from 'dotenv'
import { type Request, type Response, type NextFunction } from "express";
import jwt from 'jsonwebtoken'


function authentificationJWT(req:Request,res:Response, next:NextFunction) {
    const authHeader = req.get('Authorization');

    if (!authHeader?.startsWith('Bearer ')){
        return res.status(401).json({message: "Token absent."})
    }

    const token = authHeader.split(" ")[1]

    try {
        const payload = jwt.verify(token as any, process.env.JWT_SECRET!);
        (req as any).user = payload;
        next()
    }catch (error){

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json(
                {message:"Branchez-vous à votre compte pour accéder à cette ressource."})
        } else if(error instanceof jwt.JsonWebTokenError) {
            res.status(500).json({message:"L'authentification a échouée."})
        }
        
    }
}

function niveauRequis(role:string) {
    return (req:Request,res:Response, next:NextFunction) => {
        if ((req as any).user.role !== role) {
            return res.status(403).json({message:"accès refusé."})
        }
        next()
    }
}

export { authentificationJWT, niveauRequis }