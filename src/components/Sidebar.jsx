import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, X } from 'lucide-react';
import Logo from './Logo.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/learners', label: 'Apprenants', icon: Users },
  { to: '/courses', label: 'Formations', icon: BookOpen },
];

export default function Sidebar({ open, onClose, collapsed }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 bg-[#191919] dark:bg-[#0A0A0A] text-white transition-all duration-300 flex flex-col
      ${collapsed ? 'w-[80px] px-2' : 'w-[248px] px-4'} 
      ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className={`flex items-center h-16 mb-8 mt-2 ${collapsed ? 'justify-center' : 'justify-between pl-2'}`}>
        <Logo collapsed={collapsed} />
        <button className="md:hidden text-white/70 hover:text-white" onClick={onClose}><X size={24} /></button>
      </div>
      
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink 
            key={to} 
            to={to} 
            end={end} 
            onClick={onClose} 
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-colors
              ${isActive ? 'bg-[#FF684A] text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
              ${collapsed ? 'justify-center px-0' : ''}
            `}
            title={collapsed ? label : undefined}
          >
            <Icon size={20} /> 
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>
      
      {!collapsed && (
        <p className="text-xs text-gray-500 leading-relaxed mt-auto mb-6 pl-2">
          Centre de formation numérique<br />SkillBoard © 2026
        </p>
      )}
    </aside>
  );
}