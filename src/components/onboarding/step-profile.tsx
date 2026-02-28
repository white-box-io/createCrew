"use client";

import { Camera } from "lucide-react";
import type { OnboardingData } from "@/app/onboarding/page";

/* ── Top 30 Indian cities ── */
const INDIAN_CITIES = [
  "Mumbai, Maharashtra", "Delhi, NCR", "Bangalore, Karnataka",
  "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Kolkata, West Bengal",
  "Pune, Maharashtra", "Ahmedabad, Gujarat", "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh", "Bhopal, Madhya Pradesh", "Chandigarh, Punjab",
  "Indore, Madhya Pradesh", "Patna, Bihar", "Bhubaneswar, Odisha",
  "Kochi, Kerala", "Guwahati, Assam", "Surat, Gujarat",
  "Nagpur, Maharashtra", "Coimbatore, Tamil Nadu", "Visakhapatnam, Andhra Pradesh",
  "Noida, Uttar Pradesh", "Gurgaon, Haryana", "Thiruvananthapuram, Kerala",
  "Ranchi, Jharkhand", "Dehradun, Uttarakhand", "Vadodara, Gujarat",
  "Mangalore, Karnataka", "Mysore, Karnataka", "Other",
];

interface Props {
  data: OnboardingData;
  onChange: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
}

export default function StepProfile({ data, onChange, onNext }: Props) {
  const initials = data.displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <div>
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold text-brand-coral uppercase tracking-wider mb-1">Almost there!</p>
        <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">Quick profile setup</h1>
        <p className="mt-1.5 text-sm text-brand-gray">Just 3 fields — make it yours.</p>
      </div>

      <div className="rounded-xl border border-border/60 bg-white p-6 space-y-5">
        {/* Photo */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => onChange({ photoUrl: data.photoUrl ? "" : "mock-photo.jpg" })}
            className={`group relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed transition-colors ${
              data.photoUrl
                ? "border-brand-coral bg-brand-coral/10"
                : "border-border/60 bg-brand-surface hover:border-brand-coral/40"
            }`}
          >
            {data.photoUrl ? (
              <span className="text-2xl font-bold text-brand-coral">{initials}</span>
            ) : (
              <Camera className="h-6 w-6 text-brand-gray group-hover:text-brand-coral transition-colors" />
            )}
          </button>
          <p className="text-[10px] text-brand-gray">
            {data.photoUrl ? "Photo added! ✨ Tap to remove" : "Profiles with photos get 3x more responses 📸"}
          </p>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="ob-name" className="mb-1.5 block text-xs font-semibold text-brand-dark">
            Display Name
          </label>
          <input
            id="ob-name"
            type="text"
            value={data.displayName}
            onChange={(e) => onChange({ displayName: e.target.value })}
            placeholder="e.g., Rohan Kapoor"
            className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="ob-location" className="mb-1.5 block text-xs font-semibold text-brand-dark">
            Location
          </label>
          <select
            id="ob-location"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full rounded-md border border-border/60 bg-white px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
          >
            <option value="">Select your city</option>
            {INDIAN_CITIES.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-brand-gray">
            Helps match you with local creators & gigs
          </p>
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!data.displayName.trim()}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand-dark py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
}
