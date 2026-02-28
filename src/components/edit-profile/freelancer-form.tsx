"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  type FreelancerProfile,
  NICHE_OPTIONS,
  AVAILABILITY_OPTIONS,
  BADGE_OPTIONS,
} from "@/lib/profile-data";

interface Props {
  data: FreelancerProfile;
  onChange: (data: FreelancerProfile) => void;
}

export default function FreelancerForm({ data, onChange }: Props) {
  const [skillInput, setSkillInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");

  const toggleArrayItem = (field: "availability" | "badges" | "preferredNiches", item: string) => {
    const arr = data[field] as string[];
    const updated = arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
    onChange({ ...data, [field]: updated });
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skill) });
  };

  const addPortfolioUrl = () => {
    const trimmed = portfolioInput.trim();
    if (trimmed && !data.portfolioUrls.includes(trimmed)) {
      onChange({ ...data, portfolioUrls: [...data.portfolioUrls, trimmed] });
    }
    setPortfolioInput("");
  };

  const removePortfolioUrl = (url: string) => {
    onChange({ ...data, portfolioUrls: data.portfolioUrls.filter((u) => u !== url) });
  };

  return (
    <div className="space-y-5">
      <p className="text-[11px] text-brand-gray leading-relaxed">
        Add your best skills to attract creators. Make your profile pop! 🎨
      </p>

      {/* Skills */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">
          Skills & Services <span className="text-red-400">*</span>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
            placeholder="Type a skill and press Enter"
            className="flex-1 rounded-md border border-border/60 bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          />
          <button
            type="button"
            onClick={addSkill}
            className="flex items-center gap-1 rounded-md bg-brand-indigo px-3 py-2 text-xs font-semibold text-white hover:bg-brand-indigo/90"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {data.skills.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {data.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full bg-brand-indigo/10 px-2.5 py-1 text-[11px] font-medium text-brand-indigo"
              >
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Starting Price */}
      <div>
        <label htmlFor="ep-price" className="mb-1.5 block text-xs font-semibold text-brand-dark">
          Starting Price
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray-light">₹</span>
          <input
            id="ep-price"
            type="text"
            value={data.startingPrice}
            onChange={(e) => onChange({ ...data, startingPrice: e.target.value })}
            placeholder="e.g., 2,000"
            className="w-full rounded-md border border-border/60 bg-white py-2.5 pl-8 pr-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          />
        </div>
        <p className="mt-0.5 text-[10px] text-brand-gray-light">Your minimum rate — displayed as &quot;From ₹{data.startingPrice || "XXX"}&quot;</p>
      </div>

      {/* Availability */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">Availability</p>
        <div className="flex flex-wrap gap-2">
          {AVAILABILITY_OPTIONS.map((opt) => {
            const active = data.availability.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleArrayItem("availability", opt)}
                className={`rounded-md border px-3 py-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "border-brand-indigo bg-brand-indigo/10 text-brand-indigo"
                    : "border-border/60 bg-white text-brand-gray hover:border-brand-indigo/30"
                }`}
              >
                {active && "✓ "}{opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">Badges</p>
        <p className="mb-2 text-[10px] text-brand-gray">Toggle the badges you want on your profile</p>
        <div className="flex flex-wrap gap-2">
          {BADGE_OPTIONS.map((badge) => {
            const active = data.badges.includes(badge);
            return (
              <button
                key={badge}
                type="button"
                onClick={() => toggleArrayItem("badges", badge)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-green-100 text-green-700"
                    : "bg-brand-surface text-brand-gray hover:bg-green-50"
                }`}
              >
                {active ? "✓ " : ""}{badge}
              </button>
            );
          })}
        </div>
      </div>

      {/* Portfolio URLs */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">Portfolio Links</p>
        <p className="mb-2 text-[10px] text-brand-gray">Add links to your best work (Behance, Dribbble, YouTube, Drive, etc.)</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={portfolioInput}
            onChange={(e) => setPortfolioInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolioUrl())}
            placeholder="https://..."
            className="flex-1 rounded-md border border-border/60 bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          />
          <button
            type="button"
            onClick={addPortfolioUrl}
            className="flex items-center gap-1 rounded-md bg-brand-indigo px-3 py-2 text-xs font-semibold text-white hover:bg-brand-indigo/90"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>
        {data.portfolioUrls.length > 0 && (
          <div className="mt-2.5 space-y-1.5">
            {data.portfolioUrls.map((url) => (
              <div key={url} className="flex items-center justify-between rounded-md bg-brand-surface px-3 py-2">
                <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-[11px] text-brand-indigo hover:underline">
                  {url}
                </a>
                <button type="button" onClick={() => removePortfolioUrl(url)} className="ml-2 text-brand-gray hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferred Niches */}
      <div>
        <p className="mb-2 text-xs font-semibold text-brand-dark">Preferred Niches</p>
        <p className="mb-2 text-[10px] text-brand-gray">What type of creators do you like working with?</p>
        <div className="flex flex-wrap gap-2">
          {NICHE_OPTIONS.map((niche) => {
            const active = data.preferredNiches.includes(niche);
            return (
              <button
                key={niche}
                type="button"
                onClick={() => toggleArrayItem("preferredNiches", niche)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-brand-indigo text-white"
                    : "bg-brand-surface text-brand-gray hover:bg-brand-indigo/10 hover:text-brand-indigo"
                }`}
              >
                {niche}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
