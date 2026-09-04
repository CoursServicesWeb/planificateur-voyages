import { useState, useEffect } from "react";
import { getDestinations, supprimerDestination } from "../../api/destinations";
import "../../App.css";
import { type Destination } from "../../../../shared/types/destination";
import { type Meta } from "../../../../shared/types/pagination";
import { Link } from "react-router-dom";
import { Pagination } from "./../layout/core/Pagination";

export default function TableauAdminDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [page, setPage] = useState(1);

  const LIMITE_PAR_PAGE = 20;

  useEffect(() => {
    setChargement(true);
    getDestinations(page, LIMITE_PAR_PAGE)
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
  }, [page]);

  const totalPages = meta ? Math.ceil(meta.total / LIMITE_PAR_PAGE) : 1;

  if (chargement) return <div>Chargement des destinations...</div>;

  if (erreur) return <div style={{ color: "red" }}>{erreur}</div>;

  const handleSuppression = async (id: number) => {
    try {
      await supprimerDestination(String(id));
      setDestinations((prev) => prev.filter((item) => item.id !== id));

      if (meta) {
        setMeta({ ...meta, total: meta.total - 1 });
      }
    } catch (e) {
      console.log("Erreur de suppression : ", e);
      alert("Impossible de supprimer cette destination.");
    }
  };

  return (
    <div>
      <table>
        <caption style={{ fontSize: "1.5rem" }}>
          Destinations disponibles
        </caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ville</th>
            <th>Continent</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>ID du pays</th>
          </tr>
        </thead>
        <tbody>
          {destinations.map((d) => (
            <tr key={d.id}>
              <td>{d.id}</td>
              <td>{d.ville}</td>
              <td>{d.continent}</td>
              <td>{String(d.lat)}</td>
              {/*Pour éviter les erreurs, puisque la latitude et la longtide sont des floats*/}
              <td>{String(d.long)}</td>
              <td>{d.infoSuppPaysId}</td>
              <td>
                <span>
                  <button onClick={() => handleSuppression(d.id)}>
                    Supprimer
                  </button>
                  <Link to={`/admin/modifier-destination/${d.id}`}>
                    Modifier
                  </Link>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7}>Total Destinations : {meta?.total ?? 0}</td>
          </tr>
        </tfoot>
      </table>

      <div style={{ marginTop: "15px" }}>
        <Pagination
          pageActuelle={page}
          totalPages={totalPages}
          onPageChange={(nouvellePage: number) => setPage(nouvellePage)}
        />
      </div>
    </div>
  );
}
