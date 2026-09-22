import { useEffect, useState } from "react"
import { api } from "../../api/axios"
import { ModalModEtape } from "./ModalModEtape";
import { ModalConfirmerSuppression } from "./ModalConfirmerSuppresion";
import imageCarte from '../../assets/images/international-travel-0_1684823087.webp'
import { Axios, AxiosError } from "axios";
import { useError } from "../../context/ErrContext";


export function EtapeCard(
  {id, voyageId, destinationId, dateDeb, dateFin, hebergement,
    notes, updateHandler,deleteHandler} : EtapeCardProps) {

    const[ville, setVille] = useState<string>();
    const {addError} = useError()

    useEffect(() => {
        const getDestination = async (id:number) => {
            try{
              const resp = await api.get(`/destinations/${id}`)
              setVille(resp.data.destination.ville);
            } catch(error) {
              if(error instanceof AxiosError) {
                if (error.code) {
                  addError(error.response?.data.erreur, `${error.status}-${error.code}`);
                } 
                console.error(error.response);
              }   
            }   
        }
        try {
          getDestination(destinationId)
        } catch(error) {
          if (error instanceof AxiosError) {
            if (error.code) {
              addError(error.response?.data.message, `${error.status}-${error.code}`);
            }
            console.error(error.response);
          } 
        }
        
    },[])

    const [estOuvertModalModifierEtape,setEstOuvertModalModifierEtape] = useState<Boolean>(false);
    const [ouvrirModalSuppression, setOuvrirModalSuppression] = useState<Boolean>(false);

    const ouvrirModalModifierEtape = (event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEstOuvertModalModifierEtape(true);
    }

    const fermerModalSuppression = () => {
      setOuvrirModalSuppression(false);
    }

    const deleteAction = (event : React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      setOuvrirModalSuppression(true)
    }

    return (
        <div className="col mt-4">
          <div className= "card w-75 mx-auto h-100 position-relative">
            <button 
              type="button" 
              className="btn-close position-absolute top-0 end-0 m-2" 
              onClick={deleteAction}
            ></button>
            <img src={imageCarte} style={{height:'100px', objectFit: 'cover'}} alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{ville}</h5>
              <h6 className="card-text">Dep: {dateDeb.split('T')[0]}</h6>
              <h6 className="card-text">Fin: {dateFin.split('T')[0]}</h6>
              <p>Hébergement: {hebergement}</p>
              <p>Notes: {notes}</p>
          </div>
          <div className="card-footer bg-transparent border-0 pt-0">
            <button type="button" onClick={ouvrirModalModifierEtape} className="btn btn-primary w-100">
              Modifier
            </button>
          </div>
        </div>
        {estOuvertModalModifierEtape && 
          <ModalModEtape voyageId = {voyageId} etapeId={id} modifyHandler = {updateHandler} onClose={() => setEstOuvertModalModifierEtape(false)}/>}
        {ouvrirModalSuppression &&
        <ModalConfirmerSuppression 
          id={voyageId} 
          deleteTargetType={'étape'} 
          closeModal={fermerModalSuppression} 
          confirmDelete={()=>deleteHandler(voyageId,id)}
          />}
    </div>
    )
}

interface EtapeCardProps {
    id : number 
    voyageId : string 
    destinationId : number 
    dateDeb : string 
    dateFin : string 
    hebergement : string 
    notes : string | null
    updateHandler : (voyageId : string, etapeId : number, formValues : Object) => void
    deleteHandler : (vid : string, eid : number) => void
}