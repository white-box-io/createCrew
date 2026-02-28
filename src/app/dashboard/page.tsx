"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase, Plus, Search, FileText, Users, Eye,
  ArrowRight, Bookmark, Monitor, Pencil,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import GetStartedChecklist from "@/components/dashboard/get-started-checklist";
import { getSavedJobIds } from "@/lib/saved-jobs";
import { getJobById, type Job } from "@/lib/mock-jobs";

/* ── Dummy data ── */

const DUMMY_MY_JOBS = [
  { id: 1, title: "Reels Editor for Instagram", applicants: 12, status: "Open", daysAgo: 2 },
  { id: 2, title: "Thumbnail Designer – YouTube", applicants: 8, status: "Open", daysAgo: 5 },
  { id: 3, title: "Scriptwriter for Podcast", applicants: 3, status: "Closed", daysAgo: 14 },
];

const DUMMY_MY_GIGS = [
  { id: 1, title: "Professional Reels Editing", views: 340, orders: 5, price: "₹2,000" },
  { id: 2, title: "YouTube Shorts Batch Edit", views: 120, orders: 2, price: "₹3,500" },
];

const DUMMY_APPLICATIONS = [
  { id: 1, jobTitle: "Video Editor – Travel Vlogs", creator: "@wanderlust_india", status: "Under Review", appliedAgo: "3 days ago" },
  { id: 2, jobTitle: "Motion Graphics for YT Intro", creator: "@techburner", status: "Shortlisted", appliedAgo: "1 week ago" },
  { id: 3, jobTitle: "Podcast Audio Editor", creator: "@craftclips", status: "Rejected", appliedAgo: "2 weeks ago" },
];

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const viewParam = searchParams.get("view") as "creator" | "freelancer" | null;
  const [activeView, setActiveView] = useState<"creator" | "freelancer">(viewParam || "creator");
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);

  // Protected route
  if (!isLoading && !user) {
    router.push("/signin");
    return null;
  }

  if (!isLoading && user && !user.rolesSelected) {
    router.push("/onboarding");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  const isDual = user.creatorMode && user.freelancerMode;
  const showCreator = isDual ? activeView === "creator" : user.creatorMode;

  // Sync view with URL param
  useEffect(() => {
    if (viewParam && (viewParam === "creator" || viewParam === "freelancer")) {
      setActiveView(viewParam);
    }
  }, [viewParam]);

  // Load saved jobs for freelancer view
  useEffect(() => {
    if (user) {
      const ids = getSavedJobIds(user.username);
      const jobs = ids.map(getJobById).filter(Boolean) as Job[];
      setSavedJobs(jobs);
    }
  }, [user, activeView]);
  const showFreelancer = isDual ? activeView === "freelancer" : user.freelancerMode;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-brand-surface py-8">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo})` }}
            >
              {user.avatar}
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-dark">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="text-xs text-brand-gray">@{user.username} · Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Get Started Checklist */}
        {user.onboardingComplete && (
          <GetStartedChecklist user={user} />
        )}

        {/* Creator View */}
        {showCreator && (
          <motion.div
            key="creator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/post-job"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-coral/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-coral/10">
                  <Plus className="h-4 w-4 text-brand-coral" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Post a Job</p>
                  <p className="text-[10px] text-brand-gray">Find your next crew member</p>
                </div>
              </Link>
              <Link
                href="/find-crews"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-indigo/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <Users className="h-4 w-4 text-brand-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Browse Crew</p>
                  <p className="text-[10px] text-brand-gray">Search freelancers by skill</p>
                </div>
              </Link>
              <Link
                href={`/profile/@${user.username}`}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-coral/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-coral/10">
                  <Eye className="h-4 w-4 text-brand-coral" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">View My Profile</p>
                  <p className="text-[10px] text-brand-gray">See how creators find you</p>
                </div>
              </Link>
              <Link
                href="/dashboard/edit-profile/creator"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-coral/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-coral/10">
                  <Monitor className="h-4 w-4 text-brand-coral" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Edit Creator Profile</p>
                  <p className="text-[10px] text-brand-gray">Update your channel details</p>
                </div>
              </Link>
            </div>

            {/* My Jobs */}
            <div className="rounded-lg border border-border/60 bg-white">
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-coral" />
                  My Posted Jobs
                </h2>
                <Link href="/post-job" className="text-[11px] font-semibold text-brand-coral hover:text-brand-coral-dark flex items-center gap-0.5">
                  Post New <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-border/40">
                {DUMMY_MY_JOBS.map((job) => (
                  <div key={job.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{job.title}</p>
                      <p className="text-[10px] text-brand-gray">{job.applicants} applicants · Posted {job.daysAgo}d ago</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      job.status === "Open" ? "bg-green-50 text-green-600" : "bg-gray-100 text-brand-gray"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Freelancer View */}
        {showFreelancer && (
          <motion.div
            key="freelancer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/find-work"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-indigo/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <Search className="h-4 w-4 text-brand-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Find Work</p>
                  <p className="text-[10px] text-brand-gray">Browse jobs from top creators</p>
                </div>
              </Link>
              <Link
                href="/gigs/new"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-indigo/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <Plus className="h-4 w-4 text-brand-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Create Gig</p>
                  <p className="text-[10px] text-brand-gray">Show off your best work!</p>
                </div>
              </Link>
              <Link
                href={`/profile/@${user.username}`}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-indigo/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <FileText className="h-4 w-4 text-brand-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">View My Portfolio</p>
                  <p className="text-[10px] text-brand-gray">See your freelancer profile</p>
                </div>
              </Link>
              <Link
                href="/dashboard/edit-profile/freelancer"
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4 transition-colors hover:border-brand-indigo/30"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-indigo/10">
                  <Pencil className="h-4 w-4 text-brand-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">Edit Freelancer Profile</p>
                  <p className="text-[10px] text-brand-gray">Update your skills & rates</p>
                </div>
              </Link>
            </div>

            {/* My Gigs */}
            <div className="rounded-lg border border-border/60 bg-white">
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-indigo" />
                  My Gigs
                </h2>
              </div>
              <div className="divide-y divide-border/40">
                {DUMMY_MY_GIGS.map((gig) => (
                  <div key={gig.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{gig.title}</p>
                      <p className="text-[10px] text-brand-gray">{gig.views} views · {gig.orders} orders</p>
                    </div>
                    <span className="text-xs font-semibold text-brand-dark">{gig.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications */}
            <div className="rounded-lg border border-border/60 bg-white">
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-indigo" />
                  My Applications
                </h2>
                <Link href="/find-work" className="text-[11px] font-semibold text-brand-indigo hover:text-brand-indigo/80 flex items-center gap-0.5">
                  Browse Jobs <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="divide-y divide-border/40">
                {DUMMY_APPLICATIONS.map((app) => (
                  <div key={app.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-brand-dark">{app.jobTitle}</p>
                      <p className="text-[10px] text-brand-gray">by {app.creator} · {app.appliedAgo}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      app.status === "Shortlisted" ? "bg-green-50 text-green-600" :
                      app.status === "Rejected" ? "bg-red-50 text-red-500" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Jobs */}
            <div className="rounded-lg border border-border/60 bg-white">
              <div className="flex items-center justify-between border-b border-border/40 px-5 py-3.5">
                <h2 className="text-sm font-bold text-brand-dark flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-brand-coral" />
                  My Saved Jobs
                </h2>
                <Link href="/find-work" className="text-[11px] font-semibold text-brand-indigo hover:text-brand-indigo/80 flex items-center gap-0.5">
                  Find Work <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {savedJobs.length === 0 ? (
                <div className="px-5 py-6 text-center">
                  <Bookmark className="mx-auto mb-2 h-5 w-5 text-brand-gray-light" />
                  <p className="text-xs text-brand-gray">No saved jobs yet. Browse jobs and save the ones you like!</p>
                </div>
              ) : (
                <div className="divide-y divide-border/40">
                  {savedJobs.map((job) => (
                    <Link key={job.id} href={`/find-work/${job.id}`} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-brand-surface/30">
                      <div>
                        <p className="text-sm font-medium text-brand-dark">{job.title}</p>
                        <p className="text-[10px] text-brand-gray">by {job.creator.name} · {job.budget}</p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                        job.status === "open" ? "bg-green-50 text-green-600" : "bg-gray-100 text-brand-gray"
                      }`}>
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
