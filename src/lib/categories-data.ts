import {
  Film,
  Sparkles,
  Podcast,
  Image,
  PenTool,
  Users,
  Mic,
  Gamepad2,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Subcategory {
  slug: string;
  title: string;
  description: string;
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  teaser: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  subcategories: Subcategory[];
}

/** Map icon name strings → Lucide components (for client-side resolution) */
export const iconMap: Record<string, LucideIcon> = {
  Film,
  Sparkles,
  Podcast,
  Image,
  PenTool,
  Users,
  Mic,
  Gamepad2,
  TrendingUp,
};

export const categories: Category[] = [
  {
    slug: "short-form-content",
    title: "Short-Form Content",
    description:
      "Reels, Shorts, TikTok – hooks, edits, subtitles to go viral fast.",
    teaser: "₹499+ gigs",
    iconName: "Film",
    iconBg: "#FFF1F2",
    iconColor: "#E11D48",
    subcategories: [
      {
        slug: "reels-shorts-editing",
        title: "Reels / Shorts Editing",
        description: "Professional editing for Instagram Reels and YouTube Shorts",
      },
      {
        slug: "hook-optimization",
        title: "Hook Optimization & First 3 Seconds",
        description: "Nail those crucial opening seconds that stop the scroll",
      },
      {
        slug: "subtitle-animations",
        title: "Subtitle Animations & Kinetic Text",
        description: "Eye-catching animated subtitles and text overlays",
      },
      {
        slug: "long-video-to-shorts",
        title: "Long Video to Shorts Repurposing",
        description: "Turn your long-form content into viral short clips",
      },
      {
        slug: "batch-shorts-editing",
        title: "Batch Shorts Editing (5–20 videos)",
        description: "Bulk editing packages for consistent content output",
      },
      {
        slug: "trend-based-editing",
        title: "Trend-Based Editing (Viral Sounds/Effects)",
        description: "Ride trending sounds and effects for maximum reach",
      },
    ],
  },
  {
    slug: "ai-video-animation",
    title: "AI Video & Animation",
    description:
      "AI-generated videos, avatars, photo-to-video, reacting characters – faceless magic, script to full video.",
    teaser: "Viral AI magic 🔥",
    iconName: "Sparkles",
    iconBg: "#FFFBEB",
    iconColor: "#D97706",
    subcategories: [
      {
        slug: "script-to-ai-video",
        title: "Script to AI Video (Text/Prompt → Full Video)",
        description: "Turn your script or prompt into a complete AI-generated video",
      },
      {
        slug: "ai-avatar-creation",
        title: "AI Avatar / Character Creation",
        description: "Consistent AI characters for your series and brand",
      },
      {
        slug: "ai-reacting-characters",
        title: "AI Reacting Characters / Commentary Avatars",
        description: "AI-powered reaction and commentary characters",
      },
      {
        slug: "photo-to-ai-video",
        title: "Photo to AI Video / Animation",
        description: "Transform static images into moving, talking content",
      },
      {
        slug: "faceless-channel-automation",
        title: "Faceless Channel Automation",
        description: "Top 10s, facts, motivationals — fully automated faceless content",
      },
      {
        slug: "ai-ugc-promo-videos",
        title: "AI UGC & Product Promo Videos",
        description: "AI-generated UGC-style content for product marketing",
      },
      {
        slug: "ai-audio-voiceover",
        title: "AI Audio & Voiceover Integration",
        description: "Lip-sync, custom voices, and AI audio for your videos",
      },
      {
        slug: "ai-image-generation",
        title: "AI Image Generation & Editing",
        description: "AI-powered images for thumbnails, posts, and assets",
      },
    ],
  },
  {
    slug: "long-form-podcast-editing",
    title: "Long-Form & Podcast Editing",
    description:
      "Vlogs, roasts, podcasts, commentary – high-retention cuts for longer videos that pay off big.",
    teaser: "Trending everywhere!",
    iconName: "Podcast",
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    subcategories: [
      {
        slug: "vlog-editing",
        title: "Vlog / Daily Life Editing",
        description: "Polished edits for vlogs and lifestyle content",
      },
      {
        slug: "roast-comedy-editing",
        title: "Roast / Sarcasm / Comedy Commentary Editing",
        description: "Sharp cuts and timing for comedy and roast content",
      },
      {
        slug: "podcast-interview-editing",
        title: "Podcast / Interview Video Editing",
        description: "Multi-camera podcast and interview editing",
      },
      {
        slug: "retention-style-editing",
        title: "Retention-Style Editing",
        description: "High watch-time fixes with engagement-driven cuts",
      },
      {
        slug: "storytelling-documentary",
        title: "Storytelling / Documentary Editing",
        description: "Cinematic storytelling and documentary-style edits",
      },
      {
        slug: "gaming-commentary-editing",
        title: "Gaming Commentary / Long Playthrough Editing",
        description: "Engaging edits for long gaming sessions and commentary",
      },
      {
        slug: "audio-cleanup-mastering",
        title: "Audio Cleanup & Mastering",
        description: "Professional audio cleanup, noise removal, and mastering",
      },
    ],
  },
  {
    slug: "thumbnails-graphics-logos",
    title: "Thumbnails, Graphics & Logos",
    description:
      "CTR thumbnails, logos, posters, AI images, photo posts – build your brand & feed that pops.",
    teaser: "Feed that pops 🎨",
    iconName: "Image",
    iconBg: "#FDF2F8",
    iconColor: "#DB2777",
    subcategories: [
      {
        slug: "youtube-thumbnails",
        title: "YouTube Thumbnails (CTR-Focused)",
        description: "High click-through rate thumbnail designs",
      },
      {
        slug: "gaming-thumbnails",
        title: "Gaming Thumbnails",
        description: "Eye-catching thumbnails for gaming content",
      },
      {
        slug: "reels-shorts-covers",
        title: "Reels/Shorts Cover Images",
        description: "Scroll-stopping cover images for short-form content",
      },
      {
        slug: "instagram-carousel-posts",
        title: "Instagram Photo/Carousel Posts",
        description: "Aesthetic memes, carousels, and static content",
      },
      {
        slug: "logo-branding",
        title: "Logo Design & Branding Elements",
        description: "Custom logos and brand identity design",
      },
      {
        slug: "channel-art-banners",
        title: "Channel Art, Banners & Watermarks",
        description: "Complete channel branding package",
      },
      {
        slug: "social-media-posters",
        title: "Social Media Posters & Templates",
        description: "Reusable poster and template designs for socials",
      },
      {
        slug: "end-screens-cards",
        title: "End Screens & Cards",
        description: "Engaging end screens and info cards for YouTube",
      },
    ],
  },
  {
    slug: "script-writing-ideas",
    title: "Script Writing & Ideas",
    description:
      "Killer hooks, full scripts, ideas, calendars – for vlogs, roasts, kids stories, or AI videos.",
    teaser: "Never run out of ideas 💡",
    iconName: "PenTool",
    iconBg: "#ECFDF5",
    iconColor: "#059669",
    subcategories: [
      {
        slug: "youtube-long-form-scripts",
        title: "YouTube Long-Form Scripts",
        description: "Full scripts for vlogs, roasts, podcasts, and more",
      },
      {
        slug: "reels-shorts-scripts",
        title: "Reels/Shorts Hooks & Scripts",
        description: "Viral hooks and short-form scripts that convert",
      },
      {
        slug: "kids-stories-scripts",
        title: "Kids Stories / Nursery Rhyme Scripts",
        description: "Engaging scripts for children's content",
      },
      {
        slug: "storyboarding-shot-lists",
        title: "Storyboarding & Shot Lists",
        description: "Visual planning and shot-by-shot breakdowns",
      },
      {
        slug: "content-ideas-research",
        title: "Content Ideas & Research",
        description: "Trending topics, niche research, and content ideation",
      },
      {
        slug: "viral-title-hook-writing",
        title: "Viral Title & Hook Writing",
        description: "Titles and hooks optimized for clicks and engagement",
      },
      {
        slug: "content-calendar-planning",
        title: "Content Calendar & Series Planning",
        description: "Strategic content planning and series roadmaps",
      },
    ],
  },
  {
    slug: "ugc-on-camera-talent",
    title: "UGC & On-Camera Talent",
    description:
      "Real actors, local shoots, kid talent – authentic reels, skits, demos, family/kids videos.",
    teaser: "Real people, real content 🎬",
    iconName: "Users",
    iconBg: "#FEF3C7",
    iconColor: "#B45309",
    subcategories: [
      {
        slug: "human-ugc-acting",
        title: "Human UGC Acting / Shooting",
        description: "Natural product reviews and authentic UGC content",
      },
      {
        slug: "local-regional-actor",
        title: "Local / Regional Actor",
        description: "City/area specific shoots with local talent",
      },
      {
        slug: "kid-child-actor",
        title: "Kid / Child Actor for Videos",
        description: "Professional child talent for kids and family content",
      },
      {
        slug: "skits-comedy-acting",
        title: "Skits / Comedy / Roast Acting",
        description: "Comedic and skit-based talent for engaging content",
      },
      {
        slug: "ugc-video-editing",
        title: "UGC Video Editing",
        description: "Polish raw UGC shoots into professional content",
      },
    ],
  },
  {
    slug: "voiceover-narration",
    title: "Voiceover & Narration",
    description:
      "Gaming commentary, cute kids voices, Hindi/regional narration – make videos speak.",
    teaser: "Make videos speak 🎙️",
    iconName: "Mic",
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    subcategories: [
      {
        slug: "gaming-commentary-voiceover",
        title: "Gaming Commentary / Reaction Voiceover",
        description: "Energetic voiceovers for gaming and reaction content",
      },
      {
        slug: "kids-cartoon-voiceover",
        title: "Kids / Cartoon / Child-Friendly Voiceover",
        description: "Fun voices for children's and animated content",
      },
      {
        slug: "hindi-regional-narration",
        title: "Hindi / Regional Language Narration",
        description: "Professional narration in Hindi and regional languages",
      },
      {
        slug: "english-neutral-voiceover",
        title: "English / Neutral Voiceover",
        description: "Clean, professional English narration",
      },
      {
        slug: "podcast-storytelling-voiceover",
        title: "Podcast Intro/Outro & Storytelling Voiceover",
        description: "Captivating voiceovers for podcast branding",
      },
      {
        slug: "ai-voiceover-integration",
        title: "AI Voiceover Integration & Setup",
        description: "Setup and integration of AI voiceover tools",
      },
    ],
  },
  {
    slug: "gaming-streaming",
    title: "Gaming & Streaming",
    description:
      "Gameplay montages, highlights, overlays – level up your gaming content.",
    teaser: "Level up your content 🎮",
    iconName: "Gamepad2",
    iconBg: "#FAF5FF",
    iconColor: "#9333EA",
    subcategories: [
      {
        slug: "gameplay-editing",
        title: "Gameplay Editing",
        description: "Professional editing for gameplay footage",
      },
      {
        slug: "montage-highlight-reels",
        title: "Montage & Highlight Reels",
        description: "Epic montages and best-of highlight compilations",
      },
      {
        slug: "stream-highlights",
        title: "Stream Highlights Compilation",
        description: "Best moments from your streams, edited and polished",
      },
      {
        slug: "gaming-thumbnails-overlays",
        title: "Gaming Thumbnails & Overlays",
        description: "Custom thumbnails and stream overlays",
      },
      {
        slug: "facecam-gameplay-sync",
        title: "Facecam + Gameplay Sync Editing",
        description: "Perfectly synced facecam and gameplay edits",
      },
      {
        slug: "stream-intro-outro",
        title: "Stream Intro/Outro Animations",
        description: "Animated intros and outros for your streams",
      },
    ],
  },
  {
    slug: "growth-branding",
    title: "Growth & Branding",
    description:
      "Channel audits, SEO, media kits, posting help – grow fast and look pro.",
    teaser: "Grow fast, look pro 📈",
    iconName: "TrendingUp",
    iconBg: "#ECFEFF",
    iconColor: "#0891B2",
    subcategories: [
      {
        slug: "channel-audit-growth",
        title: "Full Channel Audit & Growth Plan",
        description: "Complete analysis and actionable growth roadmap",
      },
      {
        slug: "youtube-seo",
        title: "YouTube SEO (Titles/Tags/Description)",
        description: "Optimize your content for YouTube search and discovery",
      },
      {
        slug: "ctr-retention-analysis",
        title: "CTR & Retention Analysis",
        description: "Data-driven improvements for clicks and watch time",
      },
      {
        slug: "competitor-research",
        title: "Competitor Research",
        description: "Deep analysis of competitors and market opportunities",
      },
      {
        slug: "media-kits-sponsorship",
        title: "Media Kits & Sponsorship Decks",
        description: "Professional media kits to land brand deals",
      },
      {
        slug: "social-media-management",
        title: "Social Media Posting / Comment Management",
        description: "Consistent posting and community management",
      },
      {
        slug: "logo-branding-kit",
        title: "Logo & Branding Kit",
        description: "Complete brand identity package for your channel",
      },
    ],
  },
];

/** Look up a single category by its URL slug */
export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((cat) => cat.slug === slug);
}

/** Get all slugs (for generateStaticParams) */
export function getAllCategorySlugs(): string[] {
  return categories.map((cat) => cat.slug);
}

/** Look up a subcategory by its slug within a category */
export function getSubcategoryBySlug(
  categorySlug: string,
  subSlug: string
): Subcategory | undefined {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.subcategories.find((sub) => sub.slug === subSlug);
}
