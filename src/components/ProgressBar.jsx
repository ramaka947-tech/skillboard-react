export default function ProgressBar({ value, showLabel = true }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 bg-[#EFE9E1] dark:bg-[#333] rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${value >= 100 ? 'bg-[#A8BFA3]' : 'bg-[#FF684A]'}`} 
          style={{ width: `${value}%` }} 
        />
      </div>
      {showLabel && <span className="text-xs font-bold min-w-[36px] text-right dark:text-white">{value}%</span>}
    </div>
  );
}