import { type Request, type Response } from 'express'
import prisma from '../../utils/prisma.js'
import { Prisma } from '../../../generated/prisma/client.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

/**
 * @function creerVoyage(req:Request,res:Response)
 * Pour un utilisateur authentifié, créer un voyage et insére une première étape dans le voyage selon les données reçues
 * 
 * @param req : contient req.user (payload JWT) et req.body, qui contient les clés voyage et etape qui référencient les données POST
 * requises pour les insertions dans la base de données via une transaction prisma ORM
 * @returns retourne un objet JSON contenant les résultats d'insertions dans les tables
 * Voyage et Étape de la base de données
 */
async function creerVoyage(req:Request,res:Response) {

    const {titre,dateDeb:dateDebV,dateFin:dateFinV} = req.body.voyage
    const {dateDeb:dateDebE,dateFin:dateFinE,hebergement,destinationId} = req.body.etape

    if (!titre || !dateDebV|| !dateFinV || !dateDebE || !dateFinE || !hebergement || !destinationId) {
        return res.status(400).json({message:"Informations manquantes pour créer un voyage."})
    }
    
    // Valider que dates début et fin sont en ordre chronologique
    if ((new Date(dateFinV)).getTime()< (new Date(dateDebV)).getTime()) {
        return res.status(400).json({message:"La date de début du voyage doit être inférieure à la date de fin."})
    }

    // Valider que les dates de début/fin de l'étape ne sont respectivement pas avant ou après les dates de début/fin du voyage.
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
                    destinationId: Number(destinationId)
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
 * @function getVoyagesUtlisateur(req:Request,res:Response)
 * Pour un utlisateur authentifié, retourne tous ses voyages enregistrés dans la base de données
 * @param req contient req.user (payload JWT)
 * @returns objet(s) JSON avec clé voyage contenant le résultat de la recherche dans la base de données
 * @  
 */
async function getVoyagesUtlisateur(req:Request, res:Response) {
    try {
        const result = await prisma.voyage.findMany({
        where:{utilisateurId:(req as any).user.sub},
        orderBy: { dateDeb: 'desc'}
    })

        if(result.length === 0){res.status(404).json({message:"Aucun voyage pour cet utilisateur."})}

        res.status(200).json(
            {
                utilisateur:(req as any).user.sub,
                voyages:result
            })

    } catch(error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.log(`Prisma error - validation error`)
            res.status(400).json({message:"La recherche n'a pu être exécutée avec les informations fournies."})    
        } else {
            console.log("Une erreure est survenue lors de la récupération des voyages.")
            res.status(500).json({message:"La recherche a échouée."})
        }
    }
}

/**
 * @function modifierVoyage(req:Request,res:Response)
 * Effectue la modification du titre et la prolongation d'un voyage dans le temps.
 * @param req contient req.user (payload JWT)
 * @param res 
 * @returns objet JSON contenant le voyage avec modification(s)
 */
async function modifierVoyage(req:Request,res:Response) {
    const voyageid = req.params.voyageid || null
    if (!voyageid) {return res.status(400).json({message:"Le voyageid doit être non-nul."})}
  
    // Récupération du voyage à modifier par id
    let voyage;
    try{
        voyage = await prisma.voyage.findUnique({
        where:{id:voyageid as any}
    })
        
    }catch(error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.log(`Prisma error - validation error`)
            return res.status(400).json({message:"Erreur: le voyage à modifié n'a pu être trouvé avec les informations fournies."})    
        } else {
            console.log("Une erreure est survenue lors de la récupération des voyages.")
            return res.status(404).json({message:"Erreur: le voyage à modifié n'a pu être trouvé."})
        }
    }
    
    // Valider si un voyage a été trouvé ou si l'utilisateur connecté est authorisé à modifier le voyage associé à voyageid
    if ((!voyage) || (voyage.utilisateurId !== (req as any).user.sub)) 
        {
            return res.status(404).json({message:"Ce voyage est introuvable à votre compte.  Veuillez vérifier le id."})
        }

    const {dateFin:dateFinCourante} = voyage
    
    // Valider que la nouvelle date de fin du voyage est supérieure à la courante
    if (req.body.dateFin){
        if (!(new Date(req.body.dateFin).getTime()>dateFinCourante.getTime())){
        return res.status(400).json({message:"La nouvelle date de fin du voyage doit être supérieure à la courante."})
        }
    }

    try {
        const resultat = await prisma.voyage.update({
            where:{
                id:voyageid as any
            },
            data:{
                titre:req.body.titre ?? Prisma.skip,
                dateFin:req.body.dateFin ?? Prisma.skip
            }
        })
        return res.status(200).json(resultat)
    } catch(error){
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Prisma error: ${error.code}`)
            return res.status(500).json({message:"une erreure interne est survenue lors de la modification."})
        } else {
            console.error("Une erreure inconnue est survenue lors de la modification de la base de données.")
            return res.status(500).json({message:"Une erreure est survenue.  La mise à jour n'a pas pu être complétée."})
        }
    }
}

/**
 * @function supprimerVoyage(req:Request,res:Response)
 * Effectue la suppression d'un voyage à partir d'un id voyage
 * @param req
 * @param res 
 * @returns 
 */
async function supprimerVoyage(req:Request,res:Response) {
    const voyageid = req.params.voyageid || null
    if (!voyageid) {return res.status(400).json({message:"Le voyageid doit être non-nul."})}

    let voyage;
    try{
        voyage = await prisma.voyage.findUnique({
        where:{id:voyageid as any}
    })
        
    }catch(error) {
        if (error instanceof Prisma.PrismaClientValidationError) {
            console.log(`Prisma error - validation error`)
            return res.status(400).json({message:"Erreur: le voyage à supprimer n'a pu être trouvé avec les informations fournies."})    
        } else {
            console.log("Une erreure est survenue lors de la récupération du voyage.")
            return res.status(404).json({message:"Erreur: le voyage à supprimer n'a pu être trouvé."})
        }
    }
    
    // Valider si un voyage a été trouvé ou si l'utilisateur connecté est authorisé à modifier le voyage associé à voyageid
    if ((!voyage) || (voyage.utilisateurId !== (req as any).user.sub)) 
        {
            return res.status(404).json({message:"Ce voyage est introuvable à votre compte.  Veuillez vérifier le id."})
        }

    try {
        const result = await prisma.voyage.delete({
            where:{id:voyageid as any}
        })
        return res.status(200).json(result)
    } catch(error) {
        if (error instanceof PrismaClientKnownRequestError){
            console.error(`Prisma error: ${error.code}`)
            return res.status(500).json({message:"une erreure interne est survenue.  La suppression n'a pas pu être complétée"})
        } else {
            console.error("Une erreure inconnue est survenue lors de la modification de la base de données.")
            return res.status(500).json({message:"Une erreure est survenue.  La suppression n'a pas pu être complétée."})
        }
    }
}

export { getVoyagesUtlisateur, creerVoyage, modifierVoyage, supprimerVoyage }