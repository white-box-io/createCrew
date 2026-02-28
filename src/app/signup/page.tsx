"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SignUpPage() {
  const router = useRouter();
  const { user, signUp } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  if (user) {
    router.push(user.rolesSelected ? "/dashboard" : "/onboarding");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    const result = signUp({ name: name.trim(), email: email.trim(), password });

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push("/onboarding");
  };

  return (
    <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-brand-surface py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md px-5"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-brand-dark sm:text-3xl">
            Join <span className="text-brand-coral">CreateCrew</span>
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Build your content squad. Start hiring or earning today.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-lg border border-border/60 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-light" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rohan Kapoor"
                  className="w-full rounded-md border border-border/60 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-light" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-border/60 bg-white py-2.5 pl-10 pr-3 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-gray-light" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-md border border-border/60 bg-white py-2.5 pl-10 pr-10 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-gray-light hover:text-brand-gray"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-coral py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-coral-dark disabled:opacity-60"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-[10px] font-medium text-brand-gray-light">OR</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* Google (disabled) */}
          <button
            disabled
            className="flex w-full items-center justify-center gap-2.5 rounded-md border border-border/60 bg-brand-surface py-2.5 text-sm font-medium text-brand-gray-light cursor-not-allowed"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google — Coming soon
          </button>
        </div>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-brand-gray">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-brand-indigo hover:text-brand-indigo/80">
            Sign in
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
