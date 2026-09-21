import { convertToISO8601 } from "./utils/utils";

export function ModalModVoyage({
  voyageId,
  modifyHandler,
  onClose,
}: ModalModVoyProps) {
  const submitHandler = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formValues = Object.fromEntries(formData.entries());
    // Validation des inputs requise
    formValues.dateFin = convertToISO8601(formValues.dateFin as string);

    modifyHandler(voyageId, formValues);
    onClose();
  };
  return (
    <>
      <div
        className="bootstrap-scope modal show d-block"
        tabIndex={-1}
        role="dialog"
        onClick={onClose}
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={submitHandler}>
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
                <label htmlFor="titre" className="form-label">
                  Nouveau titre
                </label>
                <br />
                <input
                  type="text"
                  className="form-control"
                  id="titre"
                  name="titre"
                />
                <br />
                <label htmlFor="date-fin" className="form-label">
                  Nouvelle date de fin
                </label>
                <br />
                <input
                  type="date"
                  className="form-control"
                  id="date-fin"
                  name="dateFin"
                />
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
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
  voyageId: string;
  modifyHandler: (id: string, formValues: Object) => void;
  onClose: () => void;
}
