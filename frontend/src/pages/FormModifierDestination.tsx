import { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDestinationById, modifierDestination } from "../api/destinations";
import "../App.css";
import { type Continent } from "../../../shared/types/destination";

export default function FormModifierDestination() {
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(true);
  const { id } = useParams<{ id: string }>(); // Je récupère l'ID dans l'URL grâce à useParams
  const navigate = useNavigate();
  const [ville, setVille] = useState("");
  const [continent, setContinent] = useState<Continent>("Asie");
  const [infoSuppPaysId, setInfoSuppPaysID] = useState("");

  useEffect(() => {
    if (!id) {
      setChargement(false);
      return;
    }

    setChargement(true);
    getDestinationById(id)
      .then((dest) => {
        setVille(dest.ville);
        setContinent(dest.continent);
        setInfoSuppPaysID(dest.infoSuppPaysId || "");
      })
      .catch(() => setErreur("Erreur lors du chargement de la destination."))
      .finally(() => setChargement(false));
  }, [id]);

  const handleSubmit = async (e: FormEvent) => {
    // La fonction pour gérer la modification de la destination en backend
    e.preventDefault();
    if (!id) return;
    try {
      await modifierDestination(id, { ville, continent, infoSuppPaysId });
      navigate("/admin"); // Retour au tableau de base admin
    } catch (e) {
      setErreur("Erreur lors de la modification.");
      alert("Erreur lors de la modification.");
    }
  };

  if (chargement) return <div>Chargement du formulaire...</div>;

  if (erreur) return <div style={{ color: "red" }}>{erreur}</div>;

  return (
    <div>
      <h2>Modifier la destination #{id}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ margin: "12px" }}>
          <label>Nouveau nom de ville ? : </label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            required
          />
        </div>
        <div style={{ margin: "12px" }}>
          <label>Nouveau continent ? : </label>
          <input
            type="text"
            value={continent}
            onChange={(e) => setContinent(e.target.value as Continent)}
            required
          />
        </div>
        <div style={{ margin: "12px" }}>
          <label>Nouveau ID de pays ? : </label>
          <input
            type="text"
            value={infoSuppPaysId}
            onChange={(e) => setInfoSuppPaysID(e.target.value)}
            required
          />
        </div>
        <div
          style={{
            margin: "12px",
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          <button type="submit">Soumettre les changements</button>
          <button type="button" onClick={() => navigate("/admin")}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
