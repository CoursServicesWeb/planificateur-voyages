// -------------- Type StatutVoyage ---------------- //

export type StatutVoyage =
  | "Planifie"
  | "En_cours"
  | "Termine";


// ---------------- Type Voyage ---------------- //
//titre?: si titre pas fourni, la valeur par defaut est donnée("Mon Voyage")
//statut? : Pareil pour statut, par defaut ("Planifie")
//date en string envoyé par le backend, on fait le conversion en front(react)

export type Voyage = {
  id: string;
  titre: string;
  dateDeb: string;
  dateFin: string;
  statut: StatutVoyage;
  utilisateurId: string;
  createdAt: string;
  updatedAt: string;
};


// ------------ Type utilisé pour créer un voyage ------------ //

export type CreateVoyage = {
  titre?: string;
  dateDebV: string; 
  dateFinV: string;
  dateDebE: string;
  dateFinE: string;
  statut?: StatutVoyage;
  utilisateurId: string;
};


// ------------ Type utilisé pour modifier un voyage ------------ //

export type UpdateVoyage = Partial<CreateVoyage>;