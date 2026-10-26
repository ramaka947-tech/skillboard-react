import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, Clock, Check, RefreshCw } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import Badge from '../components/Badge.jsx';
import Avatar from '../components/Avatar.jsx';
import Tabs from '../components/Tabs.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import CircleProgress from '../components/CircleProgress.jsx';
import CourseCover from '../components/CourseCover.jsx';
import { formatDate } from '../utils/format.js';

export default function CourseDetail() {
  const { id } = useParams();
  const { courses, learners, enrollments, updateCourse } = useData();
  const [tab, setTab] = useState('description');
  const course = courses.find((c) => c.id === Number(id));

  const enrolled = useMemo(
    () => enrollments
      .filter((e) => e.courseId === Number(id))
      .map((e) => ({ ...e, learner: learners.find((l) => l.id === e.learnerId) }))
      .filter((e) => e.learner),
    [enrollments, learners, id]
  );

  if (!course) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-8 text-center text-[#6F6A64] dark:text-[#A0A0A0]">
        Formation introuvable. <Link to="/courses" className="text-[#FF684A] hover:underline font-semibold">Retour au catalogue</Link>
      </div>
    );
  }

  const avg = enrolled.length ? Math.round(enrolled.reduce((s, e) => s + e.progress, 0) / enrolled.length) : 0;
  const fill = Math.min(100, Math.round((enrolled.length / course.capacity) * 100));
  const toggleStatus = () => updateCourse(course.id, { status: course.status === 'publiée' ? 'brouillon' : 'publiée' });
  const from = { from: `/courses/${course.id}`, label: 'Retour à la formation' };

  const learnerRows = (list) => (
    <ul className="flex flex-col m-0 p-0 list-none">
      {list.map((e) => (
        <li key={e.id} className="flex justify-between items-center gap-4 py-3 border-b border-[#E7E2DC] dark:border-[#333] last:border-0">
          <Link to={`/learners/${e.learner.id}`} state={from} className="flex items-center gap-3 text-[#191919] dark:text-white hover:text-[#E9502F] transition-colors min-w-0">
            <Avatar name={e.learner.name} id={e.learner.id} size="sm" />
            <span className="flex flex-col">
              <span className="font-semibold text-sm">{e.learner.name}</span>
              <small className="text-[#6F6A64] dark:text-[#A0A0A0] text-xs">Inscrit le {formatDate(e.date)}</small>
            </span>
          </Link>
          <div className="w-[150px] shrink-0">
            <ProgressBar value={e.progress} />
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="space-y-5">
      <Link to="/courses" className="inline-flex items-center gap-1.5 mb-2 font-semibold text-sm text-[#E9502F] dark:text-[#FF684A] hover:underline">
        <ArrowLeft size={16} /> Retour au catalogue
      </Link>

      {/* HERO : Cover + Titre + Bouton */}
      <section className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 flex items-center gap-6 flex-wrap shadow-sm transition-colors">
        <CourseCover category={course.category} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-2xl font-bold text-[#191919] dark:text-white m-0">{course.title}</h1>
            <Badge value={course.status} />
          </div>
          <p className="text-[#6F6A64] dark:text-[#A0A0A0] text-sm m-0">Catégorie : {course.category} · Coach : {course.coach}</p>
          <div className="flex gap-6 flex-wrap mt-3 text-sm text-[#6F6A64] dark:text-[#A0A0A0]">
            <span className="inline-flex items-center gap-1.5"><Users size={16} /> {enrolled.length} inscrits</span>
            <span className="inline-flex items-center gap-1.5"><BookOpen size={16} /> {course.modules.length} modules</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={16} /> Durée : {course.duration} heures</span>
          </div>
        </div>
        <button 
          onClick={toggleStatus}
          className="bg-[#FF684A] hover:bg-[#E9502F] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <RefreshCw size={16} /> {course.status === 'publiée' ? 'Passer en brouillon' : 'Publier la formation'}
        </button>
      </section>

      {/* GRILLE 2 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        
        {/* COLONNE GAUCHE : Tabs + Contenu */}
        <section className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 shadow-sm transition-colors">
          <Tabs tabs={[
            { id: 'description', label: 'Description' },
            { id: 'programme', label: 'Programme' },
            { id: 'learners', label: 'Apprenants', count: enrolled.length },
          ]} active={tab} onChange={setTab} />

          {tab === 'description' && (
            <div className="mt-5">
              <h2 className="text-lg font-bold mb-2 text-[#191919] dark:text-white">À propos de la formation</h2>
              <p className="text-sm text-[#191919] dark:text-gray-300 leading-relaxed">{course.description}</p>
              
              <h2 className="text-lg font-bold mt-6 mb-3 text-[#191919] dark:text-white">Objectifs</h2>
              <ul className="flex flex-col gap-2.5 m-0 p-0 list-none">
                {course.objectives.map((o) => (
                  <li key={o} className="flex items-center gap-2.5 text-sm text-[#191919] dark:text-gray-300">
                    <span className="w-[22px] h-[22px] rounded-full bg-[#E4EDE1] dark:bg-[#1F2B1D] text-[#3E5A3A] dark:text-[#A8BFA3] flex items-center justify-center shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>

              <h2 className="text-lg font-bold mt-6 mb-3 text-[#191919] dark:text-white">Coach responsable</h2>
              <div className="flex items-center gap-3">
                <Avatar name={course.coach.replace(/^Dr /, '')} id={course.id} />
                <div className="flex flex-col">
                  <strong className="text-sm text-[#191919] dark:text-white">{course.coach}</strong>
                  <small className="text-[#6F6A64] dark:text-[#A0A0A0] text-xs">Capacité maximale : {course.capacity} places</small>
                </div>
              </div>
            </div>
          )}

          {tab === 'programme' && (
            <ol className="flex flex-col gap-3 m-0 p-0 list-none mt-5">
              {course.modules.map((m, i) => (
                <li key={m} className="flex items-center gap-3 p-3 px-4 border border-[#E7E2DC] dark:border-[#333] rounded-xl font-semibold text-sm text-[#191919] dark:text-white">
                  <span className="w-7 h-7 rounded-full bg-[#FFE9E3] dark:bg-[#3A1C14] text-[#B93A1E] dark:text-[#FF684A] flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </span>
                  {m}
                </li>
              ))}
            </ol>
          )}

          {tab === 'learners' && (
            <div className="mt-5">
              {enrolled.length === 0 
                ? <p className="text-center text-[#6F6A64] dark:text-[#A0A0A0]">Aucun apprenant inscrit.</p> 
                : learnerRows(enrolled)}
            </div>
          )}
        </section>

        {/* COLONNE DROITE : Progression + Liste rapide */}
        <aside className="flex flex-col gap-5">
          <section className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 flex flex-col items-center text-center gap-3 shadow-sm transition-colors">
            <h2 className="text-lg font-bold text-[#191919] dark:text-white m-0">Progression globale</h2>
            <CircleProgress value={avg} />
            <p className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] m-0">Remplissage : {enrolled.length} / {course.capacity}</p>
            <div className="w-full">
              <ProgressBar value={fill} />
            </div>
          </section>

          <section className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 shadow-sm transition-colors">
            <h2 className="text-lg font-bold mb-3 text-[#191919] dark:text-white">Apprenants inscrits</h2>
            {enrolled.length === 0 
              ? <p className="text-center text-[#6F6A64] dark:text-[#A0A0A0] text-sm">Aucun inscrit.</p> 
              : learnerRows(enrolled.slice(0, 4))}
            {enrolled.length > 4 && (
              <button 
                className="text-[#E9502F] dark:text-[#FF684A] font-semibold text-sm mt-3 hover:underline bg-none border-none cursor-pointer" 
                onClick={() => setTab('learners')}
              >
                Voir tous les apprenants
              </button>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}