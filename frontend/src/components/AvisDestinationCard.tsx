import { type Destination } from "../../../shared/types/destination";
import { type Avis } from "../../../shared/types/avis";
import { type Utilisateur } from "../../../shared/types/utilisateur";
import "../styles/AvisDestinationCard.css";

interface AvisDestinationCardProps {
  note: number;
  sujet: Destination;
  commentaire: string;
  nom: string;
}

export function AvisDestinationCard({
  note,
  sujet,
  commentaire,
  nom,
}: AvisDestinationCardProps) {
  return (
    <div className="modal-avis-card">
      <div className="moodal-avis-card-top">
        <span>📍</span>
        <span>
          <h3>{sujet.ville}</h3>
        </span>
        <h4>Note : {note} / 5</h4>
        <blockquote>{commentaire}</blockquote>
      </div>
      <div className="modal-avis-card-bottom">
        <h4>{nom}</h4>
      </div>
    </div>
  );
}
