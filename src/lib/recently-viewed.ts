// ── Recently Viewed Freelancers ──────────────────────────────────────
// Stores viewed freelancer usernames in localStorage for the "Recently Viewed" strip.

const STORAGE_KEY = "recentlyViewedFreelancers";
const MAX_ENTRIES = 5;

export interface RecentlyViewedEntry {
  username: string;
  name: string;
  avatar: string;
  gradientFrom: string;
  gradientTo: string;
}

function readStorage(): RecentlyViewedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStorage(entries: RecentlyViewedEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addRecentlyViewed(entry: RecentlyViewedEntry): void {
  const current = readStorage().filter((e) => e.username !== entry.username);
  current.unshift(entry);
  writeStorage(current.slice(0, MAX_ENTRIES));
}

export function getRecentlyViewed(): RecentlyViewedEntry[] {
  return readStorage();
}

export function removeRecentlyViewed(username: string): void {
  writeStorage(readStorage().filter((e) => e.username !== username));
}

export function clearRecentlyViewed(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
