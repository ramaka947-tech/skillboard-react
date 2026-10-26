import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, LayoutGrid, List, Users, ArrowRight, Plus, Upload, Download, Pencil } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import Badge from '../components/Badge.jsx';
import CourseCover from '../components/CourseCover.jsx';
import CourseFormModal from '../components/CourseFormModal.jsx';
import { downloadTemplate, parseCoursesFile } from '../utils/courseExcel.js';

export default function Courses() {
  const { courses, enrollments, addCourse, addCourses, updateCourse } = useData();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('toutes');
  const [status, setStatus] = useState('tous');
  const [view, setView] = useState('grid');
  const [modal, setModal] = useState({ open: false, course: null });
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  const categories = useMemo(() => [...new Set(courses.map((c) => c.category))], [courses]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses
      .filter((c) => (category === 'toutes' || c.category === category) && (status === 'tous' || c.status === status) && (!q || c.title.toLowerCase().includes(q) || c.coach.toLowerCase().includes(q)))
      .map((c) => ({ ...c, count: enrollments.filter((e) => e.courseId === c.id).length }));
  }, [courses, enrollments, query, category, status]);

  const saveCourse = (data) => {
    const { count, id, ...clean } = data; // on retire les champs calculés
    if (modal.course) updateCourse(modal.course.id, clean);
    else addCourse(clean);
    setModal({ open: false, course: null });
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { valid, errors } = await parseCoursesFile(file, courses.map((c) => c.title));
      if (valid.length) addCourses(valid);
      setImportResult({ added: valid.length, errors });
    } catch {
      setImportResult({ added: 0, errors: ['Fichier illisible. Utilisez le modèle .xlsx.'] });
    }
    e.target.value = '';
  };

  const inputClass = "p-2.5 px-4 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors";
  const secondaryBtn = "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors";

  const editButton = (c) => (
    <button
      onClick={() => setModal({ open: true, course: c })}
      className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white hover:bg-black/70 transition-colors"
      title="Modifier"
    >
      <Pencil size={15} />
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold m-0 text-[#191919] dark:text-white">Catalogue des formations</h1>
          <p className="text-[#6F6A64] dark:text-[#A0A0A0] mt-1 text-sm">Découvrez toutes les formations disponibles sur la plateforme. ({filtered.length})</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={downloadTemplate} className={secondaryBtn}><Download size={16} /> Modèle Excel</button>
          <button onClick={() => fileRef.current.click()} className={secondaryBtn}><Upload size={16} /> Importer</button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          <button
            onClick={() => setModal({ open: true, course: null })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#FF684A] hover:bg-[#E9502F] text-white transition-colors"
          >
            <Plus size={16} /> Nouvelle formation
          </button>
        </div>
      </div>

      {/* Résultat de l'import */}
      {importResult && (
        <div className="rounded-xl border border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-4 text-sm text-[#191919] dark:text-white">
          <p className="font-semibold">{importResult.added} formation(s) importée(s)</p>
          {importResult.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-red-500">
              {importResult.errors.map((er) => <li key={er}>{er}</li>)}
            </ul>
          )}
          <button className="mt-2 underline" onClick={() => setImportResult(null)}>Fermer</button>
        </div>
      )}

      {/* Toolbar : Recherche + Filtres + Vue */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-4 flex gap-3 flex-wrap items-center shadow-sm transition-colors">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64] dark:text-[#A0A0A0]" size={17} />
          <input
            placeholder="Rechercher une formation…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors"
          />
        </div>

        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Catégorie" className={inputClass}>
          <option value="toutes">Toutes les catégories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Statut" className={inputClass}>
          <option value="tous">Publiées et brouillons</option>
          <option value="publiée">Publiées</option>
          <option value="brouillon">Brouillons</option>
        </select>

        <div className="flex gap-1.5 ml-auto">
          {[['grid', LayoutGrid, 'Grille'], ['list', List, 'Liste']].map(([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${view === key
                  ? 'bg-[#FF684A] text-white border-[#FF684A]'
                  : 'bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white border-[#E7E2DC] dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2A2A2A]'
                }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-[#6F6A64] dark:text-[#A0A0A0] py-6">Aucune formation trouvée.</p>
      )}

      <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5' : 'flex flex-col gap-3'}>
        {filtered.map((c) => (
          <article
            key={c.id}
            className={`bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl overflow-hidden shadow-sm transition-colors flex ${view === 'grid' ? 'flex-col' : 'flex-col sm:flex-row sm:items-center gap-4 p-4'
              }`}
          >
            {c.cover ? (
              <div className={`relative shrink-0 overflow-hidden ${view === 'grid' ? 'h-40 w-full' : 'h-24 w-full sm:w-36 rounded-xl'}`}>
                <img src={c.cover} alt={c.title} className="h-full w-full object-cover" />
                <span className="absolute top-3 left-3"><Badge value={c.status} /></span>
                {editButton(c)}
              </div>
            ) : (
              <CourseCover category={c.category} size={view === 'grid' ? 'banner' : 'md'}>
                <span className="absolute top-3 left-3"><Badge value={c.status} /></span>
                {editButton(c)}
              </CourseCover>
            )}

            <div className={`flex-1 flex flex-col gap-1 items-start ${view === 'grid' ? 'p-4' : ''}`}>
              <span className="bg-[#FFE9E3] dark:bg-[#3A1C14] text-[#B93A1E] dark:text-[#FF684A] text-xs font-bold px-2.5 py-0.5 rounded-md inline-block">
                {c.category}
              </span>
              <h3 className="text-base font-bold m-0 text-[#191919] dark:text-white">{c.title}</h3>
              <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] m-0">Coach : {c.coach}</p>
              <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] m-0 inline-flex items-center gap-1.5">
                <Users size={15} /> {c.count} / {c.capacity} apprenants
              </p>
            </div>

            <Link
              to={`/courses/${c.id}`}
              className={`bg-[#FF684A] hover:bg-[#E9502F] text-white px-3.5 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${view === 'grid' ? 'm-4 mt-0' : 'shrink-0'
                }`}
            >
              Voir le détail <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>

      {modal.open && (
        <CourseFormModal
          course={modal.course}
          categories={categories}
          enrolledCount={modal.course ? enrollments.filter((e) => e.courseId === modal.course.id).length : 0}
          onSave={saveCourse}
          onClose={() => setModal({ open: false, course: null })}
        />
      )}
    </div>
  );
}