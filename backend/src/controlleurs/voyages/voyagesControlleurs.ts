import { type Request, type Response } from 'express'
import prisma from '../../utils/prisma.js'
import { Prisma } from '../../../generated/prisma/client.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

/**
 * @function creerVoyage(req:Request,res:Response)
 * @param req : req.body contient les clés voyage et etape qui référencient les données POST
 * requises pour les insertions dans la base de données via une transaction prisma ORM
 * @param res 
 * @returns Retourne un objet contenant les résultats d'insertions dans les tables
 * Voyage et Étape de la base de données
 */
async function creerVoyage(req:Request,res:Response) {

    const {titre,dateDeb:dateDebV,dateFin:dateFinV} = req.body.voyage
    const {dateDeb:dateDebE,dateFin:dateFinE,hebergement,destinationId} = req.body.etape

    if (!titre || !dateDebV|| !dateFinV || !dateDebE || !dateFinE || !hebergement || !destinationId) {
        return res.status(400).json({message:"Informations manquantes pour créer un voyage."})
    }

    if ((new Date(dateDebE).getTime()<new Date(dateDebV).getTime()) || (new Date(dateFinE).getTime()>new Date(dateFinV).getTime())) {
        return res.status(400).json({message:"Une ou plus des dates de l'étape ne s'alignent pas avec les dates du voyage."})
    }

    try {
        const result = await prisma.$transaction(async(tx) => {
            const voyage = await tx.voyage.create({
                data:{
                    titre:titre,
                    dateDeb:dateDebV,
                    dateFin:dateFinV,
                    utilisateurId:(req as any).user.sub
                }
            })

            const etape = await tx.etape.create({
                data:{
                    dateDeb:dateDebE,
                    dateFin:dateFinE,
                    hebergement:hebergement,
                    notes: (req as any).body.etape.notes ?? Prisma.skip,
                    voyageId:voyage.id,
                    destinationId:destinationId
                }
            })

            return { voyage, etape }
        })
        res.status(201).json({result})
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(500).json({message:"Erreur: le voyage n'a pas pu être créer."})
        } else if(error instanceof Prisma.PrismaClientValidationError) {
            res.status(400).json({message:"Le voyage n'a pas pu être créer.  Veuillez vérifiez la requête."})
        }
    }
}

/**
 * @function getVoyagesUtlisateur(req:Request, res:Response)
 * @param req 
 * @param res
 * @returns
 * @  
 */
async function getVoyagesUtlisateur(req:Request, res:Response) {

}

async function modifierVoyage(req:Request,res:Response) {

}

async function supprimerVoyage(req:Request,res:Response) {

}

export { getVoyagesUtlisateur, creerVoyage, modifierVoyage, supprimerVoyage }