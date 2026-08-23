// -------------- Type TypeHebergement ---------------- //

export type TypeHebergement =
  | "Hotel"
  | "Motel"
  | "AirBnB"
  | "Auberge"
  | "Tout_inclus"
  | "Camping"
  | "Amis_Famille";


// ---------------- Type Etape ---------------- //

export type Etape = {
  id: number;
  dateDeb: string;
  dateFin: string;
  notes: string | null;
  hebergement: TypeHebergement;
  voyageId: string;
  destinationId: number;
  createdAt: string;
  updatedAt: string;
};


// ------------ Type utilisé pour créer une étape ------------ //
//note? facultatif dans la création

export type CreateEtape = {
  dateDeb: string;
  dateFin: string;
  notes?: string;
  hebergement: TypeHebergement;
  voyageId: string;
  destinationId: number;
};


// ------------ Type utilisé pour modifier une étape ------------ //

export type UpdateEtape = Partial<CreateEtape>;