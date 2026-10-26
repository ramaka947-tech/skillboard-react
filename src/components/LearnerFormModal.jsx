import { useState } from 'react';
import { X, Camera, Trash2 } from 'lucide-react';
import { fileToCompressedDataUrl } from '../utils/image.js';

const input =
  'w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm outline-none focus:border-[#FF684A]';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LearnerFormModal({ learner, courses = [], existingEmails = [], onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', status: 'actif', avatar: null, courseId: '',
    ...learner,
  });
  const [error, setError] = useState('');
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      set('avatar', await fileToCompressedDataUrl(file, 300)); // petite taille pour un avatar
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return setError('Le nom est obligatoire.');
    if (!EMAIL_RE.test(form.email.trim())) return setError('Email invalide.');
    const taken = existingEmails
      .filter((m) => m.toLowerCase() !== (learner?.email || '').toLowerCase())
      .includes(form.email.trim().toLowerCase());
    if (taken) return setError('Cet email est déjà utilisé.');
    onSave({ ...form, name: form.name.trim(), email: form.email.trim() });
  };

  const initials = form.name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F8F5F0] dark:bg-[#161616] text-[#191919] dark:text-[#F8F5F0] p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{learner ? "Modifier l'apprenant" : 'Nouvel apprenant'}</h2>
          <button type="button" onClick={onClose}><X size={22} /></button>
        </div>

        {/* Photo */}
        <div className="flex items-center gap-4">
          {form.avatar ? (
            <img src={form.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-[#FF684A] text-white grid place-items-center text-xl font-bold">{initials}</div>
          )}
          <div className="flex gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm font-semibold hover:border-[#FF684A]">
              <Camera size={16} /> Photo
              <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
            </label>
            {form.avatar && (
              <button type="button" onClick={() => set('avatar', null)}
                className="rounded-xl border border-black/10 dark:border-white/10 p-2" title="Retirer">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Nom complet *</label>
          <input className={input} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-semibold">Email *</label>
          <input type="email" className={input} value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Téléphone</label>
            <input className={input} value={form.phone || ''} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Statut</label>
            <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
            </select>
          </div>
        </div>

        {!learner && (
          <div>
            <label className="text-sm font-semibold">Inscrire à une formation</label>
            <select className={input} value={form.courseId} onChange={(e) => set('courseId', e.target.value)}>
              <option value="">Aucune</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-black/10 dark:border-white/10">
            Annuler
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#FF684A] text-white">
            {learner ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}