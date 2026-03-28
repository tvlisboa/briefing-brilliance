import { BriefingData, emptyBriefing } from '@/types/briefing';

const STORAGE_KEY = 'briefing_app_data';

export function getAllBriefings(): BriefingData[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function getBriefing(id: string): BriefingData | undefined {
  return getAllBriefings().find(b => b.id === id);
}

export function saveBriefing(briefing: BriefingData): void {
  const all = getAllBriefings();
  const idx = all.findIndex(b => b.id === briefing.id);
  if (idx >= 0) {
    all[idx] = { ...briefing, updatedAt: new Date().toISOString() };
  } else {
    all.push(briefing);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteBriefing(id: string): void {
  const all = getAllBriefings().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function createNewBriefing(): BriefingData {
  const now = new Date().toISOString();
  return {
    ...emptyBriefing,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    references: [],
  };
}
