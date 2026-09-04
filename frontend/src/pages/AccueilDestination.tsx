import { useState, useEffect } from "react";
import {
  getDestinations,
  getDestinationsByContinent,
} from "../api/destinations";
import "../App.css";
import "../styles/CardAccueilDestination.css";
import "../styles/pagination.css";
import { CardAccueilDestination } from "../components/destination/CardAccueilDestination";
import { Pagination } from "../components/layout/core/Pagination";
import type { Destination, Continent } from "../../../shared/types/destination";
import Header from "../components/layout/core/Header";
import type { Meta } from "../../../shared/types/pagination";
import ModalAvisDestination from "../components/destination/ModalAvisDestination";

export default function AccueilDestination() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [meta, setMeta] = useState<Meta | null>(null);
  const [page, setPage] = useState(1);
  const [continentFiltre, setContinentFiltre] = useState<Continent | "tous">("tous");
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);

  const LIMITE_PAR_PAGE = 18;

  // Liste des continents
  const continentsUniques: Continent[] = [
    "Afrique",
    "Amerique",
    "Asie",
    "Europe",
    "Oceanie",
  ];

  useEffect(() => {
    setChargement(true);

    const obtenirDestinations =
      continentFiltre === "tous"
        ? getDestinations(page, LIMITE_PAR_PAGE)
        : getDestinationsByContinent(
            continentFiltre,
            page,
            LIMITE_PAR_PAGE,
          );

    obtenirDestinations
      .then((res) => {
        setDestinations(res.data);
        setMeta(res.meta);
      })
      .catch((e) => {
        console.log("Erreur API destinations :", e);
        setErreur(
          "Erreur inattendue. Impossible d'obtenir les destinations !",
        );
      })
      .finally(() => setChargement(false));
  }, [page, continentFiltre]);

  // Retour à la première page après un changement de filtre
  useEffect(() => {
    setPage(1);
  }, [continentFiltre]);

  const totalPages = meta
    ? Math.ceil(meta.total / LIMITE_PAR_PAGE)
    : 1;

  const IMAGES_PAR_CONTINENT: Record<string, string> = {
    Asie:
      "https://images.unsplash.com/photo-1464817739973-0128fe77aaa1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

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

  if (chargement) {
    return <p>Chargement en cours...</p>;
  }

  if (erreur) {
    return <p>{erreur}</p>;
  }

  return (
    <div className="accueil-destination">

      <Header />

      {/* =====================================================
         HERO
         ===================================================== */}

      <section className="destination-hero">

        <div className="destination-hero-overlay">

          <div className="destination-hero-content">

            <h1>Votre prochain voyage de rêve</h1>

            <p>
              Explorez le monde et trouvez votre prochaine destination.
            </p>

            <button
              className="destination-hero-button"
              onClick={() => {
                document
                  .getElementById("destinations")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Explorer les destinations
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
         DESTINATIONS
         ===================================================== */}

      <section
        id="destinations"
        className="destinations-section"
      >

        <h2 className="destination-title">
          Destinations en vedette
        </h2>


        {/* Filtre */}

        <form className="destination-filter">

          <label htmlFor="continent">
            Filtrer par continent :
          </label>

          <select
            id="continent"
            value={continentFiltre}
            onChange={(e) =>
              setContinentFiltre(
                e.target.value as Continent | "tous",
              )
            }
          >

            <option value="tous">
              Tous
            </option>

            {continentsUniques.map((continent) => (

              <option
                key={continent}
                value={continent}
              >
                {continent}
              </option>

            ))}

          </select>

        </form>


        {/* Cartes */}

        <div className="destination-card-container">

          {destinations.map((destination) => {

            const imageAfficher =
              IMAGES_PAR_CONTINENT[destination.continent] ||
              IMAGES_PAR_CONTINENT.DEFAULT;

            return (

              <CardAccueilDestination
                key={destination.id}
                id={destination.id}
                imageUrl={imageAfficher}
                ville={destination.ville}
                continent={destination.continent}
                drapeauEmoji={
                  destination.infosupppays?.drapeau_emoji ?? ""
                }
                devise={
                  destination.infosupppays?.devise ?? "Inconnue"
                }
                capitale={
                  destination.infosupppays?.capitale ?? "Inconnue"
                }
                langage={
                  destination.infosupppays?.langages ?? "Inconnue"
                }
                onVoirAvis={() =>
                  setSelectedDestinationId(destination.id)
                }
              />

            );

          })}

        </div>


        {/* Avis */}

        {selectedDestinationId && (

          <ModalAvisDestination
            idDestination={selectedDestinationId}
            onClose={() =>
              setSelectedDestinationId(null)
            }
          />

        )}


        {/* Pagination */}

        <div className="pagination-accueil">

          <Pagination
            pageActuelle={page}
            totalPages={totalPages}
            onPageChange={(nouvellePage: number) =>
              setPage(nouvellePage)
            }
          />

        </div>

      </section>

    </div>
  );
}