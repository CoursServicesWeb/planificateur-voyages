import { useEffect, useState } from "react"
import { api } from "../../../api/axios"
import { ModalModEtape } from "./ModalModEtape";

export function EtapeCard(
  {id, voyageId, destinationId, dateDeb, dateFin, hebergement,
    notes, updateHandler,deleteHandler} : EtapeCardProps) {

    const[ville, setVille] = useState<string>();

    useEffect(() => {
        const getDestination = async (id:number) => {
            const resp = await api.get(`/destinations/${id}`)
            setVille(resp.data.destination[0].ville);
        }
        getDestination(destinationId)
    },[])

    const [estOuvert,setEstOuvert] = useState<Boolean>(false);

    const ouvrirModal = (event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEstOuvert(true);
    }

    return (
        <div className="col mt-4">
          <div className= "card h-100 position-relative">
            <button 
              type="button" 
              className="btn-close position-absolute top-0 end-0 m-2" 
              onClick={()=>{deleteHandler(voyageId,id)}}
            ></button>
            <img src="..." className="card-img-top" alt="..."/>
            <div className="card-body">
              <h5 className="card-title">{ville}</h5>
              <h6 className="card-text">{dateDeb.split('T')[0]}</h6>
              <h6 className="card-text">{dateFin.split('T')[0]}</h6>
              <p>{hebergement}</p>
              <p>{notes}</p>
          </div>
          <div className="card-footer bg-transparent border-0 pt-0">
            <button type="button" onClick={ouvrirModal} className="btn btn-primary w-100">
              Modifier
            </button>
          </div>
        </div>
        {estOuvert && 
          <ModalModEtape voyageId = {voyageId} etapeId={id} modifyHandler = {updateHandler} onClose={() => setEstOuvert(false)}/>}
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