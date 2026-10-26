import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Topbar from '../components/Topbar.jsx';

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark'; // Aide le navigateur
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-[#F8F5F0] dark:bg-[#121212] text-[#191919] dark:text-[#F8F5F0] transition-colors duration-300">
      <Sidebar open={open} onClose={() => setOpen(false)} collapsed={sidebarCollapsed} />
      {open && <div className="fixed inset-0 bg-black/50 z-25 md:hidden" onClick={() => setOpen(false)} />}
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'ml-[80px]' : 'ml-[248px]'} max-md:ml-0`}>
        <Topbar 
          onMenu={() => setOpen(true)} 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          sidebarOpen={!sidebarCollapsed}
          darkMode={darkMode}
          toggleTheme={() => setDarkMode((prev) => !prev)}
        />
        <main className="p-6 max-w-[1240px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}