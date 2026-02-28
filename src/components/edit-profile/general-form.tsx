"use client";

import { type GeneralProfile } from "@/lib/profile-data";
import type { MockUser } from "@/lib/mock-auth";

interface Props {
  data: GeneralProfile;
  onChange: (data: GeneralProfile) => void;
  user: MockUser;
}

const SOCIAL_FIELDS: { key: keyof GeneralProfile["socials"]; label: string; placeholder: string; icon: string }[] = [
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: "▶" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle", icon: "◎" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourhandle", icon: "𝕏" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourhandle", icon: "♪" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile", icon: "in" },
];

export default function GeneralForm({ data, onChange, user }: Props) {
  const update = (field: keyof GeneralProfile, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const updateSocial = (key: keyof GeneralProfile["socials"], value: string) => {
    onChange({ ...data, socials: { ...data.socials, [key]: value } });
  };

  return (
    <div className="space-y-5">
      {/* Avatar Preview */}
      <div className="flex items-center gap-4">
        <div
          className="flex h-16 w-16 items-center justify-center rounded-full text-lg font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo})` }}
        >
          {(data.name || user.name).split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-dark">{data.name || user.name}</p>
          <p className="text-[10px] text-brand-gray">Avatar is auto-generated from your name</p>
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label htmlFor="ep-name" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Display Name <span className="text-red-400">*</span>
        </label>
        <input
          id="ep-name"
          type="text"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Your full name"
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Username */}
      <div>
        <label htmlFor="ep-username" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Username <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray-light">@</span>
          <input
            id="ep-username"
            type="text"
            value={data.username}
            onChange={(e) => update("username", e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            placeholder="yourhandle"
            className="w-full rounded-md border border-border/60 bg-white py-2.5 pl-8 pr-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          />
        </div>
        {data.username && (
          <p className="mt-1 text-[10px] text-green-600 font-medium">✓ @{data.username} looks available</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label htmlFor="ep-location" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Location
        </label>
        <input
          id="ep-location"
          type="text"
          value={data.location}
          onChange={(e) => update("location", e.target.value)}
          placeholder="e.g., Mumbai, India"
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="ep-bio" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Short Bio
        </label>
        <textarea
          id="ep-bio"
          value={data.bio}
          onChange={(e) => update("bio", e.target.value.slice(0, 200))}
          placeholder="Tell creators what you're about... (max 200 chars)"
          rows={3}
          className="w-full resize-none rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
        <p className="mt-0.5 text-right text-[10px] text-brand-gray-light">{data.bio.length}/200</p>
      </div>

      {/* Social Links */}
      <div>
        <p className="mb-3 text-xs font-semibold text-brand-dark">Social Links</p>
        <div className="space-y-2.5">
          {SOCIAL_FIELDS.map((field) => (
            <div key={field.key} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-surface text-[10px] font-bold text-brand-gray">
                {field.icon}
              </span>
              <input
                type="url"
                value={data.socials[field.key]}
                onChange={(e) => updateSocial(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="flex-1 rounded-md border border-border/60 bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
