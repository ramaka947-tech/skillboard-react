import { GraduationCap } from 'lucide-react';

// Logo SkillBoard (version fond sombre : "Skill" en ivoire, "Board" en corail)
export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="w-9 h-9 rounded-[10px] bg-[#FF684A] text-white grid place-items-center shrink-0">
        <GraduationCap size={20} strokeWidth={2.4} />
      </span>
      {!collapsed && (
        <span className="text-xl font-extrabold tracking-tight text-[#F8F5F0]">
          Skill<b className="text-[#FF684A] font-extrabold">Board</b>
        </span>
      )}
    </div>
  );
}