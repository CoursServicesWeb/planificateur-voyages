import { Router } from "express";

import { authentificationJWT, niveauRequis } from "../middleware/auth.js";

import * as destinationsCtrls from "../controlleurs/destinations/destinationsControlleurs.js";

const destinationsRouter = Router();

destinationsRouter.get("/liste", destinationsCtrls.getDestinations);

destinationsRouter.get("/continent", destinationsCtrls.getByContinent);

destinationsRouter.post(
  "/",
  authentificationJWT,
  niveauRequis("Admin"),
  destinationsCtrls.ajouterDestination,
);

// voyagesRouter.patch('/:voyageid',authentificationJWT,niveauRequis('Voyageur'),voyagesCtrls.modifierVoyage)

// voyagesRouter.delete('/:voyageid',authentificationJWT,niveauRequis('Voyageur'),voyagesCtrls.supprimerVoyage)

export default destinationsRouter;
