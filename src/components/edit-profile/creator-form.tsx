"use client";

import { type CreatorProfile, NICHE_OPTIONS, PLATFORM_OPTIONS, TEAM_SIZE_OPTIONS } from "@/lib/profile-data";

interface Props {
  data: CreatorProfile;
  onChange: (data: CreatorProfile) => void;
}

export default function CreatorForm({ data, onChange }: Props) {
  const update = (field: keyof CreatorProfile, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const toggleNiche = (niche: string) => {
    const tags = data.nicheTags.includes(niche)
      ? data.nicheTags.filter((t) => t !== niche)
      : [...data.nicheTags, niche];
    onChange({ ...data, nicheTags: tags });
  };

  return (
    <div className="space-y-5">
      <p className="text-[11px] text-brand-gray leading-relaxed">
        Tell creators about your channel so freelancers can understand your vibe.
      </p>

      {/* Primary Platform */}
      <div>
        <label htmlFor="ep-platform" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Primary Platform <span className="text-red-400">*</span>
        </label>
        <select
          id="ep-platform"
          value={data.primaryPlatform}
          onChange={(e) => update("primaryPlatform", e.target.value)}
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        >
          <option value="">Select platform</option>
          {PLATFORM_OPTIONS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* Channel URL */}
      <div>
        <label htmlFor="ep-channel-url" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Channel / Profile URL
        </label>
        <input
          id="ep-channel-url"
          type="url"
          value={data.channelUrl}
          onChange={(e) => update("channelUrl", e.target.value)}
          placeholder="https://youtube.com/@yourchannel"
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Subscriber Count */}
      <div>
        <label htmlFor="ep-subs" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Subscriber / Follower Count
        </label>
        <input
          id="ep-subs"
          type="text"
          value={data.subscriberCount}
          onChange={(e) => update("subscriberCount", e.target.value)}
          placeholder="e.g., 1.2M or 50K"
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Niche Tags */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">Niche Tags</p>
        <p className="mb-2 text-[10px] text-brand-gray">Pick the niches that match your content</p>
        <div className="flex flex-wrap gap-2">
          {NICHE_OPTIONS.map((niche) => {
            const active = data.nicheTags.includes(niche);
            return (
              <button
                key={niche}
                type="button"
                onClick={() => toggleNiche(niche)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-brand-coral text-white"
                    : "bg-brand-surface text-brand-gray hover:bg-brand-coral/10 hover:text-brand-coral"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Schedule */}
      <div>
        <label htmlFor="ep-schedule" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Upload Schedule
        </label>
        <input
          id="ep-schedule"
          type="text"
          value={data.uploadSchedule}
          onChange={(e) => update("uploadSchedule", e.target.value)}
          placeholder="e.g., 3 videos/week + daily shorts"
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Team Size */}
      <div>
        <label htmlFor="ep-team" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Team Size
        </label>
        <select
          id="ep-team"
          value={data.teamSize}
          onChange={(e) => update("teamSize", e.target.value)}
          className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        >
          <option value="">Select team size</option>
          {TEAM_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* About Channel */}
      <div>
        <label htmlFor="ep-about" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          About the Channel
        </label>
        <textarea
          id="ep-about"
          value={data.aboutChannel}
          onChange={(e) => update("aboutChannel", e.target.value)}
          placeholder="Tell freelancers what your channel is about, your content style, audience demographics..."
          rows={4}
          className="w-full resize-none rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>

      {/* Vision */}
      <div>
        <label htmlFor="ep-vision" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Our Vision
        </label>
        <textarea
          id="ep-vision"
          value={data.vision}
          onChange={(e) => update("vision", e.target.value)}
          placeholder="Where do you see your channel in the next year? What kind of team do you want to build?"
          rows={3}
          className="w-full resize-none rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
        />
      </div>
    </div>
  );
}
