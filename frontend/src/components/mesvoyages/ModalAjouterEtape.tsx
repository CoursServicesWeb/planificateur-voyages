
import { useEffect, useState } from "react";
import type { Destination } from "../../../../shared/types/destination";
import { api } from "../../api/axios";
import type { CreateEtape } from "../../../../shared/types/etape";
import { convertToISO8601 } from "./utils/utils";
import { useError } from "../../context/ErrContext";
import { AxiosError } from "axios";

export function ModalAjouterEtape({ voyageId, onClose, handleCreateEtape } : ModalCreateEtapeProps) {
  const {addError} = useError()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [destId, setDestId] = useState('')
  const [hebergement, setHebergement] = useState<string>('');
  let hebergementId : number = 0
  
  const TypeHebergement = ['Hotel','Motel','AirBnB','Auberge','Tout_inclus','Camping','Amis_Famille']

  useEffect(()=> {
      async function getDestinations() {
          
          const result = await api.get('/destinations');
          
          setDestinations(result.data.data)
      }
      try {
          getDestinations()
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.code) {
            addError(error.response?.data.erreur, `${error.status}-${error.code}`);
          } 
          console.error(error.response);
        } 
      }
  },[])

  const submitHandler = async (event : React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    const postBody = formValues as CreateEtape;
    postBody.dateDeb = convertToISO8601(postBody.dateDeb);
    postBody.dateFin = convertToISO8601(postBody.dateFin);

    handleCreateEtape(voyageId, postBody)
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
                <h5 className="modal-title">Ajoutez une étape!</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close"
                  onClick={onClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                      <label htmlFor="dateDebE" className="form-label">
                        Début:
                      </label>
                      <input type='date' className="form-control" id='datedebe' name='dateDeb'/><br/>
                      <label htmlFor="dateFinE" className="form-label">
                        Fin:
                      </label>
                      <input type='date' className="form-control" id='datefine' name='dateFin'/><br/>
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
                      <textarea className="form-control" rows={4} name="notes" placeholder="Saisir une note..."/>
                        </div>

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

interface ModalCreateEtapeProps {
  voyageId : string
  handleCreateEtape : (voyageId : string, postBody : CreateEtape) => void
  onClose : () => void
}