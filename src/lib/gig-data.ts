const GIGS_KEY = "createcrew_gigs";

export interface Gig {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;        // category slug
  subcategory: string;     // subcategory slug
  startingPrice: string;   // e.g. "2000"
  deliveryTime: string;    // e.g. "2-3 days"
  portfolioUrls: string[];
  createdAt: string;       // ISO date
}

export const DELIVERY_OPTIONS = [
  "24 hours",
  "2-3 days",
  "4-7 days",
  "1-2 weeks",
  "Custom",
];

export function getGigs(userId?: string): Gig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GIGS_KEY);
    if (!raw) return [];
    const all: Gig[] = JSON.parse(raw);
    return userId ? all.filter((g) => g.userId === userId) : all;
  } catch {
    return [];
  }
}

export function saveGig(gig: Omit<Gig, "id" | "createdAt">): Gig {
  const newGig: Gig = {
    ...gig,
    id: `gig_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
  };
  const all = getGigs();
  all.push(newGig);
  localStorage.setItem(GIGS_KEY, JSON.stringify(all));
  return newGig;
}
