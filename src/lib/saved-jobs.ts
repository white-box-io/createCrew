/* ── Saved Jobs ── */
/* localStorage-based save/unsave for freelancers */

const SAVED_KEY = "createcrew_saved_jobs";

function getStore(): Record<string, string[]> {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(SAVED_KEY);
  return raw ? JSON.parse(raw) : {};
}

function setStore(store: Record<string, string[]>): void {
  localStorage.setItem(SAVED_KEY, JSON.stringify(store));
}

export function getSavedJobIds(userId: string): string[] {
  return getStore()[userId] || [];
}

export function isJobSaved(userId: string, jobId: string): boolean {
  return getSavedJobIds(userId).includes(jobId);
}

export function saveJobForUser(userId: string, jobId: string): void {
  const store = getStore();
  const list = store[userId] || [];
  if (!list.includes(jobId)) {
    list.unshift(jobId);
    store[userId] = list;
    setStore(store);
  }
}

export function unsaveJob(userId: string, jobId: string): void {
  const store = getStore();
  const list = store[userId] || [];
  store[userId] = list.filter((id) => id !== jobId);
  setStore(store);
}

export function toggleSaveJob(userId: string, jobId: string): boolean {
  if (isJobSaved(userId, jobId)) {
    unsaveJob(userId, jobId);
    return false;
  }
  saveJobForUser(userId, jobId);
  return true;
}
