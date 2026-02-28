/* ── Profile Data (localStorage persistence) ── */
/* Separate from auth – stores extended profile info */

const PROFILE_KEY = "createcrew_profile";

/* ── Types ── */

export interface SocialLinks {
  youtube: string;
  instagram: string;
  x: string;
  tiktok: string;
  linkedin: string;
}

export interface GeneralProfile {
  name: string;
  username: string;
  location: string;
  bio: string;
  socials: SocialLinks;
}

export interface CreatorProfile {
  primaryPlatform: string;
  channelUrl: string;
  subscriberCount: string;
  nicheTags: string[];
  uploadSchedule: string;
  teamSize: string;
  aboutChannel: string;
  vision: string;
}

export interface FreelancerProfile {
  skills: string[];
  startingPrice: string;
  availability: string[];       // "Full-time" | "Part-time" | "Weekends only"
  badges: string[];             // "Beginner-Friendly" | "Retainer Available" | "Fast Delivery"
  portfolioUrls: string[];
  preferredNiches: string[];
}

export interface ProfileData {
  general: GeneralProfile;
  creator: CreatorProfile;
  freelancer: FreelancerProfile;
}

/* ── Defaults ── */

export const DEFAULT_GENERAL: GeneralProfile = {
  name: "",
  username: "",
  location: "",
  bio: "",
  socials: { youtube: "", instagram: "", x: "", tiktok: "", linkedin: "" },
};

export const DEFAULT_CREATOR: CreatorProfile = {
  primaryPlatform: "",
  channelUrl: "",
  subscriberCount: "",
  nicheTags: [],
  uploadSchedule: "",
  teamSize: "",
  aboutChannel: "",
  vision: "",
};

export const DEFAULT_FREELANCER: FreelancerProfile = {
  skills: [],
  startingPrice: "",
  availability: [],
  badges: [],
  portfolioUrls: [],
  preferredNiches: [],
};

export const DEFAULT_PROFILE: ProfileData = {
  general: DEFAULT_GENERAL,
  creator: DEFAULT_CREATOR,
  freelancer: DEFAULT_FREELANCER,
};

/* ── Niche + Skill Options ── */

export const NICHE_OPTIONS = [
  "Tech", "Gaming", "Comedy", "Education", "Regional/Hindi",
  "Lifestyle", "Fitness", "Finance", "Food", "Travel",
  "Beauty", "Music", "Vlogs", "Kids Content", "UGC",
];

export const PLATFORM_OPTIONS = [
  "YouTube", "Instagram", "TikTok", "X (Twitter)", "LinkedIn", "Podcast",
];

export const TEAM_SIZE_OPTIONS = ["Solo", "2–5", "5+"];

export const AVAILABILITY_OPTIONS = ["Full-time", "Part-time", "Weekends only"];

export const BADGE_OPTIONS = ["Beginner-Friendly", "Retainer Available", "Fast Delivery"];

/* ── localStorage Functions ── */

export function getProfile(userId: string): ProfileData {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY}_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with defaults to handle missing fields from older saves
      return {
        general: { ...DEFAULT_GENERAL, ...parsed.general },
        creator: { ...DEFAULT_CREATOR, ...parsed.creator },
        freelancer: { ...DEFAULT_FREELANCER, ...parsed.freelancer },
      };
    }
  } catch {
    // fall through to default
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(userId: string, data: ProfileData): void {
  localStorage.setItem(`${PROFILE_KEY}_${userId}`, JSON.stringify(data));
}

/* ── Initialize profile from MockUser (first-time convenience) ── */

export function initProfileFromUser(user: {
  id: string;
  name: string;
  username: string;
  bio: string;
  skills?: string[];
  subscribers?: string;
}): ProfileData {
  const existing = getProfile(user.id);

  // If profile already has a name set, it's been edited before – use existing
  if (existing.general.name) return existing;

  // Otherwise populate from auth data
  return {
    general: {
      ...DEFAULT_GENERAL,
      name: user.name,
      username: user.username,
      bio: user.bio || "",
    },
    creator: {
      ...DEFAULT_CREATOR,
      subscriberCount: user.subscribers || "",
    },
    freelancer: {
      ...DEFAULT_FREELANCER,
      skills: user.skills || [],
    },
  };
}
