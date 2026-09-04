import { createContext, useContext, useState } from "react";
import { connexion } from "../api/auth";
import type { Role } from "../../../shared/types/utilisateur";

// On définit notre type AuthContext
type AuthContextType = {
    token: string | null;
    role: Role | null;
    connecte: boolean;
    seConnecter: (courriel: string, motDePasse: string) => Promise<Role>;
    seDeconnecter: () => void;
};

// On définit notre type AuthProvider
type AuthProviderProps = {
    children: React.ReactNode;
};

// On crée notre contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fonction pour récupérer le rôle présent dans le token
function recupererRole(token: string): Role | null {

    try {
        // On récupère la deuxième partie du JWT qui contient le payload
        const payload = token.split(".")[1];

        // On décode le payload
        const donnees = JSON.parse(atob(payload));

        // On retourne le rôle de l'utilisateur
        return donnees.role as Role;

    } catch (error) {
        // Si le token est invalide, on retourne null
        console.error(error);
        return null;
    }
}

// Fonction AuthProvider qui permet de :
// Récupérer le token
// lancer seConnecter et seDeconnecter
// retourner le contexte

export function AuthProvider({ children }: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    
    // On récupère le rôle depuis le token déjà enregistré
    const [role, setRole] = useState<Role | null>(
        token ? recupererRole(token) : null
    );

    const seConnecter = async (courriel: string, motDePasse: string) => {
        const response = await connexion(courriel, motDePasse);

        // On récupère le rôle présent dans le token
        const roleUtilisateur = recupererRole(response.token);

        if (!roleUtilisateur) {
            throw new Error("Le rôle de l'utilisateur est absent du token.");
        }
        console.log("Rôle récupéré :", roleUtilisateur);

        setToken(response.token);
        setRole(roleUtilisateur);

        localStorage.setItem("token", response.token);

        return roleUtilisateur;
    };

    const seDeconnecter = () => {
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
    };

    const connecte = token !== null;

    return (
        <AuthContext.Provider
            value={{
                token,
                role,
                connecte,
                seConnecter,
                seDeconnecter,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// Ce hook permet d'utiliser le contexte dans les composants
export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth doit être utilisé à l'intérieur de AuthProvider"
        );
    }

    return context;
}