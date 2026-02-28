"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2, ChevronRight, Briefcase } from "lucide-react";
import type { ProfileGig } from "@/lib/freelancer-profile-generator";
import type { Freelancer } from "@/lib/mock-freelancers";

interface HireModalProps {
  person: Freelancer;
  // If gig is provided, we start Path A (step 1). If not, we start Path B (step 0 - choose path).
  selectedGig?: ProfileGig;
  onClose: () => void;
}

type HireStep = 
  | "choose-path"      // Path B start
  | "brief"            // Path A step 1
  | "custom-brief"     // Path B step 2
  | "payment"          // Path A step 2
  | "success-gig"      // Path A step 3
  | "success-custom";  // Path B step 3

export default function HireModal({ person, selectedGig, onClose }: HireModalProps) {
  const [step, setStep] = useState<HireStep>(selectedGig ? "brief" : "choose-path");
  const [activeGig, setActiveGig] = useState<ProfileGig | undefined>(selectedGig);
  
  // Form State
  const [briefText, setBriefText] = useState("");
  const [customBudget, setCustomBudget] = useState("");
  const [customDelivery, setCustomDelivery] = useState("Let's Discuss");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");

  const totalSteps = activeGig ? 3 : 3;
  
  let currentStepNum = 0;
  if (step === "brief" || step === "custom-brief") currentStepNum = 1;
  if (step === "payment") currentStepNum = 2;
  if (step === "success-gig" || step === "success-custom") currentStepNum = 3;

  const fname = person.name.split(" ")[0];

  // ── Handlers ──
  const handleNext = () => {
    if (step === "brief") setStep("payment");
    else if (step === "payment") setStep("success-gig");
    else if (step === "custom-brief") setStep("success-custom");
  };

  const handleSelectGigPath = () => {
    // If they choose 'listed gig' but we don't have one selected yet, 
    // ideally we'd show a dropdown, but for now we just pick their cheapest gig or mock it
    // Assuming the parent handles passing a gig if we use Path A, but if they fall back:
    setStep("brief");
  };

  const handleSelectCustomPath = () => {
    setActiveGig(undefined);
    setStep("custom-brief");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111827]/40 p-4 backdrop-blur-sm sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative flex w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              {step.startsWith("success") ? "Request Sent" : `Hire ${fname}`}
            </h2>
            {currentStepNum > 0 && !step.startsWith("success") && (
              <p className="mt-0.5 text-xs font-semibold text-[#6B7280]">
                Step {currentStepNum} of {totalSteps}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#4B5563]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStepNum > 0 && !step.startsWith("success") && (
          <div className="h-1 w-full bg-[#F3F4F6]">
            <div 
              className="h-full bg-[#10B981] transition-all duration-300" 
              style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
          <AnimatePresence mode="wait">
            
            {/* ── STEP 0: Choose Path ── */}
            {step === "choose-path" && (
              <motion.div key="choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4">
                <p className="text-sm text-[#4B5563] mb-2">How would you like to work with {fname}?</p>
                <div 
                  onClick={handleSelectCustomPath}
                  className="group cursor-pointer rounded-xl border-2 border-[#E5E7EB] p-5 transition-all hover:border-[#F26522] hover:bg-[#FFF8F5]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] group-hover:text-[#F26522]">Custom Project</h3>
                      <p className="mt-1 text-xs text-[#6B7280]">I'll describe exactly what I need and my budget.</p>
                    </div>
                    <ChevronRight className="text-[#9CA3AF] group-hover:text-[#F26522]" />
                  </div>
                </div>
                {/* Normally we'd list gigs here if multiple, simulating one listed gig option for the UI flow */}
                <div 
                  onClick={() => setStep("brief")} 
                  className="group cursor-pointer rounded-xl border-2 border-[#E5E7EB] p-5 transition-all hover:border-[#F26522] hover:bg-[#FFF8F5]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-[#111827] group-hover:text-[#F26522]">One of their listed gigs</h3>
                      <p className="mt-1 text-xs text-[#6B7280]">Pick from their pre-packaged service offerings.</p>
                    </div>
                    <ChevronRight className="text-[#9CA3AF] group-hover:text-[#F26522]" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PATH A - STEP 1: Brief (Gig) ── */}
            {step === "brief" && (
              <motion.div key="brief" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                
                {/* Gig Summary Box */}
                <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Selected Gig</span>
                  <h3 className="mt-1 font-bold text-[#111827]">{activeGig?.title || "Standard Project"}</h3>
                  <div className="mt-3 flex items-center justify-between text-xs font-semibold text-[#4B5563]">
                    <span>₹{activeGig?.startingPrice || person.price}</span>
                    <span>•</span>
                    <span>{activeGig?.deliveryTime || person.deliveryDays + " Days"}</span>
                    <span>•</span>
                    <span>{activeGig?.revisions || 2} Revisions</span>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">Brief for {fname}</label>
                  <textarea
                    rows={5}
                    placeholder="Describe your project, requirements, and any specific details..."
                    value={briefText}
                    onChange={(e) => setBriefText(e.target.value)}
                    className="w-full resize-none rounded-xl border border-[#D1D5DB] p-3 text-sm outline-none transition-colors focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">Reference Files <span className="text-[#9CA3AF] font-normal">(Optional)</span></label>
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] py-6 transition-colors hover:border-[#9CA3AF] hover:bg-gray-50">
                    <Upload className="mb-2 h-6 w-6 text-[#9CA3AF]" />
                    <span className="text-sm font-medium text-[#6B7280]">Click to upload or drag and drop</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PATH B - STEP 1: Custom Brief ── */}
            {step === "custom-brief" && (
              <motion.div key="custom-brief" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                
                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">What do you need?</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your project requirements clearly..."
                    value={briefText}
                    onChange={(e) => setBriefText(e.target.value)}
                    className="w-full resize-none rounded-xl border border-[#D1D5DB] p-3 text-sm outline-none transition-colors focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">Budget Estimate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-[#6B7280]">₹</span>
                    <input
                      type="number"
                      placeholder="5000"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      className="w-full rounded-xl border border-[#D1D5DB] p-2.5 pl-7 text-sm outline-none transition-colors focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">Delivery Expectation</label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {["1 Day", "2–3 Days", "1 Week", "Let's Discuss"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setCustomDelivery(opt)}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-colors ${
                          customDelivery === opt ? "border-[#F26522] bg-[#FFF8F5] text-[#F26522]" : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-[#374151]">Reference Files <span className="text-[#9CA3AF] font-normal">(Optional)</span></label>
                  <div className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D1D5DB] bg-[#F9FAFB] py-4 transition-colors hover:border-[#9CA3AF]">
                    <Upload className="mb-1 h-5 w-5 text-[#9CA3AF]" />
                    <span className="text-xs font-medium text-[#6B7280]">Upload files</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── PATH A - STEP 2: Payment ── */}
            {step === "payment" && (
              <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                
                {/* Order Summary */}
                <div className="rounded-xl border border-[#E5E7EB] p-4 text-sm font-medium text-[#374151]">
                  <div className="mb-3 flex justify-between">
                    <span>{activeGig?.title || "Standard Project"}</span>
                    <span>₹{activeGig?.startingPrice || person.price}</span>
                  </div>
                  <div className="mb-3 flex justify-between">
                    <span>Platform Fee</span>
                    <span className="text-[#10B981]">₹0 (Free during beta)</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E5E7EB] pt-3 text-base font-extrabold text-[#111827]">
                    <span>Total</span>
                    <span>₹{activeGig?.startingPrice || person.price}</span>
                  </div>
                </div>

                {/* Escrow Notice */}
                <div className="flex items-start gap-3 rounded-xl bg-[#ECFDF5] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#10B981]" />
                  <p className="text-xs leading-relaxed text-[#065F46]">
                    <strong>Your payment is held safely.</strong> {fname} gets paid only after you approve the final delivery.
                  </p>
                </div>

                {/* Payment Methods */}
                <div>
                  <label className="mb-3 block text-sm font-bold text-[#374151]">Payment Method</label>
                  <div className="flex gap-2 mb-4">
                    {["UPI", "Card", "Net Banking"].map(m => (
                      <button
                        key={m}
                        onClick={() => setPaymentMethod(m)}
                        className={`flex-1 rounded-lg border px-3 py-2.5 text-xs font-bold transition-all ${
                          paymentMethod === m ? "border-[#F26522] bg-[#FFF8F5] text-[#F26522] shadow-sm" : "border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F9FAFB]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "UPI" && (
                    <input
                      type="text"
                      placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full rounded-xl border border-[#D1D5DB] p-3 text-sm outline-none transition-colors focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                    />
                  )}
                </div>

              </motion.div>
            )}

            {/* ── PATH A - STEP 3: Success ── */}
            {step === "success-gig" && (
              <motion.div key="success-gig" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-6 text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#D1FAE5] text-3xl">
                  🎉
                </div>
                <h3 className="mb-2 text-2xl font-extrabold text-[#111827]">Project Started!</h3>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                  Your payment is secured in escrow. {fname} has been notified and will begin working on your project shortly.
                </p>
                
                <div className="flex w-full flex-col gap-3 sm:w-64">
                  <button onClick={onClose} className="rounded-xl bg-[#F26522] px-4 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4551A] hover:shadow">
                    Open Chat with {fname}
                  </button>
                  <button onClick={onClose} className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                    View My Projects
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── PATH B - STEP 3: Success (Custom) ── */}
            {step === "success-custom" && (
              <motion.div key="success-custom" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ECFDF5]">
                  <CheckCircle2 className="h-7 w-7 text-[#10B981]" />
                </div>
                <h3 className="mb-2 text-xl font-extrabold text-[#111827]">Request Sent!</h3>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-[#6B7280]">
                  {fname} typically responds within a few hours. They will review your brief and budget.
                </p>
                
                {/* Visual Timeline */}
                <div className="mb-8 flex w-full flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-left text-xs font-semibold text-[#4B5563]">
                  <div className="flex items-center gap-3 text-[#10B981]">
                    <div className="h-2 w-2 rounded-full bg-current" /> Request Sent
                  </div>
                  <div className="ml-1 h-3 border-l-2 border-[#E5E7EB]" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" /> They Review
                  </div>
                  <div className="ml-1 h-3 border-l-2 border-[#E5E7EB]" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" /> Confirm & Pay
                  </div>
                  <div className="ml-1 h-3 border-l-2 border-[#E5E7EB]" />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-[#D1D5DB]" /> Work Begins
                  </div>
                </div>
                
                <button onClick={onClose} className="w-full sm:w-64 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-bold text-[#374151] transition-colors hover:bg-[#F9FAFB]">
                  Back to Profile
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Footer Actions (Only for active input steps) */}
        {!step.startsWith("success") && step !== "choose-path" && (
          <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
            <button
              onClick={() => {
                if (step === "payment") setStep("brief");
                else if (step === "custom-brief") setStep("choose-path");
                else if (step === "brief" && !selectedGig) setStep("choose-path");
                else onClose();
              }}
              className="text-sm font-bold text-[#6B7280] transition-colors hover:text-[#111827]"
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={
                (step === "brief" && briefText.trim().length < 10) ||
                (step === "custom-brief" && (briefText.trim().length < 10 || !customBudget)) ||
                (step === "payment" && paymentMethod === "UPI" && !upiId)
              }
              className="flex items-center gap-2 rounded-xl bg-[#F26522] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4551A] hover:shadow disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === "payment" ? `Pay ₹${activeGig?.startingPrice || person.price} & Start` : "Continue"}
              {step !== "payment" && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
