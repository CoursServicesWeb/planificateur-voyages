import { Router } from "express";

import * as authMiddleware from '../middleware/auth.js';
import * as etapesControlleurs from '../controlleurs/etapes/etapesControlleurs.js';

const etapesRouteur = Router();

// ---- Récupérer toutes les étapes d'un voyage ------ //

etapesRouteur.get(
    '/moi/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.getEtapes
);

// ---- Ajouter une étape à un voyage -------- //

etapesRouteur.post(
    '/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.ajouterEtape
);

// ----- Modifier une étape d'un voyage ----- //

etapesRouteur.patch(
    '/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.modifierEtape
);

// ----- Supprimer une étape d'un voyage ------ //

etapesRouteur.delete(
    '/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.supprimerEtape
);

export default etapesRouteur;