export default function BarChart({ data }) {
  const maxValue = Math.max(1, ...data.map((d) => d.value));
  const top = Math.ceil(maxValue / 5) * 5;
  const ticks = [top, top * 0.75, top * 0.5, top * 0.25, 0].map(Math.round);

  return (
    <div className="flex gap-4 h-64 pt-2">
      {/* Axe Y */}
      <div className="flex flex-col justify-between text-xs text-[#6F6A64] dark:text-[#A0A0A0] pb-6 text-right min-w-[22px]">
        {ticks.map((t, i) => <span key={i}>{t}</span>)}
      </div>
      
      {/* Zone des barres */}
      <div className="flex-1 relative flex gap-2">
        {/* Grille */}
        <div className="absolute inset-0 bottom-6 flex flex-col justify-between pointer-events-none">
          {ticks.map((_, i) => <div key={i} className="border-t border-dashed border-[#E7E2DC] dark:border-[#333] h-0" />)}
        </div>
        
        {/* Barres */}
        {data.map((d) => (
          <div key={d.label} className="flex-1 flex flex-col items-center relative z-10">
            <div className="flex-1 w-full flex items-end justify-center">
              <div 
                className="w-full max-w-[26px] bg-gradient-to-t from-[#FF684A] to-[#FF9A85] rounded-t-md min-h-[2px] transition-all duration-500 hover:from-[#E9502F] hover:to-[#E9502F]" 
                style={{ height: `${(d.value / top) * 100}%` }} 
                title={`${d.label} : ${d.value} inscriptions`} 
              />
            </div>
            <span className="h-6 leading-6 text-xs text-[#6F6A64] dark:text-[#A0A0A0]">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}