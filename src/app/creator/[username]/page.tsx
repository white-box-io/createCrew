"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Camera, Pencil, MessageSquare, Briefcase, MapPin,
  Youtube, Instagram, Twitter, Linkedin, Plus, X,
  ExternalLink, Globe, MonitorPlay, Users, Calendar,
  BarChart3, Link2, Send,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getUserByUsername } from "@/lib/mock-auth";
import {
  getCreatorProfile, saveCreatorProfile, getOrCreateCreatorProfile,
  seedCraftClipsIfNeeded,
  type CreatorProfile, type ContentItem, type PlatformLink,
} from "@/lib/creator-profile-data";
import { mockJobs, type Job } from "@/lib/mock-jobs";

/* ── Platform helpers ── */

const PLATFORM_COLORS: Record<string, string> = {
  youtube: "#FF0000",
  instagram: "#E1306C",
  twitter: "#000000",
  tiktok: "#000000",
  linkedin: "#0A66C2",
};

const PLATFORM_BG_OPACITY: Record<string, string> = {
  youtube: "rgba(255,0,0,0.12)",
  instagram: "rgba(225,48,108,0.12)",
  twitter: "rgba(29,161,242,0.12)",
  tiktok: "rgba(0,0,0,0.08)",
  other: "rgba(107,114,128,0.1)",
};

function PlatformIcon({ platform, className, style }: { platform: string; className?: string; style?: React.CSSProperties }) {
  switch (platform) {
    case "youtube": return <Youtube className={className} style={style} />;
    case "instagram": return <Instagram className={className} style={style} />;
    case "twitter": return <Twitter className={className} style={style} />;
    case "linkedin": return <Linkedin className={className} style={style} />;
    case "tiktok": return <Globe className={className} style={style} />;
    default: return <Globe className={className} style={style} />;
  }
}

function detectPlatform(url: string): ContentItem["platform"] {
  const u = url.toLowerCase();
  if (u.includes("youtube.com") || u.includes("youtu.be")) return "youtube";
  if (u.includes("instagram.com")) return "instagram";
  if (u.includes("twitter.com") || u.includes("x.com")) return "twitter";
  if (u.includes("tiktok.com")) return "tiktok";
  return "other";
}

function getDomain(url: string): string {
  try { return new URL(url.startsWith("http") ? url : `https://${url}`).hostname; }
  catch { return url; }
}

/* ── Main Page ── */

export default function CreatorProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const React = require("react");
  const { username } = React.use(params);
  const decodedUsername = decodeURIComponent(username).replace(/^@/, "");

  const { user } = useAuth();
  const isOwner = user?.username === decodedUsername;

  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [targetUser, setTargetUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Edit states
  const [editingBasicInfo, setEditingBasicInfo] = useState(false);
  const [editDraft, setEditDraft] = useState<Partial<CreatorProfile>>({});
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutDraft, setAboutDraft] = useState<CreatorProfile["about"] | null>(null);

  // Content form
  const [showAddContent, setShowAddContent] = useState(false);
  const [contentUrl, setContentUrl] = useState("");
  const [contentTitle, setContentTitle] = useState("");
  const [contentPlatform, setContentPlatform] = useState<ContentItem["platform"]>("youtube");

  // Platform add form
  const [showAddPlatform, setShowAddPlatform] = useState(false);
  const [newPlatformType, setNewPlatformType] = useState<PlatformLink["platform"]>("youtube");
  const [newPlatformUrl, setNewPlatformUrl] = useState("");

  // File input refs
  const coverInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsClient(true);
    seedCraftClipsIfNeeded();

    const tu = getUserByUsername(decodedUsername);
    setTargetUser(tu);

    if (tu) {
      const p = getOrCreateCreatorProfile(tu.username, tu.name);
      setProfile(p);
    }
  }, [decodedUsername]);

  if (!isClient) return null;

  if (!targetUser) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center bg-[#F9FAFB] p-6 text-center">
        <MonitorPlay className="mx-auto mb-4 h-12 w-12 text-[#9CA3AF]" />
        <h2 className="mb-2 text-2xl font-bold text-[#111827]">Creator not found</h2>
        <p className="mb-6 text-[#6B7280]">@{decodedUsername} doesn't exist yet.</p>
        <Link href="/creators" className="rounded-xl bg-[#F26522] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#D4551A]">
          Browse all creators
        </Link>
      </div>
    );
  }

  if (!profile) return null;

  const save = (updated: CreatorProfile) => {
    saveCreatorProfile(decodedUsername, updated);
    setProfile({ ...updated });
  };

  /* ── File handlers ── */
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { save({ ...profile, coverPhoto: reader.result as string }); };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { save({ ...profile, profilePhoto: reader.result as string }); };
    reader.readAsDataURL(file);
  };

  /* ── Basic Info edit ── */
  const startEditBasicInfo = () => {
    setEditDraft({
      displayName: profile.displayName,
      headline: profile.headline,
      location: profile.location,
      bio: profile.bio,
    });
    setEditingBasicInfo(true);
  };

  const saveBasicInfo = () => {
    save({ ...profile, ...editDraft });
    setEditingBasicInfo(false);
  };

  /* ── About edit ── */
  const startEditAbout = () => {
    setAboutDraft({ ...profile.about });
    setEditingAbout(true);
  };

  const saveAbout = () => {
    if (aboutDraft) save({ ...profile, about: aboutDraft });
    setEditingAbout(false);
  };

  /* ── Content add ── */
  const handleAddContent = () => {
    if (!contentUrl.trim()) return;
    const newItem: ContentItem = {
      id: `c-${Date.now()}`,
      url: contentUrl.startsWith("http") ? contentUrl : `https://${contentUrl}`,
      title: contentTitle.trim() || "",
      platform: contentPlatform,
    };
    save({ ...profile, content: [...profile.content, newItem] });
    setContentUrl("");
    setContentTitle("");
    setContentPlatform("youtube");
    setShowAddContent(false);
  };

  const removeContent = (id: string) => {
    save({ ...profile, content: profile.content.filter((c) => c.id !== id) });
  };

  /* ── Platform add/remove ── */
  const handleAddPlatform = () => {
    if (!newPlatformUrl.trim()) return;
    const link: PlatformLink = {
      platform: newPlatformType,
      url: newPlatformUrl.startsWith("http") ? newPlatformUrl : `https://${newPlatformUrl}`,
    };
    save({ ...profile, platforms: [...profile.platforms, link] });
    setNewPlatformUrl(""); setShowAddPlatform(false);
  };

  const removePlatform = (index: number) => {
    save({ ...profile, platforms: profile.platforms.filter((_, i) => i !== index) });
  };

  /* ── Jobs ── */
  const creatorJobs: Job[] = mockJobs.filter((j) => j.creator.username === decodedUsername);

  /* ── About helpers ── */
  const aboutFields = [
    { key: "primaryPlatform" as const, label: "Primary Platform", icon: <Youtube className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
    { key: "channelURL" as const, label: "Channel URL", icon: <Link2 className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
    { key: "niche" as const, label: "Niche", icon: <BarChart3 className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
    { key: "uploadSchedule" as const, label: "Upload Schedule", icon: <Calendar className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
    { key: "teamSize" as const, label: "Team Size", icon: <Users className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
    { key: "audienceSize" as const, label: "Audience Size", icon: <BarChart3 className="h-3.5 w-3.5 text-[#9CA3AF]" /> },
  ];

  const hasAboutContent = aboutFields.some((f) => {
    const val = profile.about[f.key];
    return Array.isArray(val) ? val.length > 0 : !!val;
  });

  const hasAnyContent = profile.content.length > 0;
  const hasJobs = creatorJobs.length > 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-[860px] px-6">

        {/* ════════ COVER PHOTO ════════ */}
        {(isOwner || profile.coverPhoto) && (
          <div className="relative w-full">
            {profile.coverPhoto ? (
              <div className="relative h-[200px] w-full overflow-hidden rounded-b-2xl">
                <img src={profile.coverPhoto} alt="Cover" className="h-full w-full object-cover" />
                {isOwner && (
                  <button
                    onClick={() => coverInputRef.current?.click()}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-[#374151] shadow-sm transition-colors hover:bg-white"
                  >
                    <Pencil className="h-3 w-3" /> Edit cover
                  </button>
                )}
              </div>
            ) : isOwner ? (
              <div
                onClick={() => coverInputRef.current?.click()}
                className="flex h-[200px] w-full cursor-pointer items-center justify-center rounded-b-2xl bg-[#F3F4F6] transition-colors hover:bg-[#E5E7EB]"
              >
                <span className="text-sm text-[#9CA3AF]">📷 Add cover photo</span>
              </div>
            ) : null}
            <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </div>
        )}

        {/* ════════ PROFILE PICTURE + ACTION BUTTONS ════════ */}
        <div className={`relative flex items-end justify-between ${profile.coverPhoto || isOwner ? "-mt-11" : "mt-8"}`}>
          {/* Profile Pic */}
          <div className="relative">
            <div
              onClick={isOwner ? () => photoInputRef.current?.click() : undefined}
              className={`flex h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] border-[#F9FAFB] text-2xl font-bold text-white shadow-sm ${isOwner ? "cursor-pointer" : ""}`}
              style={{
                background: profile.profilePhoto
                  ? `url(${profile.profilePhoto}) center/cover`
                  : `linear-gradient(135deg, ${targetUser.gradientFrom} 0%, ${targetUser.gradientTo} 100%)`,
              }}
            >
              {!profile.profilePhoto && targetUser.avatar}
            </div>
            {isOwner && (
              <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm border border-[#E5E7EB]">
                <Camera className="h-3 w-3 text-[#6B7280]" />
              </span>
            )}
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pb-1">
            {isOwner ? (
              <button
                onClick={startEditBasicInfo}
                className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] shadow-sm transition-colors hover:bg-[#F9FAFB]"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit profile
              </button>
            ) : (
              <>
                <button className="flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold text-[#374151] shadow-sm transition-colors hover:bg-[#F9FAFB]">
                  <MessageSquare className="h-3.5 w-3.5" /> Message
                </button>
                {hasJobs && (
                  <a href="#active-jobs" className="flex items-center gap-1.5 rounded-lg bg-[#F26522] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#D4551A]">
                    <Briefcase className="h-3.5 w-3.5" /> View Jobs
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {/* ════════ SECTION 2 — BASIC INFO CARD ════════ */}
        <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7 relative">
          {isOwner && !editingBasicInfo && (
            <button onClick={startEditBasicInfo} className="absolute top-5 right-5 text-[#9CA3AF] hover:text-[#374151] transition-colors">
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {editingBasicInfo ? (
            /* ─── Edit Mode ─── */
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Display Name</label>
                <input
                  value={editDraft.displayName ?? ""}
                  onChange={(e) => setEditDraft({ ...editDraft, displayName: e.target.value })}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-lg font-bold text-[#111827] outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                />
              </div>
              <p className="text-sm text-[#9CA3AF]">@{decodedUsername}</p>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Headline <span className="text-[#9CA3AF]">({(editDraft.headline ?? "").length}/120)</span></label>
                <input
                  value={editDraft.headline ?? ""}
                  onChange={(e) => e.target.value.length <= 120 && setEditDraft({ ...editDraft, headline: e.target.value })}
                  placeholder="Tell people what you create"
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Location</label>
                <input
                  value={editDraft.location ?? ""}
                  onChange={(e) => setEditDraft({ ...editDraft, location: e.target.value })}
                  placeholder="City, Country"
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Bio <span className="text-[#9CA3AF]">({(editDraft.bio ?? "").length}/300)</span></label>
                <textarea
                  value={editDraft.bio ?? ""}
                  onChange={(e) => e.target.value.length <= 300 && setEditDraft({ ...editDraft, bio: e.target.value })}
                  placeholder="Tell people about your channel"
                  rows={4}
                  className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm text-[#111827] outline-none resize-none focus:border-[#F26522] focus:ring-1 focus:ring-[#F26522]"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button onClick={saveBasicInfo} className="rounded-lg bg-[#F26522] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#D4551A]">Save changes</button>
                <button onClick={() => setEditingBasicInfo(false)} className="text-sm font-medium text-[#6B7280] hover:text-[#111827]">Cancel</button>
              </div>
            </div>
          ) : (
            /* ─── View Mode ─── */
            <div>
              <h1 className="text-2xl font-extrabold text-[#111827]">
                {profile.displayName || targetUser.name}
              </h1>
              <p className="mt-0.5 text-sm text-[#9CA3AF]">@{decodedUsername}</p>

              {/* Headline */}
              {profile.headline ? (
                <p className="mt-2 text-[15px] text-[#374151]">{profile.headline}</p>
              ) : isOwner ? (
                <p
                  onClick={startEditBasicInfo}
                  className="mt-2 cursor-pointer text-[15px] italic text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  Add a headline — tell people what you create
                </p>
              ) : null}

              {/* Location */}
              {profile.location ? (
                <p className="mt-2 flex items-center gap-1.5 text-[13px] text-[#6B7280]">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              ) : isOwner ? (
                <button onClick={startEditBasicInfo} className="mt-2 text-[13px] font-semibold text-[#F26522] hover:underline">+ Add location</button>
              ) : null}

              {/* Bio */}
              {profile.bio ? (
                <p className="mt-4 text-sm leading-7 text-[#374151]">{profile.bio}</p>
              ) : isOwner ? (
                <div className="mt-4 rounded-xl border border-dashed border-[#E5E7EB] p-4">
                  <p className="text-sm text-[#9CA3AF]">Tell people about your channel — what you make, who it's for, why you started.</p>
                  <button onClick={startEditBasicInfo} className="mt-3 text-sm font-bold text-[#F26522] hover:underline">+ Add bio</button>
                </div>
              ) : null}

              {/* Platform Links */}
              {profile.platforms.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  {profile.platforms.map((p, i) => (
                    <div key={i} className="group relative">
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110"
                        style={{ backgroundColor: PLATFORM_BG_OPACITY[p.platform] }}
                      >
                        <PlatformIcon platform={p.platform} className="h-4 w-4" style={{ color: PLATFORM_COLORS[p.platform] }} />
                      </a>
                      {isOwner && (
                        <button
                          onClick={() => removePlatform(i)}
                          className="absolute -right-1 -top-1 hidden h-4 w-4 items-center justify-center rounded-full bg-[#EF4444] text-white group-hover:flex"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {isOwner && (
                    <button onClick={() => setShowAddPlatform(true)} className="text-xs font-bold text-[#F26522] hover:underline">+ Add</button>
                  )}
                </div>
              ) : isOwner ? (
                <button onClick={() => setShowAddPlatform(true)} className="mt-4 text-sm font-bold text-[#F26522] hover:underline">+ Add platforms</button>
              ) : null}

              {/* Add platform inline form */}
              {showAddPlatform && isOwner && (
                <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] p-3">
                  <select value={newPlatformType} onChange={(e) => setNewPlatformType(e.target.value as PlatformLink["platform"])} className="rounded border border-[#E5E7EB] bg-white px-2 py-1.5 text-xs font-medium text-[#374151] outline-none">
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                  </select>
                  <input value={newPlatformUrl} onChange={(e) => setNewPlatformUrl(e.target.value)} placeholder="Paste URL…" className="flex-1 rounded border border-[#E5E7EB] bg-white px-2 py-1.5 text-xs outline-none focus:border-[#F26522]" />
                  <button onClick={handleAddPlatform} className="rounded bg-[#F26522] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#D4551A]">Add</button>
                  <button onClick={() => setShowAddPlatform(false)} className="text-xs text-[#6B7280] hover:text-[#111827]">Cancel</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ════════ SECTION 3 — MY CONTENT ════════ */}
        {(isOwner || hasAnyContent) && (
          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#111827]">My Content</h2>
            </div>

            {profile.content.length === 0 && isOwner ? (
              !showAddContent ? (
                <div className="rounded-xl border border-dashed border-[#E5E7EB] p-8 text-center">
                  <p className="mb-1 text-2xl">🎬</p>
                  <p className="mb-4 text-sm text-[#9CA3AF]">Add your content here. Paste YouTube video links, Instagram posts, or any other content you want people to see.</p>
                  <button onClick={() => setShowAddContent(true)} className="rounded-lg bg-[#F26522] px-5 py-2 text-sm font-bold text-white hover:bg-[#D4551A]">+ Add Content</button>
                </div>
              ) : null
            ) : null}

            {/* Content Grid */}
            {profile.content.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {profile.content.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-xl border border-[#E5E7EB] transition-shadow hover:shadow-md"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-[100px] w-full" style={{ backgroundColor: PLATFORM_BG_OPACITY[item.platform] || PLATFORM_BG_OPACITY.other }}>
                      <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                        <PlatformIcon platform={item.platform} className="h-3 w-3" style={{ color: PLATFORM_COLORS[item.platform] || "#6B7280" }} />
                      </span>
                      {isOwner && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeContent(item.id); }}
                          className="absolute right-1.5 top-1.5 hidden h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm group-hover:flex"
                        >
                          <X className="h-3 w-3 text-[#EF4444]" />
                        </button>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-3">
                      <p className="text-[13px] font-semibold text-[#111827] line-clamp-2 leading-tight">
                        {item.title || getDomain(item.url)}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9CA3AF]">{getDomain(item.url)}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Add Content button (below grid when content exists) */}
            {isOwner && profile.content.length > 0 && !showAddContent && (
              <button onClick={() => setShowAddContent(true)} className="mt-4 text-sm font-bold text-[#F26522] hover:underline">+ Add Content</button>
            )}

            {/* Add Content Inline Form */}
            {showAddContent && isOwner && (
              <div className="mt-4 space-y-3 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Paste your content URL</label>
                  <input
                    value={contentUrl}
                    onChange={(e) => { setContentUrl(e.target.value); setContentPlatform(detectPlatform(e.target.value)); }}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Title (optional)</label>
                  <input
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    placeholder="Video title…"
                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none focus:border-[#F26522]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#6B7280]">Platform</label>
                  <select value={contentPlatform} onChange={(e) => setContentPlatform(e.target.value as ContentItem["platform"])} className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm outline-none">
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="twitter">Twitter</option>
                    <option value="tiktok">TikTok</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleAddContent} className="rounded-lg bg-[#F26522] px-4 py-2 text-sm font-bold text-white hover:bg-[#D4551A]">Add</button>
                  <button onClick={() => setShowAddContent(false)} className="text-sm text-[#6B7280] hover:text-[#111827]">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════ SECTION 4 — ACTIVE JOBS ════════ */}
        {(isOwner || hasJobs) && (
          <div id="active-jobs" className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#111827]">Active Jobs</h2>
              {isOwner && hasJobs && (
                <Link href="/post-job" className="text-[11px] font-bold text-[#F26522] hover:underline">Post New →</Link>
              )}
            </div>

            {creatorJobs.length === 0 ? (
              isOwner ? (
                <div className="text-center py-8">
                  <p className="mb-1 text-2xl">📋</p>
                  <p className="text-sm font-medium text-[#111827]">No active jobs yet.</p>
                  <p className="mt-1 text-xs text-[#6B7280]">Post a job to start finding your perfect crew.</p>
                  <Link href="/post-job" className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#F26522] px-5 py-2 text-sm font-bold text-white hover:bg-[#D4551A]">
                    Post a Job →
                  </Link>
                </div>
              ) : null
            ) : (
              <div className="divide-y divide-[#F3F4F6]">
                {creatorJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#111827]">{job.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-[13px] text-[#6B7280]">
                        <span className="rounded-full bg-[#FFF3EE] px-2 py-0.5 text-[11px] font-bold text-[#F26522]">{job.categoryLabel}</span>
                        <span>· {job.currentApplications ?? 0} applicants</span>
                      </div>
                    </div>
                    {isOwner ? (
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${job.status === "open" ? "bg-[#F0FDF4] text-[#16A34A]" : "bg-[#F3F4F6] text-[#6B7280]"}`}>
                        {job.status === "open" ? "Open" : "Closed"}
                      </span>
                    ) : (
                      <Link href={`/find-work/${job.id}`} className="text-[13px] font-bold text-[#F26522] hover:underline">Apply →</Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════ SECTION 5 — ABOUT ════════ */}
        {(isOwner || hasAboutContent) && (
          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-7 relative">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#111827]">About</h2>
              {isOwner && !editingAbout && (
                <button onClick={startEditAbout} className="text-[#9CA3AF] hover:text-[#374151] transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
              )}
            </div>

            {editingAbout && aboutDraft ? (
              <div className="space-y-4">
                {aboutFields.map((f) => (
                  <div key={f.key} className="grid grid-cols-3 gap-4 items-start">
                    <label className="flex items-center gap-2 text-[13px] text-[#6B7280] pt-2">{f.icon} {f.label}</label>
                    <div className="col-span-2">
                      {f.key === "niche" ? (
                        <input
                          value={(aboutDraft.niche || []).join(", ")}
                          onChange={(e) => setAboutDraft({ ...aboutDraft, niche: e.target.value.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3) })}
                          placeholder="e.g. Podcast, Storytelling (max 3, comma-separated)"
                          className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F26522]"
                        />
                      ) : f.key === "channelURL" ? (
                        <input
                          value={aboutDraft.channelURL}
                          onChange={(e) => setAboutDraft({ ...aboutDraft, channelURL: e.target.value })}
                          placeholder="https://youtube.com/c/yourchannel"
                          className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F26522]"
                        />
                      ) : (
                        <input
                          value={aboutDraft[f.key] as string}
                          onChange={(e) => setAboutDraft({ ...aboutDraft, [f.key]: e.target.value })}
                          placeholder={`Add ${f.label.toLowerCase()}`}
                          className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#F26522]"
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={saveAbout} className="rounded-lg bg-[#F26522] px-5 py-2 text-sm font-bold text-white hover:bg-[#D4551A]">Save changes</button>
                  <button onClick={() => setEditingAbout(false)} className="text-sm font-medium text-[#6B7280] hover:text-[#111827]">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {aboutFields.map((f) => {
                  const val = profile.about[f.key];
                  const isEmpty = Array.isArray(val) ? val.length === 0 : !val;

                  if (!isOwner && isEmpty) return null;

                  return (
                    <div key={f.key} className="grid grid-cols-3 gap-4 items-center">
                      <span className="flex items-center gap-2 text-[13px] text-[#6B7280]">{f.icon} {f.label}</span>
                      <div className="col-span-2">
                        {isEmpty ? (
                          <button onClick={startEditAbout} className="text-[13px] font-bold text-[#F26522] hover:underline">
                            + Add {f.label.toLowerCase()}
                          </button>
                        ) : f.key === "niche" ? (
                          <div className="flex flex-wrap gap-1.5">
                            {(val as string[]).map((tag) => (
                              <span key={tag} className="rounded-full bg-[#FFF3EE] px-2.5 py-0.5 text-[12px] font-bold text-[#F26522]">{tag}</span>
                            ))}
                          </div>
                        ) : f.key === "channelURL" ? (
                          <a href={val as string} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-[#F26522] hover:underline flex items-center gap-1">
                            {val as string} <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-[#111827]">{val as string}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
