# CreateCrew — Frontend & Architecture Notes 🏗️

_This document maps out the current state of the CreateCrew Next.js frontend, including all pages, how they connect, and how the current "dummy backend" (localStorage + mock data) is structured. Use this as a guide for building the real backend and API layer._

---

## 1. Application Flow & Routing

The app is divided into **Public Pages**, **Auth & Onboarding**, and **Protected Dashboard/User Pages**.

### 🌍 Public / Landing Pages

- `/` **(Home)** — Landing page with hero, value props, categories grid, featured freelancers, and dual-path CTA (Creator/Freelancer).
- `/about` — About us, mission, and "Behind the Scene" story.
- `/find-work` — Landing page targeted specifically at freelancers ("Become a Crew"). Showcases earning potential and how it works.
- `/categories` — Directory of all creative skills.
- `/categories/[slug]` — Specific category page (e.g., Video Editing) showing freelancers with that skill.

### 🔐 Auth & Onboarding Flow

- `/signup` — Account creation (Name, Email, Password). Redirects to `/onboarding`.
- `/signin` — Login. Redirects to `/dashboard` (or `/onboarding` if incomplete).
- `/onboarding` — **5-Step Setup Wizard**:
  1. **Intent:** What brings you here? (Creator / Freelancer / Both / Exploring)
  2. **Categories:** Pick skills (Freelancer) or content niches (Creator).
  3. **Profile:** Display name, Location dropdown (30 Indian cities), Photo nudge.
  4. **Trial Celebration:** 🎉 3-months free perks reveal.
  5. **First Action:** Prompts to "Create Gig", "Post Job", or "Browse Crew".

### 🛡️ Protected Pages (Requires Login)

- `/dashboard` — Main hub. Dual-role UI controlled by a toggle (Creator View / Freelancer View). Contains the "Get Started" checklist for new users.
- `/dashboard/edit-profile` — Tabbed form to edit General info, Creator details (YouTube link, subs, niches), and Freelancer details (skills, pricing, portfolio).
- `/gigs/new` — **Freelancers:** Form to create a new gig (Title, Description, Category, Price, Delivery time, Portfolio links).
- `/post-job` — **Creators:** Form to post a new job listing.
- `/find-crews` — **Creators:** Search and filter freelancers by category, subcategory, price, etc.
- `/profile/[username]` — Public profile view of any user (e.g., `/profile/@rohan`). Shows Creator stats and Freelancer gigs dynamically based on roles.

---

## 2. The "Dummy Backend" (Current Data Layer)

To allow frontend development without a real database, all data logic is currently housed in `src/lib/`. It uses hardcoded dummy data and `localStorage` for persistence.

When building the real backend (e.g., Node/Express + PostgreSQL or Supabase), these files represent the exact **Services/Controllers** and **Database Schemas** you will need.

### 👤 Authentication (`lib/mock-auth.ts`, `lib/auth-context.tsx`)

- **Storage state:** `createcrew_user` (current logged-in user) and `createcrew_registered_users` (array of all signed-up users).
- **Core Model:** `MockUser` interface includes name, email, roles (`creatorMode`, `freelancerMode`), onboarding flags, and generated gradient avatar data.
- **Backend Todo:** Replace `auth-context.tsx` with real JWT/Session management (e.g., NextAuth or Supabase Auth).

### 📝 User Profiles (`lib/profile-data.ts`)

- **Storage state:** `createcrew_profiles_{userId}`
- **Core Model:** Profiles are split into three nested objects:
  1. `general`: Location, Bio, Social Links.
  2. `creator`: Platform, Subscribers, Team Size, Channel URL, Niches.
  3. `freelancer`: Skills list, Starting Price, Availability, Badges, Portfolio URLs.
- **Backend Todo:** Create a `Profiles` table with 1-to-1 mapping to Users, likely utilizing JSON/array fields for skills and social links.

### 💼 Gigs (`lib/gig-data.ts`)

- **Storage state:** `createcrew_gigs`
- **Core Model:** `Gig` interface (userId, title, description, categorySlug, subcategorySlug, startingPrice, deliveryTime, portfolioUrls).
- **Backend Todo:** Create a `Gigs` table linked by `user_id` to the creator. Needs to support filtering by category/price for the "Find Crews" search.

### 📋 Jobs / Collab Board (`lib/mock-jobs.ts`)

- **Current State:** Hardcoded array of jobs (title, budget, type, required skills, descriptive tags).
- **Backend Todo:** Create a `Jobs` table linked to the Creator `user_id`, and an `Applications` join table to track Freelancers applying to Jobs.

### 🎭 Freelancer / Creator Search (`lib/mock-freelancers.ts`, `lib/mock-creators.ts`)

- **Current State:** Large arrays of highly detailed, realistic dummy profiles used for the `/find-crews` page and Landing Page featured grids.
- **Backend Todo:** This data should ideally be seeded into the database for testing. The `/find-crews` search will require a robust backend query to filter users joining their Profile and Gig data.

### 🗂️ Categories System (`lib/categories-data.ts`)

- **Current State:** A central source of truth for the 9 parent categories (e.g., "Video Editing") and their subcategories. Used across onboarding, gig creation, and search filters.
- **Backend Todo:** Can remain as a static config file in the backend, or be moved to a `Categories` database table if admins need to add/edit categories dynamically in the future.

---

## 3. UI/UX Principles & Patterns Used

If you add new features, follow these established frontend patterns:

- **Styling:** Tailwind CSS + `shadcn/ui` components. Avoid writing custom CSS; use Tailwind utility classes.
- **Animations:** `framer-motion`. Pages fade/slide up (`initial={{ opacity: 0, y: 12 }}`). Lists stagger in. Interactions use layout animations.
- **Design Language:** Gen-Z, bold typography (`Space Grotesk` headers, `Inter` body), border-heavy cards (`border border-border/60`), subtle hover states (`hover:border-brand-indigo/30`), and vibrant brand colors (Coral, Indigo, Emerald).
- **Forms:** Always use standard HTML/Tailwind inputs styled consistently. Minimal required fields.
- **Icons:** `lucide-react`.

## Next Steps for Backend Development

1. **Choose Stack:** Setup Database (Postgres recommended) and ORM (Prisma/Drizzle) + Auth provider.
2. **Translate Types:** Convert the interfaces in `lib/*.ts` into database schemas.
3. **Build API Routes:** Replace `localStorage` calls with `fetch` requests to your new `/api/*` endpoints.
