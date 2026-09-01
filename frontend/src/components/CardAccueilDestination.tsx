import "./CardAccueilDestination.css";
import { type Continent } from "../../../shared/types/destination";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, type ReactNode } from "react";
import { getNoteMoyenne } from "../api/destinations";
import { useAuth } from "../context/AuthContext";

interface CardAccueilDestinationProps {
  id: number;
  imageUrl: string;
  ville: string;
  continent: Continent;
  drapeauEmoji: string;
  children?: ReactNode;
  devise: string;
  capitale: string;
  langage: string;
}

export function CardAccueilDestination({
  id,
  imageUrl,
  ville,
  continent,
  drapeauEmoji,
  devise,
  capitale,
  langage,
}: CardAccueilDestinationProps) {
  const [note, setNote] = useState<number>(0);
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const navigate = useNavigate();

  const { connecte } = useAuth();

  useEffect(() => {
    if (!id) return;

    setChargement(true);
    getNoteMoyenne(id)
      .then((res) => {
        const valeurNote = res.noteMoyenne;
        setNote(valeurNote);
      })
      .catch((e) => {
        console.log(e);
        setErreur(
          "Erreur inattendue.  Impossible d'obtenir les destinations !",
        );
      })
      .finally(() => setChargement(false));
  }, [id]);

  return (
    <div className="destination-card">
      {imageUrl && (
        <div className="destination-card-image-container">
          <img
            src={imageUrl}
            alt={ville || "Image de carte"}
            className="destination-card-image"
          />
        </div>
      )}
      <div className="destination-card-body">
        <div className="destination-card-header">
          <span>
            {drapeauEmoji ? (
              <img
                src={drapeauEmoji}
                alt="Drapeau du pays"
                className="drapeau-emoji"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1713098965471-d324f294a71d?q=80&w=2102&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Image du monde"
                className="drapeau-emoji"
              />
            )}
          </span>
          <span>
            <h3 className="destination-card-title">{ville}</h3>
          </span>
        </div>
        <div className="destination-card-content">
          <div className="destination-card-continent">
            <h4>Continent : {continent}</h4>
          </div>
          <div className="destination-card-moyenne">
            {note ? (
              <h4>Moyenne des avis : {note} / 5</h4>
            ) : (
              <h4>Pas encore noté</h4>
            )}
          </div>
          <div className="destination-card-devise">
            <h5>Devise monétaire : {devise}</h5>
            <h5 className="destination-card-capitale">Capitale : {capitale}</h5>
          </div>
          <div className="destination-card-langage">
            <h6>Langue principale : {langage}</h6>
          </div>
        </div>
      </div>
      <div className="destination-card-footer">
        <button
          type="button"
          className="destination-card-button"
          onClick={() => {
            connecte ? navigate("/mesvoyages") : navigate("/login");
          }}
        >
          <span>Réserver ce voyage</span>
          <span>☀️</span>
        </button>
      </div>
    </div>
  );
}
