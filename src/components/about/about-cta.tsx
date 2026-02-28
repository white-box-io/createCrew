"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutCta() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-coral to-brand-indigo px-8 py-14 text-center sm:px-14 lg:py-20"
        >
          {/* Orbs */}
          <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-white/10 blur-2xl" />

          <h2 className="relative text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            Join the Creator Revolution
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80">
            Whether you&apos;re a creator looking for talent or a freelancer ready to work with the
            best — your next chapter starts here.
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/post-job">
              <Button className="h-11 rounded-md bg-white px-7 text-sm font-semibold text-brand-coral hover:bg-white/90">
                Start Hiring
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/find-crews">
              <Button className="h-11 rounded-md border-2 border-white/30 bg-transparent px-7 text-sm font-semibold text-white hover:bg-white/10">
                Browse Freelancers
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
