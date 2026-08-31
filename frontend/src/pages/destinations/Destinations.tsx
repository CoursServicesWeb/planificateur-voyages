import CoreLayout from "../../components/layout/core/CoreLayout";
import { type userData } from "../../types/user";
import { useAuth } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode"


export default function Destinations () {

    const { seConnecter, seDeconnecter } = useAuth();

    seConnecter(import.meta.env.VITE_LOGIN_EMAIL,import.meta.env.VITE_LOGIN_PASSWORD)

    let userData : userData;

    const token = localStorage.getItem('token')

    if (token) {
        try {
            userData = jwtDecode(token);
        } catch(error) {
            console.error(error)
        }
    }
     
    return (
        <CoreLayout navUserName={userData!.given_name} >
            <div className="container my-5">
                
            </div>
        </CoreLayout>
    )
    
}
