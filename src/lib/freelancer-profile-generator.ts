import { mockFreelancers, type Freelancer } from "./mock-freelancers";
import { categories } from "./categories-data";

export interface ProfileGig {
  id: string;
  category: string;
  title: string;
  description: string;
  thumbnails: string[]; // Colors for 3 small rects
  skills: string[];
  deliveryTime: string;
  revisions: number;
  startingPrice: number;
}

export interface PortfolioItem {
  id: string;
  type: string; // Reel, Short, UGC, etc.
  title: string;
  views: string;
  color: string;
}

export interface ProfileReview {
  id: string;
  reviewerName: string;
  reviewerInitials: string;
  reviewerSubs: string;
  rating: number;
  timeAgo: string;
  gigRef: string;
  text: string;
}

export interface GeneratedProfile {
  freelancer: Freelancer;
  availability: "available" | "busy";
  joinedDate: string;
  responseTime: string;
  onTimeDeliveryPct: number;
  repeatClientPct: number;
  tools: string[];
  languages: string[];
  aboutExpanded: string;
  gigs: ProfileGig[];
  portfolioItems: PortfolioItem[];
  reviews: ProfileReview[];
  similarFreelancers: Freelancer[];
}

// Deterministic random number generator based on string seed
function sfc32(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ b >>> 9;
    b = c + (c << 3) | 0;
    c = (c << 21 | c >>> 11);
    d = d + 1 | 0;
    t = t + d | 0;
    c = c + t | 0;
    return (t >>> 0) / 4294967296;
  };
}

function getSeededRandom(seedStr: string) {
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed = (seed << 5) - seed + seedStr.charCodeAt(i);
    seed |= 0;
  }
  return sfc32(seed, seed ^ 0xDEADBEEF, seed ^ 0xCAFEBABE, seed ^ 0x12345678);
}

const ALL_TOOLS = [
  "Premiere Pro", "After Effects", "Final Cut Pro", "DaVinci Resolve", "CapCut", // Video
  "Photoshop", "Illustrator", "Figma", "Canva", "Lightroom", // Design
  "Chat GPT", "Midjourney", "Notion", "Google Docs", "ElevenLabs", // AI/Writing
  "Logic Pro", "Ableton", "Audition", // Audio
];

const ALL_LANGUAGES = ["English", "Hindi", "Spanish", "French", "German"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PORTFOLIO_TYPES = ["Reel", "Short", "UGC", "Vlog", "Design", "Post", "Article"];

const REVIEWS_POOL = [
  "Exceptional work! Delivered ahead of schedule and the quality was top notch. Will definitely hire again.",
  "Very professional and easy to communicate with. The final product exceeded my expectations.",
  "Good work, but took a little longer than expected. Still satisfied with the result.",
  "Absolutely crushed the brief. The engagement on this video has been insane!",
  "Highly recommend. Captured my brand's voice perfectly and was super responsive to feedback.",
  "Quick turnaround and great quality. They know exactly what works for the algorithm.",
  "Always a pleasure working with them. Reliable, creative, and professional.",
];

const REVIEWER_NAMES = ["Alex G.", "Priya S.", "Rahul M.", "Sarah J.", "Neha K.", "David W.", "Karan T."];

export function generateProfile(username: string): GeneratedProfile | null {
  const freelancer = mockFreelancers.find((f) => f.username === username);
  if (!freelancer) return null;

  const rand = getSeededRandom(username);

  // ── 1. Header & Stats ──
  const availability = rand() > 0.15 ? "available" : "busy"; // 85% available
  const joinedYear = Math.floor(rand() * 4) + 2021; // 2021-2024
  const joinedMonth = MONTHS[Math.floor(rand() * 12)];
  const joinedDate = `${joinedMonth} ${joinedYear}`;
  const responseTime = rand() > 0.5 ? "Replies within 1 hr" : "Replies within a few hours";
  const onTimeDeliveryPct = Math.floor(rand() * 11) + 90; // 90-100%
  const repeatClientPct = Math.floor(rand() * 31) + 40; // 40-70%

  // ── 2. About (Skills, Tools, Languages) ──
  const aboutExpanded = `${freelancer.bio} I specialize in creating high-quality, engaging content tailored to your specific needs. Let's work together to bring your vision to life and achieve your goals.`;
  
  // Pick 3-5 tools deterministically based on tags to seem relevant
  const numTools = Math.floor(rand() * 3) + 3;
  const tools = [];
  for (let i = 0; i < numTools; i++) {
    tools.push(ALL_TOOLS[Math.floor(rand() * ALL_TOOLS.length)]);
  }
  const uniqueTools = Array.from(new Set(tools)).slice(0, 5);
  
  // Pick 1-3 languages
  const numLangs = Math.floor(rand() * 2) + 1; // English is guaranteed mostly
  const languages = ["English"];
  if (numLangs > 1) {
    languages.push(ALL_LANGUAGES[Math.floor(rand() * ALL_LANGUAGES.length)]);
  }
  const uniqueLangs = Array.from(new Set(languages)).slice(0, 3);

  // ── 3. Gigs ──
  // Generate 1-3 gigs based on their subcategories
  const gigs: ProfileGig[] = [];
  const numGigs = Math.min(Math.floor(rand() * 3) + 1, freelancer.subcategorySlugs.length);
  const selectedSubs = freelancer.subcategorySlugs.slice(0, numGigs);

  selectedSubs.forEach((subSlug, i) => {
    // Find category title for the badge
    let catTitle = "Content";
    let subTitle = "Services";
    categories.forEach(cat => {
      const sub = cat.subcategories.find(s => s.slug === subSlug);
      if (sub) {
        catTitle = cat.title;
        subTitle = sub.title;
      }
    });

    const price = freelancer.price + (i * 500); // 1st gig is baseline price, subs are slightly more

    gigs.push({
      id: `gig-${freelancer.id}-${i}`,
      category: catTitle,
      title: `I will do professional ${subTitle.toLowerCase()}`,
      description: `High quality ${subTitle.toLowerCase()} tailored to your brand. Includes research, ideation, and final delivery optimized for your platform.`,
      thumbnails: [
        `#${Math.floor(rand() * 16777215).toString(16).padStart(6, '0')}`,
        `#${Math.floor(rand() * 16777215).toString(16).padStart(6, '0')}`,
        `#${Math.floor(rand() * 16777215).toString(16).padStart(6, '0')}`
      ],
      skills: freelancer.tags.slice(0, 3),
      deliveryTime: freelancer.deliveryLabel,
      revisions: Math.floor(rand() * 3) + 1,
      startingPrice: price,
    });
  });

  // ── 4. Portfolio ──
  // Generate up to 8 portfolio items
  const portfolioItems: PortfolioItem[] = [];
  const numPortfolios = Math.floor(rand() * 6) + 3; // 3 to 8 items
  for (let i = 0; i < numPortfolios; i++) {
    const views = Math.floor(rand() * 500) + 10;
    const viewLabel = views > 100 ? `${(views / 10).toFixed(1)}k` : `${views}k`;
    portfolioItems.push({
      id: `port-${i}`,
      type: PORTFOLIO_TYPES[Math.floor(rand() * PORTFOLIO_TYPES.length)],
      title: `Project ${i + 1} - ${freelancer.tags[0] || "Creative"} Work`,
      views: viewLabel,
      color: `#${Math.floor(rand() * 16777215).toString(16).padStart(6, '0')}`,
    });
  }

  // ── 5. Reviews ──
  const reviews: ProfileReview[] = [];
  // Use their real review count, cap at 5 for display
  const numReviews = Math.min(freelancer.reviews, (Math.floor(rand() * 4) + 2)); 
  
  if (freelancer.reviews > 0) {
    for (let i = 0; i < numReviews; i++) {
      const reviewer = REVIEWER_NAMES[Math.floor(rand() * REVIEWER_NAMES.length)];
      const subs = Math.floor(rand() * 100) + 1;
      const subLabel = subs > 50 ? `${subs}k subs` : `${Math.floor(subs * 10)} subs`;
      const timeAgo = Math.floor(rand() * 5) + 1; // 1-5 weeks ago
      const isPerfect = rand() > 0.3; // mostly 5 stars
      const gigRef = gigs[0]?.title || "Custom Project";

      reviews.push({
        id: `rev-${i}`,
        reviewerName: reviewer,
        reviewerInitials: reviewer.split(" ").map(n => n[0]).join(""),
        reviewerSubs: subLabel,
        rating: isPerfect ? 5 : 4,
        timeAgo: `${timeAgo} ${timeAgo === 1 ? 'week' : 'weeks'} ago`,
        gigRef: gigRef,
        text: REVIEWS_POOL[Math.floor(rand() * REVIEWS_POOL.length)],
      });
    }
  }

  // ── 6. Similar Freelancers ──
  // Find others in the same primary subcategory
  const mainSub = freelancer.subcategorySlugs[0];
  const similarPool = mockFreelancers.filter(
    f => f.id !== freelancer.id && f.subcategorySlugs.includes(mainSub)
  );
  
  // Deterministic shuffle
  const similarFreelancers = similarPool
    .sort((a, b) => getSeededRandom(a.id)() - getSeededRandom(b.id)())
    .slice(0, 4);

  return {
    freelancer,
    availability,
    joinedDate,
    responseTime,
    onTimeDeliveryPct,
    repeatClientPct,
    tools: uniqueTools,
    languages: uniqueLangs,
    aboutExpanded,
    gigs,
    portfolioItems,
    reviews,
    similarFreelancers,
  };
}
