import { useEffect, useState } from "react";
import { getAvis, creerAvis, type Avis } from "../api/avis";
import { getDestinations } from "../api/destinations";
import type { Destination } from "../../../shared/types/destination";
import { useAuth } from "../context/AuthContext";
import "../styles/avis.css";
import Header from "../components/layout/core/Header";

function AvisPage() {
  // On récupère les informations de l'utilisateur connecté
  const { connecte, role } = useAuth();

  // On stocke la liste des avis
  const [avis, setAvis] = useState<Avis[]>([]);

  // On stocke la liste des destinations
  const [destinations, setDestinations] = useState<Destination[]>([]);

  // On stocke le nom de l'utilisateur
  const [nom, setNom] = useState("");

  // On stocke le nombre d'étoiles
  const [nbEtoiles, setNbEtoiles] = useState(5);

  // On stocke le commentaire
  const [commentaire, setCommentaire] = useState("");

  // On stocke l'identifiant de la destination
  const [destinationId, setDestinationId] = useState("");

  // On stocke la ville utilisée pour le filtre
  const [filtreVille, setFiltreVille] = useState("");

  // On stocke le message d'erreur
  const [erreur, setErreur] = useState("");

  // On stocke le message de succès
  const [message, setMessage] = useState("");

  // ----------------------------------
  // Récupérer les avis et les destinations
  // ----------------------------------

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        // On récupère tous les avis
        const resultatAvis = await getAvis();

        setAvis(resultatAvis);

        // On récupère toutes les destinations
        const resultatDestinations = await getDestinations();

        setDestinations(resultatDestinations.data);
      } catch (error) {
        console.error(error);
      }
    };

    chargerDonnees();
  }, []);

  // ----------------------------------
  // Filtrer les avis par ville
  // ----------------------------------

  const avisFiltres = filtreVille
    ? avis.filter((unAvis) => unAvis.sujet.ville === filtreVille)
    : avis;

  // ----------------------------------
  // Ajouter un avis
  // ----------------------------------

  const handleAjouterAvis = async () => {
    // On efface les anciens messages
    setErreur("");
    setMessage("");

    // Validation des champs
    if (!nom || !commentaire || !destinationId) {
      setErreur("Veuillez remplir tous les champs.");

      return;
    }

    try {
      // On crée l'avis
      const nouvelAvis = await creerAvis(
        nom,
        nbEtoiles,
        commentaire,
        Number(destinationId),
      );

      // On ajoute le nouvel avis au début de la liste
      setAvis([nouvelAvis, ...avis]);

      // On vide le formulaire
      setNom("");
      setNbEtoiles(5);
      setCommentaire("");
      setDestinationId("");

      // Affichage du message de succès
      setMessage("Votre avis a été ajouté avec succès.");
    } catch (error) {
      console.error(error);

      setErreur("Impossible d'ajouter votre avis.");
    }
  };

  return (
    <div className="avis-page">
      <Header title="Page Avis" />
      {/* ----------------------------------
                Titre de la page
            ---------------------------------- */}

      <div className="avis-header">
        <h1>Avis des voyageurs</h1>

        <p>Découvrez les expériences de nos voyageurs et partagez la vôtre.</p>
      </div>

      {/* ----------------------------------
                Contenu principal
            ---------------------------------- */}

      <div className="avis-conteneur">
        {/* ==================================
                    COLONNE GAUCHE
                    Formulaire
                ================================== */}

        {connecte && role === "Voyageur" && (
          <section className="avis-form">
            <h2>✈️ Partagez votre expérience</h2>

            <p className="avis-form-description">
              Votre voyage vous a plu ? Partagez votre expérience avec les
              autres voyageurs.
            </p>

            {/* Message d'erreur */}

            {erreur && <p className="avis-erreur">{erreur}</p>}

            {/* Message de succès */}

            {message && <p className="avis-message">{message}</p>}

            {/* ----------------------------------
                            Nom
                        ---------------------------------- */}

            <label>Votre nom</label>

            <input
              type="text"
              value={nom}
              placeholder="Votre nom"
              onChange={(e) => setNom(e.target.value)}
            />

            {/* ----------------------------------
                            Destination
                        ---------------------------------- */}

            <label>Destination</label>

            <select
              value={destinationId}
              onChange={(e) => setDestinationId(e.target.value)}
            >
              <option value="">Choisir une destination</option>

              {destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {destination.ville}
                </option>
              ))}
            </select>

            {/* ----------------------------------
                            Nombre d'étoiles
                        ---------------------------------- */}

            <label>Votre note</label>

            <div className="etoiles-selection">
              {[1, 2, 3, 4, 5].map((etoile) => (
                <button
                  key={etoile}
                  type="button"
                  className={etoile <= nbEtoiles ? "etoile active" : "etoile"}
                  onClick={() => setNbEtoiles(etoile)}
                >
                  ★
                </button>
              ))}
            </div>

            {/* ----------------------------------
                            Commentaire
                        ---------------------------------- */}

            <label>Votre commentaire</label>

            <textarea
              value={commentaire}
              placeholder="Partagez votre expérience..."
              rows={5}
              maxLength={500}
              onChange={(e) => setCommentaire(e.target.value)}
            />

            <p className="compteur">{commentaire.length}/500</p>

            {/* ----------------------------------
                            Bouton
                        ---------------------------------- */}

            <button
              type="button"
              className="bouton-avis"
              onClick={handleAjouterAvis}
            >
              Publier mon avis
            </button>
          </section>
        )}

        {/* ==================================
                    COLONNE DROITE
                    Liste des avis
                ================================== */}

        <section className="avis-resultats">
          <div className="avis-resultats-header">
            <div>
              <h2>⭐ Expériences des voyageurs</h2>

              <p>{avisFiltres.length} avis</p>
            </div>

            {/* ----------------------------------
                            Filtre par ville
                        ---------------------------------- */}

            <select
              value={filtreVille}
              onChange={(e) => setFiltreVille(e.target.value)}
              className="filtre-ville"
            >
              <option value="">Toutes les destinations</option>

              {destinations.map((destination) => (
                <option key={destination.id} value={destination.ville}>
                  {destination.ville}
                </option>
              ))}
            </select>
          </div>

          {/* ----------------------------------
                        Affichage des avis
                    ---------------------------------- */}

          <div className="avis-liste">
            {avisFiltres.length === 0 ? (
              <div className="aucun-avis">
                <p>🌴 Aucun avis pour cette destination.</p>
              </div>
            ) : (
              avisFiltres.map((unAvis) => (
                <article className="avis-card" key={unAvis.id}>
                  {/* Étoiles */}

                  <div className="avis-etoiles">
                    {"★".repeat(unAvis.nbEtoiles)}

                    <span className="etoiles-vides">
                      {"★".repeat(5 - unAvis.nbEtoiles)}
                    </span>
                  </div>

                  {/* Destination */}

                  <div className="avis-destination">
                    📍 {unAvis.sujet.ville}
                  </div>

                  {/* Commentaire */}

                  <p className="avis-commentaire">"{unAvis.commentaire}"</p>

                  {/* Auteur */}

                  <div className="avis-auteur">
                    <div className="avatar-avis">
                      {unAvis.nom.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <strong>{unAvis.nom}</strong>

                      <p>Voyageur</p>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AvisPage;
