import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, FileText, Target, CalendarDays, ChevronRight, ArrowRight } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import StatCard from '../components/StatCard.jsx';
import BarChart from '../components/BarChart.jsx';
import Badge from '../components/Badge.jsx';
import Avatar from '../components/Avatar.jsx';
import CourseCover from '../components/CourseCover.jsx';
import { formatDate, MONTHS, enrollmentStatus } from '../utils/format.js';

export default function Dashboard() {
  const { learners, courses, enrollments } = useData();
  const now = new Date();
  const thisMonth = now.toISOString().slice(0, 7);

  const completed = useMemo(() => enrollments.filter((e) => e.progress === 100).length, [enrollments]);
  const completion = enrollments.length ? Math.round((completed / enrollments.length) * 100) : 0;
  const newLearners = learners.filter((l) => l.registeredAt.startsWith(thisMonth)).length;
  const newEnrollments = enrollments.filter((e) => e.date.startsWith(thisMonth)).length;
  const published = courses.filter((c) => c.status === 'publiée').length;

  const monthly = useMemo(() => {
    const counts = Array(12).fill(0);
    enrollments.forEach((e) => { counts[new Date(e.date).getUTCMonth()] += 1; });
    return MONTHS.map((label, i) => ({ label, value: counts[i] }));
  }, [enrollments]);

  const latest = useMemo(() => [...enrollments]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
    .slice(0, 5)
    .map((e) => ({ ...e, learner: learners.find((l) => l.id === e.learnerId), course: courses.find((c) => c.id === e.courseId) }))
    .filter((e) => e.learner && e.course), [enrollments, learners, courses]);

  const popular = useMemo(() => courses
    .map((c) => ({ ...c, count: enrollments.filter((e) => e.courseId === c.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4), [courses, enrollments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#191919] dark:text-white m-0">Bonjour Admin</h1>
          <p className="text-[#6F6A64] dark:text-[#A0A0A0] mt-1 text-sm">Voici un aperçu de votre plateforme SkillBoard.</p>
        </div>
        <span className="inline-flex items-center gap-2 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] px-4 py-2 rounded-xl text-sm font-semibold text-[#191919] dark:text-white transition-colors">
          <CalendarDays size={16} /> Aujourd'hui : {formatDate(now.toISOString())}
        </span>
      </div>

      {/* Cartes Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} tone="coral" label="Apprenants" value={learners.length} hint={`${newLearners} nouveau(x) ce mois-ci`} />
        <StatCard icon={GraduationCap} tone="dark" label="Formations" value={courses.length} hint={`${published} publiées`} />
        <StatCard icon={FileText} tone="sage" label="Inscriptions" value={enrollments.length} hint={`${newEnrollments} ce mois-ci`} />
        <StatCard icon={Target} tone="sand" label="Taux de complétion" value={`${completion}%`} hint={`${completed} inscriptions terminées`} />
      </div>

      {/* Graphique & Formations Populaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-5 shadow-sm transition-colors">
          <h2 className="text-lg font-bold mb-4 text-[#191919] dark:text-white">Inscriptions mensuelles (2026)</h2>
          <BarChart data={monthly} />
        </div>
        <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-5 shadow-sm transition-colors">
          <h2 className="text-lg font-bold mb-4 text-[#191919] dark:text-white">Formations populaires</h2>
          <ul className="flex flex-col m-0 p-0 list-none">
            {popular.map((c) => (
              <li key={c.id} className="flex justify-between items-center gap-4 py-3 border-b border-[#E7E2DC] dark:border-[#333] last:border-0">
                <Link to={`/courses/${c.id}`} className="flex items-center gap-3 text-[#191919] dark:text-white hover:text-[#E9502F] transition-colors min-w-0">
                  <CourseCover category={c.category} size="sm" />
                  <span className="font-semibold text-sm truncate">{c.title}</span>
                </Link>
                <span className="text-sm text-[#6F6A64] dark:text-[#A0A0A0] whitespace-nowrap">{c.count} inscrits</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dernières Inscriptions */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-5 shadow-sm transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-[#191919] dark:text-white m-0">Dernières inscriptions</h2>
          <Link to="/learners" className="inline-flex items-center gap-1 text-sm font-semibold text-[#E9502F] dark:text-[#FF684A] hover:underline">
            Voir les apprenants <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Apprenant</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Formation</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Date</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Statut</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {latest.map((e) => (
                <tr key={e.id} className="hover:bg-[#FBF9F6] dark:hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm dark:text-white">
                    <span className="inline-flex items-center gap-3">
                      <Avatar name={e.learner.name} id={e.learner.id} size="sm" />
                      {e.learner.name}
                    </span>
                  </td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm dark:text-white">{e.course.title}</td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm dark:text-white">{formatDate(e.date)}</td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm"><Badge value={enrollmentStatus(e.progress)} /></td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-right">
                    <Link to={`/learners/${e.learner.id}`} className="text-[#6F6A64] dark:text-[#A0A0A0] hover:text-[#FF684A]">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}