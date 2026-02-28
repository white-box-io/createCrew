/* ── Creator Profile Data Layer ── */
/* localStorage-based CRUD for creator profiles */

const PROFILES_KEY = "creatorProfiles";

export interface PlatformLink {
  platform: "youtube" | "instagram" | "twitter" | "tiktok" | "linkedin";
  url: string;
}

export interface ContentItem {
  id: string;
  url: string;
  title: string;
  platform: "youtube" | "instagram" | "twitter" | "tiktok" | "other";
}

export interface CreatorAbout {
  primaryPlatform: string;
  channelURL: string;
  niche: string[];
  uploadSchedule: string;
  teamSize: string;
  audienceSize: string;
}

export interface CreatorProfile {
  displayName: string;
  headline: string;
  location: string;
  bio: string;
  platforms: PlatformLink[];
  coverPhoto: string | null;   // base64 or object URL
  profilePhoto: string | null; // base64 or object URL
  content: ContentItem[];
  about: CreatorAbout;
}

function emptyProfile(): CreatorProfile {
  return {
    displayName: "",
    headline: "",
    location: "",
    bio: "",
    platforms: [],
    coverPhoto: null,
    profilePhoto: null,
    content: [],
    about: {
      primaryPlatform: "",
      channelURL: "",
      niche: [],
      uploadSchedule: "",
      teamSize: "",
      audienceSize: "",
    },
  };
}

function getStore(): Record<string, CreatorProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function setStore(store: Record<string, CreatorProfile>): void {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(store));
}

export function getCreatorProfile(username: string): CreatorProfile | null {
  const store = getStore();
  return store[username] || null;
}

export function saveCreatorProfile(username: string, profile: CreatorProfile): void {
  const store = getStore();
  store[username] = profile;
  setStore(store);
}

export function getOrCreateCreatorProfile(username: string, displayName: string): CreatorProfile {
  const existing = getCreatorProfile(username);
  if (existing) return existing;
  const fresh = emptyProfile();
  fresh.displayName = displayName;
  saveCreatorProfile(username, fresh);
  return fresh;
}

/* ── Seed CraftClips Demo ── */

export function seedCraftClipsIfNeeded(): void {
  if (typeof window === "undefined") return;
  const store = getStore();
  if (store["craftclips"]) return; // Already seeded

  store["craftclips"] = {
    displayName: "CraftClips",
    headline: "Podcaster & Storyteller · 340K subscribers",
    location: "Bengaluru, India",
    bio: "Weekly long-form conversations with India's most interesting people. Honest, research-backed, no-fluff storytelling.",
    platforms: [
      { platform: "youtube", url: "https://youtube.com/c/craftclips" },
      { platform: "instagram", url: "https://instagram.com/craftclips" },
      { platform: "twitter", url: "https://twitter.com/craftclips" },
    ],
    coverPhoto: null,
    profilePhoto: null,
    content: [
      { id: "cc-1", url: "https://youtube.com/watch?v=1", title: "Why I'm Switching to Android in 2026", platform: "youtube" },
      { id: "cc-2", url: "https://youtube.com/watch?v=2", title: "This ₹999 Gadget Changed My Life", platform: "youtube" },
      { id: "cc-3", url: "https://youtube.com/watch?v=3", title: "I Survived 50 Hours in the World's Hottest Desert", platform: "youtube" },
    ],
    about: {
      primaryPlatform: "YouTube",
      channelURL: "https://youtube.com/c/craftclips",
      niche: ["Podcast", "Storytelling"],
      uploadSchedule: "3 videos/week · Tue, Thu, Sat",
      teamSize: "5 people",
      audienceSize: "340K subscribers on YouTube",
    },
  };

  setStore(store);
}
