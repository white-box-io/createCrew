"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CtaBanner() {
  return (
    <section className="bg-white py-4 lg:py-6">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-brand-coral via-brand-coral-dark to-brand-indigo px-8 py-16 text-center sm:px-16 lg:py-20"
        >
          {/* Decorative elements */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <Zap className="h-5 w-5 text-white" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Build Your Content Squad?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-white/80">
              Join thousands of creators and freelancers already growing together on CreateCrew.
              Zero commission to start.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button className="h-12 rounded-md bg-white px-7 text-sm font-semibold text-brand-coral hover:bg-white/90">
                Start Hiring
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-md border-white/30 bg-transparent px-7 text-sm font-semibold text-white hover:bg-white/10"
              >
                Join as Freelancer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
