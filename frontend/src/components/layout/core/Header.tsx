import { Link, useNavigate } from "react-router-dom";
import "../../../styles/Header.css";
import { useAuth } from "../../../context/AuthContext";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const { role } = useAuth();
  const navigate = useNavigate();

  const estConnecte = !!role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="header">

      <Link to="/" className="header-logo">
        ✈ Planificateur Voyages
      </Link>

      {title && (
        <h1 className="header-title">
          {title}
        </h1>
      )}

      <nav className="header-nav">
        <Link to="/">Accueil</Link>

        <Link to="/avis">Avis</Link>

        {estConnecte && (
          <Link to="/mes-voyages">
            Mes voyages
          </Link>
        )}

        {role === "Admin" && (
          <Link to="/admin">
            Administration
          </Link>
        )}

        {!estConnecte ? (
          <>
            <Link to="/login" className="header-login">
              Se connecter
            </Link>

            <Link to="/register" className="header-register">
              Créer un compte
            </Link>
          </>
        ) : (
          <button
            className="header-logout"
            onClick={handleLogout}
          >
            Déconnexion
          </button>
        )}
      </nav>

    </header>
  );
}