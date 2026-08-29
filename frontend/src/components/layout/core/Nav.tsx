import { Link } from "react-router-dom";
import type {Destination} from '../../../../../shared/types/destination'

export default function Nav({ userName, lienVoyage, lienDestination, destData = null } : CoreNavProps) {
    return (
        <nav className="navbar-nav">
            <p>Bonjour {userName}</p>
            <Link to="/">{lienDestination}</Link>
            <Link to="/mesvoyages" state = {destData ? {destData: destData } : null }>{lienVoyage}</Link>
        </nav>
    )
}

interface CoreNavProps {
    userName : string;
    lienVoyage : string;
    lienDestination : string;
    destData? : Destination[] | null
}