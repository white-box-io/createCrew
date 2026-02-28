"use client";

import { motion } from "framer-motion";
import { Briefcase, Search, Plus, ArrowRight } from "lucide-react";

interface Props {
  intent: string;
  onFinish: (redirectTo: string) => void;
}

export default function StepAction({ intent, onFinish }: Props) {
  const isFreelancer = intent === "freelancer";
  const isCreator = intent === "creator";

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-4xl">{isFreelancer ? "🚀" : isCreator ? "🎬" : "✨"}</span>

        <h1 className="mt-4 text-xl font-bold text-brand-dark sm:text-2xl">
          {isFreelancer
            ? "One last thing — let's set up your first gig"
            : isCreator
            ? "Tell us what you need help with"
            : "You're all set! What would you like to do first?"}
        </h1>
        <p className="mt-1.5 text-sm text-brand-gray">
          {isFreelancer
            ? "It takes 2 minutes and gets you discovered immediately."
            : isCreator
            ? "We'll match you with the right crew."
            : "Jump right in — your dashboard is ready."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
        className="mx-auto mt-6 max-w-sm space-y-3"
      >
        {isFreelancer && (
          <>
            <button
              onClick={() => onFinish("/gigs/new")}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-indigo py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90"
            >
              <Plus className="h-4 w-4" />
              Create My First Gig
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFinish("/dashboard")}
              className="text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
            >
              Skip for now (you can do this from your dashboard)
            </button>
          </>
        )}

        {isCreator && (
          <>
            <button
              onClick={() => onFinish("/post-job")}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-coral py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark"
            >
              <Briefcase className="h-4 w-4" />
              Post My First Job
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onFinish("/find-crews")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-white py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-surface"
            >
              <Search className="h-4 w-4" />
              Browse Crew First
            </button>
          </>
        )}

        {(intent === "both" || intent === "exploring") && (
          <>
            <button
              onClick={() => onFinish("/gigs/new")}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-indigo py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90"
            >
              <Plus className="h-4 w-4" />
              Create a Gig
            </button>
            <button
              onClick={() => onFinish("/post-job")}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-white py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-surface"
            >
              <Briefcase className="h-4 w-4" />
              Post a Job
            </button>
            <button
              onClick={() => onFinish("/dashboard")}
              className="text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
            >
              Just take me to the dashboard →
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
