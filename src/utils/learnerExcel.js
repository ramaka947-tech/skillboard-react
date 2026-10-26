import * as XLSX from 'xlsx';

const STATUSES = ['actif', 'en pause', 'terminé'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalize = (s) => String(s ?? '').trim().toLowerCase();

export function downloadLearnerTemplate() {
  const wb = XLSX.utils.book_new();

  const rows = [
    { Nom: 'Awa Diop', Email: 'awa.diop@exemple.com', Statut: 'Actif', Formation: 'React.js de zéro à pro' },
    { Nom: 'Moussa Ba', Email: 'moussa.ba@exemple.com', Statut: 'En pause', Formation: '' },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 26 }, { wch: 32 }, { wch: 12 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Apprenants');

  const help = [
    ['Colonne', 'Obligatoire', 'Valeurs acceptées'],
    ['Nom', 'Oui', 'Prénom et nom'],
    ['Email', 'Oui', 'Adresse valide et unique'],
    ['Statut', 'Non', 'Actif, En pause ou Terminé (défaut : Actif)'],
    ['Formation', 'Non', "Titre exact d'une formation existante"],
    [],
    ['Astuce', '', "Supprimez les 2 lignes d'exemple avant d'ajouter vos apprenants."],
  ];
  const wsHelp = XLSX.utils.aoa_to_sheet(help);
  wsHelp['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsHelp, 'Instructions');

  XLSX.writeFile(wb, 'modele-import-apprenants.xlsx');
}

export async function parseLearnersFile(file, existingEmails = [], courses = []) {
  const wb = XLSX.read(await file.arrayBuffer());
  const sheet = wb.Sheets['Apprenants'] || wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const knownEmails = new Set(existingEmails.map(normalize));
  const courseByTitle = new Map(courses.map((c) => [normalize(c.title), c.id]));
  const valid = [];
  const errors = [];

  raw.forEach((r, i) => {
    const line = i + 2; // ligne 1 = en-têtes
    const name = String(r['Nom'] ?? '').trim();
    const email = String(r['Email'] ?? '').trim();
    const statusKey = normalize(r['Statut']);
    const courseTitle = String(r['Formation'] ?? '').trim();

    if (!name && !email) return; // ligne vide

    const problems = [];
    if (!name) problems.push('nom manquant');
    if (!EMAIL_RE.test(email)) problems.push('email invalide');
    else if (knownEmails.has(email.toLowerCase())) problems.push('email déjà utilisé');
    if (statusKey && !STATUSES.includes(statusKey)) problems.push('statut invalide (Actif, En pause, Terminé)');

    let courseId = null;
    if (courseTitle) {
      courseId = courseByTitle.get(normalize(courseTitle));
      if (courseId === undefined) problems.push(`formation introuvable (« ${courseTitle} »)`);
    }

    if (problems.length) {
      errors.push(`Ligne ${line} : ${problems.join(', ')}`);
      return;
    }
    knownEmails.add(email.toLowerCase());
    valid.push({ name, email, status: statusKey || 'actif', courseId });
  });

  return { valid, errors };
}