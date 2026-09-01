import { api } from "./axios";
import type { Destination } from "../../../shared/types/destination";

// ----------- Type d'un avis -------------- //

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



// ------------ Fonction : Récupérer les avis --------------- //

// Cette fonction permet de récupérer tous les avis.
// GET /avis ne nécessite pas d'être connecté.

export async function getAvis(): Promise<Avis[]> {

    const response = await api.get<Avis[]>("/avis");

    return response.data;
}


// ------------ Fonction : Créer un avis ------------------- //

// Cette fonction permet à un Voyageur connecté d'ajouter un avis.
// Ici le token est ajouté automatiquement par Axios.

export async function creerAvis(
    nom: string,
    nbEtoiles: number,
    commentaire: string,
    destinationId: number
): Promise<Avis> {

    const response = await api.post<Avis>(
        "/avis",
        {
            nom,
            nbEtoiles,
            commentaire,
            destinationId,
        }
    );

    return response.data;
}