
export function ModalConfirmerSuppression({ id, deleteTargetType, closeModal, confirmDelete, altConfirmDelete }: ModalSuppressionProps) {
    return (
        <>
            <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold text-danger">Confirmer Suppression</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
                        </div>
                        <div className="modal-body py-3">
                            <p className="mb-0 text-secondary">
                                {deleteTargetType === 'voyage'? 
                                "Êtes-vous sûr de vouloir supprimer ce " + deleteTargetType +"?" : 
                                "Êtes-vous sûr de vouloir supprimer cette " + deleteTargetType+"?"} Cette action est permanente.
                            </p>
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button type="button" className="btn btn-light px-4" onClick={closeModal}>
                                Annuler
                            </button>
                            <button type="button" className="btn btn-danger px-4" onClick={() => {
                                confirmDelete?.(id)
                                altConfirmDelete?.(id,id)   
                                }}>
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    )
}

interface ModalSuppressionProps {
    id: string
    deleteTargetType : string
    closeModal : () => void
    confirmDelete?: (id: string) => void
    altConfirmDelete?: (vid: string, eid : string) => void
}