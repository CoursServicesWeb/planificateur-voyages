import { type Request, type Response } from "express";
import prisma from "../../utils/prisma.js";
import { Prisma } from "../../../generated/prisma/client.js";

/**
 * @function creerAvis(req:Request,res:Response)
 * Permet à un utilisateur authentifié d'ajouter un avis sur une destination.
 *
 * @param req contient les informations de l'avis.
 * @param res retourne l'avis créé.
 */

export async function creerAvis(req: Request, res: Response) {

    const { nom, nbEtoiles, commentaire, destinationId } = req.body;

    // ---------- Validation des champs ---------- //

    if (!nom || nbEtoiles === undefined || !commentaire || !destinationId) {

        return res.status(400).json({
            message: "Les informations suivantes sont obligatoires : nom, nbEtoiles, commentaire, destinationId."
        });
    }
    // ---------- Valider le nom ------------------//

    if (nom.trim() === "") {
        return res.status(400).json({
            message: "Le nom ne peut pas être vide."
        });
    }

    // ---------- Validation de la note ---------- //

    if (typeof nbEtoiles !== "number" || nbEtoiles < 0 || nbEtoiles > 5) {

        return res.status(400).json({
            message: "La note doit être un nombre compris entre 0 et 5."
        });
    }

    if (commentaire.trim() === "") {

        return res.status(400).json({ message: "Le commentaire ne peut pas être vide." });
    }

    try {

        // ---------- Vérifier que la destination existe ---------- //

        const destination = await prisma.destination.findUnique({
            where: {
                id: Number(destinationId)
            }
        });

        if (!destination) {
            return res.status(404).json({
                message: "Destination introuvable."
            });
        }

        // ---------- Création de l'avis ---------- //

        const avis = await prisma.avis.create({
            data: {
                nom,
                nbEtoiles: Number(nbEtoiles),
                commentaire,
                destinationId: Number(destinationId)
            }
        });

        return res.status(201).json(avis);

    } catch (error) {

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                message: "Les données fournies sont invalides."
            });
        }

        return res.status(500).json({
            message: "Erreur lors de la création de l'avis."
        });
    }
}

/**
 * @function getAvis(req:Request,res:Response)
 * Retourne la liste de tous les avis.
 *
 * @param req
 * @param res retourne tous les avis enregistrés.
 */

export async function getAvis(req: Request, res: Response) {

    try {

        // ---------- Récupération des avis ---------- //

        const avis = await prisma.avis.findMany({
            include: {
                sujet: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        if (avis.length === 0) {
            return res.status(404).json({
                message: "Aucun avis trouvé."
            });
        }

        return res.status(200).json(avis);

    } catch (error) {

        if (error instanceof Prisma.PrismaClientValidationError) {
            return res.status(400).json({
                message: "La recherche des avis a échoué."
            });
        }

        return res.status(500).json({
            message: "Erreur lors de la récupération des avis."
        });
    }
}