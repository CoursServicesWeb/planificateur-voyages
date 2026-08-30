// Un composant pour changer de page quand il y a pagination

interface PaginationProps {
  pageActuelle: number;
  totalPages: number;
  onPageChange: (nouvellePage: number) => void;
}

export function Pagination({
  pageActuelle,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <button
        onClick={() => onPageChange(pageActuelle - 1)}
        disabled={pageActuelle === 1}
      >
        Précédent
      </button>
      <span>
        Page {pageActuelle} sur {totalPages}
      </span>
      <button
        onClick={() => onPageChange(pageActuelle + 1)}
        disabled={pageActuelle === totalPages}
      >
        Suivant
      </button>
    </div>
  );
}
