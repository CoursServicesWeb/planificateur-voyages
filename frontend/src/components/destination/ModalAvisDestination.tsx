import { type Avis } from "../../../../shared/types/avis";
import { getFiveLastAvis } from "../../api/destinations";
import { useState, useEffect } from "react";
import { AvisDestinationCard } from "../avis/AvisDestinationCard";
import "../styles/AvisDestinationCard.css";
import "../styles/ModalAvis.css";
import { createPortal } from "react-dom"; // Pour activer les Modal

interface ModalAvisDestinationProps {
  idDestination: number;
  onClose: () => void;
}

export default function ModalAvisDestination({
  idDestination,
  onClose,
}: ModalAvisDestinationProps) {
  const [avis, setAvis] = useState<Avis[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    setChargement(true);
    getFiveLastAvis(idDestination)
      .then((res) => {
        setAvis(res.data);
      })
      .catch((e) => {
        console.log("Erreur API destinations :", e);
        setErreur(
          "Erreur inattendue.  Impossible d'obtenir les destinations !",
        );
      })
      .finally(() => setChargement(false));
  }, [idDestination]);

  useEffect(() => {
    // Pour gérer si on appuie sur la touche Échap
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown); // Pour nettoyer une fois que l'événement s'est effectué
  }, [onClose]);

  if (chargement) return <p>Chargement en cours...</p>;
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>;

  return createPortal(
    <div className="modal-overlay" onClick={() => onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>
          X
        </button>
        <div className="avis-card-container">
          {avis.length !== 0 ? (
            avis.map((a) => (
              <AvisDestinationCard
                key={a.id}
                note={a.nbEtoiles}
                sujet={a.sujet}
                commentaire={a.commentaire}
                nom={a.nom}
              />
            ))
          ) : (
            <h2 style={{ color: "black" }}>Aucun avis sur cette destination</h2>
          )}
        </div>
      </div>
    </div>,
    document.body, // Pour permettre le modal des avis
  );
}
