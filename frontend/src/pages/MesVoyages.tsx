
import { useEffect, useState } from "react";
import CoreLayout from "../components/layout/core/CoreLayout";
import {type CreateVoyage, type Voyage } from '../../../shared/types/voyage'
import {type CreateEtape, type Etape } from '../../../shared/types/etape'
import { type userData } from "../types/user";
import { jwtDecode } from "jwt-decode";
import { api } from "../api/axios";
import { VoyageCard } from "../components/mesvoyages/VoyageCard";
import { AjouterVoyage } from "../components/mesvoyages/AjouterVoyageCard";
import { EtapeCard } from "../components/mesvoyages/EtapeCard";
import { AxiosError } from "axios";
import { AjouterEtape } from "../components/mesvoyages/AjouterEtapeCard";
import { useError } from "../context/ErrContext";
import { ModalErreur } from "../components/common/ModalErreur";
import '../components/mesvoyages/bootstrap/bootstrap-scoped.scss'


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
    
    const {showErrModal, addError} = useError();

    const [voyages, setVoyages] = useState<Voyage[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [selectedVoyageId, setSelectedVoyageId] = useState<string>('');
    const [isVoyageSelected, setIsVoyageSelected] = useState<Boolean>(false);

    useEffect(() => {
        async function chargerVoyages(){
            const resp = await api.get('/voyages/moi')
            setVoyages(resp.data.voyages);
        }

        try {
            chargerVoyages();
            setIsLoading(false);
        } catch(error) {
            if (error instanceof AxiosError) {
                console.error(error.response)
                setIsLoading(false);
                if (error.code) {
                    addError(error.message, error.code);
                } else {
                    addError(error.message, "");
                }
            } else {
                console.error(error)
                setIsLoading(false);
            }    
        }
    },[voyages])

    const handleCreateVoyage = async (postBody : Partial<CreateVoyage>) => {
        try {
            const result = await api.post('/voyages', postBody)
            const {voyage, etape } = result.data.result
            setVoyages(prev => [...prev, voyage]);
            setEtapes(prev => [...prev, etape])
            
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response)
            }   
        }
        
    }

    const handleDeleteVoyage = async (id:string) => {

        try {
            await api.delete(`/voyages/${id}`)
            setVoyages((prev) => prev.filter(v => v.id !== id))
        
        } catch(error) {
            if (error instanceof AxiosError) {
                if (error.code) {
                    addError(error.message, error.code);
                } else {
                    addError(error.message, "");
                }
                console.error(error.response)
            }
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
            if (error instanceof AxiosError) {
                console.error(error.response)
            }
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
            setIsVoyageSelected(true);
            setSelectedVoyageId(id);
        } catch(error) {
            if (error instanceof AxiosError) {
                console.error(error.response);
                setIsLoading(false);
            }
        }
    }

    const handleCreateEtape = async (voyageId : string, postBody : CreateEtape) => {
        try {
            const result = await api.post(`/etapes/${voyageId}`, postBody);
            setEtapes(prev => [...prev, result.data])

        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response)
            }
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
            getEtapes(voyageId)
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response)
            }
        }
    }

    const handleDeleteEtapes = async (vid : string, eid : number) => {
        try {
            console.log('here')
            await api.delete(`etapes/${vid}/${eid}`)
            setEtapes(prev => prev.filter(e => e.id !== eid))
        } catch (error) {
            if (error instanceof AxiosError) {
                console.error(error.response)
            }
        }
    }

    return (
    <div className="bootstrap-scope">
        <CoreLayout navUserName={userData!.given_name}>
            <div className="container">
                    <div className="row">
                        <div className="col-6 bg-light">
                            {isLoading ? (
                                <p>Chargement des voyages...</p>
                            ):(
                                <>
                                    <AjouterVoyage handleCreateVoyage={handleCreateVoyage}/>
                                    {voyages.map(v => 
                                        <VoyageCard
                                            key={v.id} 
                                            id={v.id} 
                                            titre= {v.titre}
                                            dateDeb={v.dateDeb}
                                            dateFin={v.dateFin}
                                            statut={v.statut}
                                            updateHandler={handleUpdateVoyage} 
                                            handleCardClick = {getEtapes} 
                                            deleteHandler={handleDeleteVoyage}/>)}
                                </>
                            )}  
                        </div>
                        <div id="cartes-etapes" className="col-6 bg-light">
                            {isLoadingE ? (
                                <p className="text-center my-3">Chargement des étapes...</p>
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
                                    {isVoyageSelected &&
                                     <AjouterEtape voyageId={selectedVoyageId} handleCreateEtape={handleCreateEtape}/>}
                                </>
                            )}
                        </div>
                    </div>
            </div>
            {showErrModal && <ModalErreur/>}
        </CoreLayout>
    </div>
    )
}