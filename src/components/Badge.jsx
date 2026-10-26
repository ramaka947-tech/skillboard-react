const MAP = {
  actif: 'bg-[#E4EDE1] text-[#3E5A3A] dark:bg-[#1F2B1D] dark:text-[#A8BFA3]',
  'en pause': 'bg-[#FFF0D9] text-[#9A5B00] dark:bg-[#332A1A] dark:text-[#FFC04A]',
  terminé: 'bg-[#191919] text-white dark:bg-white dark:text-[#191919]',
  publiée: 'bg-[#E4EDE1] text-[#3E5A3A] dark:bg-[#1F2B1D] dark:text-[#A8BFA3]',
  brouillon: 'bg-[#FFF0D9] text-[#9A5B00] dark:bg-[#332A1A] dark:text-[#FFC04A]',
  'en cours': 'bg-[#FFE9E3] text-[#B93A1E] dark:bg-[#3A1C14] dark:text-[#FF684A]',
  'non commencé': 'bg-[#EFE9E1] text-[#4A4640] dark:bg-[#333] dark:text-[#A0A0A0]',
};

export default function Badge({ value }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize whitespace-nowrap ${MAP[value] || 'bg-gray-100 text-gray-800'}`}>
      {value}
    </span>
  );
}