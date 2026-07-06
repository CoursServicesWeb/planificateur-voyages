import dotenv from 'dotenv'
import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";
import {Prisma} from '../../../generated/prisma/client.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
dotenv.config()

async function authInscription(req:Request,res:Response) {
    const {courriel, motDePasse, nom, prenom} = req.body

    if (!courriel || !motDePasse || !nom || !prenom) {
        throw new Error("Ces informations sont requises: courriel, mot de passe, nom, prenom.")
    }

    // Valider si user déjà existant
    const user = await prisma.utilisateur.findUnique({
        where:{courriel:courriel}
    })
    if (user){res.status(409).json({message:"Un compte existe avec ce courriel.  Veuillez choisir une autre adresse."})}

    try {
        const mdpHash = await bcrypt.hash(motDePasse,10);
        const user = await prisma.utilisateur.create({
        data: {
            courriel,
            motDePasse:mdpHash,
            nom:nom,
            prenom:prenom
        }
    })
        res.status(201).json({id:user.courriel, role:user.role, cree:user.createdAt})
    } catch(error){
        res.status(500).json(error)
    }
}

async function authConnexion(req:Request,res:Response) {
    const {courriel,motDePasse} = req.body

    try {
        const user:any = await prisma.utilisateur.findUnique({
            where:{courriel:courriel}
        })

        if (!user) {return res.status(401).json({message:"Identifiants invalides."})}

        const ok = await bcrypt.compare(motDePasse,user.motDePasse)
        if (!ok) {
            res.status(401).json({message:"L'authentification a échouée."})
            return
        }
        
        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET!,
            {expiresIn: '1h'}
        )

        res.status(200).json({token})

    } catch(error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2025'){
                console.log(`Prisma error - code: ${error.code}`)
                res.status(404).json({message:"Authentification échouée."})
            }
        } else if(error instanceof Prisma.PrismaClientValidationError) {
            console.log(`Prisma error - validation error`)
            res.status(400).json({
                message:"La connexion est impossible.  Veuillez valider le courriel et mot de passe."})
        }
    }
}

export { authConnexion, authInscription }