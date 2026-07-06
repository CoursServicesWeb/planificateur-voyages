import { Router } from "express";

import * as authMiddleware from '../middleware/auth.js';

import * as destinationsControlleurs from '../controlleurs/destinations/destinationsControlleurs.js';

const destinationsRouteur = Router();

// ----- Récupérer toutes les destinations ------- //

destinationsRouteur.get('/',destinationsControlleurs.getDestinations);

// ----- Récupérer une destination par id -------- //

destinationsRouteur.get('/:id',destinationsControlleurs.getDestinationById);

// ----- Ajouter une destination ---------------- //

destinationsRouteur.post(
    '/',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Admin'),
    destinationsControlleurs.creerDestination
);

// ------ Modifier une destination -------------- //
destinationsRouteur.patch(
    '/:id',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Admin'),
    destinationsControlleurs.modifierDestination
);

// Supprimer une destination
destinationsRouteur.delete(
    '/:id',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Admin'),
    destinationsControlleurs.supprimerDestination
);

export default destinationsRouteur;