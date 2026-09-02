import { api } from "./axios";
import type {
  Destination,
  CreateDestination,
  UpdateDestination,
  Continent,
} from "../../../shared/types/destination";
import type { Paginated } from "../../../shared/types/pagination";

// La fonction pour obtenir toutes les destinations en provenance du backend
export async function getDestinations(
  page = 1,
  limit = 20,
): Promise<Paginated<Destination>> {
  try {
    const response = await api.get<Paginated<Destination>>("/destinations", {
      params: { page, limit },
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour obtenir une destination précise
export async function getDestinationById(
  id: string | number,
): Promise<Destination> {
  try {
    const response = await api.get<{ destination: Destination }>(
      `/destinations/${id}`,
    );
    return response.data.destination;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour creér une nouvelle destination en tant qu'Admin
export async function postDestination(
  data: CreateDestination,
): Promise<Destination> {
  try {
    const response = await api.post("/destinations", data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour modifier une destination en tant qu'Admin
export async function modifierDestination(
  id: string,
  data: UpdateDestination,
): Promise<Destination> {
  try {
    const response = await api.patch(`/destinations/${id}`, data);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fcontion pour supprimer une destination en tant qu'Admin
export async function supprimerDestination(
  id: string,
): Promise<{ message: string }> {
  try {
    const response = await api.delete(`/destinations/${id}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour obtenir la moyenne des notes des avis pour une destinationpour les cards
export async function getNoteMoyenne(idDestination: string | number) {
  try {
    const response = await api.get(`/destinations/${idDestination}`);
    return {
      noteMoyenne: response.data.noteMoyenne,
    };
  } catch (e) {
    console.log(e);
    throw e;
  }
}

// La fonction pour obtenir toutes les destinations en provenance du backend
export async function getDestinationsByContinent(
  continentChoisi: Continent,
  page = 1,
  limit = 20,
): Promise<Paginated<Destination>> {
  try {
    const response = await api.get<Paginated<Destination>>(
      `/destinations/continent?continent=${continentChoisi}`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw e;
  }
}
