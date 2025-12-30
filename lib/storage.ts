
// Simple utility to manage progress in Session Storage
// This persists until the browser tab/window is closed.

const STORAGE_KEY = 'biyohox_progress';
const LAST_ACCESS_KEY = 'biyohox_last_access';

export interface LastAccessedLesson {
  unitSlug: string;
  lessonSlug: string;
  title: string;
  timestamp: number;
}

export const getCompletedLessons = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

export const markLessonComplete = (slug: string) => {
  if (typeof window === 'undefined') return;
  try {
    const current = getCompletedLessons();
    if (!current.includes(slug)) {
      const updated = [...current, slug];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      // Dispatch a custom event to notify components to re-render if needed
      window.dispatchEvent(new Event('lesson-progress-updated'));
    }
  } catch (e) {
    console.error('Progress save failed', e);
  }
};

export const isLessonCompleted = (slug: string): boolean => {
  const completed = getCompletedLessons();
  return completed.includes(slug);
};

// --- Last Accessed Logic ---

export const saveLastAccessedLesson = (gradeSlug: string, unitSlug: string, lessonSlug: string, title: string) => {
  if (typeof window === 'undefined') return;
  try {
    const stored = sessionStorage.getItem(LAST_ACCESS_KEY);
    const data = stored ? JSON.parse(stored) : {};
    
    data[gradeSlug] = {
      unitSlug,
      lessonSlug,
      title,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem(LAST_ACCESS_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Last access save failed', e);
  }
};

export const getLastAccessedLesson = (gradeSlug: string): LastAccessedLesson | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = sessionStorage.getItem(LAST_ACCESS_KEY);
    const data = stored ? JSON.parse(stored) : {};
    return data[gradeSlug] || null;
  } catch (e) {
    return null;
  }
};
