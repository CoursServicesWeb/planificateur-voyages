

export function VoyageCard({id, titre, deleteHandler, handleCardClick} : VoyageCardProps) {

    return (
      <div className="col mt-4">
        <div className={`card h-100 position-relative$ {isSelected ? 'border-primary border-2' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleCardClick(id)}>
          <button 
            type="button" 
            className="btn-close position-absolute top-0 end-0 m-2" 
            onClick={() => deleteHandler(id)}
          ></button>
          <img src="..." className="card-img-top" alt="..."/>
          <div className="card-body">
            <h5 className="card-title">{titre}</h5>
            <h6 className="card-text">Date info</h6>
            <h6 className="card-text">Date info</h6>
            <p>Statut</p>
        </div>
        <div className="card-footer bg-transparent border-0 pt-0">
          <button type="button" onClick={()=>{}} className="btn btn-primary w-100">
            Modifier
          </button>
        </div>
      </div>
    </div> 
  )
}

interface VoyageCardProps {
  id : string
  titre : string
  deleteHandler : (id : string) => void
  handleCardClick : (id : string) => void
}