import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { GraduationCap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Entrez votre email pour réinitialiser le mot de passe.');
      return;
    }
    setError('');
    setSuccessMsg(`Un lien de réinitialisation a été envoyé à ${email}. (Mot de passe actuel : "admin")`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F5F0] dark:bg-[#121212] p-4 transition-colors">
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-8 w-full max-w-md shadow-lg">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FF684A] text-white flex items-center justify-center mb-3">
            <GraduationCap size={26} strokeWidth={2.4} />
          </div>
          <h1 className="text-2xl font-extrabold text-[#191919] dark:text-white m-0">
            Skill<span className="text-[#FF684A]">Board</span>
          </h1>
          <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] mt-2">Connectez-vous à votre espace</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-[#C62F1A] dark:text-red-400 text-sm p-3 rounded-xl mb-4 text-center">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 dark:bg-green-900/20 text-[#3E5A3A] dark:text-green-400 text-sm p-3 rounded-xl mb-4 text-center">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 font-semibold text-sm text-[#191919] dark:text-white">
            Email
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64]" />
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="w-full pl-10 pr-4 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors"
                placeholder="admin@skillboard.com"
              />
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
                className="w-full pl-10 pr-10 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors"
                placeholder="admin"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6F6A64] hover:text-[#FF684A] transition-colors"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </label>

          <div className="flex justify-end -mt-2">
            <button type="button" onClick={handleForgot} className="text-xs text-[#E9502F] dark:text-[#FF684A] font-semibold hover:underline">
              Mot de passe oublié ?
            </button>
          </div>

          <button type="submit" className="bg-[#FF684A] hover:bg-[#E9502F] text-white py-2.5 rounded-xl font-bold text-sm mt-2 transition-colors">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-[#6F6A64] dark:text-[#A0A0A0] mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-[#E9502F] dark:text-[#FF684A] font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}