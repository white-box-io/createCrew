/* ── Mock Creators Data ── */

export interface CreatorSocial {
  platform: "youtube" | "instagram" | "twitter" | "linkedin";
  handle: string;
  followers: string;
}

export interface Creator {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  niche: string;
  subscribers: string;          // primary platform count displayed
  gradientFrom: string;
  gradientTo: string;
  socials: CreatorSocial[];
  activeJobs: number;
  categoryTags: string[];       // display tags for the card
}

export const mockCreators: Creator[] = [
  {
    username: "techburner", name: "TechBurner", avatar: "TB",
    bio: "India's #1 tech creator. Reviewing gadgets, smartphones, and tech trends.",
    location: "New Delhi, India", niche: "Tech Reviews",
    subscribers: "1.2M",
    gradientFrom: "#FF6B4A", gradientTo: "#FB923C",
    socials: [
      { platform: "youtube", handle: "@techburner", followers: "1.2M" },
      { platform: "instagram", handle: "@techburner", followers: "850K" },
      { platform: "twitter", handle: "@techburner", followers: "320K" },
    ],
    activeJobs: 3, categoryTags: ["Thumbnails", "Script & Strategy"],
  },
  {
    username: "gameverse", name: "GameVerse", avatar: "GV",
    bio: "Gaming content covering esports, reviews, and competitive gaming. Let's game together!",
    location: "Mumbai, India", niche: "Gaming & Esports",
    subscribers: "520K",
    gradientFrom: "#8B5CF6", gradientTo: "#C084FC",
    socials: [
      { platform: "youtube", handle: "@gameverse", followers: "520K" },
      { platform: "instagram", handle: "@gameverse_gg", followers: "180K" },
    ],
    activeJobs: 2, categoryTags: ["Gaming", "Video Editing"],
  },
  {
    username: "craftclips", name: "CraftClips", avatar: "CC",
    bio: "Podcaster and storyteller. Weekly long-form conversations with India's most interesting people.",
    location: "Bengaluru, India", niche: "Podcast & Storytelling",
    subscribers: "340K",
    gradientFrom: "#10B981", gradientTo: "#2DD4BF",
    socials: [
      { platform: "youtube", handle: "@craftclips", followers: "340K" },
      { platform: "instagram", handle: "@craftclips", followers: "220K" },
      { platform: "twitter", handle: "@craftclips", followers: "95K" },
    ],
    activeJobs: 2, categoryTags: ["Podcast", "Short-Form"],
  },
  {
    username: "learnwithaj", name: "LearnWithAJ", avatar: "AJ",
    bio: "Making education fun and accessible. Simplifying complex topics for millions of students.",
    location: "Jaipur, India", niche: "Education",
    subscribers: "890K",
    gradientFrom: "#0891B2", gradientTo: "#22D3EE",
    socials: [
      { platform: "youtube", handle: "@learnwithaj", followers: "890K" },
      { platform: "instagram", handle: "@learnwithaj", followers: "450K" },
      { platform: "twitter", handle: "@learnwithaj", followers: "120K" },
      { platform: "linkedin", handle: "learnwithaj", followers: "45K" },
    ],
    activeJobs: 3, categoryTags: ["Voiceover", "Script & Strategy", "Growth & SEO"],
  },
  {
    username: "fitfable", name: "FitFable", avatar: "FF",
    bio: "Fitness, wellness, and healthy living. Helping India get fit, one video at a time.",
    location: "Hyderabad, India", niche: "Fitness & Lifestyle",
    subscribers: "410K",
    gradientFrom: "#EC4899", gradientTo: "#F472B6",
    socials: [
      { platform: "instagram", handle: "@fitfable.in", followers: "410K" },
      { platform: "youtube", handle: "@fitfable", followers: "180K" },
    ],
    activeJobs: 1, categoryTags: ["Short-Form", "UGC"],
  },
  {
    username: "pixelpundit", name: "PixelPundit", avatar: "PP",
    bio: "Design breakdowns, tutorials, and creative workflows. Teaching design through content.",
    location: "Pune, India", niche: "Design & Creative",
    subscribers: "670K",
    gradientFrom: "#F59E0B", gradientTo: "#FBBF24",
    socials: [
      { platform: "youtube", handle: "@pixelpundit", followers: "670K" },
      { platform: "instagram", handle: "@pixelpundit", followers: "390K" },
      { platform: "twitter", handle: "@pixelpundit", followers: "210K" },
      { platform: "linkedin", handle: "pixelpundit", followers: "80K" },
    ],
    activeJobs: 2, categoryTags: ["Brand Design", "AI Video"],
  },
  {
    username: "wanderlustrani", name: "WanderlustRani", avatar: "WR",
    bio: "Solo travel stories across India and Southeast Asia. Budget-friendly tips and hidden gems.",
    location: "Goa, India", niche: "Travel",
    subscribers: "290K",
    gradientFrom: "#14B8A6", gradientTo: "#5EEAD4",
    socials: [
      { platform: "instagram", handle: "@wanderlustrani", followers: "290K" },
    ],
    activeJobs: 1, categoryTags: ["Short-Form", "Voiceover"],
  },
  {
    username: "codemitra", name: "CodeMitra", avatar: "CM",
    bio: "Full-stack developer teaching coding in Hindi. Making tech careers accessible to tier-2 cities.",
    location: "Lucknow, India", niche: "Programming",
    subscribers: "1.5M",
    gradientFrom: "#2563EB", gradientTo: "#60A5FA",
    socials: [
      { platform: "youtube", handle: "@codemitra", followers: "1.5M" },
      { platform: "twitter", handle: "@codemitra", followers: "280K" },
      { platform: "linkedin", handle: "codemitra", followers: "150K" },
    ],
    activeJobs: 2, categoryTags: ["Thumbnails", "Video Editing"],
  },
  {
    username: "dailybites", name: "DailyBites", avatar: "DB",
    bio: "Food vlogs, recipes, and street food explorations. Celebrating India's culinary diversity.",
    location: "Chennai, India", niche: "Food & Cooking",
    subscribers: "750K",
    gradientFrom: "#EA580C", gradientTo: "#FB923C",
    socials: [
      { platform: "youtube", handle: "@dailybites", followers: "750K" },
      { platform: "instagram", handle: "@dailybites.in", followers: "520K" },
    ],
    activeJobs: 2, categoryTags: ["Video Editing", "Short-Form"],
  },
  {
    username: "startupchaitime", name: "StartupChaiTime", avatar: "SC",
    bio: "Weekly conversations with India's most exciting founders. Building in public, learning together.",
    location: "Delhi NCR, India", niche: "Startups & Business",
    subscribers: "180K",
    gradientFrom: "#7C3AED", gradientTo: "#A78BFA",
    socials: [
      { platform: "youtube", handle: "@startupchaitime", followers: "180K" },
      { platform: "twitter", handle: "@startupchaitime", followers: "95K" },
      { platform: "linkedin", handle: "startupchaitime", followers: "120K" },
    ],
    activeJobs: 1, categoryTags: ["Podcast", "Script & Strategy"],
  },
];
