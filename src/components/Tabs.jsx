// Onglets contrôlés : tabs = [{ id, label, count? }]
export default function Tabs({ tabs, active, onChange, variant = 'underline' }) {
  // Classes de base selon la variante
  const wrapperClass = variant === 'underline' 
    ? "flex flex-wrap gap-1 border-b border-[#E7E2DC] dark:border-[#333] mb-4"
    : "flex flex-wrap gap-2 mb-4";

  const getTabClass = (isActive) => {
    if (variant === 'underline') {
      return `px-4 py-2.5 font-semibold text-sm transition-colors border-b-2 -mb-px ${
        isActive 
          ? 'text-[#E9502F] dark:text-[#FF684A] border-[#FF684A]' 
          : 'text-[#6F6A64] dark:text-[#A0A0A0] border-transparent hover:text-[#191919] dark:hover:text-white'
      }`;
    }
    
    // Variante pills
    return `px-4 py-2 rounded-full font-semibold text-sm border transition-colors ${
      isActive 
        ? 'bg-[#191919] dark:bg-white text-white dark:text-[#191919] border-[#191919] dark:border-white' 
        : 'bg-white dark:bg-[#1E1E1E] text-[#6F6A64] dark:text-[#A0A0A0] border-[#E7E2DC] dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'
    }`;
  };

  return (
    <div className={wrapperClass} role="tablist">
      {tabs.map((t) => (
        <button 
          key={t.id} 
          role="tab" 
          aria-selected={active === t.id} 
          className={getTabClass(active === t.id)} 
          onClick={() => onChange(t.id)}
        >
          {t.label}
          {t.count !== undefined && (
            <span className="ml-1 opacity-70 font-normal">({t.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}