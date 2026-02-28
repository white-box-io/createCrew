"use client";

import { motion } from "framer-motion";

export default function AboutStory() {
  return (
    <section className="bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-brand-dark">Our Story</h2>
            <div className="mt-4 h-0.5 w-10 rounded-full bg-brand-coral" />
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-brand-gray">
              <p>
                CreateCrew started from a simple frustration: finding the right video editor for a
                YouTube channel shouldn&apos;t feel like searching for a needle in a haystack. Traditional
                freelance platforms weren&apos;t built for creators — they were built for corporates.
              </p>
              <p>
                We set out to change that. In 2024, a group of Indian creators and engineers came
                together to build a marketplace that truly understood the creator economy — where a
                gaming content editor speaks the same language as the creator, and where a thumbnail
                designer knows what &quot;high CTR&quot; really means.
              </p>
              <p>
                Today, CreateCrew connects thousands of creators with specialized freelancers across
                video editing, scripting, thumbnails, growth hacking, and more. Every day, new content
                squads are being built right here.
              </p>
            </div>
          </motion.div>

          {/* What Makes Us Different */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold text-brand-dark">What Makes Us Different</h2>
            <div className="mt-4 h-0.5 w-10 rounded-full bg-brand-indigo" />
            <div className="mt-6 space-y-5">
              {[
                {
                  title: "Creator-Native Categories",
                  desc: "No generic 'graphic design' buckets. Our categories are built for creators — retention editing, viral thumbnails, podcast clipping, and more.",
                },
                {
                  title: "Verified Portfolios",
                  desc: "Every freelancer has a curated portfolio with real work samples, client reviews, and content-specific metrics.",
                },
                {
                  title: "India-First Pricing",
                  desc: "Transparent pricing in INR, no hidden fees, and secure payment protection for both creators and freelancers.",
                },
                {
                  title: "Built for Scale",
                  desc: "Whether you're a 1K subscriber channel or a 10M creator, our platform scales with you — from one-off gigs to monthly retainers.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="text-sm font-semibold text-brand-dark">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-brand-gray">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
