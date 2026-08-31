import { useState, useEffect } from "react";
import { getInfosPays, supprimerPays } from "../api/pays";
import "../App.css";
import { type InfosSuppPays } from "../../../shared/types/infosSuppPays";
import { type Meta } from "../../../shared/types/pagination";
import { Pagination } from "./layout/core/Pagination";

export default function TableauAdminPays() {
  const [pays, setPays] = useState<InfosSuppPays[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [page, setPage] = useState(1);

  const LIMITE_PAR_PAGE = 20;

  useEffect(() => {
    setChargement(true);
    getInfosPays(page, LIMITE_PAR_PAGE)
      .then((res) => {
        setPays(res.data);
        setMeta(res.meta);
      })
      .catch((e) => {
        console.log("Erreur API infos Pays :", e);
        setErreur(
          "Erreur inattendue.  Impossible d'obtenir les infos des pays !",
        );
      })
      .finally(() => setChargement(false));
  }, [page]);

  const totalPages = meta ? Math.ceil(meta.total / LIMITE_PAR_PAGE) : 1;

  if (chargement) return <div>Chargement des infos des pays...</div>;

  if (erreur) return <div style={{ color: "red" }}>{erreur}</div>;

  const handleSuppression = async (countryCode: string) => {
    try {
      await supprimerPays(countryCode);
      setPays((prev) =>
        prev.filter((item) => item.countryCode !== countryCode),
      );

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
        <caption>Pays avec infos disponibles</caption>
        <thead>
          <tr>
            <th>Country Code</th>
            <th>Drapeau</th>
            <th>Capitale</th>
            <th>Devise</th>
            <th>Langues</th>
          </tr>
        </thead>
        <tbody>
          {pays.map((p) => (
            <tr key={p.countryCode}>
              <td>{p.countryCode}</td>
              <td>
                {p.drapeau_emoji ? (
                  <img
                    src={p.drapeau_emoji}
                    alt={`Drapeau ${p.countryCode}`}
                    style={{ width: "30px", height: "auto", display: "block" }}
                  />
                ) : (
                  "-"
                )}
              </td>
              <td>{p.capitale}</td>
              <td>{p.devise}</td>
              <td>{p.langages}</td>
              <td>
                <span>
                  <button onClick={() => handleSuppression(p.countryCode)}>
                    Supprimer
                  </button>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={5}>Total Pays : {meta?.total ?? 0}</td>
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
