# Layout Fix Task Document

> **Issue:** Header, Footer, and Sidebar are inconsistently applied across pages  
> **Goal:** Create clear layout boundaries between public pages, dashboard pages, and profile pages

---

## Current State Analysis

### Root Layout (`src/app/layout.tsx`)

Applies to **ALL pages**:

- ✅ Navbar (always shown)
- ✅ ConditionalFooter (hides only on: `/onboarding`, `/signup`, `/signin`)

### Dashboard Layout (`src/app/dashboard/layout.tsx`)

Applies to **`/dashboard/*`**:

- ✅ DashboardSidebar
- ❌ Still inherits Navbar + Footer from root layout

---

## Problems Identified

### Problem 1: Dashboard Shows Footer (Wrong)

**Current:** Dashboard pages show the landing page footer  
**Expected:** Dashboard should NOT have footer (it's an app interface, not marketing)

### Problem 2: Public Profiles Show Footer (Wrong)

**Current:** Profile pages (`/profile/*`, `/creator/*`, `/freelancer/*`) show footer  
**Expected:** Public profiles should NOT have footer (clean profile view)

### Problem 3: Dashboard Shows Marketing Navbar (Debatable)

**Current:** Dashboard shows same navbar as marketing pages  
**Expected:** Dashboard could have simplified header OR keep consistent navbar

---

## Required Layout Structure

### Layout Type A: Marketing Pages (Public)

**Pages:**

- `/` (Home)
- `/about`
- `/find-crews`
- `/find-work`
- `/categories/*`
- `/become-crew`
- `/creators`

**Components:**

- ✅ Navbar (marketing nav)
- ✅ Footer
- ❌ No Sidebar

### Layout Type B: Auth Pages

**Pages:**

- `/signup`
- `/signin`
- `/onboarding`

**Components:**

- ❌ No Navbar (clean auth experience)
- ❌ No Footer
- ❌ No Sidebar

### Layout Type C: Dashboard Pages (App)

**Pages:**

- `/dashboard/*` (all dashboard routes)

**Components:**

- ⚠️ Optional: Simplified header OR no header
- ✅ Sidebar (dashboard navigation)
- ❌ No Footer

### Layout Type D: Public Profile Pages

**Pages:**

- `/profile/[username]`
- `/creator/[username]`
- `/freelancer/[username]`

**Components:**

- ✅ Navbar (for navigation back)
- ❌ No Footer
- ❌ No Sidebar

### Layout Type E: Creator/Freelancer Actions

**Pages:**

- `/gigs/new`
- `/post-job`

**Components:**

- ✅ Navbar
- ❌ No Footer
- ❌ No Sidebar

---

## Files to Fix

### File 1: `src/components/layout/conditional-footer.tsx`

**Action:** Update footer hide paths

**Current:**

```typescript
const HIDE_FOOTER_PATHS = ['/onboarding', '/signup', '/signin'];
```

**Should Be:**

```typescript
const HIDE_FOOTER_PATHS = [
    '/onboarding',
    '/signup',
    '/signin',
    '/dashboard',
    '/profile',
    '/creator',
    '/freelancer',
    '/gigs/new',
    '/post-job',
];
```

---

### File 2: Create `src/app/(marketing)/layout.tsx` (New)

**Action:** Create group layout for marketing pages

**Purpose:** Separate marketing pages from app pages

**Structure:**

```
src/app/
├── (marketing)/          # Group folder (no URL segment)
│   ├── layout.tsx        # Marketing layout with footer
│   ├── page.tsx          # Home
│   ├── about/
│   ├── find-crews/
│   ├── find-work/
│   ├── categories/
│   ├── become-crew/
│   └── creators/
```

**Content:**

```tsx
// src/app/(marketing)/layout.tsx
import Footer from '@/components/landing/footer';

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            {children}
            <Footer />
        </>
    );
}
```

---

### File 3: `src/app/layout.tsx`

**Action:** Remove footer from root layout (move to marketing group)

**Current:**

```tsx
<body>
    <AuthProvider>
        <Navbar />
        <main>{children}</main>
        <ConditionalFooter /> {/* REMOVE THIS */}
    </AuthProvider>
</body>
```

**Should Be:**

```tsx
<body>
    <AuthProvider>
        <Navbar />
        <main>{children}</main>
        {/* Footer moved to marketing layout */}
    </AuthProvider>
</body>
```

---

### File 4: Create `src/app/(auth)/layout.tsx` (New)

**Action:** Create auth group layout (clean, no nav/footer)

**Structure:**

```
src/app/
├── (auth)/               # Group folder
│   ├── layout.tsx        # Clean auth layout
│   ├── signup/
│   ├── signin/
│   └── onboarding/
```

**Content:**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            {children}
        </div>
    );
}
```

---

### File 5: `src/app/dashboard/layout.tsx`

**Action:** Ensure dashboard has no footer (already handled if we move footer)

**Optional Enhancement:**
Add a simplified header for dashboard:

```tsx
// Optional: Add to dashboard layout
<div className='flex min-h-screen'>
    <DashboardSidebar />
    <div className='flex-1'>
        {/* Optional: Simple header */}
        <main>{children}</main>
    </div>
</div>
```

---

## Summary of Changes

| File                                           | Change Type | Description                                      |
| ---------------------------------------------- | ----------- | ------------------------------------------------ |
| `src/app/(marketing)/layout.tsx`               | **Create**  | New group layout for marketing pages with footer |
| `src/app/(auth)/layout.tsx`                    | **Create**  | New group layout for auth pages (clean)          |
| `src/app/layout.tsx`                           | **Modify**  | Remove ConditionalFooter                         |
| `src/components/layout/conditional-footer.tsx` | **Modify**  | Update hide paths (backup safety)                |

---

## Page Reorganization

### Move to `(marketing)` Group:

- [ ] `src/app/page.tsx` → `src/app/(marketing)/page.tsx`
- [ ] `src/app/about/` → `src/app/(marketing)/about/`
- [ ] `src/app/find-crews/` → `src/app/(marketing)/find-crews/`
- [ ] `src/app/find-work/` → `src/app/(marketing)/find-work/`
- [ ] `src/app/categories/` → `src/app/(marketing)/categories/`
- [ ] `src/app/become-crew/` → `src/app/(marketing)/become-crew/`
- [ ] `src/app/creators/` → `src/app/(marketing)/creators/`

### Move to `(auth)` Group:

- [ ] `src/app/signup/` → `src/app/(auth)/signup/`
- [ ] `src/app/signin/` → `src/app/(auth)/signin/`
- [ ] `src/app/onboarding/` → `src/app/(auth)/onboarding/`

### Keep at Root (App Pages):

- [ ] `src/app/dashboard/` (has its own layout with sidebar)
- [ ] `src/app/profile/[username]/` (public profile)
- [ ] `src/app/creator/[username]/` (public creator profile)
- [ ] `src/app/freelancer/[username]/` (public freelancer profile)
- [ ] `src/app/gigs/new/` (create gig)
- [ ] `src/app/post-job/` (post job)

---

## Visual Reference

### Marketing Page Layout

```
┌─────────────────────────┐
│        Navbar           │  ← Marketing nav
├─────────────────────────┤
│                         │
│      Page Content       │
│                         │
├─────────────────────────┤
│        Footer           │  ← Marketing footer
└─────────────────────────┘
```

### Auth Page Layout

```
┌─────────────────────────┐
│                         │
│      Auth Content       │  ← Clean, centered
│    (signup/signin)      │
│                         │
└─────────────────────────┘
```

### Dashboard Layout

```
┌────────┬────────────────┐
│        │   Simplified   │  ← Optional header
│   SB   ├────────────────┤
│   IA   │                │
│   R    │  Page Content  │
│        │                │
│        │                │
└────────┴────────────────┘
```

### Public Profile Layout

```
┌─────────────────────────┐
│        Navbar           │  ← Back nav
├─────────────────────────┤
│                         │
│    Profile Content      │  ← Clean view
│                         │
└─────────────────────────┘
```

---

## Implementation Priority

1. **High Priority:**
    - Create `(marketing)` group layout
    - Move marketing pages to group
    - Remove footer from root layout

2. **Medium Priority:**
    - Create `(auth)` group layout
    - Move auth pages to group
    - Update conditional-footer as safety

3. **Low Priority:**
    - Optional dashboard header refinements
    - Test all page transitions

---

## Testing Checklist

After fixes, verify each page type:

- [ ] `/` (Home) - Has navbar + footer
- [ ] `/about` - Has navbar + footer
- [ ] `/find-crews` - Has navbar + footer
- [ ] `/signup` - NO navbar, NO footer
- [ ] `/signin` - NO navbar, NO footer
- [ ] `/onboarding` - NO navbar, NO footer
- [ ] `/dashboard` - Has sidebar, NO footer
- [ ] `/dashboard/messages` - Has sidebar, NO footer
- [ ] `/profile/@username` - Has navbar, NO footer
- [ ] `/creator/@username` - Has navbar, NO footer
- [ ] `/freelancer/@username` - Has navbar, NO footer
- [ ] `/gigs/new` - Has navbar, NO footer
- [ ] `/post-job` - Has navbar, NO footer
