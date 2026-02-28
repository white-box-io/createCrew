"use client";

import { Youtube, Instagram, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: ["Find Crew by Skills", "Browse Services", "Post a Job", "Become a Freelancer"],
  Company: ["About Us", "Careers", "Blog", "Contact"],
  Resources: ["Help Center", "Trust & Safety", "Community", "Pricing"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Policy"],
};

const socials = [
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "X / Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-brand-dark font-[family-name:var(--font-display)]">
                Create
              </span>
              <span className="text-xl font-bold tracking-tight text-brand-coral font-[family-name:var(--font-display)]">
                Crew
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-gray">
              The operating system for India&rsquo;s creator economy. Build your content squad today.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border/60 text-brand-gray transition-colors hover:border-brand-coral/30 hover:text-brand-coral"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="mb-4 text-sm font-semibold text-brand-dark">{heading}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-brand-gray transition-colors hover:text-brand-dark">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-brand-gray-light">
            © {new Date().getFullYear()} CreateCrew. All rights reserved.
          </p>
          <p className="text-xs text-brand-gray-light">
            Made with ❤️ for India&rsquo;s creators
          </p>
        </div>
      </div>
    </footer>
  );
}
