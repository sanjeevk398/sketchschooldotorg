export interface UserProgress {
  xp: number;
  streak: number;
  lastActiveDate: string;
  hearts: number;
  completedLessons: Record<
    string,
    {
      stars: number;
      bestScore: number;
      completedAt: string;
    }
  >;
}

const STORAGE_KEY = 'sketchschool_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  completedLessons: {},
};

export function getLocalProgress(): UserProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);

    // Check streak update
    const today = new Date().toISOString().split('T')[0];
    const lastDate = parsed.lastActiveDate;

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      if (lastDate === yesterday) {
        parsed.streak += 1;
      } else {
        parsed.streak = 1;
      }
      parsed.lastActiveDate = today;
      saveLocalProgress(parsed);
    }

    return parsed;
  } catch (e) {
    console.error('Error reading progress:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveLocalProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

export function recordLessonCompletion(
  lessonId: string,
  score: number,
  stars: number,
  earnedXp: number
): UserProgress {
  const progress = getLocalProgress();

  const prev = progress.completedLessons[lessonId];
  const isFirstTime = !prev;

  const newStars = Math.max(prev?.stars || 0, stars);
  const newBest = Math.max(prev?.bestScore || 0, score);

  progress.completedLessons[lessonId] = {
    stars: newStars,
    bestScore: newBest,
    completedAt: new Date().toISOString(),
  };

  // Only award full XP if first time or improved
  if (isFirstTime) {
    progress.xp += earnedXp;
  } else {
    progress.xp += Math.round(earnedXp * 0.3); // replay bonus
  }

  saveLocalProgress(progress);
  return progress;
}

export function getUserLevel(xp: number): { level: number; title: string; nextLevelXp: number } {
  if (xp < 100) return { level: 1, title: 'Sketch Novice', nextLevelXp: 100 };
  if (xp < 250) return { level: 2, title: 'Line Apprentice', nextLevelXp: 250 };
  if (xp < 500) return { level: 3, title: 'Form Seeker', nextLevelXp: 500 };
  if (xp < 900) return { level: 4, title: 'Perspective Practitioner', nextLevelXp: 900 };
  return { level: 5, title: 'Master Draftsman', nextLevelXp: 1500 };
}
