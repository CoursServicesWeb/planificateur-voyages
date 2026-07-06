import { Router } from "express";

import * as authMiddleware from '../middleware/auth.js';

import * as avisControlleurs from '../controlleurs/avis/avisControlleurs.js';

const avisRouteur = Router();

// ------ Récupérer tous les avis --------------- //

avisRouteur.get('/',avisControlleurs.getAvis);

// ------ Récupérer un avis -------------------- //

avisRouteur.get('/:id',avisControlleurs.getAvisById);

// ------ Ajouter un avis --------------------- //

avisRouteur.post('/',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    avisControlleurs.creerAvis
);

// ------ Modifier un avis -------------------- //
avisRouteur.patch(
    '/:id',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    avisControlleurs.modifierAvis
);

// ------- Supprimer un avis ------------ //

avisRouteur.delete(
    '/:id',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    avisControlleurs.supprimerAvis
);

export default avisRouteur;