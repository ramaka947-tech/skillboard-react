import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, onClose, children }) {
  // Fermeture avec la touche Échap
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    // Overlay (fond sombre)
    <div 
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-colors" 
      onClick={onClose}
    >
      {/* Boîte de la modale */}
      <div 
        className="bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 transition-colors"
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
      >
        {/* En-tête */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-[#191919] dark:text-white m-0">{title}</h3>
          <button 
            onClick={onClose} 
            aria-label="Fermer"
            className="p-1.5 text-[#6F6A64] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contenu (le formulaire) */}
        {children}
      </div>
    </div>
  );
}