import { useState } from 'react'
import { ModalModVoyage } from './ModalModVoyage';
import imageCarte from '../../../assets/images/international-travel-0_1684823087.webp'

export function VoyageCard({id, titre, updateHandler, deleteHandler, handleCardClick} : VoyageCardProps) {

    const [estOuvert,setEstOuvert] = useState<Boolean>(false);

    const ouvrirModal = (event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setEstOuvert(true);
    }

    return (
      <div className="col mt-4">
        <div className={`card w-75 mx-auto h-100 position-relative$ {isSelected ? 'border-primary border-2' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleCardClick(id)}>
          <button 
            type="button" 
            className="btn-close position-absolute top-0 end-0 m-2" 
            onClick={() => deleteHandler(id)}
          ></button>
          <img src={imageCarte} style={{height:'100px', objectFit: 'cover'}} alt="..."/>
          <div className="card-body">
            <h5 className="card-title">{titre}</h5>
            <h6 className="card-text">Date info</h6>
            <h6 className="card-text">Date info</h6>
            <p>Statut</p>
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <button type="button" onClick={ouvrirModal} className="btn btn-primary w-100">
            Modifier
          </button>
        </div>
      </div>
      {estOuvert && <ModalModVoyage voyageId = {id} modifyHandler = {updateHandler} onClose={() => setEstOuvert(false)}/>}
    </div> 
  )
}

interface VoyageCardProps {
  id : string
  titre : string
  updateHandler : (id : string, formValues : Object) => void
  deleteHandler : (id : string) => void
  handleCardClick : (id : string) => void
}