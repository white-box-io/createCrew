"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, Search } from "lucide-react";
import { getSavedJobIds } from "@/lib/saved-jobs";
import { getJobById, type Job } from "@/lib/mock-jobs";
import JobCard from "@/components/find-work/job-card";
import { useAuth } from "@/lib/auth-context";

export default function SavedJobsPage() {
  const { user } = useAuth();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) return;
    
    // Fetch saved job IDs from localStorage via utility
    const ids = getSavedJobIds(user.username);
    const jobs = ids.map((id) => getJobById(id)).filter(Boolean) as Job[];
    setSavedJobs(jobs);
  }, [user]);

  if (!isClient) {
    return null; // Prevents hydration mismatch
  }

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#111827] sm:text-3xl">Saved Jobs</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Jobs you've kept an eye on to apply for later.
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-6 py-24 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8F5]">
            <Bookmark className="h-8 w-8 text-[#F26522]" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-[#111827]">No jobs saved yet</h2>
          <p className="mb-6 max-w-sm text-sm text-[#6B7280]">
            Keep track of interesting opportunities by bookmarking them on the job board.
          </p>
          <Link
            href="/find-work"
            className="flex items-center gap-2 rounded-xl bg-[#F26522] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4551A] hover:shadow"
          >
            <Search className="h-4 w-4" />
            Browse Find Work
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
