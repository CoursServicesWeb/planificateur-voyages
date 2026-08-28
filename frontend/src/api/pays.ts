import { api } from "./axios";
import { type InfosSuppPays } from "../../../shared/types/infosSuppPays";

// L'appel axios pour obtenir tous les pays en tant qu'admin

export async function getInfosPays(): Promise<InfosSuppPays[]> {
  try {
    const response = await api.get("/liste-pays");
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour ajouter un nouveau pays en tant qu'Admin
export async function postNewPays(nomPays: string): Promise<InfosSuppPays> {
  try {
    const response = await api.post<InfosSuppPays>(
      `/importer/${encodeURIComponent(nomPays)}`,
    );
    return response.data; // Pour que les caractères spéciaux soient bien encodés
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour modifier un pays en tant qu'admin
export async function modifierPays(
  countryCode: string,
  data: Partial<InfosSuppPays>,
): Promise<InfosSuppPays> {
  try {
    const response = await api.patch(`/${countryCode}`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function supprimerPays(countryCode: string) {
  try {
    const response = await api.delete(`/${countryCode}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
