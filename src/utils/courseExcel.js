import * as XLSX from 'xlsx';

const STATUS_MAP = { 'publiée': 'publiée', 'publiee': 'publiée', 'brouillon': 'brouillon' };

export function downloadTemplate() {
  const wb = XLSX.utils.book_new();

  const rows = [
    { Titre: 'React.js de zéro à pro', Catégorie: 'Web', Coach: 'Dr Samba Kane', Capacité: 30, Statut: 'Publiée', Description: 'Apprendre React pas à pas' },
    { Titre: 'Analyse de données avec Python', Catégorie: 'Data', Coach: 'Aïda Seck', Capacité: 20, Statut: 'Brouillon', Description: '' },
  ];
  const ws = XLSX.utils.json_to_sheet(rows);
  ws['!cols'] = [{ wch: 35 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 12 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Formations');

  const help = [
    ['Colonne', 'Obligatoire', 'Valeurs acceptées'],
    ['Titre', 'Oui', 'Texte libre'],
    ['Catégorie', 'Oui', 'Ex : Web, Data, Design, Infra…'],
    ['Coach', 'Oui', 'Nom du coach'],
    ['Capacité', 'Oui', 'Nombre entier supérieur à 0'],
    ['Statut', 'Non', 'Publiée ou Brouillon (défaut : Brouillon)'],
    ['Description', 'Non', 'Texte libre'],
    [],
    ['Astuce', '', "Supprimez les 2 lignes d'exemple avant d'ajouter vos formations."],
  ];
  const wsHelp = XLSX.utils.aoa_to_sheet(help);
  wsHelp['!cols'] = [{ wch: 14 }, { wch: 14 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, wsHelp, 'Instructions');

  XLSX.writeFile(wb, 'modele-import-formations.xlsx');
}

export async function parseCoursesFile(file, existingTitles = []) {
  const wb = XLSX.read(await file.arrayBuffer());
  const sheet = wb.Sheets['Formations'] || wb.Sheets[wb.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' });

  const known = new Set(existingTitles.map((t) => t.trim().toLowerCase()));
  const valid = [];
  const errors = [];

  raw.forEach((r, i) => {
    const line = i + 2; // ligne 1 = en-têtes
    const title = String(r['Titre'] ?? '').trim();
    const category = String(r['Catégorie'] ?? '').trim();
    const coach = String(r['Coach'] ?? '').trim();
    const capacity = Number(r['Capacité']);
    const statusKey = String(r['Statut'] ?? '').trim().toLowerCase();

    if (!title && !category && !coach) return; // ligne vide

    const problems = [];
    if (!title) problems.push('titre manquant');
    if (!category) problems.push('catégorie manquante');
    if (!coach) problems.push('coach manquant');
    if (!Number.isInteger(capacity) || capacity <= 0) problems.push('capacité invalide');
    if (title && known.has(title.toLowerCase())) problems.push('formation déjà existante');

    if (problems.length) {
      errors.push(`Ligne ${line} : ${problems.join(', ')}`);
      return;
    }
    known.add(title.toLowerCase());
    valid.push({
      title, category, coach, capacity,
      status: STATUS_MAP[statusKey] || 'brouillon',
      description: String(r['Description'] ?? '').trim(),
      cover: null,
    });
  });

  return { valid, errors };
}