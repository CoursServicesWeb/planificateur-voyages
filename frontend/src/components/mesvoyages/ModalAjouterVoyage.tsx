import { useEffect, useState } from "react";
import type { Destination } from "../../../../shared/types/destination";
import { api } from "../../api/axios";
import { genererPOSTBodyCreerVoyage } from "./utils/utils";
import type { CreateVoyage } from "../../../../shared/types/voyage";
import { useError } from "../../context/ErrContext";
import { AxiosError } from "axios";

export function ModalAjouterVoyage({ onClose, handleCreateVoyage } : ModalModVoyProps) {

  const {addError} = useError()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [destId, setDestId] = useState('')
  const [hebergement, setHebergement] = useState<string>('');
  let hebergementId : number = 0
  
  const TypeHebergement = ['Hotel','Motel','AirBnB','Auberge','Tout_inclus','Camping','Amis_Famille']

  useEffect(()=> {
      async function getDestinations() {
          
          const result = await api.get('/destinations');
          if (result.status !== 200) {
            throw new Error(result.statusText);
          }
          setDestinations(result.data.data)
          
      }
      try {
          getDestinations()
      } catch (error) {
        if(error instanceof AxiosError) {
          addError(error.message, error.code? error.code:"");
        } else if(error instanceof Error) {
          addError(error.message,"")
        }
          console.error(error)
      }
  },[])

  const submitHandler = async (event : React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const postBody : Partial<CreateVoyage> = genererPOSTBodyCreerVoyage(formValues)
    handleCreateVoyage(postBody)
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
          className="modal-dialog modal-dialog-centered modal-lg" 
          role="document"
          onClick={(e) => e.stopPropagation()} 
        >
          <form onSubmit={submitHandler}>
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Ajoutez un Voyage!</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">
                          Choisissez pour votre voyage:
                      </label><br/>
                      <input 
                          type="text" 
                          className="form-col-custom form-control" 
                          id="titre" 
                          name="titre"
                          placeholder="Entrez le titre..."
                      /><br/>
                      <label htmlFor="dateDebV" className="form-label">
                        Début:
                      </label>
                      <input type='date' className="form-control" id='datedebv' name='dateDebV'/><br/>
                      <label htmlFor="dateFinV" className="form-label">
                        Fin:
                      </label>
                      <input type='date' className="form-control" id='datefinv' name='dateFinV'/><br/>

                  </div>
                  
                  <div className="col-md-6">
                      <label className="form-label fw-bold text-primary">
                          ...et pour la première étape:
                      </label><br/><br/>
                      <label htmlFor="dateDebE" className="form-label">
                        Début:
                      </label>
                      <input type='date' className="form-control" id='datedebe' name='dateDebE'/><br/>
                      <label htmlFor="dateFinE" className="form-label">
                        Fin:
                      </label>
                      <input type='date' className="form-control" id='datefine' name='dateFinE'/><br/>
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
                      </select><br/>
                      <input 
                          type="text" 
                          className="form-col-custom form-control" 
                          id="notes" 
                          name="notes"
                          placeholder="Entrez une note..."
                      />
                  </div>
                </div>
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

interface ModalModVoyProps {
  handleCreateVoyage : (postBody : Partial<CreateVoyage>) => void
  onClose : () => void
}