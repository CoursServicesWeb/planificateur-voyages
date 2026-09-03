import { useState, useEffect } from "react";
import {
  getDestinations,
  getDestinationsByContinent,
} from "../api/destinations";
import "../App.css";
import "../styles/CardAccueilDestination.css";
import "../styles/pagination.css";
import { CardAccueilDestination } from "../components/CardAccueilDestination";
import { Pagination } from "../components/layout/core/Pagination";
import type { Destination } from "../../../shared/types/destination";
import Header from "../components/layout/core/Header";
import { type Meta } from "../../../shared/types/pagination";
import { type Continent } from "../../../shared/types/destination";

export default function AccueilDestination() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [continentFiltre, setContinentFiltre] = useState<Continent | "tous">(
    "tous",
  );

  const LIMITE_PAR_PAGE = 18;

  // Pour avoir la liste des continents uniques
  const continentsUniques: Continent[] = [
    "Afrique",
    "Amerique",
    "Asie",
    "Europe",
    "Oceanie",
  ];

  useEffect(() => {
    setChargement(true);
    /* On gère si le filtrage par continent est activé ou non*/
    const obtenirDestinations =
      continentFiltre === "tous"
        ? getDestinations(page, LIMITE_PAR_PAGE)
        : getDestinationsByContinent(continentFiltre, page, LIMITE_PAR_PAGE);

    obtenirDestinations
      .then((res) => {
        setDestinations(res.data);
        setMeta(res.meta);
      })
      .catch((e) => {
        console.log("Erreur API destinations :", e);
        setErreur(
          "Erreur inattendue.  Impossible d'obtenir les destinations !",
        );
      })
      .finally(() => setChargement(false));
  }, [page, continentFiltre]);

  /* Pour revenir à la page 1 si on filtre les résultats*/
  useEffect(() => {
    setPage(1);
  }, [continentFiltre]);

  const totalPages = meta ? Math.ceil(meta.total / LIMITE_PAR_PAGE) : 1;

  if (chargement) return <p>Chargement en cours...</p>;
  if (erreur) return <p>{erreur}</p>;

  const IMAGES_PAR_CONTINENT: Record<string, string> = {
    Asie: "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Afrique:
      "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Amerique:
      "https://plus.unsplash.com/premium_photo-1661925249607-9262896b6a69?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Europe:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    Oceanie:
      "https://plus.unsplash.com/premium_photo-1661927951140-dc5de87bc8c7?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    DEFAULT:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  };

  return (
    <div>
      <Header title="Votre prochain voyage de rêve" />
      <h2 className="destination-title"> Destinations en vedette </h2>
      <div>
        <form>
          <label>Filtrer par continent : </label>
          <select
            value={continentFiltre}
            onChange={(e) => setContinentFiltre(e.target.value as Continent)}
          >
            <option value="tous">Tous</option>
            {continentsUniques.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </form>
      </div>
      <div className="destination-card-container">
        {destinations.map((d) => {
          const imageAfficher =
            IMAGES_PAR_CONTINENT[d.continent] || IMAGES_PAR_CONTINENT.DEFAULT;
          return (
            <CardAccueilDestination
              key={d.id}
              id={d.id}
              imageUrl={imageAfficher}
              ville={d.ville}
              continent={d.continent}
              drapeauEmoji={d.infosupppays?.drapeau_emoji ?? ""}
              devise={d.infosupppays?.devise ?? "Inconnue"}
              capitale={d.infosupppays?.capitale ?? "Inconnue"}
              langage={d.infosupppays?.langages ?? "Inconnue"}
            />
          );
        })}
      </div>
      <div className="pagination-accueil">
        <Pagination
          pageActuelle={page}
          totalPages={totalPages}
          onPageChange={(nouvellePage: number) => setPage(nouvellePage)}
        />
      </div>
    </div>
  );
}
