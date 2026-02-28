"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ArrowRight, LogOut,
  ChevronDown, Pencil, Settings, Monitor, Search, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import EditRolesModal from "@/components/dashboard/edit-roles-modal";

const navLinks = [
  { label: "Find Crew by Skills", href: "/find-crews" },
  { label: "Post a Job", href: "/post-job" },
  { label: "Find Work", href: "/find-work" },
  { label: "Your Creators", href: "/creators" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [rolesModalOpen, setRolesModalOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    router.push("/");
    setMobileOpen(false);
    setProfileOpen(false);
  };

  const closeAll = () => {
    setProfileOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-brand-dark font-[family-name:var(--font-display)]">
              Create
            </span>
            <span className="text-xl font-bold tracking-tight text-brand-coral font-[family-name:var(--font-display)]">
              Crew
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-brand-gray transition-colors hover:text-brand-dark"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden items-center gap-3 lg:flex">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-brand-surface" />
            ) : user ? (
              <>
                <Link
                  href="/dashboard/messages"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>

                {/* Profile Dropdown Trigger */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-brand-surface"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                      style={{ background: `linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo})` }}
                    >
                      {user.avatar}
                    </div>
                    <span className="text-sm font-medium text-brand-dark">{user.name.split(" ")[0]}</span>
                    <ChevronDown className={`h-3.5 w-3.5 text-brand-gray transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-border/60 bg-white py-1.5 shadow-lg"
                      >
                        {/* User Info */}
                        <div className="px-3 py-2.5 border-b border-border/40">
                          <p className="text-sm font-semibold text-brand-dark">{user.name}</p>
                          <p className="text-[10px] text-brand-gray">@{user.username}</p>
                        </div>

                        {/* Role Views */}
                        <div className="py-1 border-b border-border/40">
                          {user.creatorMode && (
                            <Link
                              href={`/creator/${user.username}`}
                              onClick={closeAll}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                            >
                              <Monitor className="h-3.5 w-3.5" />
                              Creator Profile
                            </Link>
                          )}
                          {user.freelancerMode && (
                            <Link
                              href="/dashboard?view=freelancer"
                              onClick={closeAll}
                              className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                            >
                              <Search className="h-3.5 w-3.5" />
                              Freelancer View
                            </Link>
                          )}
                        </div>

                        {/* Settings */}
                        <div className="py-1 border-b border-border/40">
                          <Link
                            href="/dashboard/edit-profile"
                            onClick={closeAll}
                            className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit General Profile
                          </Link>
                          <button
                            onClick={() => { setProfileOpen(false); setRolesModalOpen(true); }}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                          >
                            <Settings className="h-3.5 w-3.5" />
                            Edit Roles
                          </button>
                        </div>

                        {/* Sign Out */}
                        <div className="py-1">
                          <button
                            onClick={handleSignOut}
                            className="flex w-full items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                          >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/become-crew">
                  <Button variant="outline" size="sm" className="rounded-md border-brand-indigo/30 text-brand-indigo hover:bg-brand-indigo/5 font-semibold">
                    Become a Crew
                  </Button>
                </Link>
                <Link href="/signin" className="text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors">
                  Sign In
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-brand-coral text-white hover:bg-brand-coral-dark rounded-md font-semibold">
                    Join
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-md lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5 text-brand-dark" /> : <Menu className="h-5 w-5 text-brand-dark" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-border/60 bg-white lg:hidden"
            >
              <div className="mx-auto max-w-7xl space-y-1 px-5 pb-5 pt-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray transition-colors hover:bg-brand-surface hover:text-brand-dark"
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-border/40 pt-3 mt-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-2.5 px-3 py-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                          style={{ background: `linear-gradient(135deg, ${user.gradientFrom}, ${user.gradientTo})` }}
                        >
                          {user.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-brand-dark">{user.name}</p>
                          <p className="text-[10px] text-brand-gray">@{user.username}</p>
                        </div>
                      </div>

                      {user.creatorMode && (
                        <Link
                          href={`/creator/${user.username}`}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                        >
                          <Monitor className="h-3.5 w-3.5" /> Creator Profile
                        </Link>
                      )}
                      {user.freelancerMode && (
                        <Link
                          href="/dashboard?view=freelancer"
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                        >
                          <Search className="h-3.5 w-3.5" /> Freelancer View
                        </Link>
                      )}
                      
                      <div className="my-1 border-t border-border/40" />
                      
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Messages
                      </Link>

                      <div className="my-1 border-t border-border/40" />

                      <Link
                        href="/dashboard/edit-profile"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit General Profile
                      </Link>
                      <button
                        onClick={() => { setMobileOpen(false); setRolesModalOpen(true); }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray hover:bg-brand-surface hover:text-brand-dark"
                      >
                        <Settings className="h-3.5 w-3.5" /> Edit Roles
                      </button>

                      <div className="border-t border-border/40 my-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-red-500"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/signin"
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md px-3 py-2.5 text-sm font-medium text-brand-gray"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="mt-1 block rounded-md bg-brand-coral px-3 py-2.5 text-center text-sm font-semibold text-white"
                      >
                        Join CreateCrew
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Edit Roles Modal (global) */}
      <AnimatePresence>
        {rolesModalOpen && (
          <EditRolesModal
            open={rolesModalOpen}
            onClose={() => setRolesModalOpen(false)}
            onRolesChanged={() => setRolesModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
