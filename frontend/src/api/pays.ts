import { api } from "./axios";
import { type InfosSuppPays } from "../../../shared/types/infosSuppPays";
import type { Paginated } from "../../../shared/types/pagination";

// L'appel axios pour obtenir tous les pays en tant qu'admin

export async function getInfosPays(
  page = 1,
  limit = 20,
): Promise<Paginated<InfosSuppPays>> {
  try {
    const response = await api.get("/pays/liste-pays", {
      params: {
        page,
        limit,
      },
    });
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
      `/api/pays/importer/${encodeURIComponent(nomPays)}`,
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
    const response = await api.patch(`/api/pays/${countryCode}`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function supprimerPays(countryCode: string) {
  try {
    const response = await api.delete(`/api/pays/${countryCode}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
