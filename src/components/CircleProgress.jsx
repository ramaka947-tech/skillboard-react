// Indicateur circulaire en SVG : le trait est calculé avec stroke-dasharray
export default function CircleProgress({ value, size = 130 }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Cercle de fond (gris clair en mode clair, gris foncé en mode sombre) */}
        <circle 
          cx={size / 2} cy={size / 2} r={r} fill="none" 
          className="stroke-[#EFE9E1] dark:stroke-[#333]" 
          strokeWidth={stroke} 
        />
        {/* Cercle de progression (corail) */}
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FF684A" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      {/* Texte au centre */}
      <span className="absolute text-2xl font-extrabold text-[#191919] dark:text-white">
        {value}%
      </span>
    </div>
  );
}