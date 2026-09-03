import { type Avis } from "../../../shared/types/avis";
import { getFiveLastAvis } from "../api/destinations";
import { useState, useEffect } from "react";
import { AvisDestinationCard } from "./AvisDestinationCard";
import "../styles/AvisDestinationCard.css";

interface ModalAvisDestinationProps {
  idDestination: number;
}

export default function ModalAvisDestination({
  idDestination,
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

  if (chargement) return <p>Chargement en cours...</p>;
  if (erreur) return <p style={{ color: "red" }}>{erreur}</p>;

  return (
    <div className="avis-card-container">
      {avis.map((a) => (
        <AvisDestinationCard
          key={a.id}
          note={a.nbEtoiles}
          sujet={a.sujet}
          commentaire={a.commentaire}
          nom={a.nom}
        />
      ))}
    </div>
  );
}
