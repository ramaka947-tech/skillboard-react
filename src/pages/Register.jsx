import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = register(name, email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121212] p-4 transition-colors">
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-8 w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF684A] text-white flex items-center justify-center mb-3">
            <GraduationCap size={26} strokeWidth={2.4} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#191919] dark:text-white m-0">Créer un compte</h1>
          <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] mt-2">Rejoignez SkillBoard</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-[#C62F1A] dark:text-red-400 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 font-semibold text-sm text-[#191919] dark:text-white">
            Nom complet
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors" placeholder="Rama KA" />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 font-semibold text-sm text-[#191919] dark:text-white">
            Email
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors" placeholder="vous@exemple.com" />
            </div>
          </label>

          <label className="flex flex-col gap-1.5 font-semibold text-sm text-[#191919] dark:text-white">
            Mot de passe
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                minLength={4} 
                className="w-full pl-10 pr-10 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors" 
                placeholder="4 caractères minimum"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A64] hover:text-[#FF684A] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <button type="submit" className="bg-[#FF684A] hover:bg-[#E9502F] text-white py-2.5 rounded-xl font-bold text-sm mt-2 transition-colors">S'inscrire</button>
        </form>

        <p className="text-center text-sm text-[#6F6A64] dark:text-[#A0A0A0] mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-[#E9502F] dark:text-[#FF684A] font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}