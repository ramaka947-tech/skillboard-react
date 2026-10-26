# SkillBoard

```
npm install
npm run dev
```

## Architecture
- `src/data/db.js` : fake database (tables + API insert/update/remove, persistée dans localStorage)
- `src/context/DataContext.jsx` : état global (Context API) et actions CRUD qui appellent la fake database
- `src/layouts/MainLayout.jsx` : Sidebar + Topbar + `<Outlet />` (React Router)
- `src/components/` : composants réutilisables (Modal, Badge, Avatar, Tabs, Pagination, BarChart, CircleProgress, ProgressBar, StatCard, CourseCover, LearnerForm)
- `src/pages/` : Dashboard, Learners, LearnerProfile, Courses, CourseDetail
- Icônes : lucide-react (aucun emoji). Palette Charbon & Corail définie dans `src/index.css` (:root).
