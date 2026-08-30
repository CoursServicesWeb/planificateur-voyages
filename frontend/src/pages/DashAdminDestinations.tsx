import "../App.css";
import TableauAdminDestinations from "../components/TableauAdminDestinations";
import FormAjouterDestination from "../components/FormAjouterDestination";
import Header from "../components/layout/core/Header";
import { useState } from "react";

export default function DashAdminDestinations() {
  const [rafraichir, setRafraichir] = useState(0);
  const handleDestinationAjoutee = () => {
    setRafraichir((prev) => prev + 1); // Pour force le rechargement après un ajout de destination
  };
  return (
    <div>
      <Header title="Page Administrateur" />
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <TableauAdminDestinations key={rafraichir} />
        </div>
        <div>
          <FormAjouterDestination onSuccess={handleDestinationAjoutee} />
        </div>
      </div>
    </div>
  );
}
