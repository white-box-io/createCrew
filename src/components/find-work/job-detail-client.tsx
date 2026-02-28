"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Wallet,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  FileEdit,
  Bookmark,
  ArrowRight,
  Shield,
  UserPlus,
} from "lucide-react";
import { getJobById, type Job } from "@/lib/mock-jobs";
import { hasApplied } from "@/lib/job-applications";
import { categories } from "@/lib/categories-data";
import { useAuth } from "@/lib/auth-context";
import { isJobSaved, toggleSaveJob } from "@/lib/saved-jobs";

function getTimeRemaining(createdAt: string, deadlineHours: number): string {
  const created = new Date(createdAt).getTime();
  const deadline = created + deadlineHours * 60 * 60 * 1000;
  const now = Date.now();
  const remaining = deadline - now;
  if (remaining <= 0) return "Closed";
  const hours = Math.floor(remaining / (60 * 60 * 1000));
  if (hours >= 24) return `${Math.floor(hours / 24)}d ${hours % 24}h left`;
  return `${hours}h left`;
}

function getSubcategoryTitle(categorySlug: string, subcategorySlug?: string): string | null {
  if (!subcategorySlug) return null;
  const cat = categories.find((c) => c.slug === categorySlug);
  return cat?.subcategories.find((s) => s.slug === subcategorySlug)?.title ?? null;
}

export default function JobDetailClient() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const jobId = params.jobId as string;

  useEffect(() => {
    const found = getJobById(jobId);
    setJob(found);
    setLoading(false);
    if (found && user) {
      setAlreadyApplied(hasApplied(found.id, user.username));
      setSaved(isJobSaved(user.username, found.id));
    }
  }, [jobId, user]);

  const handleToggleSave = () => {
    if (!job || !user) return;
    const nowSaved = toggleSaveJob(user.username, job.id);
    setSaved(nowSaved);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-brand-dark">Job not found</p>
        <Link href="/find-work" className="text-sm font-medium text-brand-indigo hover:underline">
          ← Back to Find Work
        </Link>
      </div>
    );
  }

  const appCount = job.currentApplications ?? 0;
  const maxApps = job.maxApplications ?? 15;
  const appPct = Math.min((appCount / maxApps) * 100, 100);
  const timeLeft = getTimeRemaining(job.createdAt, job.applicationDeadlineHours ?? 48);
  const isClosed = job.status !== "open" || timeLeft === "Closed" || appCount >= maxApps;
  const subcategoryTitle = getSubcategoryTitle(job.categorySlug, job.subcategorySlug);
  const reqs = job.applicationRequirements;

  const statusColors: Record<string, string> = {
    open: "bg-emerald-100 text-emerald-700",
    reviewing: "bg-amber-100 text-amber-700",
    "in-progress": "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-brand-surface/30">
      {/* Top Bar */}
      <div className="border-b border-border/40 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-5 py-3 lg:px-8">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
          <span className="text-border">|</span>
          <Link href="/find-work" className="text-xs font-medium text-brand-gray hover:text-brand-dark">Find Work</Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1"
          >
            {/* Header Card */}
            <div className="rounded-lg border border-border/60 bg-white p-6 lg:p-8">
              {/* Status + Category Row */}
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusColors[job.status] || statusColors.open}`}>
                  {job.status}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: job.categoryColor + "12", color: job.categoryColor }}
                >
                  {job.categoryLabel}
                </span>
                {subcategoryTitle && (
                  <span className="rounded-full border border-border/60 bg-brand-surface px-2.5 py-0.5 text-[10px] font-medium text-brand-gray">
                    {subcategoryTitle}
                  </span>
                )}
                {reqs?.testSample && (
                  <span className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                    <FileEdit className="h-2.5 w-2.5" /> Test Required
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-brand-dark leading-snug lg:text-2xl">{job.title}</h1>

              {/* Meta Row */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-brand-gray">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Posted {job.postedAgo}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> {job.timeline}
                </span>
                <span className="flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5" />
                  <span className="font-semibold text-brand-dark">{job.budget}</span>
                  <span className="text-brand-gray-light">({job.budgetType})</span>
                </span>
              </div>

              {/* Applicant Progress */}
              <div className="mt-5 flex items-center gap-3 rounded-lg border border-border/40 bg-brand-surface/50 p-3">
                <Users className="h-4 w-4 text-brand-indigo" />
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-brand-dark">{appCount}/{maxApps} applied</span>
                    <span className={`font-medium ${isClosed ? "text-brand-coral" : "text-brand-gray"}`}>{isClosed ? "Closed" : timeLeft}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-border/40">
                    <div
                      className={`h-full rounded-full transition-all ${appCount >= maxApps ? "bg-brand-coral" : "bg-brand-indigo"}`}
                      style={{ width: `${appPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Sections */}
            <div className="mt-5 rounded-lg border border-border/60 bg-white p-6 lg:p-8 space-y-6">
              <div>
                <h2 className="text-sm font-bold text-brand-dark mb-2">What They Need</h2>
                <p className="text-sm leading-relaxed text-brand-gray">{job.guidedDescription?.whatNeeded || job.description}</p>
              </div>

              {job.guidedDescription?.styleReference && (
                <div>
                  <h2 className="text-sm font-bold text-brand-dark mb-2">Style & Reference</h2>
                  <p className="text-sm leading-relaxed text-brand-gray">{job.guidedDescription.styleReference}</p>
                </div>
              )}

              {job.guidedDescription?.specificRequirements && (
                <div>
                  <h2 className="text-sm font-bold text-brand-dark mb-2">Specific Requirements</h2>
                  <p className="text-sm leading-relaxed text-brand-gray">{job.guidedDescription.specificRequirements}</p>
                </div>
              )}
            </div>

            {/* Application Requirements */}
            {reqs && (
              <div className="mt-5 rounded-lg border border-border/60 bg-white p-6 lg:p-8">
                <h2 className="text-sm font-bold text-brand-dark mb-3">What You Need to Submit</h2>
                <div className="flex flex-col gap-2">
                  {reqs.proposedPrice && (
                    <div className="flex items-center gap-2 text-xs text-brand-gray">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Your proposed price
                    </div>
                  )}
                  {reqs.portfolioSample && (
                    <div className="flex items-center gap-2 text-xs text-brand-gray">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> One relevant portfolio sample
                    </div>
                  )}
                  {reqs.deliveryTime && (
                    <div className="flex items-center gap-2 text-xs text-brand-gray">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Estimated delivery time
                    </div>
                  )}
                  {reqs.shortNote && (
                    <div className="flex items-center gap-2 text-xs text-brand-gray">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> A short note (why you&apos;re right for this)
                    </div>
                  )}
                  {reqs.testSample && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                      <FileEdit className="h-3.5 w-3.5 text-amber-600" /> A test sample for this specific job
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Deadline Warning */}
            {!isClosed && (
              <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                <p className="text-xs text-amber-800">
                  Applications close when <span className="font-bold">{maxApps} bids</span> are received or after <span className="font-bold">{job.applicationDeadlineHours ?? 48} hours</span> — whichever comes first.
                </p>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="w-full lg:w-80 flex-shrink-0 space-y-5"
          >
            {/* Apply / Applied Card */}
            <div className="rounded-lg border border-border/60 bg-white p-5">
              {alreadyApplied ? (
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-brand-dark">You&apos;ve Applied!</p>
                  <p className="mt-1 text-[10px] text-brand-gray">Your application has been submitted.</p>
                </div>
              ) : isClosed ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-gray">Applications Closed</p>
                  <p className="mt-1 text-[10px] text-brand-gray">This job is no longer accepting applications.</p>
                </div>
              ) : !user ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-brand-dark">Sign in to apply</p>
                  <Link href="/signin" className="mt-2 flex w-full items-center justify-center gap-2 rounded-md bg-brand-indigo px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90">
                    Sign In <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : !user.freelancerMode ? (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                      <UserPlus className="h-4 w-4 text-amber-600" />
                    </div>
                    <p className="text-xs font-bold text-brand-dark">Freelancer Account Required</p>
                  </div>
                  <p className="text-[11px] leading-relaxed text-brand-gray mb-4">
                    Your account is set up for content creation only. Enable the <span className="font-semibold text-brand-dark">Crew (Freelancer)</span> feature to start applying for jobs.
                  </p>
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark"
                  >
                    Enable Freelancer Mode <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href={`/find-work/${job.id}/apply`}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-coral px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark"
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleToggleSave}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-md border px-6 py-2.5 text-xs font-semibold transition-colors ${
                      saved
                        ? "border-brand-indigo/40 bg-brand-indigo/5 text-brand-indigo"
                        : "border-border/60 bg-white text-brand-dark hover:bg-brand-surface"
                    }`}
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${saved ? "fill-current" : ""}`} />
                    {saved ? "Saved ✓" : "Save Job"}
                  </button>
                </>
              )}
            </div>

            {/* Creator Card */}
            <div className="rounded-lg border border-border/60 bg-white p-5">
              <h3 className="mb-3 text-xs font-bold text-brand-dark uppercase tracking-wider">Posted By</h3>
              <Link
                href={`/profile/@${job.creator.username}`}
                className="flex items-center gap-3 rounded-lg border border-border/40 bg-brand-surface/50 p-3 transition-colors hover:border-border"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${job.creator.gradientFrom}, ${job.creator.gradientTo})` }}
                >
                  {job.creator.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-dark">{job.creator.name}</p>
                  <p className="text-[10px] text-brand-gray">{job.creator.subscribers} subscribers</p>
                </div>
              </Link>
            </div>

            {/* Safety Badge */}
            <div className="rounded-lg border border-border/60 bg-white p-5">
              <div className="flex items-center gap-2 text-brand-dark mb-2">
                <Shield className="h-4 w-4 text-brand-indigo" />
                <h3 className="text-xs font-bold">CreateCrew Protection</h3>
              </div>
              <ul className="space-y-1.5 text-[10px] text-brand-gray">
                <li>• Verified creator profiles</li>
                <li>• Shortlist before committing</li>
                <li>• Secure in-platform communication</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
