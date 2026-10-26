import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, ChevronDown, X, Moon, Sun, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const INITIAL_NOTIFS = [
  { id: 1, text: 'Nouvelle inscription à « React.js de zéro à pro »' },
  { id: 2, text: 'La formation « UI/UX Design avec Figma » est toujours en brouillon' },
  { id: 3, text: '3 apprenants sont en pause depuis 30 jours' },
];

const STORAGE_KEY = 'skillboard_notifs';

const getInitials = (name) => {
  if (!name) return '??';
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
};

export default function Topbar({ onMenu, onToggleSidebar, sidebarOpen, darkMode, toggleTheme }) {
  const [q, setQ] = useState('');
  
  // ✅ LA CORRECTION : on lit le localStorage au démarrage
  const [notifs, setNotifs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFS;
    } catch {
      return INITIAL_NOTIFS;
    }
  });
  
  const [showNotifs, setShowNotifs] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ LA CORRECTION : on sauvegarde dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
  }, [notifs]);

  useEffect(() => {
    const onDown = (e) => wrapRef.current && !wrapRef.current.contains(e.target) && setShowNotifs(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteOne = (e, id) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifs([]);
  };

  // ✅ Bonus : fonction pour restaurer les notifications (utile pour tester)
  const handleResetNotifs = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setNotifs(INITIAL_NOTIFS);
  };

  const displayName = user?.name || 'Utilisateur';
  const initials = getInitials(displayName);

  return (
    <header className="flex items-center gap-4 px-6 py-3 bg-[#F8F5F0] dark:bg-[#121212] sticky top-0 z-20 transition-colors duration-300">
      <button className="md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg" onClick={onMenu}>
        <Menu size={22} />
      </button>

      <button className="max-md:hidden p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg" onClick={onToggleSidebar}>
        {sidebarOpen ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
      </button>
      
      <form className="relative flex-1 max-w-[460px]" onSubmit={(e) => { e.preventDefault(); navigate(`/learners?q=${q}`); }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
        <input 
          className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm outline-none focus:border-[#FF684A] dark:text-white transition-colors" 
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un apprenant…" 
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors" onClick={toggleTheme}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="relative" ref={wrapRef}>
          <button className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg relative transition-colors" onClick={() => setShowNotifs(!showNotifs)}>
            <Bell size={20} />
            {notifs.length > 0 && <span className="absolute top-0 right-0 bg-[#FF684A] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{notifs.length}</span>}
          </button>

          {showNotifs && (
            <ul className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-xl shadow-xl p-2 z-50">
              <li className="flex justify-between items-center p-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold dark:text-white">
                <span>Notifications</span>
                {notifs.length > 0 && (
                  <button onClick={handleDeleteAll} className="text-xs text-red-500 hover:underline">
                    Tout effacer
                  </button>
                )}
              </li>
              {notifs.length === 0 ? (
                <li className="p-4 text-center text-sm text-gray-500">
                  <p className="mb-2">Aucune notification.</p>
                  {/* ✅ Bouton bonus pour restaurer */}
                  <button 
                    onClick={handleResetNotifs} 
                    className="text-xs text-[#FF684A] hover:underline font-semibold"
                  >
                    Restaurer les notifications
                  </button>
                </li>
              ) : (
                notifs.map((n) => (
                  <li key={n.id} className="flex justify-between items-center gap-2 p-2 text-sm border-b border-[#E7E2DC] dark:border-[#333] last:border-0 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#2A2A2A] rounded-lg">
                    <span className="flex-1">{n.text}</span>
                    <button 
                      type="button"
                      onClick={(e) => handleDeleteOne(e, n.id)} 
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                      title="Supprimer cette notification"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-[#E7E2DC] dark:border-[#333]">
          <div className="w-10 h-10 rounded-full bg-[#191919] dark:bg-[#FF684A] text-[#FF684A] dark:text-[#191919] flex items-center justify-center font-bold text-sm">
            {initials}
          </div>
          <div className="max-md:hidden">
            <p className="text-sm font-bold dark:text-white">{displayName}</p>
            <p className="text-xs text-gray-500">Connecté</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 max-md:hidden" />
          
          <button 
            onClick={handleLogout} 
            className="p-2 ml-1 text-gray-500 hover:text-[#C62F1A] dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-[#333] rounded-lg transition-colors"
            title="Déconnexion"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}