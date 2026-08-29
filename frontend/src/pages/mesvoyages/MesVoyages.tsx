import CoreLayout from "../../components/layout/core/CoreLayout"
import { useAuth } from "../../context/AuthContext"

export default function MesVoyages() {
    const { seDeconnecter } = useAuth();
    seDeconnecter()
    return (
        <CoreLayout >
            <div className="container my-5">
                Mes Voyages
            </div>
        </CoreLayout>
    )
}