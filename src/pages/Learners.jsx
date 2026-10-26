import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Plus, Search, Eye, Pencil, Trash2, Upload, Download } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import Badge from '../components/Badge.jsx';
import Avatar from '../components/Avatar.jsx';
import Tabs from '../components/Tabs.jsx';
import Modal from '../components/Modal.jsx';
import Pagination from '../components/Pagination.jsx';
import LearnerForm from '../components/LearnerForm.jsx';
import { formatDate } from '../utils/format.js';
import { downloadLearnerTemplate, parseLearnersFile } from '../utils/learnerExcel.js';

export default function Learners() {
  const { learners, courses, addLearner, addLearners, updateLearner, deleteLearner } = useData();
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [status, setStatus] = useState('tous');
  const [sort, setSort] = useState('date-desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [modal, setModal] = useState(null);
  const [importResult, setImportResult] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setQuery(params.get('q') || '');
    setPage(1);
  }, [params]);

  const count = (s) => learners.filter((l) => l.status === s).length;
  const tabs = [
    { id: 'tous', label: 'Tous', count: learners.length },
    { id: 'actif', label: 'Actifs', count: count('actif') },
    { id: 'en pause', label: 'En pause', count: count('en pause') },
    { id: 'terminé', label: 'Terminés', count: count('terminé') },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = learners.filter(
      (l) => (status === 'tous' || l.status === status) && (!q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q))
    );
    const [field, dir] = sort.split('-');
    return [...result].sort((a, b) => {
      const c = field === 'name' ? a.name.localeCompare(b.name) : a.registeredAt.localeCompare(b.registeredAt);
      return dir === 'asc' ? c : -c;
    });
  }, [learners, query, status, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const close = () => setModal(null);

  // Gestion de l'import Excel
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { valid, errors } = await parseLearnersFile(file, learners.map((l) => l.email), courses);
      if (valid.length) addLearners(valid);
      setImportResult({ added: valid.length, errors });
      setPage(1);
    } catch {
      setImportResult({ added: 0, errors: ['Fichier illisible. Utilisez le modèle .xlsx.'] });
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      {/* En-tête de page */}
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold m-0 text-[#191919] dark:text-white">Apprenants</h1>
          <p className="text-[#6F6A64] dark:text-[#A0A0A0] mt-1 text-sm">Gérez les apprenants de votre plateforme.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={downloadLearnerTemplate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <Download size={16} /> Modèle Excel
          </button>
          <button 
            onClick={() => fileRef.current.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2A2A] transition-colors"
          >
            <Upload size={16} /> Importer
          </button>
          <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport} />
          <button 
            onClick={() => setModal({ type: 'add' })}
            className="bg-[#FF684A] hover:bg-[#E9502F] text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors"
          >
            <Plus size={18} /> Ajouter un apprenant
          </button>
        </div>
      </div>

      {/* Résultat de l'import */}
      {importResult && (
        <div className="rounded-xl border border-[#E7E2DC] dark:border-[#333] bg-white dark:bg-[#1E1E1E] p-4 text-sm text-[#191919] dark:text-white">
          <p className="font-semibold">{importResult.added} apprenant(s) importé(s)</p>
          {importResult.errors.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-red-500">
              {importResult.errors.map((er) => <li key={er}>{er}</li>)}
            </ul>
          )}
          <button className="mt-2 underline" onClick={() => setImportResult(null)}>Fermer</button>
        </div>
      )}

      {/* Carte principale */}
      <div className="bg-white dark:bg-[#1E1E1E] border border-[#E7E2DC] dark:border-[#333] rounded-2xl p-5 shadow-sm transition-colors">
        
        {/* Toolbar : Recherche + Tri */}
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F6A64] dark:text-[#A0A0A0]" size={17} />
            <input 
              placeholder="Rechercher par nom ou email…" 
              value={query} 
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors"
            />
          </div>
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)} 
            aria-label="Trier"
            className="p-2.5 px-4 border border-[#E7E2DC] dark:border-[#333] rounded-xl text-sm bg-white dark:bg-[#1E1E1E] text-[#191919] dark:text-white outline-none focus:border-[#FF684A] transition-colors"
          >
            <option value="name-asc">Trier par : Nom (A-Z)</option>
            <option value="name-desc">Trier par : Nom (Z-A)</option>
            <option value="date-desc">Inscription récente</option>
            <option value="date-asc">Inscription ancienne</option>
          </select>
        </div>

        {/* Onglets de filtre par statut */}
        <Tabs variant="pills" tabs={tabs} active={status} onChange={(s) => { setStatus(s); setPage(1); }} />

        {/* Tableau (responsive : cartes sur mobile, tableau sur PC) */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full border-collapse">
            <thead className="max-md:hidden">
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Nom</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Email</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Statut</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Date</th>
                <th className="text-left text-xs uppercase tracking-wider text-[#6F6A64] dark:text-[#A0A0A0] py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-[#6F6A64] dark:text-[#A0A0A0]">Aucun apprenant trouvé.</td>
                </tr>
              )}
              {pageItems.map((l) => (
                <tr key={l.id} className="max-md:block max-md:border max-md:border-[#E7E2DC] dark:max-md:border-[#333] max-md:rounded-xl max-md:mb-3 max-md:p-2 hover:bg-[#FBF9F6] dark:hover:bg-[#2A2A2A] transition-colors">
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] max-md:border-none max-md:flex max-md:justify-between max-md:items-center max-md:py-1.5">
                    <span className="hidden max-md:inline text-xs font-semibold text-[#6F6A64] dark:text-[#A0A0A0]">Nom</span>
                    <span className="inline-flex items-center gap-3 text-[#191919] dark:text-white">
                      <Avatar name={l.name} id={l.id} size="sm" />
                      <strong className="text-sm">{l.name}</strong>
                    </span>
                  </td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm text-[#191919] dark:text-white max-md:border-none max-md:flex max-md:justify-between max-md:items-center max-md:py-1.5">
                    <span className="hidden max-md:inline text-xs font-semibold text-[#6F6A64] dark:text-[#A0A0A0]">Email</span>
                    {l.email}
                  </td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] max-md:border-none max-md:flex max-md:justify-between max-md:items-center max-md:py-1.5">
                    <span className="hidden max-md:inline text-xs font-semibold text-[#6F6A64] dark:text-[#A0A0A0]">Statut</span>
                    <Badge value={l.status} />
                  </td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] text-sm text-[#191919] dark:text-white max-md:border-none max-md:flex max-md:justify-between max-md:items-center max-md:py-1.5">
                    <span className="hidden max-md:inline text-xs font-semibold text-[#6F6A64] dark:text-[#A0A0A0]">Date</span>
                    {formatDate(l.registeredAt)}
                  </td>
                  <td className="py-3 px-2 border-b border-[#E7E2DC] dark:border-[#333] max-md:border-none max-md:flex max-md:justify-end max-md:py-1.5">
                    <span className="inline-flex gap-1">
                      <Link className="p-1.5 text-[#6F6A64] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors" to={`/learners/${l.id}`} title="Consulter" aria-label={`Consulter ${l.name}`}><Eye size={18} /></Link>
                      <button className="p-1.5 text-[#6F6A64] dark:text-[#A0A0A0] hover:bg-gray-100 dark:hover:bg-[#333] rounded-lg transition-colors" onClick={() => setModal({ type: 'edit', learner: l })} title="Modifier" aria-label={`Modifier ${l.name}`}><Pencil size={18} /></button>
                      <button className="p-1.5 text-[#C62F1A] dark:text-[#FF684A] hover:bg-[#FDE6E1] dark:hover:bg-[#3A1C14] rounded-lg transition-colors" onClick={() => setModal({ type: 'delete', learner: l })} title="Supprimer" aria-label={`Supprimer ${l.name}`}><Trash2 size={18} /></button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination page={safePage} totalPages={totalPages} onChange={setPage} total={filtered.length} pageSize={pageSize} onPageSize={(n) => { setPageSize(n); setPage(1); }} />
      </div>

      {/* MODALES */}
      {modal?.type === 'add' && (
        <Modal title="Ajouter un apprenant" onClose={close}>
          <LearnerForm courses={courses} onCancel={close} onSubmit={(data) => { addLearner(data); close(); }} />
        </Modal>
      )}
      {modal?.type === 'edit' && (
        <Modal title="Modifier l'apprenant" onClose={close}>
          <LearnerForm initial={modal.learner} onCancel={close} onSubmit={(data) => { updateLearner(modal.learner.id, { name: data.name, email: data.email, status: data.status }); close(); }} />
        </Modal>
      )}
      {modal?.type === 'delete' && (
        <Modal title="Supprimer l'apprenant" onClose={close}>
          <p className="text-sm text-[#191919] dark:text-gray-300">
            Voulez-vous vraiment supprimer <strong>{modal.learner.name}</strong> ? Ses inscriptions seront aussi supprimées. Cette action est définitive.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button className="bg-[#EFE9E1] dark:bg-[#333] hover:bg-[#E7E2DC] dark:hover:bg-[#444] text-[#191919] dark:text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors" onClick={close}>Annuler</button>
            <button className="bg-[#C62F1A] hover:bg-[#A52614] text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors" onClick={() => { deleteLearner(modal.learner.id); close(); }}>Supprimer</button>
          </div>
        </Modal>
      )}
    </div>
  );
}