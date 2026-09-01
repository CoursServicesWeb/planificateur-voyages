import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";
import * as destinationsControlleurs from "../controlleurs/destinations/destinationsControlleurs.js";

const destinationsRouter = Router();

// ------ Récupérer toutes les destinations ------ //
destinationsRouter.get("/", destinationsControlleurs.getDestinations);

// ------ Filtrer les destinations par continent ------ //
destinationsRouter.get("/continent", destinationsControlleurs.getByContinent);

// ------ Récupérer une destination par identifiant ------ //
destinationsRouter.get("/:id", destinationsControlleurs.getDestinationById);

// ------ Ajouter une destination (Admin) ------ //
destinationsRouter.post(
  "/",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.creerDestination,
);

// ------ Modifier une destination (Admin) ------ //
destinationsRouter.patch(
  "/:id",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.modifierDestination,
);

// ------ Supprimer une destination (Admin) ------ //
destinationsRouter.delete(
  "/:id",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.supprimerDestination,
);

export default destinationsRouter;
