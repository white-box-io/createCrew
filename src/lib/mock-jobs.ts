/* ── Mock Jobs Data ── */
/* Extended with bidding system fields */

const JOBS_KEY = "createcrew_posted_jobs";

export interface JobCreator {
  name: string;
  username: string;
  subscribers: string;
  avatar: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface ApplicationRequirements {
  proposedPrice: boolean;
  portfolioSample: boolean;
  deliveryTime: boolean;
  shortNote: boolean;
  testSample: boolean;
}

export interface GuidedDescription {
  whatNeeded: string;
  styleReference: string;
  specificRequirements: string;
}

export type BudgetModel = "fixed" | "range" | "open";
export type VisibilitySetting = "public" | "invite-only" | "manual-shortlist" | "auto-match";
export type JobStatus = "open" | "reviewing" | "in-progress" | "completed" | "closed";

export interface Job {
  id: string;
  title: string;
  categorySlug: string;
  categoryLabel: string;
  categoryColor: string;
  subcategorySlug?: string;
  /* ── Description ── */
  description: string;                   // kept for backward compat / summary
  guidedDescription: GuidedDescription;
  /* ── Budget ── */
  budget: string;                        // display string e.g. "₹800 – ₹1,500"
  budgetType: string;                    // "per reel", "fixed", etc.
  budgetModel: BudgetModel;
  budgetMin?: number;
  budgetMax?: number;
  /* ── Visibility & Applications ── */
  visibilitySetting: VisibilitySetting;
  applicationRequirements: ApplicationRequirements;
  maxApplications: number;
  applicationDeadlineHours: number;
  currentApplications: number;
  /* ── Status & Meta ── */
  status: JobStatus;
  timeline: string;
  postedAgo: string;                     // display string for seed data
  createdAt: string;                     // ISO date
  creator: JobCreator;
}

/* ── Creators referenced by jobs ── */

const creators: Record<string, JobCreator> = {
  techburner:   { name: "TechBurner",   username: "techburner",   subscribers: "1.2M", avatar: "TB", gradientFrom: "#FF6B4A", gradientTo: "#FB923C" },
  gameverse:    { name: "GameVerse",    username: "gameverse",    subscribers: "520K", avatar: "GV", gradientFrom: "#8B5CF6", gradientTo: "#C084FC" },
  craftclips:   { name: "CraftClips",   username: "craftclips",   subscribers: "340K", avatar: "CC", gradientFrom: "#10B981", gradientTo: "#2DD4BF" },
  learnwithaj:  { name: "LearnWithAJ",  username: "learnwithaj",  subscribers: "890K", avatar: "AJ", gradientFrom: "#0891B2", gradientTo: "#22D3EE" },
  fitfableindi: { name: "FitFable",     username: "fitfable",     subscribers: "410K", avatar: "FF", gradientFrom: "#EC4899", gradientTo: "#F472B6" },
  pixelpundit:  { name: "PixelPundit",  username: "pixelpundit",  subscribers: "670K", avatar: "PP", gradientFrom: "#F59E0B", gradientTo: "#FBBF24" },
};

/* ── Helper: default fields for seed jobs ── */
const defaults = {
  visibilitySetting: "public" as VisibilitySetting,
  applicationRequirements: { proposedPrice: true, portfolioSample: true, deliveryTime: true, shortNote: true, testSample: false },
  maxApplications: 15,
  applicationDeadlineHours: 48,
  status: "open" as JobStatus,
};

function seedGuided(desc: string): GuidedDescription {
  return { whatNeeded: desc, styleReference: "", specificRequirements: "" };
}

function parseBudgetRange(budget: string): { min?: number; max?: number; model: BudgetModel } {
  const nums = budget.match(/[\d,]+/g);
  if (!nums) return { model: "open" };
  const parsed = nums.map((n) => parseInt(n.replace(/,/g, ""), 10));
  if (parsed.length === 2) return { min: parsed[0], max: parsed[1], model: "range" };
  return { min: parsed[0], max: parsed[0], model: "fixed" };
}

/* ── 16 Seed Jobs (enhanced) ── */

export const mockJobs: Job[] = [
  // Short-Form Content
  {
    id: "j1", title: "Reels Editor for Daily Instagram Content",
    categorySlug: "short-form-content", categoryLabel: "Short-Form Content", categoryColor: "#E11D48",
    subcategorySlug: "reels-shorts-editing",
    description: "Edit 60-sec Instagram Reels with trending audio, captions, and hooks. Need someone who understands viral short-form formats.",
    guidedDescription: { whatNeeded: "60-sec Instagram Reels with trending audio, captions, and hooks", styleReference: "Viral short-form style, high energy edits", specificRequirements: "Must know CapCut or Premiere Pro, quick turnaround" },
    budget: "₹800 – ₹1,500", budgetType: "per reel", budgetModel: "range", budgetMin: 800, budgetMax: 1500,
    ...defaults, currentApplications: 9, timeline: "1 Day", postedAgo: "1h ago", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), creator: creators.fitfableindi,
  },
  {
    id: "j2", title: "Hook Writer for YouTube Shorts",
    categorySlug: "short-form-content", categoryLabel: "Short-Form Content", categoryColor: "#E11D48",
    subcategorySlug: "hook-optimization",
    description: "Write scroll-stopping hooks for my tech Shorts channel. Must test well in first 3 seconds.",
    guidedDescription: { whatNeeded: "Scroll-stopping hooks for tech Shorts", styleReference: "First 3 seconds must grab attention", specificRequirements: "Must understand tech niche, Hindi + English" },
    budget: "₹300 – ₹600", budgetType: "per hook", budgetModel: "range", budgetMin: 300, budgetMax: 600,
    ...defaults, currentApplications: 14, timeline: "24 Hours", postedAgo: "3h ago", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), creator: creators.techburner,
  },

  // Long-Form & Podcast Production
  {
    id: "j3", title: "Podcast Audio Editor & Clip Creator",
    categorySlug: "long-form-podcast-production", categoryLabel: "Podcast & Long-Form", categoryColor: "#0891B2",
    subcategorySlug: "podcast-editing",
    description: "Edit weekly 1-hour podcast episodes — noise reduction, level balancing, intro/outro, and create 3 short clips per episode.",
    guidedDescription: { whatNeeded: "Edit weekly 1-hour podcast episodes with noise reduction and clipping", styleReference: "Clean, professional audio quality", specificRequirements: "Audacity or Adobe Audition, 3 short clips per episode" },
    budget: "₹3,000 – ₹6,000", budgetType: "per episode", budgetModel: "range", budgetMin: 3000, budgetMax: 6000,
    ...defaults, currentApplications: 4, timeline: "5 Days", postedAgo: "4h ago", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), creator: creators.craftclips,
  },
  {
    id: "j4", title: "Long-Form YouTube Editor — Vlog Style",
    categorySlug: "long-form-podcast-production", categoryLabel: "Podcast & Long-Form", categoryColor: "#0891B2",
    subcategorySlug: "long-form-youtube-editing",
    description: "Edit 15-20 min vlogs with smooth transitions, color grading, and background music. Retention-style pacing preferred.",
    guidedDescription: { whatNeeded: "Edit 15-20 min vlogs with transitions and color grading", styleReference: "Retention-style pacing, clean cuts", specificRequirements: "Premiere Pro or DaVinci Resolve, background music sourcing" },
    budget: "₹4,000 – ₹8,000", budgetType: "per video", budgetModel: "range", budgetMin: 4000, budgetMax: 8000,
    ...defaults, currentApplications: 7, timeline: "4 Days", postedAgo: "6h ago", createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), creator: creators.learnwithaj,
  },

  // Thumbnail & Visual Design
  {
    id: "j5", title: "Thumbnail Designer — High CTR Focus",
    categorySlug: "thumbnail-visual-design", categoryLabel: "Thumbnails", categoryColor: "#4F46E5",
    subcategorySlug: "youtube-thumbnail-design",
    description: "Need eye-catching thumbnails for my tech review channel. Must understand YouTube CTR, bold text overlays, and clean compositions.",
    guidedDescription: { whatNeeded: "Eye-catching thumbnails for tech review channel", styleReference: "High CTR style, bold text overlays, clean compositions", specificRequirements: "Photoshop or Figma, deliver source files" },
    budget: "₹500 – ₹1,200", budgetType: "per thumbnail", budgetModel: "range", budgetMin: 500, budgetMax: 1200,
    ...defaults, applicationRequirements: { ...defaults.applicationRequirements, testSample: true }, currentApplications: 12, timeline: "1 Day", postedAgo: "2h ago", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), creator: creators.techburner,
  },

  // Scriptwriting & Content Strategy
  {
    id: "j6", title: "Scriptwriter for YouTube Explainer Videos",
    categorySlug: "scriptwriting-content-strategy", categoryLabel: "Script & Strategy", categoryColor: "#059669",
    subcategorySlug: "youtube-scripts",
    description: "Write engaging, research-heavy scripts for explainer/storytelling videos on Indian history and culture. 8-12 minute format.",
    guidedDescription: { whatNeeded: "Research-heavy scripts for explainer/storytelling videos", styleReference: "Indian history and culture, 8-12 minute format", specificRequirements: "Strong research skills, Hindi-English mixed narration style" },
    budget: "₹1,500 – ₹3,000", budgetType: "per script", budgetModel: "range", budgetMin: 1500, budgetMax: 3000,
    ...defaults, currentApplications: 6, timeline: "3 Days", postedAgo: "8h ago", createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), creator: creators.craftclips,
  },

  // AI Video & Animation
  {
    id: "j7", title: "AI Faceless Video Creator for Finance Channel",
    categorySlug: "ai-video-animation", categoryLabel: "AI Video & Animation", categoryColor: "#7C3AED",
    subcategorySlug: "ai-faceless-videos",
    description: "Create AI-narrated faceless videos for a personal finance YouTube channel. Must know tools like Pictory, InVideo, or similar.",
    guidedDescription: { whatNeeded: "AI-narrated faceless videos for personal finance channel", styleReference: "Clean, professional, data-driven visuals", specificRequirements: "Pictory, InVideo, or similar AI tools" },
    budget: "₹2,000 – ₹4,000", budgetType: "per video", budgetModel: "range", budgetMin: 2000, budgetMax: 4000,
    ...defaults, currentApplications: 3, timeline: "3 Days", postedAgo: "5h ago", createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), creator: creators.pixelpundit,
  },

  // Gaming Content Creation
  {
    id: "j8", title: "Retention-Style Editor for Gaming Channel",
    categorySlug: "gaming-content-creation", categoryLabel: "Gaming", categoryColor: "#8B5CF6",
    subcategorySlug: "montage-highlight-reels",
    description: "Looking for someone who can create fast-paced, MrBeast-style retention edits with zooms, sound effects, and subtitles for my gaming channel.",
    guidedDescription: { whatNeeded: "Fast-paced MrBeast-style retention edits", styleReference: "Zooms, sound effects, subtitles, high energy", specificRequirements: "After Effects or Premiere Pro, gaming editing experience" },
    budget: "₹2,000 – ₹5,000", budgetType: "per video", budgetModel: "range", budgetMin: 2000, budgetMax: 5000,
    ...defaults, applicationRequirements: { ...defaults.applicationRequirements, testSample: true }, currentApplications: 11, timeline: "3 Days", postedAgo: "2h ago", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), creator: creators.gameverse,
  },

  // UGC & Influencer Content
  {
    id: "j9", title: "UGC Creator for Tech Product Review",
    categorySlug: "ugc-influencer-content", categoryLabel: "UGC & Influencer", categoryColor: "#F59E0B",
    subcategorySlug: "ugc-video-creation",
    description: "Need a UGC creator to shoot authentic unboxing and review content for a gadget brand collaboration. Must have good camera presence.",
    guidedDescription: { whatNeeded: "Authentic unboxing and review content for gadget brand", styleReference: "Natural, relatable, not overly polished", specificRequirements: "Good camera presence, own filming setup" },
    budget: "₹4,000 – ₹8,000", budgetType: "fixed", budgetModel: "fixed", budgetMin: 4000, budgetMax: 8000,
    ...defaults, currentApplications: 5, timeline: "7 Days", postedAgo: "1d ago", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), creator: creators.gameverse,
  },

  // Growth, SEO & Analytics
  {
    id: "j10", title: "YouTube SEO Specialist — Monthly Retainer",
    categorySlug: "growth-seo-analytics", categoryLabel: "Growth & SEO", categoryColor: "#2563EB",
    subcategorySlug: "youtube-seo",
    description: "Optimize titles, descriptions, tags, and thumbnails for better search ranking. Need weekly keyword reports.",
    guidedDescription: { whatNeeded: "Optimize titles, descriptions, tags, and thumbnails", styleReference: "Data-driven SEO approach", specificRequirements: "TubeBuddy or VidIQ experience, weekly keyword reports" },
    budget: "₹5,000 – ₹10,000", budgetType: "per month", budgetModel: "range", budgetMin: 5000, budgetMax: 10000,
    ...defaults, currentApplications: 2, timeline: "Ongoing", postedAgo: "10h ago", createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), creator: creators.learnwithaj,
  },

  // Brand & Channel Design
  {
    id: "j11", title: "YouTube Banner & Logo Refresh",
    categorySlug: "brand-channel-design", categoryLabel: "Brand Design", categoryColor: "#DC2626",
    subcategorySlug: "channel-art-branding",
    description: "Redesign my YouTube banner and logo. Modern, clean, techy vibe. Must deliver in Figma + PNG format.",
    guidedDescription: { whatNeeded: "Redesign banner and logo", styleReference: "Modern, clean, techy vibe", specificRequirements: "Figma + PNG delivery" },
    budget: "₹3,000 – ₹6,000", budgetType: "fixed", budgetModel: "fixed", budgetMin: 3000, budgetMax: 6000,
    ...defaults, currentApplications: 8, timeline: "5 Days", postedAgo: "12h ago", createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), creator: creators.pixelpundit,
  },

  // Voiceover & Audio Services
  {
    id: "j12", title: "Hindi Voiceover for Educational Videos",
    categorySlug: "voiceover-audio-services", categoryLabel: "Voiceover & Audio", categoryColor: "#0D9488",
    subcategorySlug: "voiceover-narration",
    description: "Record professional Hindi voiceover for 8-10 min educational explainer videos. Clear, engaging tone required.",
    guidedDescription: { whatNeeded: "Professional Hindi voiceover for educational videos", styleReference: "Clear, engaging, teacher-like tone", specificRequirements: "Professional mic setup, 8-10 min per video" },
    budget: "₹1,000 – ₹2,500", budgetType: "per video", budgetModel: "range", budgetMin: 1000, budgetMax: 2500,
    ...defaults, applicationRequirements: { ...defaults.applicationRequirements, testSample: true }, currentApplications: 10, timeline: "2 Days", postedAgo: "14h ago", createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), creator: creators.learnwithaj,
  },

  // Short-Form Content repurposing
  {
    id: "j13", title: "Repurpose Podcast into Reels & Shorts",
    categorySlug: "short-form-content", categoryLabel: "Short-Form Content", categoryColor: "#E11D48",
    subcategorySlug: "trend-based-editing",
    description: "Repurpose my long-form podcast episodes into 60-sec vertical clips with subtitles, hooks, and trending audio.",
    guidedDescription: { whatNeeded: "Repurpose podcast into 60-sec vertical clips", styleReference: "Subtitles, hooks, trending audio", specificRequirements: "Experience with podcast-to-short repurposing" },
    budget: "₹800 – ₹2,000", budgetType: "per reel", budgetModel: "range", budgetMin: 800, budgetMax: 2000,
    ...defaults, currentApplications: 6, timeline: "2 Days", postedAgo: "6h ago", createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), creator: creators.craftclips,
  },

  // Thumbnail visual design
  {
    id: "j14", title: "Custom Intro & Outro Animation",
    categorySlug: "thumbnail-visual-design", categoryLabel: "Thumbnails", categoryColor: "#4F46E5",
    subcategorySlug: "intro-outro-animations",
    description: "Design a 5-sec intro and 10-sec outro animation with my brand colors and logo. Clean, modern motion design.",
    guidedDescription: { whatNeeded: "5-sec intro and 10-sec outro animation", styleReference: "Clean, modern motion design with brand colors", specificRequirements: "After Effects, deliver as .mov with alpha" },
    budget: "₹2,500 – ₹5,000", budgetType: "fixed", budgetModel: "fixed", budgetMin: 2500, budgetMax: 5000,
    ...defaults, currentApplications: 3, timeline: "5 Days", postedAgo: "1d ago", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), creator: creators.fitfableindi,
  },

  // ── OTHERS ──
  {
    id: "j15", title: "Translate My Videos into Sign Language Overlays",
    categorySlug: "others", categoryLabel: "Others", categoryColor: "#6B7280",
    description: "Add ISL (Indian Sign Language) overlay to my educational YouTube videos to make them accessible. Must know ISL.",
    guidedDescription: { whatNeeded: "ISL overlay for educational YouTube videos", styleReference: "Professional, non-distracting overlay", specificRequirements: "Must know Indian Sign Language" },
    budget: "₹3,000 – ₹5,000", budgetType: "per video", budgetModel: "range", budgetMin: 3000, budgetMax: 5000,
    ...defaults, currentApplications: 1, timeline: "7 Days", postedAgo: "3h ago", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), creator: creators.learnwithaj,
  },
  {
    id: "j16", title: "Create a Meme Content Calendar for Instagram",
    categorySlug: "others", categoryLabel: "Others", categoryColor: "#6B7280",
    description: "Plan and design 20 meme posts per month for my gaming Instagram page. Must understand Indian gaming meme culture.",
    guidedDescription: { whatNeeded: "20 meme posts per month for gaming Instagram", styleReference: "Indian gaming meme culture, relatable humor", specificRequirements: "Canva or Photoshop, understand Indian gaming trends" },
    budget: "₹2,000 – ₹4,000", budgetType: "per month", budgetModel: "range", budgetMin: 2000, budgetMax: 4000,
    ...defaults, currentApplications: 4, timeline: "Ongoing", postedAgo: "1d ago", createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), creator: creators.gameverse,
  },
];

/* ── localStorage Helpers ── */

export function getPostedJobs(): Job[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(JOBS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveJob(job: Job): void {
  const jobs = getPostedJobs();
  jobs.unshift(job);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getAllJobs(): Job[] {
  return [...getPostedJobs(), ...mockJobs];
}

export function getJobById(id: string): Job | null {
  return getAllJobs().find((j) => j.id === id) || null;
}

export function updateJob(id: string, updates: Partial<Job>): void {
  // Check user-posted jobs first
  const posted = getPostedJobs();
  const idx = posted.findIndex((j) => j.id === id);
  if (idx !== -1) {
    posted[idx] = { ...posted[idx], ...updates };
    localStorage.setItem(JOBS_KEY, JSON.stringify(posted));
  }
  // Seed jobs can't be persisted, but we track their app counts in applications layer
}

export { parseBudgetRange };
