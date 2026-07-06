import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import * as voyagesCtrls from "../controlleurs/voyages/voyagesControlleurs.js";

const voyagesRouter = Router();

// ----- Récupérer les voyages de l'utilisateur connecté -------- //

voyagesRouter.get(
    "/moi",
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.getVoyagesUtlisateur
);

// ------- Créer un voyage ------------//

voyagesRouter.post(
    "/",
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.creerVoyage
);

// ----- Modifier un voyage ------- //

voyagesRouter.patch(
    "/:voyageid",
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.modifierVoyage
);

// ----- Supprimer un voyage ------ //

voyagesRouter.delete(
    "/:voyageid",
    authentificationJWT,
    niveauRequis("Voyageur"),
    voyagesCtrls.supprimerVoyage
);

export default voyagesRouter;