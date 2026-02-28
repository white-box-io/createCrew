"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search } from "lucide-react";
import { mockFreelancers } from "@/lib/mock-freelancers";
import CrewCard from "@/components/find-crews/crew-card";
import MessageModal from "@/components/find-crews/message-modal";

export default function SavedCrewPage() {
  // For now, let's pretend the first 3 freelancers are "saved"
  const [savedCrew, setSavedCrew] = useState(mockFreelancers.slice(0, 3));
  const [messageTarget, setMessageTarget] = useState<any | null>(null);

  return (
    <div className="p-6 lg:p-10 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#111827] sm:text-3xl">Saved Crew</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          Freelancers you've bookmarked for current or future projects.
        </p>
      </div>

      {savedCrew.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white py-24 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF8F5]">
            <Users className="h-8 w-8 text-[#F26522]" />
          </div>
          <h2 className="mb-2 text-lg font-bold text-[#111827]">No crew saved yet</h2>
          <p className="mb-6 max-w-sm text-sm text-[#6B7280]">
            Keep track of your favorite creators and freelancers by bookmarking their profiles.
          </p>
          <Link
            href="/find-crew"
            className="flex items-center gap-2 rounded-xl bg-[#F26522] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#D4551A] hover:shadow"
          >
            <Search className="h-4 w-4" />
            Browse Find Crew
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedCrew.map((person) => (
            <CrewCard 
              key={person.id} 
              person={person} 
              onMessage={(p) => setMessageTarget(p)}
            />
          ))}
        </div>
      )}

      {/* Message Modal */}
      {messageTarget && (
        <MessageModal
          person={messageTarget}
          onClose={() => setMessageTarget(null)}
        />
      )}
    </div>
  );
}
