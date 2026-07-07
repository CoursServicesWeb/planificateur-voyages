import { Router } from "express";

import * as authMiddleware from '../middleware/auth.js'

import * as etapesControlleurs from '../controlleurs/etapes/etapesControlleurs.js'

const etapesRouteur = Router();

etapesRouteur.get('/moi/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.getEtapes)

etapesRouteur.post('/:voyageid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.ajouterEtape)

etapesRouteur.patch('/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.modifierEtape)

etapesRouteur.delete('/:voyageid/:etapeid',
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis('Voyageur'),
    etapesControlleurs.supprimerEtape)

export default etapesRouteur
