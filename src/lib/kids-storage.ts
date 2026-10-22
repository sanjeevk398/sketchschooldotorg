export interface KidsSticker {
  id: string;
  name: string;
  emoji: string;
  date: string;
}

export interface KidsProgress {
  totalStars: number;
  completedIds: string[];
  stickers: KidsSticker[];
}

const KIDS_STORAGE_KEY = 'sketchschool_kids_progress_v1';

const DEFAULT_KIDS_PROGRESS: KidsProgress = {
  totalStars: 0,
  completedIds: [],
  stickers: [],
};

export function getKidsProgress(): KidsProgress {
  if (typeof window === 'undefined') return DEFAULT_KIDS_PROGRESS;
  try {
    const raw = localStorage.getItem(KIDS_STORAGE_KEY);
    if (!raw) return DEFAULT_KIDS_PROGRESS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_KIDS_PROGRESS;
  }
}

export function saveKidsProgress(progress: KidsProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KIDS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save kids progress:', e);
  }
}

export function recordKidItemCompleted(
  id: string,
  sticker: { name: string; emoji: string }
): { progress: KidsProgress; isFirstTime: boolean } {
  const progress = getKidsProgress();
  const isFirstTime = !progress.completedIds.includes(id);

  if (isFirstTime) {
    progress.completedIds.push(id);
    progress.totalStars += 3;
    progress.stickers.push({
      id,
      name: sticker.name,
      emoji: sticker.emoji,
      date: new Date().toISOString(),
    });
    saveKidsProgress(progress);
  }

  return { progress, isFirstTime };
}
