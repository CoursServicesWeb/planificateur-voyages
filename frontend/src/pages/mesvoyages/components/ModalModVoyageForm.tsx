

export function ModalModVoyageForm({ onClose } : ModalModVoyProps) {
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
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="modal-title">Modifiez votre Voyage</h5>
              <button 
                type="button" 
                className="btn-close" 
                aria-label="Close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p>Formulaire</p>
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => alert('Modifié avec succès!')}
              >
                Sauvegarder
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

interface ModalModVoyProps {
    onClose : () => void
}