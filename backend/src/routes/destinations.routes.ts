import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

import * as destinationsControlleurs from "../controlleurs/destinations/destinationsControlleurs.js";

const destinationsRouter = Router();

destinationsRouter.get("/", destinationsControlleurs.getDestinations); // La route pour avoir toutes les destinations

destinationsRouter.get("/continent", destinationsControlleurs.getByContinent); // La route pour filtrer les destinations par continent

destinationsRouter.get("/:id", destinationsControlleurs.getDestinationById); // La route pour obtenir une destination, la liste de ses avis et sa note moyenne

// La route pour pouvoir créer une nouvelle destination.  Il faut être admin pour pouvoir le faire.
destinationsRouter.post(
  "/",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.creerDestination,
);

// La route ppur modifier une destination.  Il faut être admin pour pouvoir le faire.
destinationsRouter.patch(
  "/:id",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.modifierDestination,
);

// La route pour supprimer une destination.  Il faut aussi être admin pour pouvoir le faire.
destinationsRouter.delete(
  "/:id",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsControlleurs.supprimerDestination,
);

export default destinationsRouter;
