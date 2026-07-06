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
 * @returns status 201 et la nouvelle étape
 */
async function ajouterEtape(req:Request,res:Response) {
    const {voyageid} = req.params

    if(!voyageid) {throw new TypeError("voyageid doit être non-nul.")}

    // Récuperer le voyage et les étapes associés via id voyage
    let voyage,etapes:any=[];

    try {
            [voyage,etapes] = await Promise.all([
                await prisma.voyage.findUnique({
                where: {
                    id:voyageid as any,
                    utilisateurId:(req as any).user.sub
                }
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

    const {
        dateDeb:dateDebNouvEtape,
        dateFin:dateFinNouvEtape,
        hebergement,
        notes,
        destinationId} = req.body
    const {dateDeb:dateDebVoyage,dateFin:dateFinVoyage} = voyage as any
    
    // Valider que dates début et fin sont en ordre chronologique
    if ((new Date(dateFinNouvEtape)).getTime()< (new Date(dateDebNouvEtape)).getTime()) {
        return res.status(400).json({message:"La date de début de l'étape doit être inférieure à la date de fin."})
    }
    
    // Cas 1 d'insertion d'étape: ajout d'une première étape 
    if (etapes?.length === 0) {
        
        // Valider que l'étape débute en même temps que le voyage
        if ((new Date(dateDebVoyage)).getTime() !== (new Date(dateDebNouvEtape)).getTime()) {
            return res.status(400).json({message:"Cette étape doit débuter en même temps que le voyage."})
        }

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
        // Cas 2 d'insertion d'étape: ajout d'une nième étape
    } else {

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
}    

/**
 * @function getEtapes(req:Request,res:Response)
 * Récupère les étapes d'un voyage via le id fourni pour un utilisateur authentifié
 * @param req 
 * @param res 
 * @returns status(200) et liste des étapes
 */
async function getEtapes(req:Request,res:Response) {

    try {

        const voyage = await prisma.voyage.findUnique({
            where:{
                id:(req as any).params.voyageid,
                utilisateurId:(req as any).user.sub
            }
        })

        if(!voyage) {return res.status(404).json({message:"Ce voyage est introuvable.  Veuillez vérifier la requête."})}

        const etapes = await prisma.etape.findMany({
            where:{
                voyageId:req.params.voyageid as string
            }
        })

        return res.status(200).json(etapes)
    } catch(error){
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return res.status(500).json({message:"Erreur lors de la recherche des étapes."})
        } else if(error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({message:"Une erreure est survenue lors de la recherche des étapes.  Veuillez vérifier la requête."})
        }
    }
}
/**
 * @function modifierEtape(req:Request,res:Response)
 * Permet la modification de un ou plusieurs attributs d'une étape parmi la destination,
 * le type d'hébergement et/ou les notes.
 * @param req 
 * @param res 
 * @returns status(200) et étape modifié
 */
async function modifierEtape(req:Request, res:Response) {

    try {
        // Valider que le voyageid recu est associé à l'utilisateur
        const voyage = await prisma.voyage.findUnique({
            where:{
                id:(req as any).params.voyageid,
                utilisateurId:(req as any).user.sub
            }
        })

        if (!voyage) {
            return res.status(404)
            .json({message:"Le voyage associé n'est pas trouvable pour cet utilisateur.  Veuillez valider la requête."})
        }
        // Récupérer l'étape par etapeid et voyageid recus
        const etape = await prisma.etape.findUnique({
            where:{
                id: Number(req.params.etapeid),
                voyageId:(req as any).params.voyageid
            }
        })

        if(!etape) {
            return res.status(404)
            .json({message:"L'étape associée à ce voyage est introuvable pour cet utilisateur.  Veuillez valider la requête."})
            
        }

        const resultat = await prisma.etape.update({
            where:{id:Number(req.params.etapeid)},
            data:{
                hebergement:req.body.hebergement ?? Prisma.skip,
                destinationId:req.body.destinationId ?? Prisma.skip,
                notes:req.body.notes ?? Prisma.skip
            }
        })
        return res.status(200).json({resultat})

    } catch(error){
        if (error instanceof PrismaClientKnownRequestError) {
            console.error(`Prisma error: ${error.code}`)
            return res.status(500).json({message:"une erreure interne est survenue lors de la recherche du voyage de cette étape."})
        } else {
            console.error("Une erreure inconnue est survenue lors de la recherche de la base de données.")
            return res.status(500).json({message:"Une erreure est survenue.  La mise à jour de l'étape n'a pas pu être complétée."})
        }
    }
}

/**
 * @function supprimerEtape(req:Request,res:Response)
 * Permet de supprimer une étape pour un voyage donné, pour un utilisateur
 * authentifié.  Seule la derniére étape d'un voyage peut être supprimée.
 * @param req 
 * @param res 
 * @returns status(200) et étape suppriméee
 */
async function supprimerEtape(req:Request,res:Response) {

    try {
        // Valider que le voyageid recu est associé à l'utilisateur
        const voyage = await prisma.voyage.findUnique({
            where:{
                id:(req as any).params.voyageid,
                utilisateurId:(req as any).user.sub
            }
        })

        if (!voyage) {
            return res.status(404)
            .json({message:"Le voyage associé n'est pas trouvable pour cet utilisateur.  Veuillez valider la requête."})
        }

        // Récupérer toutes les étapes pour ce voyage et trier descendant par la date de début pour valider la suppression 
        // de la dernière étape seulement
        const etapes = await prisma.etape.findMany({
            where: {
                voyageId:(req as any).params.voyageid
            },
            orderBy: {
                dateDeb:'desc'
            }
        })

        if(etapes.length === 0) {
            return res.status(400).json({message:"Aucune étape dans ce voyage pour la suppression."})
        }

        // Valider que l'étape à retirer appartient à ce voyage, à cet utilisateur et est la dernière étape.
        if(etapes[0]?.id !== Number(req.params.etapeid)) {
            return res.status(400)
            .json({message:"Seule la dernière étape du voyage peut être supprimée."})
        }
        
        const resultat = await prisma.etape.delete({
            where:{
                id:Number(req.params.etapeid),
                voyageId:(req as any).params.voyageid
            },
        })
        return res.status(200).json({resultat})

    } catch(error){
        if (error instanceof PrismaClientKnownRequestError) {
            console.error(`Prisma error: ${error.code}`)
            return res.status(500).json({message:"une erreure interne est survenue lors de la recherche du voyage de cette étape."})
        } else {
            console.error("Une erreure inconnue est survenue lors de la recherche de la base de données.")
            return res.status(500).json({message:"Une erreure est survenue.  La mise à jour de l'étape n'a pas pu être complétée."})
        }
    }
}

export { ajouterEtape, getEtapes, modifierEtape, supprimerEtape }