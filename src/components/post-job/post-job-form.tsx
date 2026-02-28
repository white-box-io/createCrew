"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Info } from "lucide-react";
import { categories } from "@/lib/categories-data";
import { useAuth } from "@/lib/auth-context";
import {
  saveJob,
  type Job,
  type BudgetModel,
  type VisibilitySetting,
  type ApplicationRequirements,
  type GuidedDescription,
} from "@/lib/mock-jobs";

const TIMELINE_OPTIONS = ["ASAP", "1 Day", "3 Days", "5 Days", "Within a Week", "Within 2 Weeks", "Within a Month", "Ongoing", "Flexible"];

const SUGGESTED_RANGES: Record<string, string> = {
  "short-form-content": "₹500 – ₹2,000",
  "long-form-podcast-production": "₹3,000 – ₹10,000",
  "thumbnail-visual-design": "₹300 – ₹1,500",
  "scriptwriting-content-strategy": "₹1,000 – ₹5,000",
  "ai-video-animation": "₹2,000 – ₹6,000",
  "gaming-content-creation": "₹1,500 – ₹5,000",
  "ugc-influencer-content": "₹3,000 – ₹10,000",
  "growth-seo-analytics": "₹4,000 – ₹12,000",
  "brand-channel-design": "₹2,000 – ₹8,000",
  "voiceover-audio-services": "₹800 – ₹3,000",
};

const TOTAL_STEPS = 4;

export default function PostJobForm() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 — Job Basics
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [timeline, setTimeline] = useState("Within a Week");
  const [guided, setGuided] = useState<GuidedDescription>({
    whatNeeded: "", styleReference: "", specificRequirements: "",
  });

  // Step 2 — Budget
  const [budgetModel, setBudgetModel] = useState<BudgetModel>("range");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  // Step 3 — Visibility
  const [visibility, setVisibility] = useState<VisibilitySetting>("public");

  // Step 4 — Application Requirements
  const [appReqs, setAppReqs] = useState<ApplicationRequirements>({
    proposedPrice: true,
    portfolioSample: true,
    deliveryTime: true,
    shortNote: true,
    testSample: false,
  });

  const activeCat = categories.find((c) => c.slug === category);
  const subcategories = activeCat?.subcategories || [];
  const isOthers = category === "others";
  const suggestedRange = SUGGESTED_RANGES[category] || "";

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const canProceedStep1 = title.trim() && category && guided.whatNeeded.trim();
  const canProceedStep2 = budgetModel === "open" || (budgetMin || budgetMax);

  const handleSubmit = () => {
    if (!user) return;
    setIsSubmitting(true);

    const budgetDisplay =
      budgetModel === "fixed" ? `₹${budgetMin}` :
      budgetModel === "range" ? `₹${budgetMin} – ₹${budgetMax}` :
      "Open Budget";

    const job: Job = {
      id: `job_${Date.now()}`,
      title: title.trim(),
      categorySlug: category,
      categoryLabel: activeCat?.title || "Others",
      categoryColor: activeCat?.iconColor || "#6B7280",
      subcategorySlug: subcategory || undefined,
      description: guided.whatNeeded,
      guidedDescription: guided,
      budget: budgetDisplay,
      budgetType: budgetModel === "fixed" ? "fixed" : "per project",
      budgetModel,
      budgetMin: budgetMin ? parseInt(budgetMin, 10) : undefined,
      budgetMax: budgetMax ? parseInt(budgetMax, 10) : undefined,
      visibilitySetting: visibility,
      applicationRequirements: appReqs,
      maxApplications: 15,
      applicationDeadlineHours: 48,
      currentApplications: 0,
      status: "open",
      timeline,
      postedAgo: "Just now",
      createdAt: new Date().toISOString(),
      creator: {
        name: user.name,
        username: user.username,
        subscribers: user.subscribers || "New",
        avatar: user.avatar,
        gradientFrom: user.gradientFrom,
        gradientTo: user.gradientTo,
      },
    };

    saveJob(job);

    // Toast-style redirect
    setTimeout(() => {
      router.push("/dashboard");
    }, 300);
  };

  const inputClass = "w-full rounded-md border border-border/60 bg-white px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-coral/50 focus:ring-1 focus:ring-brand-coral/20";
  const selectClass = "w-full rounded-md border border-border/60 bg-white px-4 py-3 text-sm text-brand-dark outline-none transition-colors appearance-none focus:border-brand-coral/50";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-lg border border-border/60 bg-white p-6 lg:p-8"
    >
      {/* Step Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold text-brand-coral uppercase tracking-wider">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h2 className="mt-1 text-lg font-bold text-brand-dark">
            {step === 1 && "Job Basics"}
            {step === 2 && "Budget Setup"}
            {step === 3 && "Who Can Apply?"}
            {step === 4 && "Application Requirements"}
          </h2>
        </div>
        {/* Progress dots */}
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-colors ${
                i + 1 <= step ? "bg-brand-coral" : "bg-border/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── STEP 1: Job Basics ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                  Job Title <span className="text-brand-coral">*</span>
                </label>
                <input
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Need a retention-style video editor for YouTube"
                  className={inputClass}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-brand-dark">
                    Category <span className="text-brand-coral">*</span>
                  </label>
                  <select value={category} onChange={(e) => { setCategory(e.target.value); setSubcategory(""); }} className={selectClass}>
                    <option value="">Select a category</option>
                    {categories.map((cat) => (<option key={cat.slug} value={cat.slug}>{cat.title}</option>))}
                    <option value="others">Others</option>
                  </select>
                </div>
                {category && !isOthers && subcategories.length > 0 && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-brand-dark">Subcategory</label>
                    <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} className={selectClass}>
                      <option value="">Select subcategory</option>
                      {subcategories.map((sub) => (<option key={sub.slug} value={sub.slug}>{sub.title}</option>))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-brand-dark">Delivery Timeline</label>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)} className={selectClass}>
                  {TIMELINE_OPTIONS.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>

              {/* Guided Description */}
              <div className="rounded-lg border border-border/40 bg-brand-surface/50 p-4 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Info className="h-3.5 w-3.5 text-brand-indigo" />
                  <p className="text-xs font-semibold text-brand-dark">Describe your job (guided)</p>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-brand-gray">What do you need done? <span className="text-brand-coral">*</span></label>
                  <textarea
                    rows={3} value={guided.whatNeeded}
                    onChange={(e) => setGuided({ ...guided, whatNeeded: e.target.value })}
                    placeholder="e.g., Edit 60-sec Instagram Reels with trending audio and captions"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-brand-gray">What style or reference do you have in mind?</label>
                  <textarea
                    rows={2} value={guided.styleReference}
                    onChange={(e) => setGuided({ ...guided, styleReference: e.target.value })}
                    placeholder="e.g., Viral short-form style, high energy edits like @creatorname"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-brand-gray">Any specific requirements?</label>
                  <textarea
                    rows={2} value={guided.specificRequirements}
                    onChange={(e) => setGuided({ ...guided, specificRequirements: e.target.value })}
                    placeholder="e.g., Must know CapCut, Hindi + English, 24hr turnaround"
                    className={`${inputClass} resize-none`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Budget Setup ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-2 sm:grid-cols-3">
                {([
                  { key: "fixed" as BudgetModel, label: "Fixed Price", desc: "One price, no negotiation" },
                  { key: "range" as BudgetModel, label: "Budget Range", desc: "Freelancers bid within range" },
                  { key: "open" as BudgetModel, label: "Open Budget", desc: "Let them quote freely" },
                ]).map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => setBudgetModel(opt.key)}
                    className={`rounded-lg border-2 p-4 text-left transition-all ${
                      budgetModel === opt.key
                        ? "border-brand-coral bg-brand-coral/5"
                        : "border-border/60 bg-white hover:border-border"
                    }`}
                  >
                    <p className={`text-sm font-bold ${budgetModel === opt.key ? "text-brand-coral" : "text-brand-dark"}`}>{opt.label}</p>
                    <p className="mt-0.5 text-[10px] text-brand-gray">{opt.desc}</p>
                  </button>
                ))}
              </div>

              {budgetModel !== "open" && (
                <div>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray">₹</span>
                      <input
                        type="number" value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                        placeholder={budgetModel === "fixed" ? "Price" : "Min"}
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                    {budgetModel === "range" && (
                      <>
                        <span className="text-sm text-brand-gray">to</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray">₹</span>
                          <input
                            type="number" value={budgetMax}
                            onChange={(e) => setBudgetMax(e.target.value)}
                            placeholder="Max"
                            className={`${inputClass} pl-7`}
                          />
                        </div>
                      </>
                    )}
                  </div>
                  {suggestedRange && (
                    <p className="mt-2 text-[10px] text-brand-gray">
                      💡 Suggested range for this category: <span className="font-semibold text-brand-dark">{suggestedRange}</span>
                    </p>
                  )}
                </div>
              )}

              {budgetModel === "open" && suggestedRange && (
                <div className="rounded-lg border border-brand-indigo/20 bg-brand-indigo/5 p-4">
                  <p className="text-xs text-brand-gray">
                    Freelancers will quote their own price. Based on your category, similar jobs typically pay <span className="font-bold text-brand-dark">{suggestedRange}</span>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Visibility ── */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-xs text-brand-gray mb-3">Who can apply to this job?</p>
              {([
                { key: "public" as VisibilitySetting, label: "Everyone (public job)", desc: "Any freelancer can apply. Maximum reach." },
                { key: "invite-only" as VisibilitySetting, label: "Only freelancers I invite", desc: "You pick who can apply. Fully private." },
                { key: "manual-shortlist" as VisibilitySetting, label: "Everyone, but I'll shortlist manually", desc: "Open applications, you review and pick." },
                { key: "auto-match" as VisibilitySetting, label: "Let CreateCrew match me (recommended)", desc: "We surface 3-5 best-fit freelancers for you." },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setVisibility(opt.key)}
                  className={`flex w-full items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                    visibility === opt.key
                      ? "border-brand-coral bg-brand-coral/5"
                      : "border-border/60 bg-white hover:border-border"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    visibility === opt.key ? "border-brand-coral bg-brand-coral" : "border-border/60"
                  }`}>
                    {visibility === opt.key && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${visibility === opt.key ? "text-brand-coral" : "text-brand-dark"}`}>{opt.label}</p>
                    <p className="text-[10px] text-brand-gray">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ── STEP 4: Application Requirements ── */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-xs text-brand-gray mb-2">What should applicants include?</p>
              {([
                { key: "proposedPrice" as keyof ApplicationRequirements, label: "Their proposed price" },
                { key: "portfolioSample" as keyof ApplicationRequirements, label: "One relevant portfolio sample" },
                { key: "deliveryTime" as keyof ApplicationRequirements, label: "Estimated delivery time" },
                { key: "shortNote" as keyof ApplicationRequirements, label: "A short note (why they're right for this)" },
                { key: "testSample" as keyof ApplicationRequirements, label: "A test sample (for this specific job)" },
              ]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setAppReqs({ ...appReqs, [opt.key]: !appReqs[opt.key] })}
                  className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition-all ${
                    appReqs[opt.key]
                      ? "border-brand-indigo/40 bg-brand-indigo/5"
                      : "border-border/60 bg-white hover:border-border"
                  }`}
                >
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
                    appReqs[opt.key] ? "bg-brand-indigo" : "border-2 border-border/60"
                  }`}>
                    {appReqs[opt.key] && <Check className="h-3 w-3 text-white" />}
                  </div>
                  <p className={`text-sm ${appReqs[opt.key] ? "font-semibold text-brand-dark" : "text-brand-gray"}`}>{opt.label}</p>
                </button>
              ))}

              {appReqs.testSample && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600" />
                  <p className="text-[11px] text-amber-800">
                    Asking for a test sample significantly reduces spam applications. Only serious freelancers will apply.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-5">
        {step > 1 ? (
          <button onClick={prev} className="flex items-center gap-1.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        ) : (
          <span />
        )}

        {step < TOTAL_STEPS ? (
          <button
            onClick={next}
            disabled={step === 1 ? !canProceedStep1 : step === 2 ? !canProceedStep2 : false}
            className="flex items-center gap-2 rounded-md bg-brand-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-md bg-brand-coral px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark disabled:opacity-60"
          >
            {isSubmitting ? "Posting..." : "Post Job"} <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
