import { useState } from 'react';

const STATUSES = ['actif', 'en pause', 'terminé'];

export default function LearnerForm({ initial, courses = [], onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', email: '', status: 'actif', courseId: '', ...initial });
  const [errors, setErrors] = useState({});
  const isEdit = Boolean(initial);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (form.name.trim().length < 3) errs.name = 'Le nom doit contenir au moins 3 caractères.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Email invalide.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() });
    }
  };

  // Classes réutilisables pour les inputs
  const inputClass = "w-full p-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] focus:ring-2 focus:ring-[#FFE9E3] dark:focus:ring-[#3A1C14] transition-colors";
  const labelClass = "flex flex-col gap-1.5 font-semibold text-sm text-[#191919] dark:text-white";
  const errorClass = "text-[#C62F1A] dark:text-[#FF684A] font-medium text-xs";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <label className={labelClass}>
        Nom complet
        <input name="name" value={form.name} onChange={change} className={inputClass} />
        {errors.name && <span className={errorClass}>{errors.name}</span>}
      </label>
      
      <label className={labelClass}>
        Email
        <input name="email" value={form.email} onChange={change} className={inputClass} />
        {errors.email && <span className={errorClass}>{errors.email}</span>}
      </label>
      
      <label className={labelClass}>
        Statut
        <select name="status" value={form.status} onChange={change} className={inputClass}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </label>
      
      {!isEdit && (
        <label className={labelClass}>
          Inscrire à une formation (optionnel)
          <select name="courseId" value={form.courseId} onChange={change} className={inputClass}>
            <option value="">Aucune</option>
            {courses.filter((c) => c.status === 'publiée').map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        </label>
      )}
      
      <div className="flex justify-end gap-3 mt-4">
        <button type="button" onClick={onCancel} className="bg-[#EFE9E1] dark:bg-[#333] hover:bg-[#E7E2DC] dark:hover:bg-[#444] text-[#191919] dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
          Annuler
        </button>
        <button type="submit" className="bg-[#FF684A] hover:bg-[#E9502F] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors">
          {isEdit ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
}