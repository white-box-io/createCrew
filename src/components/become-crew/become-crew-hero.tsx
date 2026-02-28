"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function BecomeCrewHero() {
  const { user } = useAuth();

  const ctaHref = user ? (user.rolesSelected ? "/dashboard" : "/onboarding") : "/signup";

  return (
    <section className="border-b border-border/40 bg-brand-surface py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-brand-dark sm:text-4xl lg:text-5xl">
            Turn Your Skills into a{" "}
            <span className="bg-gradient-to-r from-brand-coral to-brand-indigo bg-clip-text text-transparent">
              Creator Career
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-brand-gray">
            Join India&apos;s fastest-growing creator marketplace. Work with top YouTubers, Instagram creators, podcasters. Get paid what you deserve.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link href={ctaHref}>
            <Button size="lg" className="bg-brand-coral text-white hover:bg-brand-coral-dark rounded-md px-8 text-sm font-semibold">
              Create Freelancer Profile
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/signin" className="text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors">
            Already have an account? <span className="text-brand-indigo font-semibold">Sign in</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
