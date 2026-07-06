import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

import * as voyagesCtrls from '../controlleurs/voyages/voyagesControlleurs.js'

const voyagesRouter = Router()

voyagesRouter.get('/moi',
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.getVoyagesUtlisateur)

voyagesRouter.post('/',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.creerVoyage)

voyagesRouter.patch('/:voyageid',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.modifierVoyage)

voyagesRouter.delete('/:voyageid',
    authentificationJWT,
    niveauRequis('Voyageur'),
    voyagesCtrls.supprimerVoyage)

export default voyagesRouter

