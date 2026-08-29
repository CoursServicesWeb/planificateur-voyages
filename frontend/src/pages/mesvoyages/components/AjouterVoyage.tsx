

export function AjouterVoyage() {
    return (
        <div className="col mt-4">
            <div 
                className="card h-100 text-center border-secondary border-dashed cursor-pointer shadow-sm-hover"
                onClick={()=>{}}
                style={{ borderStyle: 'dashed', cursor: 'pointer' }}
            >
                <div className="card-body d-flex flex-column align-items-center justify-content-center py-5">
                <div className="bg-light rounded-circle p-3 mb-3 text-secondary">
                    <svg xmlns="http://w3.org" width="32" height="32" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
                    </svg>
                </div>
                <h5 className="card-title text-secondary fw-semibold">Commencez un Voyage</h5>
                <p className="card-text text-muted small">Cliquez pour de l'aventure!</p>
                </div>
            </div>
        </div>
    )
}