import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, CalendarDays, Pencil, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import Badge from '../components/Badge.jsx';
import Avatar from '../components/Avatar.jsx';
import Tabs from '../components/Tabs.jsx';
import Modal from '../components/Modal.jsx';
import LearnerForm from '../components/LearnerForm.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import CourseCover from '../components/CourseCover.jsx';
import { formatDate, enrollmentStatus } from '../utils/format.js';

export default function LearnerProfile() {
  const { id } = useParams();
  const location = useLocation();
  const { learners, courses, enrollments, activities, updateLearner } = useData();
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('courses');

  const learner = learners.find((l) => l.id === Number(id));
  if (!learner) {
    return (
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-8 text-center text-[#6F6A64] dark:text-[#A0A0A0]">
        Apprenant introuvable. <Link to="/learners" className="text-[#FF684A] hover:underline font-semibold">Retour à la liste</Link>
      </div>
    );
  }

  const back = location.state?.from || '/learners';
  const backLabel = location.state?.label || 'Retour à la liste';
  const myCourses = enrollments
    .filter((e) => e.learnerId === learner.id)
    .map((e) => ({ ...e, course: courses.find((c) => c.id === e.courseId) }))
    .filter((e) => e.course);
  const history = activities.filter((a) => a.learnerId === learner.id).sort((a, b) => b.date.localeCompare(a.date));
  const avg = myCourses.length ? Math.round(myCourses.reduce((s, e) => s + e.progress, 0) / myCourses.length) : 0;
  const done = myCourses.filter((e) => e.progress === 100).length;

  return (
    <div className="space-y-5">
      <Link to={back} className="inline-flex items-center gap-1.5 mb-2 font-semibold text-sm text-[#E9502F] dark:text-[#FF684A] hover:underline">
        <ArrowLeft size={16} /> {backLabel}
      </Link>

      {/* HERO : Avatar + Info + Bouton Modifier */}
      <section className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 flex items-center gap-6 flex-wrap shadow-sm transition-colors">
        <Avatar name={learner.name} id={learner.id} size="xl" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-bold m-0 text-[#191919] dark:text-white">{learner.name}</h1>
            <Badge value={learner.status} />
          </div>
          <div className="flex gap-6 flex-wrap text-sm text-[#6F6A64] dark:text-[#A0A0A0]">
            <span className="inline-flex items-center gap-1.5"><Mail size={16} /> {learner.email}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} /> Inscrit le {formatDate(learner.registeredAt)}</span>
          </div>
        </div>
        <button 
          onClick={() => setEditing(true)}
          className="bg-[#191919] dark:bg-white hover:bg-[#333] dark:hover:bg-gray-200 text-white dark:text-[#191919] px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shrink-0"
        >
          <Pencil size={16} /> Modifier le profil
        </button>
      </section>

      {/* TABS PRINCIPAUX */}
      <section className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-6 shadow-sm transition-colors">
        <Tabs tabs={[
          { id: 'info', label: 'Informations' },
          { id: 'courses', label: 'Formations suivies', count: myCourses.length },
          { id: 'activity', label: 'Activité' },
        ]} active={tab} onChange={setTab} />

        {/* Onglet Informations */}
        {tab === 'info' && (
          <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F8F5F0] dark:bg-[#2A2A2A] rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-[#6F6A64] dark:text-[#A0A0A0]">Formations suivies</span>
                <strong className="text-2xl text-[#191919] dark:text-white">{myCourses.length}</strong>
              </div>
              <div className="bg-[#F8F5F0] dark:bg-[#2A2A2A] rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-[#6F6A64] dark:text-[#A0A0A0]">Formations terminées</span>
                <strong className="text-2xl text-[#191919] dark:text-white">{done}</strong>
              </div>
              <div className="bg-[#F8F5F0] dark:bg-[#2A2A2A] rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-[#6F6A64] dark:text-[#A0A0A0]">Progression moyenne</span>
                <strong className="text-2xl text-[#191919] dark:text-white">{avg}%</strong>
              </div>
            </div>

            <dl className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 m-0 text-sm">
              <dt className="text-[#6F6A64] dark:text-[#A0A0A0]">Nom complet</dt>
              <dd className="m-0 font-semibold text-[#191919] dark:text-white">{learner.name}</dd>
              <dt className="text-[#6F6A64] dark:text-[#A0A0A0]">Email</dt>
              <dd className="m-0 font-semibold text-[#191919] dark:text-white">{learner.email}</dd>
              <dt className="text-[#6F6A64] dark:text-[#A0A0A0]">Date d'inscription</dt>
              <dd className="m-0 font-semibold text-[#191919] dark:text-white">{formatDate(learner.registeredAt)}</dd>
              <dt className="text-[#6F6A64] dark:text-[#A0A0A0]">Statut</dt>
              <dd className="m-0 font-semibold"><Badge value={learner.status} /></dd>
            </dl>
          </div>
        )}

        {/* Onglet Formations suivies */}
        {tab === 'courses' && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Formation</th>
                  <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Progression</th>
                  <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Statut</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {myCourses.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-[#6F6A64] dark:text-[#A0A0A0]">Aucune formation.</td>
                  </tr>
                )}
                {myCourses.map((e) => (
                  <tr key={e.id} className="hover:bg-[#FBF9F6] dark:hover:bg-[#2A2A2A] transition-colors">
                    <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm">
                      <Link to={`/courses/${e.course.id}`} className="flex items-center gap-3 text-[#191919] dark:text-white hover:text-[#E9502F] transition-colors">
                        <CourseCover category={e.course.category} size="sm" />
                        <span className="font-semibold">{e.course.title}</span>
                      </Link>
                    </td>
                    <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm min-w-[160px]">
                      <ProgressBar value={e.progress} />
                    </td>
                    <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm">
                      <Badge value={enrollmentStatus(e.progress)} />
                    </td>
                    <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-right">
                      <Link to={`/courses/${e.course.id}`} aria-label="Voir la formation" className="text-[#6F6A64] dark:text-[#A0A0A0] hover:text-[#FF684A]">
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Onglet Activité */}
        {tab === 'activity' && (
          <ul className="mt-5 list-none m-0 pl-2 border-l-2 border-[#E7E2DC] dark:border-[#333] ml-2">
            {history.map((a) => (
              <li key={a.id} className="pl-5 pb-4 relative flex flex-col">
                <span className="absolute left-[-7px] top-1 w-2.5 h-2.5 rounded-full bg-[#FF684A] ring-4 ring-[#FFE9E3] dark:ring-[#3A1C14]"></span>
                <strong className="text-sm text-[#191919] dark:text-white">{a.text}</strong>
                <small className="text-[#6F6A64] dark:text-[#A0A0A0] text-xs mt-1">{formatDate(a.date)}</small>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* MODALE DE MODIFICATION */}
      {editing && (
        <Modal title="Modifier le profil" onClose={() => setEditing(false)}>
          <LearnerForm
            initial={learner}
            onCancel={() => setEditing(false)}
            onSubmit={(d) => { updateLearner(learner.id, { name: d.name, email: d.email, status: d.status }); setEditing(false); }}
          />
        </Modal>
      )}
    </div>
  );
}