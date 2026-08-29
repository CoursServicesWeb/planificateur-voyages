
import { useEffect, useState } from "react";
import CoreLayout from "../../components/layout/core/CoreLayout";
import {type Voyage } from '../../../../shared/types/voyage'
import { type userData } from "../../../src/types/user";
import { jwtDecode } from "jwt-decode";
import { api } from "../../api/axios";
import { VoyageCard } from "./components/VoyageCard";
import { AjouterVoyage } from "./components/AjouterVoyage";


export default function MesVoyages () {

    const token = localStorage.getItem('token')

    let userData : userData;
    
        if (token) {
            try {
                userData = jwtDecode(token);
            } catch(error) {
                console.error(error)
            }
        } 

    const [voyages, setVoyages] = useState<Voyage[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);

    useEffect(() => {
        async function chargerVoyages(){
            const resp = await api.get('/voyages/moi')
            setVoyages(resp.data.voyages);
        }

        try {
            chargerVoyages();
            setIsLoading(false);
        } catch(error) {
            console.error(error)
            setIsLoading(false);
        }
    },[voyages])

    const handleDelete = async (id:string) => {
        try {
            await api.delete(`/voyages/${id}`)
            setVoyages((prev) => prev.filter(v => v.id !== id))
        
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <CoreLayout navUserName={userData!.given_name}>
            <div className="container">
                {isLoading ? (
                    <p>Chargement des voyages....</p>
                ) : (
                    <div className="row">
                        <div className="col-6 bg-light">
                            {voyages.map(v => 
                                <VoyageCard 
                                    key={v.id} 
                                    id={v.id} 
                                    titre= {v.titre} 
                                    handleCardClick = {()=>{}} 
                                    deleteHandler={handleDelete}/>)}
                                <AjouterVoyage/>
                        </div>
                        <div className="col-6 bg-light">
                            Etapes
                        </div>
                    </div>
                    )
                }
            </div>
        </CoreLayout>
    )
}