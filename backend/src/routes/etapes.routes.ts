import { Router } from "express";

import * as authMiddleware from '../middleware/auth.js'

import * as etapesControlleurs from '../controlleurs/etapes/etapesControlleurs.js'

const etapesRouteur = Router();

// Récupérer les étapes pour un utlisateur authentifié avec permissions suffisantes
etapesRouteur.get('/moi/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.getEtapes)

// Créer une étape pour un utlisateur authentifié avec permissions suffisantes
etapesRouteur.post('/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.ajouterEtape)

// Modifier une étape pour un utlisateur authentifié avec permissions suffisantes
etapesRouteur.patch('/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.modifierEtape)

// Supprimer une étape pour un utlisateur authentifié avec permissions suffisantes
etapesRouteur.delete('/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.supprimerEtape)

export default etapesRouteur