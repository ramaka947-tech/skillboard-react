export default function StatCard({ icon: Icon, label, value, hint, tone = 'coral' }) {
  const tones = {
    coral: 'bg-[#FFE9E3] text-[#E9502F] dark:bg-[#3A1C14] dark:text-[#FF684A]',
    dark: 'bg-[#E9E4DD] text-[#191919] dark:bg-[#333] dark:text-white',
    sage: 'bg-[#E4EDE1] text-[#3E5A3A] dark:bg-[#1F2B1D] dark:text-[#A8BFA3]',
    sand: 'bg-[#FFF0D9] text-[#9A5B00] dark:bg-[#332A1A] dark:text-[#FFC04A]',
  };

  return (
    <div className="flex items-center gap-4 p-5 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl shadow-sm transition-colors">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${tones[tone]}`}>
        <Icon size={24} strokeWidth={2} />
      </div>
      <div>
        <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] m-0">{label}</p>
        <h3 className="text-2xl font-bold text-[#191919] dark:text-white my-1">{value}</h3>
        {hint && <p className="text-xs font-semibold text-[#3E5A3A] dark:text-[#A8BFA3] m-0">{hint}</p>}
      </div>
    </div>
  );
}