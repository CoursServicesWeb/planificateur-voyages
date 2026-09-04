import { useAuth } from "../../context/AuthContext"

export function Authenticate ({ children } : AuthenticateProps ) {{
    const { connecte } = useAuth();
    if (!connecte) {
        return <p>Il faut être connecté pour accéder à cette page.</p>
    }
    return children
}}

interface AuthenticateProps {
    children : React.ReactNode
}