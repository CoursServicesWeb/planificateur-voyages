import { useError } from "../../context/ErrContext"

export function ModalErreur() {

    const {errCode, errMsg, clearError} = useError();

    return (
        <>
            <div 
        className="modal-backdrop fade show" 
        onClick={clearError}
      ></div>

      <div 
        className="modal fade show d-block" 
        tabIndex={-1}
        role="dialog"
        aria-labelledby="errorModalLabel"
        aria-hidden="false"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content border-danger">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title" id="errorModalLabel">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {errCode}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                aria-label="Close"
                onClick={clearError}
              ></button>
            </div>

            <div className="modal-body py-4">
              <p className="text-muted mb-0">
                {errMsg}
              </p>
            </div>

            <div className="modal-footer bg-light">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={clearError}
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      </div>
        </>
    )
}

