import { Code2, BarChart3, Server, Palette, Smartphone, BookOpen } from 'lucide-react';

// Icône + couleur par catégorie (remplace les images et les emojis)
export const CATEGORIES = {
  Web: { icon: Code2, bg: '#191919', fg: '#FF684A' },
  Data: { icon: BarChart3, bg: '#E4EDE1', fg: '#3E5A3A' },
  DevOps: { icon: Server, bg: '#2B2B2B', fg: '#A8BFA3' },
  Design: { icon: Palette, bg: '#FFE3DC', fg: '#C2410C' },
  Mobile: { icon: Smartphone, bg: '#EFE9E1', fg: '#191919' },
};
export const getCategory = (name) => CATEGORIES[name] || { icon: BookOpen, bg: '#EFE9E1', fg: '#191919' };
