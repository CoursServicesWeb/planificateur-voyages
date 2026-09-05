// ---------------- Type Avis ---------------- //
import type { Destination } from "../../shared/types/destination";

export type Avis = {
    id: number;
    nom: string;
    nbEtoiles: number;
    commentaire: string;
    destinationId: number;
    createdAt: string;
    updatedAt: string;
    sujet: Destination;
};


// ------------ Type utilisé pour créer un avis ------------ //

export type CreateAvis = {
  nom: string;
  nbEtoiles: number;
  commentaire: string;
  destinationId: number;
};


// ------------ Type utilisé pour modifier un avis ------------ //

export type UpdateAvis = Partial<CreateAvis>;