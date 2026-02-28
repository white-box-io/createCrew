"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Megaphone, Palette, AlertTriangle, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  PLATFORM_OPTIONS,
  NICHE_OPTIONS,
  type CreatorProfile,
  type FreelancerProfile,
  DEFAULT_CREATOR,
  DEFAULT_FREELANCER,
  getProfile,
  saveProfile,
} from "@/lib/profile-data";

interface Props {
  open: boolean;
  onClose: () => void;
  onRolesChanged: (creatorMode: boolean, freelancerMode: boolean) => void;
}

export default function EditRolesModal({ open, onClose, onRolesChanged }: Props) {
  const { user, updateUser } = useAuth();

  const [creatorOn, setCreatorOn] = useState(false);
  const [freelancerOn, setFreelancerOn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Confirmation state
  const [confirmDisable, setConfirmDisable] = useState<"creator" | "freelancer" | null>(null);

  // Mini-form data for newly enabled roles
  const [creatorForm, setCreatorForm] = useState<CreatorProfile>(DEFAULT_CREATOR);
  const [freelancerForm, setFreelancerForm] = useState<FreelancerProfile>(DEFAULT_FREELANCER);
  const [skillInput, setSkillInput] = useState("");

  // Track which roles were newly enabled (to show mini-form)
  const [creatorWasOff, setCreatorWasOff] = useState(false);
  const [freelancerWasOff, setFreelancerWasOff] = useState(false);

  // Load current state when modal opens
  useEffect(() => {
    if (open && user) {
      setCreatorOn(user.creatorMode);
      setFreelancerOn(user.freelancerMode);
      setCreatorWasOff(!user.creatorMode);
      setFreelancerWasOff(!user.freelancerMode);
      setConfirmDisable(null);

      // Load existing profile data
      const profile = getProfile(user.id);
      setCreatorForm(profile.creator);
      setFreelancerForm(profile.freelancer);
    }
  }, [open, user]);

  if (!open || !user) return null;

  const wouldLeaveZero = (role: "creator" | "freelancer") => {
    if (role === "creator") return !freelancerOn;
    return !creatorOn;
  };

  const handleToggleCreator = () => {
    if (creatorOn) {
      // Trying to disable
      if (wouldLeaveZero("creator")) return; // Guard
      setConfirmDisable("creator");
    } else {
      setCreatorOn(true);
      setConfirmDisable(null);
    }
  };

  const handleToggleFreelancer = () => {
    if (freelancerOn) {
      if (wouldLeaveZero("freelancer")) return;
      setConfirmDisable("freelancer");
    } else {
      setFreelancerOn(true);
      setConfirmDisable(null);
    }
  };

  const confirmDeactivate = () => {
    if (confirmDisable === "creator") setCreatorOn(false);
    if (confirmDisable === "freelancer") setFreelancerOn(false);
    setConfirmDisable(null);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !freelancerForm.skills.includes(trimmed)) {
      setFreelancerForm({ ...freelancerForm, skills: [...freelancerForm.skills, trimmed] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setFreelancerForm({ ...freelancerForm, skills: freelancerForm.skills.filter((s) => s !== skill) });
  };

  const toggleNiche = (n: string) => {
    const tags = creatorForm.nicheTags.includes(n)
      ? creatorForm.nicheTags.filter((t) => t !== n)
      : [...creatorForm.nicheTags, n];
    setCreatorForm({ ...creatorForm, nicheTags: tags });
  };

  const handleSave = () => {
    setSaving(true);

    // Update auth user roles
    updateUser({ creatorMode: creatorOn, freelancerMode: freelancerOn, rolesSelected: true });

    // Save role-specific form data to profile
    const profile = getProfile(user.id);
    if (creatorOn && creatorWasOff) {
      profile.creator = { ...profile.creator, ...creatorForm };
    }
    if (freelancerOn && freelancerWasOff) {
      profile.freelancer = { ...profile.freelancer, ...freelancerForm };
    }
    saveProfile(user.id, profile);

    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      onRolesChanged(creatorOn, freelancerOn);
      setTimeout(() => {
        setShowToast(false);
        onClose();
      }, 1500);
    }, 400);
  };

  const showCreatorMini = creatorOn && creatorWasOff;
  const showFreelancerMini = freelancerOn && freelancerWasOff;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 max-h-[85vh] overflow-y-auto"
      >
        <div className="rounded-xl border border-border/60 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-brand-dark">Manage Your Roles</h2>
              <p className="text-[11px] text-brand-gray">Level up your hustle! Toggle roles below.</p>
            </div>
            <button onClick={onClose} className="rounded-md p-1.5 text-brand-gray hover:bg-brand-surface hover:text-brand-dark transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 py-5 space-y-5">
            {/* Creator Toggle */}
            <div className={`rounded-lg border-2 p-4 transition-colors ${creatorOn ? "border-brand-coral bg-brand-coral/5" : "border-border/60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${creatorOn ? "bg-brand-coral/10" : "bg-brand-surface"}`}>
                    <Megaphone className={`h-4 w-4 ${creatorOn ? "text-brand-coral" : "text-brand-gray"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Creator Mode</p>
                    <p className="text-[10px] text-brand-gray">Post jobs & hire talent</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleCreator}
                  disabled={creatorOn && wouldLeaveZero("creator")}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    creatorOn ? "bg-brand-coral" : "bg-gray-200"
                  } ${creatorOn && wouldLeaveZero("creator") ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    creatorOn ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>

              {/* One-role guard message */}
              {creatorOn && wouldLeaveZero("creator") && (
                <p className="mt-2 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> You need at least one role active!
                </p>
              )}

              {/* Creator Mini-Form */}
              <AnimatePresence>
                {showCreatorMini && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                      <p className="text-[10px] font-semibold text-brand-coral uppercase tracking-wider">Quick Setup</p>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-brand-dark">
                          Primary Platform <span className="text-red-400">*</span>
                        </label>
                        <select
                          value={creatorForm.primaryPlatform}
                          onChange={(e) => setCreatorForm({ ...creatorForm, primaryPlatform: e.target.value })}
                          className="w-full rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-brand-dark outline-none focus:border-brand-coral/50"
                        >
                          <option value="">Select platform</option>
                          {PLATFORM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-brand-dark">Channel URL</label>
                        <input
                          type="url"
                          value={creatorForm.channelUrl}
                          onChange={(e) => setCreatorForm({ ...creatorForm, channelUrl: e.target.value })}
                          placeholder="https://youtube.com/@yourchannel"
                          className="w-full rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-coral/50"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-brand-dark">Subscribers / Followers</label>
                        <input
                          type="text"
                          value={creatorForm.subscriberCount}
                          onChange={(e) => setCreatorForm({ ...creatorForm, subscriberCount: e.target.value })}
                          placeholder="e.g., 50K or 1.2M"
                          className="w-full rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-coral/50"
                        />
                      </div>

                      <div>
                        <p className="mb-1.5 text-[11px] font-semibold text-brand-dark">Niche</p>
                        <div className="flex flex-wrap gap-1.5">
                          {NICHE_OPTIONS.slice(0, 10).map((n) => {
                            const active = creatorForm.nicheTags.includes(n);
                            return (
                              <button
                                key={n}
                                type="button"
                                onClick={() => toggleNiche(n)}
                                className={`rounded-full px-2.5 py-1 text-[10px] font-medium transition-colors ${
                                  active ? "bg-brand-coral text-white" : "bg-brand-surface text-brand-gray hover:bg-brand-coral/10"
                                }`}
                              >
                                {n}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Freelancer Toggle */}
            <div className={`rounded-lg border-2 p-4 transition-colors ${freelancerOn ? "border-brand-indigo bg-brand-indigo/5" : "border-border/60"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${freelancerOn ? "bg-brand-indigo/10" : "bg-brand-surface"}`}>
                    <Palette className={`h-4 w-4 ${freelancerOn ? "text-brand-indigo" : "text-brand-gray"}`} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark">Freelancer Mode</p>
                    <p className="text-[10px] text-brand-gray">Offer skills & earn</p>
                  </div>
                </div>
                <button
                  onClick={handleToggleFreelancer}
                  disabled={freelancerOn && wouldLeaveZero("freelancer")}
                  className={`relative h-7 w-12 rounded-full transition-colors ${
                    freelancerOn ? "bg-brand-indigo" : "bg-gray-200"
                  } ${freelancerOn && wouldLeaveZero("freelancer") ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    freelancerOn ? "translate-x-5" : ""
                  }`} />
                </button>
              </div>

              {freelancerOn && wouldLeaveZero("freelancer") && (
                <p className="mt-2 text-[10px] text-amber-600 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> You need at least one role active!
                </p>
              )}

              {/* Freelancer Mini-Form */}
              <AnimatePresence>
                {showFreelancerMini && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
                      <p className="text-[10px] font-semibold text-brand-indigo uppercase tracking-wider">Quick Setup</p>

                      <div>
                        <p className="mb-1 text-[11px] font-semibold text-brand-dark">
                          Main Skills <span className="text-red-400">*</span>
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                            placeholder="e.g., Reels Editing"
                            className="flex-1 rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-indigo/50"
                          />
                          <button type="button" onClick={addSkill} className="flex items-center gap-1 rounded-md bg-brand-indigo px-2.5 py-2 text-[10px] font-semibold text-white hover:bg-brand-indigo/90">
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                        {freelancerForm.skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {freelancerForm.skills.map((s) => (
                              <span key={s} className="flex items-center gap-1 rounded-full bg-brand-indigo/10 px-2 py-0.5 text-[10px] font-medium text-brand-indigo">
                                {s}
                                <button type="button" onClick={() => removeSkill(s)} className="hover:text-red-500"><X className="h-2.5 w-2.5" /></button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-brand-dark">Starting Price</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-brand-gray-light">₹</span>
                          <input
                            type="text"
                            value={freelancerForm.startingPrice}
                            onChange={(e) => setFreelancerForm({ ...freelancerForm, startingPrice: e.target.value })}
                            placeholder="e.g., 2,000"
                            className="w-full rounded-md border border-border/60 bg-white py-2 pl-7 pr-3 text-xs text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-indigo/50"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-[11px] font-semibold text-brand-dark">Portfolio Link</label>
                        <input
                          type="url"
                          value={freelancerForm.portfolioUrls[0] || ""}
                          onChange={(e) => setFreelancerForm({ ...freelancerForm, portfolioUrls: e.target.value ? [e.target.value] : [] })}
                          placeholder="https://behance.net/yourwork"
                          className="w-full rounded-md border border-border/60 bg-white px-3 py-2 text-xs text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-indigo/50"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Confirmation Banner */}
            <AnimatePresence>
              {confirmDisable && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Are you sure?
                    </p>
                    <p className="mt-1 text-[11px] text-amber-700">
                      {confirmDisable === "creator"
                        ? "You won't be able to post jobs or hire talent anymore."
                        : "You won't be able to offer gigs or apply for jobs anymore."}
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={confirmDeactivate}
                        className="rounded-md bg-amber-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-amber-700"
                      >
                        Yes, deactivate
                      </button>
                      <button
                        onClick={() => setConfirmDisable(null)}
                        className="rounded-md border border-border/60 bg-white px-3 py-1.5 text-[11px] font-medium text-brand-gray hover:bg-brand-surface"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="border-t border-border/40 px-6 py-4 flex items-center justify-between">
            <button onClick={onClose} className="text-xs font-medium text-brand-gray hover:text-brand-dark">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || (!creatorOn && !freelancerOn)}
              className="flex items-center gap-2 rounded-md bg-brand-dark px-5 py-2.5 text-xs font-semibold text-white hover:bg-brand-dark/90 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save & Update"}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]"
          >
            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
              <Check className="h-4 w-4" />
              Roles updated! Your squad is ready 🔥
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
