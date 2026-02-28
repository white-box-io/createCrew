"use client";

import { motion } from "framer-motion";
import { Wallet, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreatorJob {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  budget: string;
  timeline: string;
  description: string;
  postedAgo: string;
}

export default function CreatorJobs({ jobs }: { jobs: CreatorJob[] }) {
  if (jobs.length === 0) {
    return (
      <div className="rounded-lg border border-border/60 bg-brand-surface p-10 text-center">
        <p className="text-sm text-brand-gray">No active jobs right now. Check back later!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="group rounded-lg border border-border/60 bg-white p-5 transition-all hover:border-brand-indigo/30 hover:shadow-sm"
        >
          <div className="mb-2 flex items-start justify-between">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
              style={{ backgroundColor: job.categoryColor + "12", color: job.categoryColor }}
            >
              {job.category}
            </span>
            <span className="text-[10px] text-brand-gray-light">{job.postedAgo}</span>
          </div>

          <h3 className="mb-1.5 text-sm font-bold text-brand-dark">{job.title}</h3>
          <p className="mb-4 text-xs leading-relaxed text-brand-gray">{job.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-brand-gray">
              <span className="flex items-center gap-1">
                <Wallet className="h-3 w-3" />
                {job.budget}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {job.timeline}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-brand-indigo text-white hover:bg-brand-indigo/90 rounded-md px-4 text-xs font-semibold opacity-0 transition-opacity group-hover:opacity-100"
            >
              Apply
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
