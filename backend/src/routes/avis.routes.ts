import { Router } from "express";

import * as authMiddleware from "../middleware/auth.js";
import * as avisControlleurs from "../controlleurs/avis/avisControlleurs.js";

const avisRouteur = Router();

// ------ Récupérer tous les avis ------ //

avisRouteur.get(
    "/",
    avisControlleurs.getAvis
);

// ------ Ajouter un avis ------ //

avisRouteur.post(
    "/",
    authMiddleware.authentificationJWT,
    authMiddleware.niveauRequis("Voyageur"),
    avisControlleurs.creerAvis
);

export default avisRouteur;