/* ── Mock Authentication System ── */
/* localStorage-based auth for testing the full UI flow */
/* Will be replaced with real Supabase Auth later */

const AUTH_KEY = "createcrew_user";
const USERS_KEY = "createcrew_registered_users";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  username: string;
  bio: string;
  creatorMode: boolean;
  freelancerMode: boolean;
  rolesSelected: boolean; // true after onboarding
  skills?: string[];
  subscribers?: string;
  avatar: string;           // 2-letter initials
  gradientFrom: string;
  gradientTo: string;
  /* ── Onboarding fields ── */
  phone?: string;
  selectedIntent?: "creator" | "freelancer" | "both" | "exploring";
  selectedCategories?: string[];   // category slugs chosen during onboarding
  location?: string;               // "City, State"
  photoUrl?: string;               // mock — just a placeholder URL
  onboardingComplete?: boolean;    // true after finishing all wizard steps
  trialStartDate?: string;         // ISO date when trial began
}


/* ── 4 Hardcoded Test Accounts ── */

const SEED_USERS: (MockUser & { password: string })[] = [
  {
    id: "u-techburner", name: "Shlok Srivastava", email: "techburner@createcrew.test",
    username: "techburner", password: "Test1234!",
    bio: "India's #1 tech creator, 1.2M+ YouTube subs",
    creatorMode: true, freelancerMode: false, rolesSelected: true,
    subscribers: "1.2M", avatar: "SS", gradientFrom: "#FF6B4A", gradientTo: "#FB923C",
  },
  {
    id: "u-rohaneditor", name: "Rohan Kapoor", email: "rohaneditor@createcrew.test",
    username: "rohaneditor", password: "Test1234!",
    bio: "Freelance video editor specializing in Reels & Shorts",
    creatorMode: false, freelancerMode: true, rolesSelected: true,
    skills: ["Reels Editing", "Hook Optimization", "Premiere Pro"],
    avatar: "RK", gradientFrom: "#4F46E5", gradientTo: "#818CF8",
  },
  {
    id: "u-craftclips", name: "Craft Clips Team", email: "craftclips@createcrew.test",
    username: "craftclips", password: "Test1234!",
    bio: "340K subs – Shorts & Reels channel + freelance editing services",
    creatorMode: true, freelancerMode: true, rolesSelected: true,
    subscribers: "340K", skills: ["Batch Shorts Editing", "Retention Editing"],
    avatar: "CC", gradientFrom: "#10B981", gradientTo: "#2DD4BF",
  },
  {
    id: "u-localcafe", name: "Priya Cafe Owner", email: "localcafe@createcrew.test",
    username: "priyacafe", password: "Test1234!",
    bio: "Small cafe in Bhubaneswar needing Reels for Instagram",
    creatorMode: true, freelancerMode: false, rolesSelected: true,
    avatar: "PC", gradientFrom: "#EC4899", gradientTo: "#F472B6",
  },
];

/* ── Helper: get registered users from localStorage ── */

function getRegisteredUsers(): (MockUser & { password: string })[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUsers(users: (MockUser & { password: string })[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getAllUsers() {
  return [...SEED_USERS, ...getRegisteredUsers()];
}

/* ── Auth Functions ── */

export function signIn(email: string, password: string): { user: MockUser | null; error: string | null } {
  const all = getAllUsers();
  const match = all.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!match) {
    return { user: null, error: "Invalid email or password" };
  }

  const { password: _, ...userWithoutPassword } = match;
  localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
  return { user: userWithoutPassword, error: null };
}

export function signUp(data: {
  name: string;
  email: string;
  password: string;
}): { user: MockUser | null; error: string | null } {
  const all = getAllUsers();

  if (all.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { user: null, error: "An account with this email already exists" };
  }

  const newUser: MockUser & { password: string } = {
    id: `u-${Date.now()}`,
    name: data.name,
    email: data.email,
    username: data.name.toLowerCase().replace(/\s+/g, ""),
    password: data.password,
    bio: "",
    creatorMode: false,
    freelancerMode: false,
    rolesSelected: false,
    avatar: data.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    gradientFrom: "#6366F1",
    gradientTo: "#A78BFA",
  };

  const registered = getRegisteredUsers();
  registered.push(newUser);
  saveRegisteredUsers(registered);

  const { password: _, ...userWithoutPassword } = newUser;
  localStorage.setItem(AUTH_KEY, JSON.stringify(userWithoutPassword));
  return { user: userWithoutPassword, error: null };
}

export function signOut() {
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function updateCurrentUser(updates: Partial<MockUser>) {
  const user = getCurrentUser();
  if (!user) return null;
  const updated = { ...user, ...updates };
  localStorage.setItem(AUTH_KEY, JSON.stringify(updated));

  // Also update in registered users if not a seed user
  const registered = getRegisteredUsers();
  const idx = registered.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    registered[idx] = { ...registered[idx], ...updates };
    saveRegisteredUsers(registered);
  }

  return updated;
}

export function getUserByUsername(username: string): MockUser | null {
  if (typeof window === "undefined") return null;
  const clean = username.replace(/^@/, "").toLowerCase();
  const all = getAllUsers();
  const match = all.find((u) => u.username.toLowerCase() === clean);
  if (!match) return null;
  const { password: _, ...userWithoutPassword } = match;
  return userWithoutPassword;
}
