import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange, total, pageSize, onPageSize }) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Classe de base pour tous les boutons de page
  const baseBtn = "min-w-[34px] h-[34px] rounded-lg border flex items-center justify-center text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 mt-4 pt-4 border-t border-[#E7E2DC] dark:border-[#333]">
      
      {/* Boutons de pagination */}
      <div className="flex gap-1.5 flex-wrap">
        <button 
          className={`${baseBtn} border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#333]`}
          disabled={page <= 1} 
          onClick={() => onChange(page - 1)} 
          aria-label="Page précédente"
        >
          <ChevronLeft size={16} />
        </button>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button 
            key={p} 
            className={`${baseBtn} ${
              p === page 
                ? 'bg-[#FF684A] text-white border-[#FF684A] font-bold' 
                : 'border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#333]'
            }`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
        
        <button 
          className={`${baseBtn} border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#333]`}
          disabled={page >= totalPages} 
          onClick={() => onChange(page + 1)} 
          aria-label="Page suivante"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Info de la page actuelle */}
      <span className="text-sm text-[#6F6A64] dark:text-[#A0A0A0]">{from}–{to} sur {total}</span>

      {/* Éléments par page */}
      {onPageSize && (
        <label className="flex items-center gap-2 text-sm text-[#6F6A64] dark:text-[#A0A0A0]">
          Éléments par page
          <select 
            value={pageSize} 
            onChange={(e) => onPageSize(Number(e.target.value))}
            className="p-1.5 px-2 border border-[#E7E2DC] dark:border-[#333] rounded-lg bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] text-sm transition-colors"
          >
            {[5, 8, 10, 20].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
      )}
    </div>
  );
}