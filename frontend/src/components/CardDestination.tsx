import "./CardDestination.css";
import { type Continent } from "../../../shared/types/destination";
import { useNavigate } from "react-router-dom";
import { type ReactNode } from "react";

const navigate = useNavigate();

interface CardDestinationProps {
  imageUrl: string;
  ville: string;
  continent: Continent;
  moyenneNotes?: number;
  drapeauEmoji: string;
  children: ReactNode;
  devise: string;
  capitale: string;
  langage: string;
  temperatureActuelle?: number;
}

export function CardDestination({
  imageUrl,
  ville,
  continent,
  moyenneNotes,
  drapeauEmoji,
  children,
  devise,
  capitale,
  langage,
  temperatureActuelle,
}: CardDestinationProps) {
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
      <div className="destination-card-header">
        <span>
          {drapeauEmoji && (
            <img
              src={drapeauEmoji}
              alt="Drapeau du pays"
              className="drapeau-emoji"
            />
          )}
        </span>
        <span>
          <h3 className="destination-card-title">{ville}</h3>
        </span>
      </div>
      <div className="destination-card-continent">
        <h4>Continent : {continent}</h4>
      </div>

      <div className="destination-card-moyenne">
        {moyenneNotes && <h4>Moyenne des aviso : {moyenneNotes} / 5</h4>}
      </div>
      {children && <div className="destination-card-content">{children}</div>}

      <div className="destination-card-devise">
        <h5>Devise monétaire : {devise}</h5>
      </div>
      <div className="destination-card-capitale">
        <h5>Capitale : {capitale}</h5>
      </div>
      <div className="destination-card-langage">
        <h6>Langue principale : {langage}</h6>
      </div>

      {temperatureActuelle && (
        <div className="destination-card-temperature">
          <h6>Température actuelle : {temperatureActuelle} degrés</h6>
        </div>
      )}
      <div>
        <button type="button" onClick={() => navigate("/login")}>
          <span>Réserver ce voyage</span>
          <span>☀️</span>
        </button>
      </div>
    </div>
  );
}
