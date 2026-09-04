import "../App.css";
import "../styles/DashAdminDestinations.css";
import TableauAdminDestinations from "../components/admin/TableauAdminDestinations";
import FormAjouterDestination from "../components/admin/FormAjouterDestination";
import Header from "../components/layout/core/Header";
import { useState } from "react";
import TableauAdminPays from "../components/admin/TableauAdminPays";
import { useAuth } from "../context/AuthContext";

export default function DashAdminDestinations() {
  const [rafraichir, setRafraichir] = useState(0);

  const handleDestinationAjoutee = () => {
    setRafraichir((prev) => prev + 1); // Pour force le rechargement après un ajout de destination
  };

  const { role } = useAuth();

  // Pour éviter que n'import qui accède à la page Admin
  if (role !== "Admin") {
    return (
      <div className="admin-access-denied">
        <h3>Accès refusé !</h3>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Header title="Page Administrateur" />

      <main className="admin-content">
        <div className="admin-main">

          <div className="admin-card">
            <TableauAdminDestinations key={rafraichir} />
          </div>

          <div className="admin-card">
            <FormAjouterDestination onSuccess={handleDestinationAjoutee} />
          </div>

        </div>

        <div className="admin-card admin-pays">
          <TableauAdminPays />
        </div>
      </main>
    </div>
  );
}