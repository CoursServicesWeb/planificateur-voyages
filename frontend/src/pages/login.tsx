import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

     const navigate = useNavigate();

    // On stocke le courriel
    const [courriel, setCourriel] = useState("");

    // On stocke le mot de passe
    const [motDePasse, setMotDePasse] = useState("");

    // On stocke le message d'erreur
    const [erreur, setErreur] = useState("");

    // On récupere notre fct de connexion
    const { seConnecter} = useAuth();

    // Fonction appelée quand l'utilisateur clique sur Connexion
    const handleConnexion = async () => {

        // On efface l'ancien message d'erreur
        setErreur("");

        // On vérifie si le courriel ou le mot de passe est vide
        if (!courriel || !motDePasse) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        // On verfie le forma du courriel
        const formatCourriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // On check le format attendu
        if (!formatCourriel.test(courriel)) {
            setErreur("Veuillez entrer un courriel valide.");
            return;
        }

        try {

            const roleUtilisateur = await seConnecter(courriel, motDePasse);

            console.log("Connexion réussie");
            console.log("Rôle :", roleUtilisateur);

            if (roleUtilisateur === "Admin") {
                navigate("/admin");
            }

        } catch (error) {
            // Affiche l'erreur dans la console
            console.error(error);

            // Affiche le message d'erreur
            setErreur("Courriel ou mot de passe incorrect.");
        }
    };

    return (
        <div>
            <h1>Connexion</h1>

            {/* Affichage Erreur */}
            {erreur && (
                <p>{erreur}</p>
            )}

            <input
                type="email"
                placeholder="Courriel"
                value={courriel}
                onChange={(e) => setCourriel(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mot de passe"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
            />

            <button type="button" onClick={handleConnexion}>
                Se connecter
            </button>
        </div>
    );
}

export default Login;