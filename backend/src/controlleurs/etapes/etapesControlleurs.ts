import { type Request, type Response } from "express";
import prisma from '../../utils/prisma.js'
import { Prisma } from '../../../generated/prisma/client.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

/**
 * @function ajouterEtape(req:Request,res:Response)
 * Permet d'ajouter une étape qui débute soit à la date de fin de l'étape
 * précédente déjà dans le voyage ou au plus une journée après.
 * @param req 
 * @param res 
 * @returns 
 */
async function ajouterEtape(req:Request,res:Response) {
    const {voyageid} = req.params

    if(!voyageid) {throw new TypeError("voyageid doit être non-nul.")}

    // Récuperer le voyage et les étapes associés via id voyage
    let voyage,etapes; 

    try {
            [voyage,etapes] = await Promise.all([
                await prisma.voyage.findUnique({
                where: {id:voyageid as any}
                }),
                await prisma.etape.findMany({
                where:{voyageId:voyageid as any},
                orderBy:{dateDeb:'desc'}
            })
        ])
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(500).json({message:"Erreur: Ce voyage et/ou ses étapes n'ont pas étés récupérées."})
        } else if(error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({message:"Le voyage et/ou ses étapes n'ont pas étés récupérés.  Veuillez vérifier la requête."})
        }
    }
    
    if (!voyage) {return res.status(404).json({message:"Désolé, nous n'avons pas trouvé votre voyage.  Veuillez vérifier la demande."})}

    // Valider que l'utilisateur est autorisé pour ajouter à ce voyage
    if ((voyage.utilisateurId !== (req as any).user.sub)) {
        return res.status(401).json({message:"Ce voyage ou ses étapes sont introuvables à votre compte."})
    }

    const {
        dateDeb:dateDebNouvEtape,
        dateFin:dateFinNouvEtape,
        hebergement,
        notes,
        destinationId} = req.body
    const {dateDeb:dateDebVoyage,dateFin:dateFinVoyage} = voyage as any
    const dateFinDernEtape = (etapes![0] as any).dateFin

    // Valider si des dates sont toujours disponibles pour ce voyage en validant si la date de fin
    // de la dernière étape déjà dans le voyage est égale à la date de fin de ce voyage
    if (new Date(dateFinDernEtape).getTime()===new Date(dateFinVoyage).getTime()) {
        return res.status(400).json({message:"Aucun date de disponible pour ce voyage."})
    }

    // Fixer dates de validation pour insertion soit sur la date de fin de l'étape précédente
    // ou au plus une journée après
    const dateFinDernEtapePlusUn = new Date(dateFinDernEtape)
    dateFinDernEtapePlusUn.setDate(dateFinDernEtapePlusUn.getDate()+1)

    // Valider si la nouvelle étape débute sur la date de fin de la précédente,
    // ou si elle débute une journée après au plus et ne dépasse pas la date limite du
    // voyage
    if (
        (new Date(dateDebNouvEtape).getTime()===dateFinDernEtape.getTime() || 
        new Date(dateDebNouvEtape).getTime()===dateFinDernEtapePlusUn.getTime()) &&
        (new Date(dateFinNouvEtape).getTime()<=new Date(dateFinVoyage).getTime())
    ) {
        try {
            const result = await prisma.etape.create({
            data:{
                dateDeb:dateDebNouvEtape,
                dateFin:dateFinNouvEtape,
                hebergement:hebergement,
                notes: notes ?? Prisma.skip,
                voyageId:voyageid as any,
                destinationId:destinationId
            }
            })
            return res.status(201).json(result)
        } catch(error){
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return res.status(500).json({message:"Erreur: l'étape n'a pas pu être ajoutée."})
            } else if(error instanceof Prisma.PrismaClientValidationError)
            {
                return res.status(400).json({message:"L'étape n'a pas pu être ajoutée.  Veuillez vérifier la requête."})
            }
        } 

    } else {
        return res.status(400).json({message:"Erreur: dates début/fin de cette étape sont respectivement avant ou après dates début/fin voyage ou l'étape "+
            "ne débute pas immédiatement après la dernière étape dejà dans le voyage."
        })
    }   
}    


async function getEtapes(req:Request,res:Response) {

}

async function modifierEtape(req:Request, res:Response) {

}

async function supprimerEtape(req:Request,res:Response) {

}

export { ajouterEtape, getEtapes, modifierEtape, supprimerEtape }