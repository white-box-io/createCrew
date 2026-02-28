"use client";

import { useState } from "react";
import { generateProfile, type ProfileGig, type PortfolioItem, type ProfileReview } from "@/lib/freelancer-profile-generator";
import type { Freelancer } from "@/lib/mock-freelancers";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Calendar, CheckCircle2, Bookmark, MessageSquare, Play } from "lucide-react";
import HireModal from "@/components/freelancer-profile/hire-modal";
import MessageModal from "@/components/find-crews/message-modal";

export default function FreelancerProfilePage({ params }: { params: Promise<{ username: string }> }) {
  // To avoid unwrap issues in client component with async params
  // Next.js 15+ React.use()
  const React = require("react");
  const { username } = React.use(params);

  const [showHireModal, setShowHireModal] = useState(false);
  const [hireGigTarget, setHireGigTarget] = useState<ProfileGig | undefined>(undefined);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // URL decoding fix
  const decodedUsername = decodeURIComponent(username).replace(/^@/, "");
  const generatedProfile = generateProfile(decodedUsername);

  if (!generatedProfile) {
    return (
      <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 bg-[#F9FAFB] px-5">
        <div className="text-5xl">🔍</div>
        <h1 className="text-xl font-bold text-[#111827]">User not found</h1>
        <p className="text-sm text-[#6B7280]">
          @{decodedUsername} doesn&apos;t exist or hasn&apos;t set up a profile yet.
        </p>
        <Link href="/find-crews" className="mt-2 text-sm font-semibold text-[#F26522] hover:underline">
          ← Back to Find Crew
        </Link>
      </section>
    );
  }

  const {
    freelancer: f,
    availability,
    joinedDate,
    responseTime,
    onTimeDeliveryPct,
    repeatClientPct,
  } = generatedProfile;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[#F9FAFB] pb-16 pt-8">
      <div className="mx-auto max-w-4xl px-5 lg:px-8">
        
        {/* Back Link */}
        <Link
          href="/find-crews"
          className="mb-6 flex w-fit items-center gap-1.5 text-xs font-semibold text-[#6B7280] transition-colors hover:text-[#F26522]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to results
        </Link>

        {/* ── Section 1: Profile Header Card ── */}
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 sm:gap-8 justify-between">
            
            {/* Left Column: Info */}
            <div className="flex flex-col sm:flex-row gap-5">
              {/* Avatar + Availability Dot */}
              <div className="relative h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full text-2xl sm:text-3xl font-bold text-white shadow-inner"
                  style={{
                    background: `linear-gradient(135deg, ${f.gradientFrom} 0%, ${f.gradientTo} 100%)`,
                  }}
                >
                  {f.avatar}
                </div>
                {/* Status Dot */}
                <div
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white ring-2 ring-white/50 ${
                    availability === "available" ? "bg-[#10B981]" : "bg-[#9CA3AF]"
                  }`}
                  title={availability === "available" ? "Available now" : "Currently busy"}
                />
              </div>

              {/* Names & Badges */}
              <div className="flex flex-col justify-center">
                <h1 className="text-2xl font-extrabold text-[#111827] sm:text-3xl">{f.name}</h1>
                <p className="text-sm font-medium text-[#6B7280]">@{f.username}</p>
                <p className="mt-1 text-sm font-semibold text-[#374151]">{f.role}</p>
                
                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#2563EB]">
                    <CheckCircle2 className="h-3 w-3" />
                    VERIFIED FREELANCER
                  </span>
                  {f.badges?.includes("Beginner-Friendly") && (
                    <span className="inline-flex items-center rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#059669]">
                      BEGINNER-FRIENDLY
                    </span>
                  )}
                  {f.badges?.includes("Retainer Available") && (
                    <span className="inline-flex items-center rounded-full bg-[#FAF5FF] px-2.5 py-1 text-[10px] font-bold tracking-wide text-[#9333EA]">
                      RETAINER AVAILABLE
                    </span>
                  )}
                </div>

                {/* Meta Row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-[#6B7280]">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {f.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {responseTime}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    Joined {joinedDate}
                  </div>
                  <div className={`flex items-center gap-1.5 ${availability === "available" ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                    {availability === "available" ? "Available for work" : "Not taking new clients"}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-48 sm:pt-4">
              <button 
                onClick={() => {
                  setHireGigTarget(undefined);
                  setShowHireModal(true);
                }}
                className={`flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-bold shadow-sm transition-all duration-200 ${
                  availability === "available" 
                  ? "bg-[#F26522] text-white hover:bg-[#D4551A] hover:shadow" 
                  : "cursor-not-allowed bg-[#F3F4F6] text-[#9CA3AF]"
                }`}
                disabled={availability !== "available"}
              >
                Hire {f.name.split(" ")[0]}
              </button>
              {availability !== "available" && (
                <p className="text-center text-[10px] text-[#6B7280] leading-tight px-1">
                  Currently not taking new projects. You can still message them.
                </p>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowMessageModal(true)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-xs font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </button>
                <button 
                  onClick={() => setIsSaved(!isSaved)}
                  className="group flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 transition-colors hover:bg-[#F9FAFB]"
                >
                  <Bookmark className={`h-4 w-4 transition-colors ${isSaved ? "fill-[#F26522] text-[#F26522]" : "text-[#6B7280] group-hover:text-[#F26522]"}`} />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* ── Section 2: Stats Bar ── */}
        <div className="mb-10 grid grid-cols-2 gap-y-6 divide-x divide-[#E5E7EB] rounded-2xl border border-[#E5E7EB] bg-white py-6 shadow-sm sm:grid-cols-4 sm:gap-y-0">
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <span className="text-2xl font-extrabold text-[#111827]">{f.jobsDone}</span>
            <span className="mt-1 text-xs font-medium text-[#6B7280]">Jobs Completed</span>
          </div>
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-extrabold text-[#111827]">{f.rating.toFixed(1)}</span>
              <span className="text-lg text-[#F59E0B]">★</span>
            </div>
            <span className="mt-1 text-xs font-medium text-[#6B7280]">Average Rating</span>
          </div>
          <div className="flex flex-col items-center justify-center px-4 text-center">
            <span className="text-2xl font-extrabold text-[#111827]">{onTimeDeliveryPct}%</span>
            <span className="mt-1 text-xs font-medium text-[#6B7280]">On-Time Delivery</span>
          </div>
          <div className="flex flex-col items-center justify-center border-l-0 px-4 text-center sm:border-l sm:border-[#E5E7EB]">
            <span className="text-2xl font-extrabold text-[#111827]">{repeatClientPct}%</span>
            <span className="mt-1 text-xs font-medium text-[#6B7280]">Repeat Clients</span>
          </div>
        </div>

        {/* ── Section 3: About ── */}
        <div className="mb-12 rounded-2xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold text-[#111827] mb-4">About {f.name}</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#4B5563] mb-8">
            {generatedProfile.aboutExpanded}
          </p>
          
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {f.tags.map((t: string) => (
                  <span key={t} className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#374151]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {generatedProfile.tools.map((t: string) => (
                  <span key={t} className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#374151]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] mb-3">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {generatedProfile.languages.map((l: string) => (
                  <span key={l} className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-xs font-medium text-[#374151]">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 4: What They Offer (Gigs) ── */}
        <div className="mb-14">
          <h2 className="mb-6 text-xl font-bold text-[#111827]">What {f.name.split(" ")[0]} Offers</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {generatedProfile.gigs.map((gig: ProfileGig, i: number) => (
              <div 
                key={gig.id} 
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}
              >
                <div className="p-5">
                  <span className="mb-3 inline-block rounded border border-[#E5E7EB] bg-[#F9FAFB] px-2 py-0.5 text-[10px] font-semibold text-[#6B7280]">
                    {gig.category}
                  </span>
                  <h3 className="mb-2 text-base font-bold text-[#111827] line-clamp-2 leading-tight">
                    {gig.title}
                  </h3>
                  <p className="mb-4 text-xs text-[#6B7280] line-clamp-3 leading-relaxed">
                    {gig.description}
                  </p>
                  
                  {/* Thumbnails */}
                  <div className="mb-4 flex gap-1 h-12">
                    {gig.thumbnails.map((col: string, idx: number) => (
                      <div key={idx} className="flex-1 rounded-sm" style={{ backgroundColor: col }} />
                    ))}
                  </div>

                  {/* Gig Info */}
                  <div className="flex flex-col gap-2 border-t border-[#F3F4F6] pt-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                      <Clock className="h-3.5 w-3.5" /> Delivery in {gig.deliveryTime}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280]">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Up to {gig.revisions} Revisions
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-[#F9FAFB] p-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">Starting at</p>
                    <p className="text-lg font-extrabold text-[#111827]">₹{gig.startingPrice}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setHireGigTarget(gig);
                      setShowHireModal(true);
                    }}
                    className="rounded-lg bg-white border border-[#E5E7EB] px-4 py-2 text-xs font-bold text-[#F26522] transition-colors hover:bg-[#F26522] hover:text-white"
                  >
                    Hire for This
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 5: Portfolio ── */}
        <div className="mb-14">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#111827]">Portfolio</h2>
            <button className="text-sm font-bold text-[#F26522] hover:underline">
              View All →
            </button>
          </div>
          
          {generatedProfile.portfolioItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {generatedProfile.portfolioItems.slice(0, 6).map((item: PortfolioItem, i: number) => {
                const isSixth = i === 5;
                const hasMore = generatedProfile.portfolioItems.length > 6;
                const moreCount = generatedProfile.portfolioItems.length - 6;

                return (
                  <div 
                    key={item.id}
                    className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl bg-gray-100 animate-in fade-in"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" style={{ backgroundColor: item.color }} />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                          {item.type}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-white/90">
                          <Play className="h-3 w-3 fill-current" /> {item.views}
                        </div>
                      </div>
                      <p className="text-sm font-bold text-white line-clamp-1">{item.title}</p>
                    </div>

                    {/* "+X More" Overlay for 6th item */}
                    {isSixth && hasMore && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                        <span className="text-lg font-bold text-white">+{moreCount} more</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white">
              <p className="text-sm font-medium text-[#6B7280]">Portfolio coming soon</p>
            </div>
          )}
        </div>

        {/* ── Section 6: Reviews ── */}
        <div className="mb-14">
          <h2 className="mb-6 text-xl font-bold text-[#111827]">
            Reviews <span className="text-[#9CA3AF]">({f.reviews})</span>
          </h2>

          {generatedProfile.reviews.length > 0 ? (
            <div className="flex flex-col gap-5">
              {generatedProfile.reviews.map((rev: ProfileReview) => (
                <div key={rev.id} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
                  <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3F4F6] text-sm font-bold text-[#4B5563]">
                        {rev.reviewerInitials}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827]">{rev.reviewerName}</p>
                        <p className="text-xs text-[#6B7280]">{rev.reviewerSubs}</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-sm ${i < rev.rating ? "text-[#F59E0B]" : "text-[#E5E7EB]"}`}>★</span>
                        ))}
                      </div>
                      <p className="text-xs text-[#9CA3AF] mt-1">{rev.timeAgo}</p>
                    </div>
                  </div>

                  <span className="mb-3 inline-block rounded bg-[#F9FAFB] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
                    Gig: {rev.gigRef}
                  </span>
                  <p className="text-sm leading-relaxed text-[#4B5563]">"{rev.text}"</p>
                </div>
              ))}
              {f.reviews > 3 && (
                <button className="mt-2 text-center text-sm font-bold text-[#F26522] hover:underline">
                  Load more reviews →
                </button>
              )}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-[#E5E7EB] bg-white">
              <p className="text-sm font-medium text-[#6B7280]">No reviews yet — be the first to work with {f.name.split(" ")[0]}!</p>
            </div>
          )}
        </div>

        {/* ── Section 7: Similar Freelancers ── */}
        {generatedProfile.similarFreelancers.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-6 text-xl font-bold text-[#111827]">Similar freelancers you might like</h2>
            <div className="-mx-5 flex overflow-x-auto px-5 pb-6 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 gap-5 hide-scrollbar">
              {generatedProfile.similarFreelancers.slice(0, 3).map((sim: Freelancer) => (
                <div key={sim.id} className="min-w-[260px] flex-shrink-0 sm:min-w-0 flex flex-col justify-between rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                  <div>
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-inner" style={{ background: `linear-gradient(135deg, ${sim.gradientFrom} 0%, ${sim.gradientTo} 100%)` }}>
                        {sim.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-[#111827] line-clamp-1">{sim.name}</p>
                        <p className="text-xs text-[#6B7280] line-clamp-1">{sim.role}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4 flex items-center gap-3 text-xs font-medium text-[#6B7280]">
                      <div className="flex items-center gap-1">
                        <span className="text-[#F59E0B] text-sm">★</span> {sim.rating.toFixed(1)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> {sim.location.split(",")[0]}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">From</p>
                      <p className="text-sm font-bold text-[#111827]">₹{sim.price}</p>
                    </div>
                    <Link href={`/freelancer/@${sim.username}`} className="text-xs font-bold text-[#F26522] hover:underline">
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── Modals ── */}
      {showHireModal && (
        <HireModal
          person={f}
          selectedGig={hireGigTarget}
          onClose={() => {
            setShowHireModal(false);
            setHireGigTarget(undefined);
          }}
        />
      )}

      {showMessageModal && (
        <MessageModal
          person={f as any}
          onClose={() => setShowMessageModal(false)}
        />
      )}
    </section>
  );
}
