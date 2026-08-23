// -------------- Type Role ---------------- //

export type Role =
  | "Voyageur"
  | "Admin";


// ---------------- Type Utilisateur ---------------- //
// motDePasse n'est pas présent 
// Si on veut récuperer un utilisateur
// on veut pas exposer le mot de passe meme si il est hashé 

export type Utilisateur = {
  id: string;
  courriel: string;
  nom: string;
  prenom: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};


// ------------ Type utilisé pour créer un utilisateur ------------ //
// role?: Car si on crée un utilisateur sans role
// le backend lui donne la valeur par defaut"Voyageur"

export type CreateUtilisateur = {
  courriel: string;
  motDePasse: string;
  nom: string;
  prenom: string;
  role?: Role;
};


// ------------ Type utilisé pour modifier un utilisateur ------------ //

export type UpdateUtilisateur = Partial<CreateUtilisateur>;