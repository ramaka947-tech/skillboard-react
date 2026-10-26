import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { database } from '../data/db.js';

const DataContext = createContext(null);

const read = () => ({
  learners: database.getAll('learners'),
  courses: database.getAll('courses'),
  enrollments: database.getAll('enrollments'),
  activities: database.getAll('activities'),
});

export function DataProvider({ children }) {
  const [data, setData] = useState(read);
  const refresh = useCallback(() => setData(read()), []);

  const addLearner = useCallback(({ courseId, ...learner }) => {
    const today = new Date().toISOString().slice(0, 10);
    const row = database.insert('learners', { ...learner, registeredAt: today });
    database.insert('activities', { learnerId: row.id, text: 'Compte créé', date: today });
    if (courseId) database.insert('enrollments', { learnerId: row.id, courseId: Number(courseId), progress: 0, date: today });
    refresh();
  }, [refresh]);

  const addLearners = useCallback((list) => {
    const today = new Date().toISOString().slice(0, 10);
    list.forEach(({ courseId, ...learner }) => {
      const row = database.insert('learners', { ...learner, registeredAt: today });
      database.insert('activities', { learnerId: row.id, text: 'Compte créé', date: today });
      if (courseId) database.insert('enrollments', { learnerId: row.id, courseId: Number(courseId), progress: 0, date: today });
    });
    refresh();
  }, [refresh]);

  const updateLearner = useCallback((id, patch) => {
    database.update('learners', id, patch);
    refresh();
  }, [refresh]);

  const deleteLearner = useCallback((id) => {
    database.remove('learners', id);
    database.removeWhere('enrollments', (e) => e.learnerId === id);
    database.removeWhere('activities', (a) => a.learnerId === id);
    refresh();
  }, [refresh]);

  const addCourse = useCallback((course) => {
    database.insert('courses', course);
    refresh();
  }, [refresh]);

  const addCourses = useCallback((list) => {
    list.forEach((course) => database.insert('courses', course));
    refresh();
  }, [refresh]);

  const updateCourse = useCallback((id, patch) => {
    database.update('courses', id, patch);
    refresh();
  }, [refresh]);

  const resetData = useCallback(() => {
    database.reset();
    refresh();
  }, [refresh]);

  // ✅ LA CORRECTION EST ICI : on ajoute addLearners
  const value = useMemo(
    () => ({ 
      ...data, 
      addLearner, 
      addLearners,       // <-- ajouté
      updateLearner, 
      deleteLearner, 
      addCourse, 
      addCourses, 
      updateCourse, 
      resetData 
    }),
    [data, addLearner, addLearners, updateLearner, deleteLearner, addCourse, addCourses, updateCourse, resetData]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);