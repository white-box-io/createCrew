"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export default function BecomeCrewCta() {
  const { user } = useAuth();
  const ctaHref = user ? (user.rolesSelected ? "/dashboard" : "/onboarding") : "/signup";

  return (
    <section className="bg-brand-dark py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to Level Up Your Earnings?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/60">
            Join 5,200+ freelancers already building their creator careers on CreateCrew.
          </p>
          <Link href={ctaHref} className="mt-6 inline-block">
            <Button size="lg" className="bg-brand-coral text-white hover:bg-brand-coral-dark rounded-md px-8 text-sm font-semibold">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
