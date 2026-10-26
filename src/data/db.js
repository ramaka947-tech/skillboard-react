// FAKE DATABASE : tables en JavaScript, persistées dans le localStorage.
// L'API (getAll / insert / update / remove) imite une vraie base de données.
const KEY = 'skillboard-db-v2';

const FIRST = ['Awa', 'Moussa', 'Fatou', 'Ibrahima', 'Aminata', 'Cheikh', 'Mariama', 'Ousmane', 'Khady', 'Abdoulaye', 'Seynabou', 'Mamadou', 'Ndeye', 'Pape'];
const LAST = ['Diop', 'Ndiaye', 'Fall', 'Sow', 'Ba', 'Sarr', 'Gueye', 'Diallo', 'Faye', 'Thiam', 'Mbaye'];
const STATUSES = ['actif', 'actif', 'en pause', 'terminé', 'actif'];

const COURSES = [
  { id: 1, title: 'React.js de zéro à pro', category: 'Web', coach: 'Dr Samba Kane', capacity: 30, status: 'publiée', description: 'Composants, hooks, routing et architecture d’une application React moderne.', duration: 40, objectives: ["Maîtriser les composants et les props", "Gérer l’état avec les hooks", "Structurer un projet avec React Router"], modules: ["Introduction à React et Vite", "Composants, props et JSX", "Hooks : useState et useEffect", "Routing avec React Router", "Architecture et bonnes pratiques"] },
  { id: 2, title: 'Node.js et Express', category: 'Web', coach: 'Aïda Seck', capacity: 25, status: 'publiée', description: 'Créer des API REST robustes avec Node.js, Express et JWT.', duration: 36, objectives: ["Créer une API REST avec Express", "Sécuriser les routes avec JWT", "Connecter une base de données"], modules: ["Bases de Node.js", "Routes et middlewares Express", "Authentification JWT", "Accès aux données", "Déploiement"] },
  { id: 3, title: 'Analyse de données avec Python', category: 'Data', coach: 'Dr Samba Kane', capacity: 20, status: 'publiée', description: 'Pandas, nettoyage de données, visualisation et premières analyses.', duration: 32, objectives: ["Nettoyer et transformer des données", "Manipuler les DataFrames avec Pandas", "Visualiser les résultats"], modules: ["Introduction à Python", "Pandas : les fondamentaux", "Nettoyage de données", "Visualisation", "Projet d’analyse"] },
  { id: 4, title: 'Power BI et tableaux de bord', category: 'Data', coach: 'Mame Diarra Bousso', capacity: 20, status: 'publiée', description: 'Modéliser des données et construire des dashboards décisionnels.', duration: 28, objectives: ["Modéliser des données dans Power BI", "Écrire des mesures DAX simples", "Publier un tableau de bord"], modules: ["Import et préparation", "Modèle de données", "Mesures DAX", "Visuels et rapports"] },
  { id: 5, title: 'Docker et CI/CD', category: 'DevOps', coach: 'Lamine Cissé', capacity: 18, status: 'publiée', description: 'Conteneurisation, pipelines GitHub Actions et déploiement continu.', duration: 30, objectives: ["Conteneuriser une application", "Écrire un pipeline CI/CD", "Déployer automatiquement"], modules: ["Introduction à Docker", "Images et conteneurs", "Docker Compose", "GitHub Actions", "Déploiement continu"] },
  { id: 6, title: 'UI/UX Design avec Figma', category: 'Design', coach: 'Aïda Seck', capacity: 22, status: 'brouillon', description: 'Wireframes, prototypes et design system pour produits numériques.', duration: 24, objectives: ["Concevoir des wireframes", "Prototyper dans Figma", "Construire un design system"], modules: ["Bases de l’UX", "Wireframes", "Prototypage Figma", "Design system"] },
  { id: 7, title: 'Développement mobile avec React Native', category: 'Mobile', coach: 'Lamine Cissé', capacity: 15, status: 'brouillon', description: 'Créer des applications Android et iOS avec React Native.', duration: 34, objectives: ["Créer une application mobile", "Naviguer entre les écrans", "Publier sur les stores"], modules: ["Introduction à React Native", "Composants natifs", "Navigation", "Publication"] },
  { id: 8, title: 'Administration Linux', category: 'DevOps', coach: 'Mame Diarra Bousso', capacity: 16, status: 'publiée', description: 'Ligne de commande, services, droits, réseau et scripts shell.', duration: 28, objectives: ["Utiliser la ligne de commande", "Gérer services et permissions", "Écrire des scripts shell"], modules: ["Premiers pas sous Linux", "Utilisateurs et droits", "Services et processus", "Réseau", "Scripts shell"] },
];

const ACTIVITY_TEXTS = ['Connexion à la plateforme', 'Module terminé avec succès', 'Exercice pratique soumis', 'Participation à une session live', 'Quiz validé'];

function seed() {
  const learners = Array.from({ length: 28 }, (_, i) => {
    const f = FIRST[i % FIRST.length];
    const l = LAST[(i * 3) % LAST.length];
    const month = i % 10;
    const day = 1 + ((i * 5) % 27);
    return {
      id: i + 1,
      name: `${f} ${l}`,
      email: `${f}.${l}${i + 1}@mail.com`.toLowerCase(),
      status: STATUSES[i % 5],
      registeredAt: new Date(Date.UTC(2026, month, day)).toISOString().slice(0, 10),
    };
  });

  const enrollments = [];
  let eid = 1;
  learners.forEach((lr, i) => {
    const ids = [(i % 8) + 1];
    if (i % 2 === 0) ids.push(((i + 3) % 8) + 1);
    if (i % 3 === 0) ids.push(((i + 5) % 8) + 1);
    [...new Set(ids)].forEach((courseId) => {
      let progress;
      if (lr.status === 'terminé') progress = 100;
      else if (lr.status === 'en pause') progress = (i * 7 + courseId * 3) % 60;
      else progress = 20 + ((i * 13 + courseId * 5) % 75);
      enrollments.push({ id: eid++, learnerId: lr.id, courseId, progress, date: lr.registeredAt });
    });
  });

  const activities = [];
  let aid = 1;
  learners.forEach((lr, i) => {
    for (let k = 0; k < 3; k++) {
      activities.push({ id: aid++, learnerId: lr.id, text: ACTIVITY_TEXTS[(i + k) % ACTIVITY_TEXTS.length], date: new Date(Date.UTC(2026, 9, 1 + ((i + k * 4) % 20))).toISOString().slice(0, 10) });
    }
  });

  return { learners, courses: COURSES, enrollments, activities };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return seed();
}

let db = load();
const save = () => {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* ignore */ }
};

export const database = {
  getAll: (table) => db[table],
  insert(table, item) {
    const id = Math.max(0, ...db[table].map((r) => r.id)) + 1;
    const row = { ...item, id };
    db[table] = [row, ...db[table]];
    save();
    return row;
  },
  update(table, id, patch) {
    db[table] = db[table].map((r) => (r.id === id ? { ...r, ...patch } : r));
    save();
  },
  remove(table, id) {
    db[table] = db[table].filter((r) => r.id !== id);
    save();
  },
  removeWhere(table, predicate) {
    db[table] = db[table].filter((r) => !predicate(r));
    save();
  },
  reset() {
    db = seed();
    save();
  },
};
