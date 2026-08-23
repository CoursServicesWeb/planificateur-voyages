import { api } from "./axios";
import type {CreateUtilisateur, Role,} from "../../../shared/types/utilisateur";


// ----------------------------------
// Type de la réponse d'inscription
// ----------------------------------

type InscriptionResponse = {
    id: string;
    role: Role;
    cree: string;
};

// ----------------------------------
// Type de la réponse de connexion
// ----------------------------------

type ConnexionResponse = {
    token: string;
};


// ----------------------------------
// Fonction d'inscription
// ----------------------------------

// On crée une fonction d'inscription avec un paramètre
// utilisateur de type CreateUtilisateur ==> voir shared/types/utilisateur
//
// Promise signifie que la fonction est asynchrone
// et qu'elle retournera une réponse de type InscriptionResponse.
//
// <InscriptionResponse> indique à Axios que la réponse
// doit respecter le type InscriptionResponse.

export async function inscription(
    utilisateur: CreateUtilisateur
): Promise<InscriptionResponse> {

    const response = await api.post<InscriptionResponse>(
        "/auth/inscription",
        utilisateur
    );

    return response.data;
}


// ----------------------------------
// Fonction de connexion
// ----------------------------------

// La fonction reçoit le courriel et le mot de passe.
//
// Elle retourne une Promise contenant un objet
// de type ConnexionResponse.

export async function connexion(
    courriel: string,
    motDePasse: string
): Promise<ConnexionResponse> {

    const response = await api.post<ConnexionResponse>(
        "/auth/connexion",
        {
            courriel,
            motDePasse,
        }
    );

    return response.data;
}