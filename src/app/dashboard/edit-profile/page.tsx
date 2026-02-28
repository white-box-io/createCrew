"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Save, User, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  type ProfileData,
  type GeneralProfile,
  saveProfile,
  initProfileFromUser,
} from "@/lib/profile-data";
import GeneralForm from "@/components/edit-profile/general-form";

export default function EditGeneralProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Load profile data
  useEffect(() => {
    if (user) {
      const data = initProfileFromUser(user);
      setProfile(data);
    }
  }, [user]);

  // Protected route
  if (!isLoading && !user) {
    router.push("/signin");
    return null;
  }

  if (isLoading || !user || !profile) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  const handleSave = () => {
    setSaving(true);
    // Save profile to localStorage
    saveProfile(user.id, profile);
    // Also sync name/username/bio back to auth user
    updateUser({
      name: profile.general.name || user.name,
      username: profile.general.username || user.username,
      bio: profile.general.bio || user.bio,
      avatar: (profile.general.name || user.name).split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    });
    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 400);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-brand-surface pb-28 pt-8">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="mb-3 flex items-center gap-1 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">Edit General Profile</h1>
          <p className="mt-1 text-sm text-brand-gray">
            Update your basic details like name, bio, and social links.
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-border/60 bg-white p-5 shadow-sm sm:p-7"
        >
          <div className="mb-6 flex items-center gap-2 border-b border-border/40 pb-4">
            <User className="h-5 w-5 text-brand-dark" />
            <h2 className="text-lg font-bold text-brand-dark">General Information</h2>
          </div>
          
          <GeneralForm
            data={profile.general}
            user={user}
            onChange={(newData: GeneralProfile) =>
              setProfile({ ...profile, general: newData })
            }
          />
        </motion.div>
      </div>

      {/* Floating Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-white/80 p-4 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-1">
          <p className="text-xs text-brand-gray">Changes are saved to your local profile</p>
          <div className="flex items-center gap-3">
            {showToast && (
              <span className="text-xs font-medium text-green-600 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                Saved!
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-md bg-brand-dark px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-dark/90 disabled:opacity-70"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
