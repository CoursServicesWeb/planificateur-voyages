import { createContext, useContext, useState } from "react";
import { connexion } from "../api/auth";

// On définit notre type AuthContext
type AuthContextType = {
    token: string | null;
    connecte: boolean;
    seConnecter: (courriel: string, motDePasse: string) => Promise<void>;
    seDeconnecter: () => void;
};

// On définit notre type AuthProvider
type AuthProviderProps = {
    children: React.ReactNode;
};

// On crée notre contexte
const AuthContext = createContext<AuthContextType | undefined>(undefined);


// Fonction AuthProvider qui permet de :
// Récupérer le token
// lancer seConnecter et seDeconnecter
// retourner le contexte
export function AuthProvider({ children }: AuthProviderProps) {

    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );

    const seConnecter = async (courriel: string, motDePasse: string) => {
        const response = await connexion(courriel, motDePasse);

        setToken(response.token);
        localStorage.setItem("token", response.token);
    };

    const seDeconnecter = () => {
        setToken(null);
        localStorage.removeItem("token");
    };

    const connecte = token !== null;

    return (
        <AuthContext.Provider
            value={{
                token,
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