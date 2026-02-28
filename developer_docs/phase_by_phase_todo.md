# CreateCrew — Phase by Phase Development Roadmap

> **Last Updated:** 28 Feb 2026  
> **Project:** CreateCrew - Gen-Z Creator Operations Marketplace  
> **Current Status:** Frontend MVP Complete (Mock Data)  
> **Backend Stack:** Supabase (PostgreSQL + Auth + Storage + Realtime)  
> **Next Phase:** Backend Development + Production Readiness

---

## Executive Summary

### What Exists (Frontend MVP)

- Complete Next.js 16 frontend with 20+ pages
- Mock authentication using localStorage
- All UI components built with Tailwind + shadcn/ui
- Mock data for freelancers, creators, jobs, messages
- Category/subcategory system (9 categories, 50+ subcategories)

### What's Missing (Backend & Production)

- Real database and API
- Authentication service
- File uploads
- Payment processing
- Real-time features
- Mobile app
- Admin tools

---

## Phase 1: Supabase Backend Foundation (Weeks 1-4)

**Goal:** Set up Supabase and replace localStorage mock data

### 1.1 Supabase Project Setup

- [ ] Create Supabase project at supabase.com
- [ ] Set up organization and project name (createcrew-prod)
- [ ] Note down Project URL and Anon/Public API keys
- [ ] Set up environment variables:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
    ```
- [ ] Install Supabase libraries:
    ```bash
    npm install @supabase/supabase-js @supabase/ssr
    ```
- [ ] Create Supabase client utilities:
    - [ ] `src/lib/supabase/client.ts` (browser client)
    - [ ] `src/lib/supabase/server.ts` (server-side client)
    - [ ] `src/lib/supabase/middleware.ts` (session handling)

### 1.2 Database Schema Design (Supabase)

Use Supabase Dashboard SQL Editor to create tables:

- [ ] **profiles** table (extends auth.users):
    ```sql
    create table profiles (
      id uuid references auth.users on delete cascade,
      username text unique not null,
      full_name text,
      avatar_url text,
      bio text,
      location text,
      creator_mode boolean default false,
      freelancer_mode boolean default false,
      onboarding_complete boolean default false,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      updated_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```
- [ ] **creator_profiles** table:
    ```sql
    create table creator_profiles (
      user_id uuid references profiles(id) on delete cascade,
      primary_platform text,
      channel_url text,
      subscriber_count text,
      niche_tags text[],
      upload_schedule text,
      team_size text,
      about_channel text,
      vision text,
      primary key (user_id)
    );
    ```
- [ ] **freelancer_profiles** table:
    ```sql
    create table freelancer_profiles (
      user_id uuid references profiles(id) on delete cascade,
      skills text[],
      starting_price integer,
      availability text[],
      badges text[],
      portfolio_urls text[],
      preferred_niches text[],
      rating decimal(2,1) default 0,
      jobs_done integer default 0,
      primary key (user_id)
    );
    ```
- [ ] **gigs** table:
    ```sql
    create table gigs (
      id uuid default gen_random_uuid(),
      user_id uuid references profiles(id) on delete cascade,
      title text not null,
      description text,
      category_slug text not null,
      subcategory_slug text not null,
      starting_price integer not null,
      delivery_time text,
      portfolio_urls text[],
      status text default 'active',
      created_at timestamp with time zone default timezone('utc'::text, now()),
      updated_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```
- [ ] **jobs** table:
    ```sql
    create table jobs (
      id uuid default gen_random_uuid(),
      creator_id uuid references profiles(id) on delete cascade,
      title text not null,
      category_slug text not null,
      category_label text,
      category_color text,
      subcategory_slug text,
      description text,
      what_needed text,
      style_reference text,
      specific_requirements text,
      budget_min integer,
      budget_max integer,
      budget_model text,
      timeline text,
      visibility_setting text default 'public',
      max_applications integer default 15,
      application_deadline_hours integer default 48,
      status text default 'open',
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```
- [ ] **applications** table:
    ```sql
    create table applications (
      id uuid default gen_random_uuid(),
      job_id uuid references jobs(id) on delete cascade,
      freelancer_id uuid references profiles(id) on delete cascade,
      proposed_price integer not null,
      delivery_days integer not null,
      portfolio_sample_url text,
      pitch text,
      question_for_creator text,
      position integer,
      status text default 'submitted',
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```
- [ ] **conversations** table:
    ```sql
    create table conversations (
      id uuid default gen_random_uuid(),
      participant_1_id uuid references profiles(id) on delete cascade,
      participant_2_id uuid references profiles(id) on delete cascade,
      related_job_id uuid references jobs(id) on delete set null,
      last_message text,
      last_updated timestamp with time zone default timezone('utc'::text, now()),
      unread_count_1 integer default 0,
      unread_count_2 integer default 0,
      primary key (id)
    );
    ```
- [ ] **messages** table:
    ```sql
    create table messages (
      id uuid default gen_random_uuid(),
      conversation_id uuid references conversations(id) on delete cascade,
      sender_id uuid references profiles(id) on delete cascade,
      text text not null,
      status text default 'sent',
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```
- [ ] **saved_jobs** table:
    ```sql
    create table saved_jobs (
      user_id uuid references profiles(id) on delete cascade,
      job_id uuid references jobs(id) on delete cascade,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (user_id, job_id)
    );
    ```
- [ ] **saved_freelancers** table:
    ```sql
    create table saved_freelancers (
      user_id uuid references profiles(id) on delete cascade,
      freelancer_id uuid references profiles(id) on delete cascade,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (user_id, freelancer_id)
    );
    ```
- [ ] **reviews** table:
    ```sql
    create table reviews (
      id uuid default gen_random_uuid(),
      reviewer_id uuid references profiles(id) on delete cascade,
      reviewee_id uuid references profiles(id) on delete cascade,
      job_id uuid references jobs(id) on delete set null,
      rating integer not null check (rating >= 1 and rating <= 5),
      comment text,
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```

### 1.3 Row Level Security (RLS) Policies

- [ ] Enable RLS on all tables
- [ ] Set up policies for profiles (users can read all, update own):
    ```sql
    alter table profiles enable row level security;

    create policy "Public profiles are viewable by everyone"
      on profiles for select using (true);

    create policy "Users can update own profile"
      on profiles for update using (auth.uid() = id);
    ```
- [ ] Set up policies for gigs (public read, owner write)
- [ ] Set up policies for jobs (creator can manage, freelancers can view open)
- [ ] Set up policies for messages (participants only)

### 1.4 Supabase Auth Integration

- [ ] Replace `src/lib/mock-auth.ts` with Supabase Auth:
    ```typescript
    // src/lib/supabase/auth.ts
    export async function signUp(
        email: string,
        password: string,
        userData: object,
    ) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: userData },
        });
        return { data, error };
    }

    export async function signIn(email: string, password: string) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { data, error };
    }

    export async function signOut() {
        const supabase = createClient();
        await supabase.auth.signOut();
    }
    ```
- [ ] Update `src/lib/auth-context.tsx` to use Supabase session
- [ ] Set up auth hooks for real-time session updates
- [ ] Configure email templates in Supabase Dashboard:
    - [ ] Confirmation email
    - [ ] Password reset email
    - [ ] Magic link email
- [ ] Set up OAuth providers (Google) in Supabase Dashboard
- [ ] Configure redirect URLs for auth callbacks

### 1.5 Database Functions & Triggers

- [ ] Create trigger to auto-create profile on user signup:
    ```sql
    create or replace function public.handle_new_user()
    returns trigger as $$
    begin
      insert into public.profiles (id, username, full_name)
      values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name');
      return new;
    end;
    $$ language plpgsql security definer;

    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
    ```
- [ ] Create function to update application position automatically
- [ ] Create function to update conversation last_message

### 1.6 Seed Data Migration

- [ ] Convert existing mock data to SQL inserts
- [ ] Create seed script using Supabase CLI:
    ```bash
    supabase db seed new initial_data
    ```
- [ ] Seed test users with confirmed emails
- [ ] Seed sample gigs, jobs, and profiles

---

## Phase 2: Core Features with Supabase (Weeks 5-8)

**Goal:** Implement all CRUD using Supabase client

### 2.1 Gigs System (Supabase)

- [ ] Create `src/lib/supabase/gigs.ts` with Supabase queries:
    ```typescript
    export async function getGigs(filters?: GigFilters) {
        const supabase = createClient();
        let query = supabase
            .from('gigs')
            .select('*, freelancer_profiles(*), profiles(*)');

        if (filters?.category) {
            query = query.eq('category_slug', filters.category);
        }
        if (filters?.minPrice) {
            query = query.gte('starting_price', filters.minPrice);
        }
        // Add sorting and pagination
        const { data, error } = await query;
        return { data, error };
    }
    ```
- [ ] Replace `src/lib/gig-data.ts` localStorage with Supabase calls
- [ ] Implement full-text search using Supabase `.textSearch()`
- [ ] Add pagination using Supabase range

### 2.2 Jobs System (Supabase)

- [ ] Create `src/lib/supabase/jobs.ts`:
    ```typescript
    export async function createJob(jobData: CreateJobInput) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('jobs')
            .insert(jobData)
            .select()
            .single();
        return { data, error };
    }
    ```
- [ ] Replace `src/lib/mock-jobs.ts` with Supabase queries
- [ ] Implement job status workflow
- [ ] Create view for creator's posted jobs

### 2.3 Applications System (Supabase)

- [ ] Create `src/lib/supabase/applications.ts`:
    ```typescript
    export async function submitApplication(applicationData: object) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('applications')
            .insert(applicationData)
            .select()
            .single();
        return { data, error };
    }

    export async function updateApplicationStatus(id: string, status: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', id);
        return { data, error };
    }
    ```
- [ ] Replace `src/lib/job-applications.ts`
- [ ] Implement application counter with Supabase count

### 2.4 Search & Discovery (Supabase)

- [ ] Use Supabase full-text search for freelancer/job search
- [ ] Set up database indexes for performance:
    ```sql
    create index idx_gigs_category on gigs(category_slug);
    create index idx_gigs_price on gigs(starting_price);
    create index idx_jobs_status on jobs(status);
    ```
- [ ] Implement fuzzy search using pg_trgm extension

---

## Phase 3: Real-Time with Supabase (Weeks 9-11)

**Goal:** Implement real-time messaging using Supabase Realtime

### 3.1 Supabase Realtime Setup

- [ ] Enable Realtime in Supabase Dashboard for messages table
- [ ] Create `src/lib/supabase/realtime.ts`:
    ```typescript
    export function subscribeToMessages(
        conversationId: string,
        callback: (message: Message) => void,
    ) {
        const supabase = createClient();
        return supabase
            .channel(`messages:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => callback(payload.new as Message),
            )
            .subscribe();
    }
    ```

### 3.2 Messaging with Supabase

- [ ] Replace `src/lib/mock-messages.ts` with Supabase queries
- [ ] Create `src/lib/supabase/messages.ts`:
    ```typescript
    export async function sendMessage(messageData: object) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('messages')
            .insert(messageData)
            .select()
            .single();
        return { data, error };
    }

    export async function getMessages(conversationId: string) {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });
        return { data, error };
    }
    ```
- [ ] Implement unread count updates via Realtime
- [ ] Set up conversation list subscription

### 3.3 Email Notifications (Supabase Edge Functions)

- [ ] Set up Supabase Edge Functions:
    ```bash
    supabase functions new send-email
    ```
- [ ] Create email triggers using database webhooks
- [ ] Integrate with Resend or SendGrid in Edge Functions:
    ```typescript
    // supabase/functions/send-email/index.ts
    import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

    serve(async (req) => {
        const { to, subject, html } = await req.json();
        // Send email via Resend API
    });
    ```

---

## Phase 4: File Storage with Supabase (Weeks 12-13)

**Goal:** Enable file uploads using Supabase Storage

### 4.1 Supabase Storage Setup

- [ ] Create buckets in Supabase Dashboard:
    - [ ] `avatars` (public, 2MB limit, image types only)
    - [ ] `portfolios` (public, 10MB limit, images + PDFs)
    - [ ] `job-attachments` (private, 10MB limit)
- [ ] Set up storage policies:
    ```sql
    create policy "Avatar images are publicly accessible"
      on storage.objects for select
      using (bucket_id = 'avatars');

    create policy "Users can upload their own avatar"
      on storage.objects for insert
      with check (bucket_id = 'avatars' and auth.uid() = owner);
    ```

### 4.2 Upload Implementation (Supabase)

- [ ] Create `src/lib/supabase/storage.ts`:
    ```typescript
    export async function uploadAvatar(file: File, userId: string) {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, { upsert: true });

        if (error) throw error;

        const {
            data: { publicUrl },
        } = supabase.storage.from('avatars').getPublicUrl(fileName);

        // Update profile with new avatar URL
        await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', userId);

        return publicUrl;
    }
    ```
- [ ] Implement image compression before upload
- [ ] Add file type validation client-side

---

## Phase 5: Payments (Weeks 14-16)

**Goal:** Integrate Razorpay for Indian payments

### 5.1 Razorpay Integration

- [ ] Set up Razorpay account and get API keys
- [ ] Create Supabase Edge Function for payment:
    ```typescript
    // supabase/functions/create-order/index.ts
    import Razorpay from 'npm:razorpay';

    const razorpay = new Razorpay({
        key_id: Deno.env.get('RAZORPAY_KEY_ID'),
        key_secret: Deno.env.get('RAZORPAY_KEY_SECRET'),
    });

    serve(async (req) => {
        const { amount, currency = 'INR' } = await req.json();
        const order = await razorpay.orders.create({ amount, currency });
        return new Response(JSON.stringify(order));
    });
    ```
- [ ] Create `payments` table in Supabase:
    ```sql
    create table payments (
      id uuid default gen_random_uuid(),
      order_id text not null,
      payment_id text,
      status text default 'pending',
      amount integer not null,
      currency text default 'INR',
      creator_id uuid references profiles(id),
      freelancer_id uuid references profiles(id),
      job_id uuid references jobs(id),
      created_at timestamp with time zone default timezone('utc'::text, now()),
      primary key (id)
    );
    ```

---

## Phase 6: Advanced Features (Weeks 17-20)

### 6.1 Saved Items (Supabase)

- [ ] Replace localStorage saved jobs with `saved_jobs` table queries
- [ ] Create toggle save functionality using Supabase

### 6.2 Recently Viewed (Supabase)

- [ ] Create `recently_viewed` table or use Supabase Analytics
- [ ] Track views via Edge Functions

### 6.3 Analytics with Supabase

- [ ] Use Supabase Logging and Monitoring
- [ ] Create analytics views for dashboards

---

## Phase 7: Admin Panel (Weeks 21-23)

### 7.1 Admin Setup

- [ ] Create `is_admin` column on profiles table
- [ ] Build admin dashboard using Supabase data
- [ ] Use Supabase Studio for direct database management

---

## Phase 8: Mobile App with Supabase (Weeks 24-32)

### 8.1 Mobile Setup with Supabase

- [ ] Initialize Expo project in monorepo
- [ ] Install Supabase client for React Native:
    ```bash
    npx expo install @supabase/supabase-js @react-native-async-storage/async-storage
    ```
- [ ] Configure Supabase auth persistence with AsyncStorage
- [ ] Share database types between web and mobile

### 8.2 Mobile Auth

- [ ] Implement Supabase Auth in React Native
- [ ] Deep linking for OAuth callbacks
- [ ] Biometric auth using expo-local-authentication

---

## Phase 9-11: Testing, Deployment, Scaling

### Supabase-Specific Production Checklist

- [ ] Enable Point-in-Time Recovery (PITR) for database
- [ ] Set up Database backups
- [ ] Configure connection pooling (PgBouncer)
- [ ] Enable Supabase CDN for storage
- [ ] Set up custom domain in Supabase
- [ ] Configure rate limiting at edge
- [ ] Monitor using Supabase Dashboard Analytics

---

## Supabase Quick Reference

### Client Setup Pattern

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
```

### Server-Side Pattern

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createClient() {
    const cookieStore = cookies();
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                /* cookie handlers */
            },
        },
    );
}
```

### Mock → Supabase Migration

| Mock File             | Supabase Replacement                                   |
| --------------------- | ------------------------------------------------------ |
| `mock-auth.ts`        | Supabase Auth + profiles table                         |
| `profile-data.ts`     | profiles, creator_profiles, freelancer_profiles tables |
| `gig-data.ts`         | gigs table + RLS policies                              |
| `mock-jobs.ts`        | jobs table + views                                     |
| `job-applications.ts` | applications table + functions                         |
| `mock-messages.ts`    | conversations + messages tables + Realtime             |
| `saved-jobs.ts`       | saved_jobs table                                       |
| `recently-viewed.ts`  | recently_viewed table or Analytics                     |

---

## Technology Stack (Supabase-Centric)

| Layer              | Technology                             |
| ------------------ | -------------------------------------- |
| **Database**       | PostgreSQL (via Supabase)              |
| **Auth**           | Supabase Auth (GoTrue)                 |
| **Storage**        | Supabase Storage                       |
| **Real-time**      | Supabase Realtime                      |
| **Edge Functions** | Deno (Supabase Edge Functions)         |
| **Frontend**       | Next.js 16 + Tailwind + shadcn/ui      |
| **ORM**            | Supabase Client (postgrest-js)         |
| **Mobile**         | React Native + Expo + Supabase         |
| **Hosting**        | Vercel (frontend) + Supabase (backend) |
| **Payments**       | Razorpay (via Edge Functions)          |
| **Email**          | Resend (via Edge Functions)            |

---

## Supabase Resources

- **Dashboard:** https://app.supabase.com
- **Docs:** https://supabase.com/docs
- **Auth Helpers:** https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- **Realtime:** https://supabase.com/docs/guides/realtime
- **Storage:** https://supabase.com/docs/guides/storage
- **Edge Functions:** https://supabase.com/docs/guides/functions

---

> **Note:** This roadmap is optimized for Supabase. All database operations use PostgreSQL via Supabase client, auth uses Supabase Auth, file storage uses Supabase Storage, and real-time features use Supabase Realtime.
