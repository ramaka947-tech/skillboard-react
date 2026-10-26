import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl shadow-sm transition-colors min-h-[60vh]">
      <h1 className="text-7xl font-extrabold text-[#FF684A] m-0 tracking-tighter">404</h1>
      <p className="text-lg text-[#191919] dark:text-white font-semibold mt-4 mb-1">
        Page introuvable
      </p>
      <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] mb-8">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <Link 
        to="/" 
        className="bg-[#FF684A] hover:bg-[#E9502F] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
      >
        <Home size={16} /> Retour au dashboard
      </Link>
    </div>
  );
}