"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Star,
  Clock,
  Wallet,
  ChevronDown,
  CheckCircle2,
  UserCheck,
  ExternalLink,
  XCircle,
} from "lucide-react";
import { getJobById, type Job } from "@/lib/mock-jobs";
import {
  getApplicationsForJob,
  shortlistApplication,
  rejectApplication,
  getShortlistedCount,
  type JobApplication,
} from "@/lib/job-applications";

type SortKey = "newest" | "price-low" | "price-high" | "rating";

const sortLabels: Record<SortKey, string> = {
  newest: "Newest First",
  "price-low": "Price: Low → High",
  "price-high": "Price: High → Low",
  rating: "Best Rating",
};

function sortApps(apps: JobApplication[], sort: SortKey): JobApplication[] {
  const copy = [...apps];
  switch (sort) {
    case "price-low": return copy.sort((a, b) => a.proposedPrice - b.proposedPrice);
    case "price-high": return copy.sort((a, b) => b.proposedPrice - a.proposedPrice);
    case "rating": return copy.sort((a, b) => b.freelancerRating - a.freelancerRating);
    default: return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export default function ApplicantDashboardClient() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<SortKey>("newest");
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    const found = getJobById(jobId);
    setJob(found);
    setApps(getApplicationsForJob(jobId));
    setLoading(false);
  }, [jobId]);

  const shortlistedCount = useMemo(() => getShortlistedCount(jobId), [apps, jobId]);

  const sorted = useMemo(() => sortApps(apps, sort), [apps, sort]);

  const refreshApps = () => {
    setApps(getApplicationsForJob(jobId));
  };

  const handleShortlist = (appId: string) => {
    if (shortlistedCount >= 3) return;
    shortlistApplication(appId);
    refreshApps();
  };

  const handleReject = (appId: string) => {
    rejectApplication(appId);
    refreshApps();
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
        <Link href="/dashboard" className="text-sm font-medium text-brand-indigo hover:underline">← Dashboard</Link>
      </div>
    );
  }

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
          <Link href="/dashboard" className="text-xs font-medium text-brand-gray hover:text-brand-dark">Dashboard</Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 lg:px-8">
        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-border/60 bg-white p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusColors[job.status] || statusColors.open}`}>
                  {job.status}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: job.categoryColor + "12", color: job.categoryColor }}
                >
                  {job.categoryLabel}
                </span>
              </div>
              <h1 className="text-lg font-bold text-brand-dark">{job.title}</h1>
              <p className="mt-1 text-xs text-brand-gray">{job.budget} · {job.timeline}</p>
            </div>
            <div className="flex items-center gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-brand-dark">{apps.length}</p>
                <p className="text-[10px] text-brand-gray">Applications</p>
              </div>
              <div className="h-8 w-px bg-border/40" />
              <div>
                <p className="text-2xl font-bold text-brand-indigo">{shortlistedCount}</p>
                <p className="text-[10px] text-brand-gray">Shortlisted</p>
              </div>
              <div className="h-8 w-px bg-border/40" />
              <div>
                <p className="text-2xl font-bold text-brand-coral">{job.maxApplications ?? 15}</p>
                <p className="text-[10px] text-brand-gray">Max Slots</p>
              </div>
            </div>
          </div>
          {shortlistedCount >= 3 && (
            <div className="mt-4 rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5 text-amber-600" />
              You&apos;ve shortlisted the maximum of 3 freelancers. Reject one to shortlist another.
            </div>
          )}
        </motion.div>

        {/* Toolbar */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-brand-gray">
            <span className="font-semibold text-brand-dark">{apps.length}</span> applicant{apps.length !== 1 ? "s" : ""}
          </p>
          <div className="relative">
            <button
              onClick={() => setShowSort(!showSort)}
              className="flex items-center gap-1.5 rounded-md border border-border/60 bg-white px-3 py-2 text-xs font-medium text-brand-dark transition-colors hover:border-border"
            >
              Sort: {sortLabels[sort]}
              <ChevronDown className="h-3 w-3 text-brand-gray" />
            </button>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-border/60 bg-white py-1 shadow-lg"
              >
                {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setSort(key); setShowSort(false); }}
                    className={`w-full px-3 py-2 text-left text-xs font-medium transition-colors ${
                      sort === key ? "bg-brand-surface text-brand-indigo" : "text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Applicant List */}
        <div className="flex flex-col gap-4">
          {sorted.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`rounded-lg border bg-white p-5 transition-all ${
                app.status === "shortlisted"
                  ? "border-brand-indigo/40 ring-1 ring-brand-indigo/10"
                  : app.status === "rejected"
                  ? "border-border/40 opacity-50"
                  : "border-border/60 hover:border-border"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar + Info */}
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${app.freelancerGradientFrom}, ${app.freelancerGradientTo})` }}
                  >
                    {app.freelancerAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-brand-dark">{app.freelancerName}</p>
                      {app.status === "shortlisted" && (
                        <span className="rounded-full bg-brand-indigo/10 px-2 py-0.5 text-[9px] font-bold text-brand-indigo">Shortlisted</span>
                      )}
                      {app.status === "rejected" && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-bold text-gray-500">Rejected</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-brand-gray mb-2">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-2.5 w-2.5 text-amber-400" /> {app.freelancerRating}
                      </span>
                      <span>@{app.freelancerUsername}</span>
                      <span>#{app.position}</span>
                    </div>
                    {/* Pitch */}
                    <p className="text-xs leading-relaxed text-brand-gray line-clamp-2">{app.pitch}</p>
                  </div>
                </div>

                {/* Price + Actions */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 flex-shrink-0">
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-sm font-bold text-brand-dark">
                      <Wallet className="h-3.5 w-3.5 text-brand-gray" /> ₹{app.proposedPrice.toLocaleString()}
                    </p>
                    <p className="flex items-center gap-1 text-[10px] text-brand-gray">
                      <Clock className="h-2.5 w-2.5" /> {app.deliveryDays} days
                    </p>
                  </div>

                  {app.portfolioSampleUrl && (
                    <a
                      href={app.portfolioSampleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-medium text-brand-indigo hover:underline"
                    >
                      <ExternalLink className="h-2.5 w-2.5" /> Portfolio
                    </a>
                  )}

                  {/* Action Buttons */}
                  {app.status === "submitted" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleShortlist(app.id)}
                        disabled={shortlistedCount >= 3}
                        className="flex items-center gap-1 rounded-md bg-brand-indigo px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-brand-indigo/90 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <UserCheck className="h-3 w-3" /> Shortlist
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="flex items-center gap-1 rounded-md border border-border/60 bg-white px-3 py-1.5 text-[11px] font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                      >
                        <XCircle className="h-3 w-3" /> Pass
                      </button>
                    </div>
                  )}
                  {app.status === "shortlisted" && (
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex items-center gap-1 rounded-md border border-border/60 bg-white px-3 py-1.5 text-[11px] font-medium text-brand-gray transition-colors hover:bg-brand-surface"
                    >
                      <XCircle className="h-3 w-3" /> Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Question for creator */}
              {app.questionForCreator && (
                <div className="mt-3 rounded-md bg-brand-surface/50 border border-border/40 p-3 text-xs text-brand-gray">
                  <span className="font-semibold text-brand-dark">Question: </span>
                  {app.questionForCreator}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {apps.length === 0 && (
          <div className="rounded-lg border border-border/60 bg-white py-16 text-center mt-5">
            <Users className="mx-auto mb-3 h-8 w-8 text-brand-gray-light" />
            <p className="text-lg font-semibold text-brand-dark">No applications yet</p>
            <p className="mt-1 text-sm text-brand-gray">Applications will appear here once freelancers start bidding.</p>
          </div>
        )}
      </div>
    </div>
  );
}
