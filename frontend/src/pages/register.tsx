import { useState } from "react";
import { inscription } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {

    // On crée notre fonction pour naviguer vers une autre page
    const navigate = useNavigate();

    // On stocke le prénom
    const [prenom, setPrenom] = useState("");

    // On stocke le nom
    const [nom, setNom] = useState("");

    // On stocke le courriel
    const [courriel, setCourriel] = useState("");

    // On stocke le mot de passe
    const [motDePasse, setMotDePasse] = useState("");

    // On stocke la confirmation du mot de passe
    const [confirmationMotDePasse, setConfirmationMotDePasse] = useState("");

    // On stocke le message d'erreur
    const [erreur, setErreur] = useState("");

    // Notre handleInscription
    const handleInscription = async () => {

        // On efface l'ancien message d'erreur
        setErreur("");

        // Vérification des champs
        if (
            !prenom ||
            !nom ||
            !courriel ||
            !motDePasse ||
            !confirmationMotDePasse
        ) {
            setErreur("Veuillez remplir tous les champs.");
            return;
        }

        // format du courriel
        const formatCourriel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // On vérifie le format attendu
        if (!formatCourriel.test(courriel)) {
            setErreur("Veuillez entrer un courriel valide.");
            return;
        }

        // On vérifie que les mots de passe sont identiques
        if (motDePasse !== confirmationMotDePasse) {
            setErreur("Les mots de passe ne correspondent pas.");
            return;
        }

        try {

            // On envoie les informations au backend
            await inscription({
                prenom,
                nom,
                courriel,
                motDePasse,
            });

            console.log("Inscription réussie");

            // Après l'inscription, on retourne vers la connexion
            navigate("/login");

        } catch (error) {

            console.error(error);

            setErreur(
                "Impossible de créer le compte. Veuillez vérifier vos informations."
            );
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <h1>Prêt à voyager ? ✈️</h1>

                <p className="register-subtitle">
                    Créez votre compte et préparez votre prochaine aventure.
                </p>

                {/* Affichage Erreur */}
                {erreur && (
                    <p className="register-error">
                        {erreur}
                    </p>
                )}

                {/* Champ prénom */}
                <div className="register-field">
                    <label htmlFor="prenom">
                        Prénom
                    </label>

                    <input
                        id="prenom"
                        type="text"
                        placeholder="Votre prénom"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                    />
                </div>

                {/* Champ nom */}
                <div className="register-field">
                    <label htmlFor="nom">
                        Nom
                    </label>

                    <input
                        id="nom"
                        type="text"
                        placeholder="Votre nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </div>

                {/* Champ courriel */}
                <div className="register-field">
                    <label htmlFor="courriel">
                        Courriel
                    </label>

                    <input
                        id="courriel"
                        type="email"
                        placeholder="exemple@email.com"
                        value={courriel}
                        onChange={(e) => setCourriel(e.target.value)}
                    />
                </div>

                {/* Champ mot de passe */}
                <div className="register-field">
                    <label htmlFor="motDePasse">
                        Mot de passe
                    </label>

                    <input
                        id="motDePasse"
                        type="password"
                        placeholder="Votre mot de passe"
                        value={motDePasse}
                        onChange={(e) => setMotDePasse(e.target.value)}
                    />
                </div>

                {/* Champ confirmation du mot de passe */}
                <div className="register-field">
                    <label htmlFor="confirmationMotDePasse">
                        Confirmer le mot de passe
                    </label>

                    <input
                        id="confirmationMotDePasse"
                        type="password"
                        placeholder="Confirmez votre mot de passe"
                        value={confirmationMotDePasse}
                        onChange={(e) =>
                            setConfirmationMotDePasse(e.target.value)
                        }
                    />
                </div>

                {/* Bouton d'inscription */}
                <button
                    type="button"
                    className="register-button"
                    onClick={handleInscription}
                >
                    Créer mon compte ✈️
                </button>

                {/* Retour vers la connexion */}
                <p className="register-footer">
                    Vous avez déjà un compte ?{" "}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                    >
                        Se connecter
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;