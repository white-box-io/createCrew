"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import type { MockUser } from "@/lib/mock-auth";

interface CheckItem {
  label: string;
  done: boolean;
  href: string;
  action: string;
}

function getChecklist(user: MockUser): CheckItem[] {
  return [
    { label: "Created account", done: true, href: "/dashboard", action: "Done" },
    { label: "Chose your category", done: !!user.selectedCategories && user.selectedCategories.length > 0, href: "/dashboard/edit-profile", action: "Add" },
    { label: "Added a profile photo", done: !!user.photoUrl, href: "/dashboard/edit-profile", action: "Add Photo" },
    { label: "Created your first gig", done: false, href: "/gigs/new", action: "Create Gig" },
    { label: "Added portfolio sample", done: false, href: "/dashboard/edit-profile", action: "Add Now" },
  ];
}

interface Props {
  user: MockUser;
}

export default function GetStartedChecklist({ user }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const items = getChecklist(user);
  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const pct = Math.round((done / total) * 100);

  if (dismissed || done === total) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5 rounded-xl border border-border/60 bg-white overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-brand-dark">Complete your profile</p>
            <span className="rounded-full bg-brand-coral/10 px-2 py-0.5 text-[10px] font-bold text-brand-coral">
              {pct}%
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full max-w-xs rounded-full bg-brand-surface">
            <div
              className="h-full rounded-full bg-brand-coral transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
            className="text-[10px] text-brand-gray hover:text-brand-dark"
          >
            ✕
          </button>
          {collapsed ? (
            <ChevronDown className="h-4 w-4 text-brand-gray" />
          ) : (
            <ChevronUp className="h-4 w-4 text-brand-gray" />
          )}
        </div>
      </button>

      {/* Checklist items */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/40 px-5 py-4 space-y-2.5">
              {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    item.done ? "bg-green-100" : "border-2 border-border/60"
                  }`}>
                    {item.done && <Check className="h-3 w-3 text-green-600" />}
                  </div>
                  <p className={`flex-1 text-xs ${item.done ? "text-brand-gray line-through" : "text-brand-dark font-medium"}`}>
                    {item.label}
                  </p>
                  {!item.done && (
                    <Link
                      href={item.href}
                      className="flex items-center gap-1 rounded-md bg-brand-surface px-2.5 py-1 text-[10px] font-semibold text-brand-indigo hover:bg-brand-indigo/10 transition-colors"
                    >
                      {item.action}
                      <ArrowRight className="h-2.5 w-2.5" />
                    </Link>
                  )}
                </div>
              ))}

              <Link
                href="/dashboard/edit-profile"
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-brand-dark px-4 py-2 text-[11px] font-semibold text-white hover:bg-brand-dark/90 transition-colors"
              >
                Complete Profile
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
