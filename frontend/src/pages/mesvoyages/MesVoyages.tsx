
import { useEffect, useState } from "react";
import CoreLayout from "../../components/layout/core/CoreLayout";
import {type Voyage } from '../../../../shared/types/voyage'
import {type Etape } from '../../../../shared/types/etape'
import { type userData } from "../../types/user";
import { jwtDecode } from "jwt-decode";
import { api } from "../../api/axios";
import { VoyageCard } from "./components/VoyageCard";
import { AjouterVoyage } from "./components/AjouterVoyage";
import { EtapeCard } from "./components/EtapeCard";

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

    const handleDeleteVoyage = async (id:string) => {
        try {
            await api.delete(`/voyages/${id}`)
            setVoyages((prev) => prev.filter(v => v.id !== id))
        
        } catch(error) {
            console.log(error)
        }
    }

    const handleUpdateVoyage = async (id : string, formValues : Object) => {
        try {
            const result = await api.patch(`/voyages/${id}`, formValues)
            const update : Voyage = result.data
            const subsVoyage = (update : Voyage) => {
                setVoyages(prev => prev.map( v => v.id === update.id ? update : v))
            }
            subsVoyage(update)
        } catch (error) {
            console.error(error)
        }
    }

    const [etapes, setEtapes] = useState<Etape[]>([]);
    const [isLoadingE, setIsLoadingE] = useState<Boolean>(false);

    const getEtapes = async (id : string) => {
        try {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setIsLoadingE(true);
            const resp = await api.get(`/etapes/moi/${id}`);
            setEtapes(resp.data.etapes);
            setIsLoadingE(false);
        } catch(error) {
            console.error(error)
            setIsLoadingE(false);
        }
    }

    const handleUpdateEtape = async (voyageId : string, etapeId : number, formValues : Object) => {
        try {
            const result = await api.patch(`/etapes/${voyageId}/${etapeId}`, formValues)
            const update : Etape = result.data
            const subsEtape = (update : Etape) => {
                setEtapes(prev => prev.map( e => e.id === update.id ? update : e))
            }
            subsEtape(update)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteEtapes = async (vid : string, eid : number) => {
        try {
            alert('Une etape sera supprime')
            await api.delete(`etapes/${vid}/${eid}`)
            setEtapes(prev => prev.filter(e => e.id !== eid))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <CoreLayout navUserName={userData!.given_name}>
            <div className="container">
                    <div className="row">
                        <div className="col-6 bg-light">
                            {isLoading ? (
                                <p>Chargement des voyages...</p>
                            ):(
                                <>
                                    {voyages.map(v => 
                                        <VoyageCard 
                                            key={v.id} 
                                            id={v.id} 
                                            titre= {v.titre}
                                            updateHandler={handleUpdateVoyage} 
                                            handleCardClick = {getEtapes} 
                                            deleteHandler={handleDeleteVoyage}/>)}
                                        <AjouterVoyage/>
                                </>
                            )}  
                        </div>
                        <div className="col-6 bg-light">
                            {isLoadingE ? (
                                <p>Chargement des étapes...</p>
                            ):(
                                <>
                                    {etapes.map(etape => 
                                        <EtapeCard 
                                            key={etape.id} 
                                            id={etape.id}
                                            voyageId={etape.voyageId} 
                                            destinationId={etape.destinationId}
                                            dateDeb={etape.dateDeb}
                                            dateFin={etape.dateFin}
                                            hebergement={etape.hebergement} 
                                            notes = {etape.notes}
                                            updateHandler={handleUpdateEtape}
                                            deleteHandler={handleDeleteEtapes}
                                        />)
                                    }   
                                </>
                            )}
                        </div>
                    </div>
            </div>
        </CoreLayout>
    )
}