import { Link } from "react-router-dom";
import "../../../styles/Header.css";

export default function Header() {
  return (
    <header className="header">

      <Link to="/" className="header-logo">
        ✈ Planificateur Voyages
      </Link>

      <nav className="header-nav">
        <Link to="/">Accueil</Link>
        <Link to="/avis">Avis</Link>
        <Link to="/login">Se connecter</Link>
        <Link to="/register">Créer un compte</Link>
      </nav>

    </header>
  );
}