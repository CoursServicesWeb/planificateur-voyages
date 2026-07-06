import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

import * as voyagesCtrls from '../controlleurs/voyages/voyagesControlleurs.js'

const voyagesRouter = Router()

// Récupérer les voyages pour un utlisateur authentifié avec permissions suffisantes
voyagesRouter.get('/moi',
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.getVoyagesUtlisateur)

// Créer un voyage pour un utlisateur authentifié avec permissions suffisantes
voyagesRouter.post('/',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.creerVoyage)

// Modifier un voyage pour un utilisateur authentifié avec permissions suffisantes
voyagesRouter.patch('/:voyageid',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.modifierVoyage)

// Suppression d'un voyage pour un utilisateur authentifié avec permissions suffisantes
voyagesRouter.delete('/:voyageid',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.supprimerVoyage)

export default voyagesRouter

