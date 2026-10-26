import { getCategory } from '../utils/categories.js';

// Visuel d'une formation généré par catégorie (aucune image externe nécessaire)
export default function CourseCover({ category, size = 'md', children }) {
  const { icon: Icon, bg, fg } = getCategory(category);
  
  // Définition des tailles en Tailwind
  const sizes = {
    sm: 'w-[38px] h-[38px] rounded-[10px]',
    md: 'w-[72px] h-[72px] rounded-xl',
    lg: 'w-[110px] h-[110px] rounded-2xl',
    banner: 'w-full h-[130px] rounded-none',
  };

  // Taille de l'icône selon le format
  const iconSize = size === 'sm' ? 18 : size === 'lg' ? 44 : 34;

  return (
    <div 
      className={`relative grid place-items-center shrink-0 ${sizes[size] || sizes.md}`}
      style={{ background: bg, color: fg }}
    >
      <Icon size={iconSize} strokeWidth={1.8} />
      {children}
    </div>
  );
}