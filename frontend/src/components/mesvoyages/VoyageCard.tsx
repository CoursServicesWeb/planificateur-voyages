import { useState } from 'react'
import { ModalModVoyage } from './ModalModVoyage';
import imageCarte from '../../assets/images/international-travel-0_1684823087.webp'
import { ModalConfirmerSuppression } from './ModalConfirmerSuppresion';
import "../../styles/voyages.css"

export function VoyageCard(
  {id, titre, dateDeb, dateFin, statut, updateHandler, deleteHandler, handleCardClick} : VoyageCardProps) {

    const [ouvrirModalModifierVoy, setOuvrirModalModifierVoy] = useState<Boolean>(false);
    const [ouvrirModalSuppression, setOuvrirModalSuppression] = useState<Boolean>(false);

    const ouvrirModalModifierVoyage = (event : React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setOuvrirModalModifierVoy(true);
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
        <div className= "card mx-5 h-100 position-relative custom-hover"
        
        onClick={() => handleCardClick(id)}>
          <button 
            type="button" 
            className="btn-close position-absolute top-0 end-0 m-2" 
            onClick={deleteAction}
          ></button>
          <img src={imageCarte} style={{height:'100px', objectFit: 'cover'}} alt="..."/>
          <div className="card-body">
            <h5 className="card-title">{titre}</h5>
            <h6 className="card-text">Dep: {dateDeb.split('T')[0]}</h6>
            <h6 className="card-text">Retour: {dateFin.split('T')[0]}</h6>
            <p>{statut}</p>
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <button type="button" onClick={ouvrirModalModifierVoyage} className="btn btn-primary w-100">
            Modifier
          </button>
        </div>
      </div>
      {ouvrirModalModifierVoy && <ModalModVoyage voyageId = {id} modifyHandler = {updateHandler} onClose={() => setOuvrirModalModifierVoy(false)}/>}
      {ouvrirModalSuppression && <ModalConfirmerSuppression id={id} deleteTargetType={'voyage'} closeModal={fermerModalSuppression} confirmDelete={deleteHandler}/>}
    </div> 
  )
}

interface VoyageCardProps {
  id : string
  titre : string
  dateDeb : string
  dateFin : string
  statut : string
  updateHandler : (id : string, formValues : Object) => void
  deleteHandler : (id : string) => void
  handleCardClick : (id : string) => void
}