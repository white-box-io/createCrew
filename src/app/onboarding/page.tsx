"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import StepIntent from "@/components/onboarding/step-intent";
import StepCategories from "@/components/onboarding/step-categories";
import StepProfile from "@/components/onboarding/step-profile";
import StepCelebration from "@/components/onboarding/step-celebration";
import StepAction from "@/components/onboarding/step-action";

export interface OnboardingData {
  intent: "creator" | "freelancer" | "both" | "exploring" | "";
  categories: string[];       // slug list
  displayName: string;
  location: string;
  photoUrl: string;
}

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    intent: "",
    categories: [],
    displayName: "",
    location: "",
    photoUrl: "",
  });

  // Redirect if not logged in
  if (!isLoading && !user) {
    router.push("/signin");
    return null;
  }

  // If already completed onboarding, go to dashboard
  if (!isLoading && user?.rolesSelected) {
    router.push("/dashboard");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  // Pre-fill display name from signup
  if (!data.displayName && user.name) {
    setData((prev) => ({ ...prev, displayName: user.name }));
  }

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const update = (partial: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...partial }));

  const finishOnboarding = (redirectTo: string) => {
    const isCreator = data.intent === "creator" || data.intent === "both";
    const isFreelancer = data.intent === "freelancer" || data.intent === "both";

    updateUser({
      creatorMode: isCreator,
      freelancerMode: isFreelancer,
      rolesSelected: true,
      selectedIntent: data.intent || undefined,
      selectedCategories: data.categories.length > 0 ? data.categories : undefined,
      location: data.location || undefined,
      photoUrl: data.photoUrl || undefined,
      onboardingComplete: true,
      trialStartDate: new Date().toISOString(),
    });

    router.push(redirectTo);
  };

  // Skip category step for "exploring"
  const effectiveNext = () => {
    if (step === 1 && data.intent === "exploring") {
      setStep(3); // skip categories, jump to profile
    } else {
      next();
    }
  };

  const effectivePrev = () => {
    if (step === 3 && data.intent === "exploring") {
      setStep(1); // from profile back to intent (skip categories)
    } else {
      prev();
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col bg-brand-surface">
      {/* Progress Bar */}
      <div className="mx-auto w-full max-w-xl px-5 pt-6">
        <div className="flex items-center justify-between mb-2">
          {step > 1 ? (
            <button
              onClick={effectivePrev}
              className="flex items-center gap-1 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          ) : (
            <span />
          )}
          <p className="text-[10px] font-semibold text-brand-gray uppercase tracking-wider">
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-border/40">
          <motion.div
            className="h-full rounded-full bg-brand-coral"
            initial={{ width: 0 }}
            animate={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex flex-1 items-center justify-center px-5 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-xl"
          >
            {step === 1 && (
              <StepIntent
                value={data.intent}
                onChange={(intent) => update({ intent })}
                onNext={effectiveNext}
              />
            )}
            {step === 2 && (
              <StepCategories
                intent={data.intent}
                selected={data.categories}
                onChange={(categories) => update({ categories })}
                onNext={next}
              />
            )}
            {step === 3 && (
              <StepProfile
                data={data}
                onChange={update}
                onNext={next}
              />
            )}
            {step === 4 && (
              <StepCelebration
                name={data.displayName || user.name}
                onNext={next}
              />
            )}
            {step === 5 && (
              <StepAction
                intent={data.intent}
                onFinish={finishOnboarding}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
