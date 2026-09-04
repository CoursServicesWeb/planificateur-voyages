import { useState, type FormEvent } from "react";
import { postDestination } from "../../api/destinations";
import "../App.css";
import { type Continent } from "../../../../shared/types/destination";

interface FormProps {
  onSuccess?: () => void;
}

export default function FormAjouterDestination({ onSuccess }: FormProps) {
  const [erreur, setErreur] = useState("");
  const [ville, setVille] = useState("");
  const [continent, setContinent] = useState<Continent>("Asie");
  const [message, setMessage] = useState("");

  const continents = ["Asie", "Afrique", "Amerique", "Europe", "Oceanie"];

  const handleSubmit = async (e: FormEvent) => {
    // La fonction pour gérer l'ajout de la destination en backend
    e.preventDefault();
    if (!ville.trim()) return;
    setErreur("");
    setMessage("");
    try {
      await postDestination({ ville, continent });
      setVille(""); // Pour réinitialiser le champ de la ville
      setMessage("Destination ajoutée avec succès !");
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      setErreur(
        "Erreur lors de l'ajout.  Assurez-vous d'ajouter une ville valide.",
      );
    }
  };

  return (
    <div>
      <h2>Ajouter une nouvelle destination</h2>
      <h3>Remplisser les champs suivants :</h3>
      {erreur && <p style={{ color: "red" }}>{erreur}</p>}{" "}
      {/* Pour afficher le message en cas d'erreur */}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="ville">Ville :</label>
          <input
            type="text"
            id="ville"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
            placeholder="Ville à ajouter..."
            required
          />
        </div>
        <div>
          <label htmlFor="continent">Choisissez le continent : </label>
          <select
            id="continent"
            value={continent}
            onChange={(e) => setContinent(e.target.value as Continent)}
          >
            {continents.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button type="submit">Ajouter la destination</button>
        </div>
      </form>
      <div>{message && <p style={{ color: "green" }}>{message}</p>}</div>
    </div>
  );
}
