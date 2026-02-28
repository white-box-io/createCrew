"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, MapPin, Pencil, Youtube, Instagram, Linkedin,
  ExternalLink, Briefcase, DollarSign, Clock, Megaphone, Palette,
} from "lucide-react";
import { getUserByUsername, type MockUser } from "@/lib/mock-auth";
import { getProfile, type ProfileData } from "@/lib/profile-data";
import { getGigs, type Gig } from "@/lib/gig-data";
import { useAuth } from "@/lib/auth-context";
import { categories } from "@/lib/categories-data";
import MessageModal from "@/components/find-crews/message-modal";
import { MessageSquare } from "lucide-react";

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const { user: currentUser } = useAuth();

  const [profileUser, setProfileUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [cameFromFindCrew, setCameFromFindCrew] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    const clean = username.replace(/^@/, "");
    const found = getUserByUsername(clean);
    if (!found) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setProfileUser(found);
    setProfile(getProfile(found.id));
    setGigs(getGigs(found.id));
    setLoading(false);
    // Detect if navigated from Find Crew page
    if (typeof window !== "undefined" && sessionStorage.getItem("findCrewPageState")) {
      setCameFromFindCrew(true);
    }
  }, [username]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  if (notFound || !profileUser) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 px-5">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-brand-dark">User not found</h1>
        <p className="text-sm text-brand-gray">@{username.replace(/^@/, "")} doesn&apos;t exist yet.</p>
        <Link href="/dashboard" className="mt-2 text-sm font-semibold text-brand-indigo hover:underline">
          ← Back to Dashboard
        </Link>
      </section>
    );
  }

  const isOwn = currentUser?.id === profileUser.id;
  const gen = profile?.general;
  const cr = profile?.creator;
  const fl = profile?.freelancer;

  const getCategoryTitle = (slug: string) => categories.find((c) => c.slug === slug)?.title || slug;
  const getSubTitle = (catSlug: string, subSlug: string) => {
    const cat = categories.find((c) => c.slug === catSlug);
    return cat?.subcategories.find((s) => s.slug === subSlug)?.title || subSlug;
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-brand-surface pb-16 pt-8">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        {/* Back Link */}
        <Link
          href={isOwn ? "/dashboard" : "/find-crews"}
          className={`mb-5 flex items-center gap-1 text-xs font-medium transition-colors ${
            cameFromFindCrew && !isOwn
              ? "text-[#6B7280] hover:text-[#F26522]"
              : "text-brand-gray hover:text-brand-dark"
          }`}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isOwn ? "Back to Dashboard" : cameFromFindCrew ? "Back to results" : "Back"}
        </Link>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border border-border/60 bg-white p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
              style={{ background: `linear-gradient(135deg, ${profileUser.gradientFrom}, ${profileUser.gradientTo})` }}
            >
              {(gen?.name || profileUser.name).split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-bold text-brand-dark sm:text-xl">{gen?.name || profileUser.name}</h1>
                  <p className="text-sm text-brand-gray">@{gen?.username || profileUser.username}</p>
                </div>
                {isOwn ? (
                  <Link
                    href="/dashboard/edit-profile"
                    className="flex items-center gap-1.5 rounded-md bg-brand-dark px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-brand-dark/90"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit Profile
                  </Link>
                ) : (
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="flex items-center gap-1.5 rounded-md bg-[#F26522] px-4 py-2 text-xs font-semibold text-white transition-all duration-200 hover:bg-[#D4551A]"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Message
                  </button>
                )}
              </div>

              {gen?.location && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-brand-gray">
                  <MapPin className="h-3 w-3" /> {gen.location}
                </p>
              )}

              {(gen?.bio || profileUser.bio) && (
                <p className="mt-2 text-sm text-brand-dark/80 leading-relaxed">
                  {gen?.bio || profileUser.bio}
                </p>
              )}

              {/* Role badges */}
              <div className="mt-3 flex flex-wrap gap-2">
                {profileUser.creatorMode && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-coral/10 px-2.5 py-1 text-[10px] font-semibold text-brand-coral">
                    <Megaphone className="h-3 w-3" /> Creator
                  </span>
                )}
                {profileUser.freelancerMode && (
                  <span className="flex items-center gap-1 rounded-full bg-brand-indigo/10 px-2.5 py-1 text-[10px] font-semibold text-brand-indigo">
                    <Palette className="h-3 w-3" /> Freelancer
                  </span>
                )}
              </div>

              {/* Social Links */}
              {gen?.socials && Object.values(gen.socials).some((v) => v) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {gen.socials.youtube && (
                    <a href={gen.socials.youtube} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-surface text-brand-gray hover:text-red-500 transition-colors">
                      <Youtube className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {gen.socials.instagram && (
                    <a href={gen.socials.instagram} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-surface text-brand-gray hover:text-pink-500 transition-colors">
                      <Instagram className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {gen.socials.x && (
                    <a href={gen.socials.x} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-surface text-brand-gray hover:text-brand-dark transition-colors" title="X (Twitter)">
                      <span className="text-[10px] font-bold">𝕏</span>
                    </a>
                  )}
                  {gen.socials.tiktok && (
                    <a href={gen.socials.tiktok} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-surface text-brand-gray hover:text-brand-dark transition-colors" title="TikTok">
                      <span className="text-[10px] font-bold">♪</span>
                    </a>
                  )}
                  {gen.socials.linkedin && (
                    <a href={gen.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-surface text-brand-gray hover:text-blue-600 transition-colors">
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Creator Section */}
        {profileUser.creatorMode && cr && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-4 rounded-xl border border-border/60 bg-white overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
              <Megaphone className="h-4 w-4 text-brand-coral" />
              <h2 className="text-sm font-bold text-brand-dark">Creator Profile</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Stats row */}
              <div className="grid gap-3 sm:grid-cols-3">
                {(cr.subscriberCount || profileUser.subscribers) && (
                  <div className="rounded-lg bg-brand-surface p-3 text-center">
                    <p className="text-lg font-bold text-brand-dark">{cr.subscriberCount || profileUser.subscribers}</p>
                    <p className="text-[10px] text-brand-gray">Subscribers</p>
                  </div>
                )}
                {cr.primaryPlatform && (
                  <div className="rounded-lg bg-brand-surface p-3 text-center">
                    <p className="text-sm font-bold text-brand-dark">{cr.primaryPlatform}</p>
                    <p className="text-[10px] text-brand-gray">Platform</p>
                  </div>
                )}
                {cr.teamSize && (
                  <div className="rounded-lg bg-brand-surface p-3 text-center">
                    <p className="text-sm font-bold text-brand-dark">{cr.teamSize}</p>
                    <p className="text-[10px] text-brand-gray">Team Size</p>
                  </div>
                )}
              </div>

              {/* Niche tags */}
              {cr.nicheTags.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold text-brand-gray uppercase tracking-wider">Niches</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cr.nicheTags.map((n) => (
                      <span key={n} className="rounded-full bg-brand-coral/10 px-2.5 py-1 text-[10px] font-medium text-brand-coral">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* About */}
              {cr.aboutChannel && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold text-brand-gray uppercase tracking-wider">About</p>
                  <p className="text-sm text-brand-dark/80 leading-relaxed">{cr.aboutChannel}</p>
                </div>
              )}

              {/* Vision */}
              {cr.vision && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold text-brand-gray uppercase tracking-wider">Vision</p>
                  <p className="text-sm text-brand-dark/80 leading-relaxed">{cr.vision}</p>
                </div>
              )}

              {/* Channel link */}
              {cr.channelUrl && (
                <a
                  href={cr.channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-coral hover:underline"
                >
                  <ExternalLink className="h-3 w-3" /> Visit Channel
                </a>
              )}
            </div>
          </motion.div>
        )}

        {/* Freelancer Section */}
        {profileUser.freelancerMode && fl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="mt-4 rounded-xl border border-border/60 bg-white overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
              <Palette className="h-4 w-4 text-brand-indigo" />
              <h2 className="text-sm font-bold text-brand-dark">Freelancer Profile</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              {/* Skills */}
              {(fl.skills.length > 0 || (profileUser.skills && profileUser.skills.length > 0)) && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold text-brand-gray uppercase tracking-wider">Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(fl.skills.length > 0 ? fl.skills : profileUser.skills || []).map((s) => (
                      <span key={s} className="rounded-full bg-brand-indigo/10 px-2.5 py-1 text-[10px] font-medium text-brand-indigo">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price & Badges row */}
              <div className="flex flex-wrap gap-3">
                {fl.startingPrice && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-brand-surface px-3 py-2">
                    <DollarSign className="h-3.5 w-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-brand-dark">From ₹{fl.startingPrice}</span>
                  </div>
                )}
                {fl.availability.length > 0 && fl.availability.map((a) => (
                  <span key={a} className="flex items-center gap-1 rounded-lg bg-brand-surface px-3 py-2 text-xs text-brand-gray">
                    <Clock className="h-3 w-3" /> {a}
                  </span>
                ))}
              </div>

              {/* Badges */}
              {fl.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {fl.badges.map((b) => (
                    <span key={b} className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-medium text-green-700">
                      ✓ {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Portfolio links */}
              {fl.portfolioUrls.length > 0 && (
                <div>
                  <p className="mb-2 text-[10px] font-semibold text-brand-gray uppercase tracking-wider">Portfolio</p>
                  <div className="space-y-1.5">
                    {fl.portfolioUrls.map((url) => (
                      <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-brand-indigo hover:underline">
                        <ExternalLink className="h-3 w-3" /> {url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Gigs Section */}
        {profileUser.freelancerMode && gigs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="mt-4 rounded-xl border border-border/60 bg-white overflow-hidden"
          >
            <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
              <Briefcase className="h-4 w-4 text-brand-indigo" />
              <h2 className="text-sm font-bold text-brand-dark">Gigs ({gigs.length})</h2>
            </div>
            <div className="divide-y divide-border/40">
              {gigs.map((gig) => (
                <div key={gig.id} className="px-6 py-4">
                  <p className="text-sm font-semibold text-brand-dark">{gig.title}</p>
                  <p className="mt-1 text-xs text-brand-gray line-clamp-2">{gig.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-medium text-brand-gray">
                      {getCategoryTitle(gig.category)}
                    </span>
                    <span className="rounded-full bg-brand-surface px-2 py-0.5 text-[10px] font-medium text-brand-gray">
                      {getSubTitle(gig.category, gig.subcategory)}
                    </span>
                    <span className="text-[10px] font-semibold text-green-600">From ₹{gig.startingPrice}</span>
                    <span className="text-[10px] text-brand-gray">· {gig.deliveryTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && profileUser && (
        <MessageModal
          person={profileUser as any}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </section>
  );
}
