
import { useState,useEffect } from "react";
import type { Destination } from "../../../../../shared/types/destination";
import { api } from "../../../api/axios";

export function ModalModEtape({voyageId, etapeId, modifyHandler, onClose} : ModalModEtapeProps) {

    const [destinations, setDestinations] = useState<Destination[]>([])
    const [destId, setDestId] = useState('')
    const [hebergement, setHebergement] = useState<string>('');
    let hebergementId : number = 0
    
    const TypeHebergement = ['Hotel','Motel','AirBnB','Auberge','Tout_inclus','Camping','Amis_Famille']

    useEffect(()=> {
        async function getDestinations() {
            
            const result = await api.get('/destinations');
            setDestinations(result.data)
        }
        try {
            getDestinations()
        } catch (error) {
            console.error(error)
        }
    },[])

    const submitHandler = async (event : React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formValues = Object.fromEntries(formData.entries());
        modifyHandler(voyageId, etapeId, formValues)
        onClose()
    }
    return (
        <>
        <div 
            className="modal show d-block" 
            tabIndex={-1}
            role="dialog"
            onClick={onClose} 
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} 
        >
            <div 
            className="modal-dialog modal-dialog-centered" 
            role="document"
            onClick={(e) => e.stopPropagation()} 
            >
            <form onSubmit={submitHandler}>
                <div className="modal-content">
                <div className="modal-header d-flex justify-content-between align-items-center">
                    <h5 className="modal-title">Modifiez votre Étape</h5>
                    <button 
                    type="button" 
                    className="btn-close" 
                    aria-label="Close"
                    onClick={onClose}
                    ></button>
                </div>
                <div className="modal-body">
                    <label htmlFor="notes" className="form-label">Notes</label><br/>
                    <input type="text" className="form-control" id="notes" name="notes"/><br/>
                    <label htmlFor="hebergement-select" className="form-label">Type hébergement</label><br/>
                    <select 
                        id="hebergement-select"
                        className="form-select" 
                        name="hebergement"
                        value={hebergement} 
                        onChange={(e) => setHebergement(e.target.value)}
                    >
                        <option value="">-- Choisir un type d'hébergement --</option>
                        {TypeHebergement.map(h => (
                        <option key={hebergementId++} value={h}>
                            {h}
                        </option>
                        ))}
                    </select><br/>
                    <label htmlFor="destination-select" className="form-label">Choisir une destination:</label><br/>
                    <select 
                        id="destination-select"
                        className="form-select" 
                        name="destinationId"
                        value={destId} 
                        onChange={(e) => setDestId(e.target.value)}
                    >
                        <option value="">-- Choisir une ville --</option>
                        {destinations.map(dest => (
                        <option key={dest.id} value={dest.id}>
                            {dest.ville}
                        </option>
                        ))}
                    </select>
                </div>
                <div className="modal-footer">
                    <button 
                    type="submit" 
                    className="btn btn-primary"
                    >
                    Sauvegarder
                    </button>
                </div>

                </div>
            </form>
            </div>
        </div>
        </>
    );
}

interface ModalModEtapeProps {
    voyageId : string
    etapeId : number
    modifyHandler : (voyageId : string, etapeId : number, formValues : Object) => void
    onClose : () => void
}

