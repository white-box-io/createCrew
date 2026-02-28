"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  Clock,
  FileText,
  Link2,
  MessageSquare,
  CheckCircle2,
  Target,
  Search,
  UserPlus,
} from "lucide-react";
import { getJobById, type Job } from "@/lib/mock-jobs";
import { submitApplication, hasApplied } from "@/lib/job-applications";
import { useAuth } from "@/lib/auth-context";

const TOTAL_STEPS = 3;

export default function ApplyClient() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const jobId = params.jobId as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedPosition, setSubmittedPosition] = useState(0);

  // Screen 1 — Your Bid
  const [proposedPrice, setProposedPrice] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");

  // Screen 2 — Your Pitch
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [pitch, setPitch] = useState("");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    const found = getJobById(jobId);
    setJob(found);
    setLoading(false);
    if (found && user) {
      setAlreadyApplied(hasApplied(found.id, user.username));
    }
  }, [jobId, user]);

  const canProceedStep1 = proposedPrice && deliveryDays;
  const canProceedStep2 = pitch.trim().length > 0;

  const handleSubmit = () => {
    if (!job || !user) return;
    setSubmitting(true);

    const result = submitApplication({
      jobId: job.id,
      freelancerId: user.username,
      freelancerName: user.name,
      freelancerUsername: user.username,
      freelancerAvatar: user.avatar,
      freelancerGradientFrom: user.gradientFrom,
      freelancerGradientTo: user.gradientTo,
      freelancerRating: 4.5,
      proposedPrice: parseInt(proposedPrice, 10),
      deliveryDays: parseInt(deliveryDays, 10),
      portfolioSampleUrl: portfolioUrl,
      pitch: pitch.trim(),
      questionForCreator: question.trim() || undefined,
    });

    setSubmittedPosition(result.position);

    setTimeout(() => {
      setSubmitting(false);
      setStep(3);
    }, 400);
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
        <Link href="/find-work" className="text-sm font-medium text-brand-indigo hover:underline">← Back to Find Work</Link>
      </div>
    );
  }

  if (alreadyApplied && step !== 3) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="text-lg font-semibold text-brand-dark">You&apos;ve already applied</p>
        <Link href={`/find-work/${job.id}`} className="text-sm font-medium text-brand-indigo hover:underline">← Back to Job</Link>
      </div>
    );
  }

  // Guard: creator-only accounts can't apply
  if (user && !user.freelancerMode) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <UserPlus className="h-8 w-8 text-amber-600" />
        </div>
        <h2 className="text-lg font-bold text-brand-dark">Freelancer Account Required</h2>
        <p className="max-w-md text-center text-sm text-brand-gray">
          Your account is set up for content creation only. Enable the <span className="font-semibold text-brand-dark">Crew (Freelancer)</span> feature to start applying for jobs.
        </p>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark"
        >
          Enable Freelancer Mode <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href={`/find-work/${job.id}`} className="text-xs font-medium text-brand-gray hover:text-brand-dark">
          ← Back to Job
        </Link>
      </div>
    );
  }

  const appCount = job.currentApplications ?? 0;
  const maxApps = job.maxApplications ?? 15;

  const inputClass = "w-full rounded-md border border-border/60 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/20";

  return (
    <div className="min-h-screen bg-brand-surface/30">
      {/* Top Bar */}
      <div className="border-b border-border/40 bg-white">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-5 py-3">
          {step < 3 ? (
            <button onClick={() => step === 1 ? router.back() : setStep(1)} className="flex items-center gap-1.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> {step === 1 ? "Back to Job" : "Back"}
            </button>
          ) : (
            <span className="text-xs text-brand-gray">Application Submitted</span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-8">
        {/* Job Summary Bar */}
        {step < 3 && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-border/60 bg-white p-4">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${job.creator.gradientFrom}, ${job.creator.gradientTo})` }}
            >
              {job.creator.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-brand-dark truncate">{job.title}</p>
              <p className="text-[10px] text-brand-gray">{job.creator.name} · {job.budget}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-semibold text-brand-dark">{appCount}/{maxApps}</p>
              <p className="text-[9px] text-brand-gray">applied</p>
            </div>
          </div>
        )}

        {/* Step Progress */}
        {step < 3 && (
          <div className="mb-6 flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                  s <= step ? "bg-brand-coral text-white" : "bg-border/40 text-brand-gray"
                }`}>
                  {s < step ? <CheckCircle2 className="h-3.5 w-3.5" /> : s}
                </div>
                <span className={`text-xs font-medium ${s <= step ? "text-brand-dark" : "text-brand-gray"}`}>
                  {s === 1 ? "Your Bid" : "Your Pitch"}
                </span>
                {s === 1 && <div className={`flex-1 h-0.5 rounded ${step > 1 ? "bg-brand-coral" : "bg-border/40"}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ── SCREEN 1: Your Bid ── */}
            {step === 1 && (
              <div className="rounded-lg border border-border/60 bg-white p-6 lg:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-brand-dark">Your Bid</h2>
                  <p className="mt-1 text-xs text-brand-gray">Set your price and timeline for this job.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    <Wallet className="mr-1 -mt-0.5 inline h-3.5 w-3.5" />
                    Proposed Price (₹) <span className="text-brand-coral">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray">₹</span>
                    <input
                      type="number"
                      value={proposedPrice}
                      onChange={(e) => setProposedPrice(e.target.value)}
                      placeholder="e.g., 1500"
                      className={`${inputClass} pl-7`}
                    />
                  </div>
                  {job.budgetMin && job.budgetMax && (
                    <p className="mt-1.5 text-[10px] text-brand-gray">
                      💡 Creator&apos;s range: <span className="font-semibold text-brand-dark">₹{job.budgetMin.toLocaleString()} – ₹{job.budgetMax.toLocaleString()}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    <Clock className="mr-1 -mt-0.5 inline h-3.5 w-3.5" />
                    Delivery Time (days) <span className="text-brand-coral">*</span>
                  </label>
                  <input
                    type="number"
                    value={deliveryDays}
                    onChange={(e) => setDeliveryDays(e.target.value)}
                    placeholder="e.g., 3"
                    className={inputClass}
                    min="1"
                  />
                </div>
              </div>
            )}

            {/* ── SCREEN 2: Your Pitch ── */}
            {step === 2 && (
              <div className="rounded-lg border border-border/60 bg-white p-6 lg:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-brand-dark">Your Pitch</h2>
                  <p className="mt-1 text-xs text-brand-gray">Tell the creator why you&apos;re right for this job.</p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    <Link2 className="mr-1 -mt-0.5 inline h-3.5 w-3.5" />
                    Portfolio Sample (URL)
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://your-portfolio.com/sample"
                    className={inputClass}
                  />
                  <p className="mt-1 text-[10px] text-brand-gray">Link to a relevant work sample — YouTube video, Behance, Google Drive, etc.</p>
                </div>

                <div>
                  <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-brand-dark">
                    <span>
                      <FileText className="mr-1 -mt-0.5 inline h-3.5 w-3.5" />
                      Why You&apos;re Right for This <span className="text-brand-coral">*</span>
                    </span>
                    <span className={`font-normal ${pitch.length > 300 ? "text-brand-coral" : "text-brand-gray"}`}>
                      {pitch.length}/300
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value.slice(0, 300))}
                    placeholder="Be specific — mention relevant experience, tools, or past projects."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    <MessageSquare className="mr-1 -mt-0.5 inline h-3.5 w-3.5" />
                    Questions for the Creator <span className="text-[10px] font-normal text-brand-gray">(optional)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., Do you have raw footage already, or do I need to shoot?"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            )}

            {/* ── SCREEN 3: Confirmation ── */}
            {step === 3 && (
              <div className="rounded-lg border border-border/60 bg-white p-8 lg:p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
                >
                  <Target className="h-8 w-8 text-emerald-600" />
                </motion.div>

                <h2 className="text-xl font-bold text-brand-dark">Application Submitted!</h2>
                <p className="mt-2 text-sm text-brand-gray">
                  You&apos;re applicant <span className="font-bold text-brand-dark">#{submittedPosition}</span> of <span className="font-bold text-brand-dark">{maxApps}</span>
                </p>

                <div className="mt-6 rounded-lg border border-border/40 bg-brand-surface/50 p-4 text-left">
                  <p className="text-xs font-semibold text-brand-dark mb-2">Your Bid Summary</p>
                  <div className="flex flex-col gap-1.5 text-xs text-brand-gray">
                    <div className="flex justify-between">
                      <span>Proposed Price</span>
                      <span className="font-semibold text-brand-dark">₹{parseInt(proposedPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Time</span>
                      <span className="font-semibold text-brand-dark">{deliveryDays} days</span>
                    </div>
                    {portfolioUrl && (
                      <div className="flex justify-between">
                        <span>Portfolio</span>
                        <span className="font-semibold text-brand-indigo truncate max-w-[180px]">{portfolioUrl}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href={`/find-work/${job.id}`}
                    className="flex items-center justify-center gap-2 rounded-md border border-border/60 bg-white px-6 py-2.5 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-surface"
                  >
                    <CheckCircle2 className="h-4 w-4" /> View Application
                  </Link>
                  <Link
                    href="/find-work"
                    className="flex items-center justify-center gap-2 rounded-md bg-brand-indigo px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-indigo/90"
                  >
                    <Search className="h-4 w-4" /> Find More Jobs
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < 3 && (
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => step === 1 ? router.back() : setStep(1)}
              className="flex items-center gap-1.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {step === 1 ? "Cancel" : "Back"}
            </button>

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                disabled={!canProceedStep1}
                className="flex items-center gap-2 rounded-md bg-brand-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceedStep2 || submitting}
                className="flex items-center gap-2 rounded-md bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Application"} <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
