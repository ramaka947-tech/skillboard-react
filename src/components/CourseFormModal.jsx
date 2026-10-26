import { useState } from 'react';
import { X, ImagePlus, Trash2 } from 'lucide-react';
import { fileToCompressedDataUrl } from '../utils/image.js';

const input =
  'w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#1E1E1E] px-4 py-2.5 text-sm outline-none focus:border-[#FF684A]';

export default function CourseFormModal({ course, categories = [], enrolledCount = 0, onSave, onClose }) {
  const [form, setForm] = useState({
    title: '', category: categories[0] || '', coach: '', capacity: 20,
    status: 'brouillon', description: '', cover: null,
    ...course,
  });
  const [error, setError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      set('cover', await fileToCompressedDataUrl(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.coach.trim() || !form.category.trim())
      return setError('Titre, catégorie et coach sont obligatoires.');
    if (Number(form.capacity) < enrolledCount)
      return setError(`La capacité ne peut pas être inférieure aux inscrits (${enrolledCount}).`);
    onSave({ ...form, capacity: Number(form.capacity) });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#F8F5F0] dark:bg-[#161616] text-[#191919] dark:text-[#F8F5F0] p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold">{course ? 'Modifier la formation' : 'Nouvelle formation'}</h2>
          <button type="button" onClick={onClose}><X size={22} /></button>
        </div>

        <div>
          <label className="text-sm font-semibold">Photo de couverture</label>
          {form.cover ? (
            <div className="relative mt-1">
              <img src={form.cover} alt="" className="h-40 w-full object-cover rounded-xl" />
              <button type="button" onClick={() => set('cover', null)}
                className="absolute top-2 right-2 bg-black/60 text-white p-2 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          ) : (
            <label className="mt-1 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20 text-sm text-gray-500 hover:border-[#FF684A]">
              <ImagePlus size={24} /> Cliquer pour choisir une image
              <input type="file" accept="image/*" className="hidden" onChange={onCover} />
            </label>
          )}
        </div>

        <div>
          <label className="text-sm font-semibold">Titre *</label>
          <input className={input} value={form.title} onChange={(e) => set('title', e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Catégorie *</label>
            <input className={input} list="cats" value={form.category} onChange={(e) => set('category', e.target.value)} />
            <datalist id="cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
          </div>
          <div>
            <label className="text-sm font-semibold">Capacité</label>
            <input type="number" min="1" className={input} value={form.capacity}
              onChange={(e) => set('capacity', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold">Coach *</label>
            <input className={input} value={form.coach} onChange={(e) => set('coach', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold">Statut</label>
            <select className={input} value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="publiée">Publiée</option>
              <option value="brouillon">Brouillon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">Description</label>
          <textarea rows={3} className={input} value={form.description || ''}
            onChange={(e) => set('description', e.target.value)} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold border border-black/10 dark:border-white/10">
            Annuler
          </button>
          <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#FF684A] text-white">
            {course ? 'Enregistrer' : 'Créer'}
          </button>
        </div>
      </form>
    </div>
  );
}