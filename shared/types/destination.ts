import { type InfosSuppPays } from "./infosSuppPays";

// -------------- Type Continent ---------------- //

export type Continent = "Asie" | "Afrique" | "Amerique" | "Europe" | "Oceanie";

// ---------------- Type Destination ---------------- //

export type Destination = {
  id: number;
  ville: string;
  continent: Continent;
  lat: number;
  long: number;
  infoSuppPaysId: string;
  infosupppays?: InfosSuppPays;
  createdAt: string;
  updatedAt: string;
};

// ------------ Type utilisé pour créer une destination ------------ //

export type CreateDestination = {
  ville: string;
  continent: Continent;
};

// ------------ Type utilisé pour modifier une destination ------------ //
// Partial rend les propriétés de CreateDestination optionnelles(ville devient ville?:string;)

export type UpdateDestination = Partial<CreateDestination> & {
  infoSuppPaysId: string;
};
