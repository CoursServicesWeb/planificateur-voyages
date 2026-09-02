import { Link } from "react-router-dom";
import type {Destination} from '../../../../../shared/types/destination'

export default function Nav({ userName, lienVoyage, lienDestination } : CoreNavProps) {
    return (
        <nav className="navbar-nav">
            <p>Bonjour {userName}</p>
            <Link to="/">{lienDestination}</Link>
            <Link to="/mesvoyages">{lienVoyage}</Link>
        </nav>
    )
}

interface CoreNavProps {
    userName : string;
    lienVoyage : string;
    lienDestination : string;
    destData? : Destination[] | null
}