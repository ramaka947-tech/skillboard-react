import { initials } from '../utils/format.js';

// Couleurs conservées, mais adaptées pour bien réagir au Dark Mode
const TONES = [
  { bg: '#FFE3DC', fg: '#C2410C' },
  { bg: '#E4EDE1', fg: '#3E5A3A' },
  { bg: '#EFE9E1', fg: '#191919' },
  { bg: '#191919', fg: '#FF684A' },
];

const SIZES = {
  sm: 'w-8 h-8 text-xs',       // 32px
  md: 'w-10 h-10 text-sm',     // 40px
  xl: 'w-[84px] h-[84px] text-2xl', // 84px
};

export default function Avatar({ name, id = 0, size = 'md' }) {
  const t = TONES[id % TONES.length];
  
  return (
    <span 
      className={`rounded-full inline-flex items-center justify-center font-bold shrink-0 ${SIZES[size] || SIZES.md}`}
      style={{ background: t.bg, color: t.fg }}
    >
      {initials(name)}
    </span>
  );
}