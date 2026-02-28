"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, X, Check, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { categories } from "@/lib/categories-data";
import { saveGig, DELIVERY_OPTIONS } from "@/lib/gig-data";

export default function NewGigPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [subcategorySlug, setSubcategorySlug] = useState("");
  const [startingPrice, setStartingPrice] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Protected route
  if (!isLoading && !user) {
    router.push("/signin");
    return null;
  }

  if (!isLoading && user && !user.freelancerMode) {
    router.push("/dashboard");
    return null;
  }

  if (isLoading || !user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-indigo border-t-transparent" />
      </div>
    );
  }

  const selectedCategory = categories.find((c) => c.slug === categorySlug);
  const subcategories = selectedCategory?.subcategories || [];

  const addUrl = () => {
    const trimmed = urlInput.trim();
    if (trimmed && !portfolioUrls.includes(trimmed)) {
      setPortfolioUrls([...portfolioUrls, trimmed]);
    }
    setUrlInput("");
  };

  const removeUrl = (url: string) => {
    setPortfolioUrls(portfolioUrls.filter((u) => u !== url));
  };

  const validate = (): boolean => {
    const errs: Record<string, boolean> = {};
    if (!title.trim()) errs.title = true;
    if (!description.trim()) errs.description = true;
    if (!categorySlug) errs.category = true;
    if (!subcategorySlug) errs.subcategory = true;
    if (!startingPrice.trim()) errs.price = true;
    if (!deliveryTime) errs.delivery = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setSaving(true);

    saveGig({
      userId: user.id,
      title: title.trim(),
      description: description.trim(),
      category: categorySlug,
      subcategory: subcategorySlug,
      startingPrice: startingPrice.trim(),
      deliveryTime,
      portfolioUrls,
    });

    setTimeout(() => {
      setSaving(false);
      setShowToast(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }, 400);
  };

  const inputCls = (field: string) =>
    `w-full rounded-md border bg-white px-3 py-2.5 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none transition-colors focus:ring-1 ${
      errors[field]
        ? "border-red-300 focus:border-red-400 focus:ring-red-200"
        : "border-border/60 focus:border-brand-indigo/50 focus:ring-brand-indigo/20"
    }`;

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-brand-surface pb-12 pt-8">
      <div className="mx-auto max-w-2xl px-5 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            href="/dashboard"
            className="mb-3 flex items-center gap-1 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-brand-indigo" />
            <h1 className="text-xl font-bold text-brand-dark sm:text-2xl">Create a Gig</h1>
          </div>
          <p className="mt-1 text-xs text-brand-gray">Attract creators fast — fill out the details below 🚀</p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-xl border border-border/60 bg-white p-6 space-y-5"
        >
          {/* Title */}
          <div>
            <label htmlFor="gig-title" className="mb-1.5 block text-xs font-semibold text-brand-dark">
              Gig Title <span className="text-red-400">*</span>
            </label>
            <input
              id="gig-title"
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setErrors({ ...errors, title: false }); }}
              placeholder="e.g., Professional YouTube Thumbnail Design"
              className={inputCls("title")}
            />
            {errors.title && <p className="mt-1 text-[10px] text-red-500">Title is required</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="gig-desc" className="mb-1.5 block text-xs font-semibold text-brand-dark">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="gig-desc"
              value={description}
              onChange={(e) => { setDescription(e.target.value); setErrors({ ...errors, description: false }); }}
              placeholder="Describe what you'll deliver, your process, and why creators should pick you..."
              rows={4}
              className={`resize-none ${inputCls("description")}`}
            />
            {errors.description && <p className="mt-1 text-[10px] text-red-500">Description is required</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="gig-cat" className="mb-1.5 block text-xs font-semibold text-brand-dark">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              id="gig-cat"
              value={categorySlug}
              onChange={(e) => {
                setCategorySlug(e.target.value);
                setSubcategorySlug("");
                setErrors({ ...errors, category: false });
              }}
              className={inputCls("category")}
            >
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-[10px] text-red-500">Category is required</p>}
          </div>

          {/* Subcategory */}
          <div>
            <label htmlFor="gig-sub" className="mb-1.5 block text-xs font-semibold text-brand-dark">
              Subcategory <span className="text-red-400">*</span>
            </label>
            <select
              id="gig-sub"
              value={subcategorySlug}
              onChange={(e) => { setSubcategorySlug(e.target.value); setErrors({ ...errors, subcategory: false }); }}
              disabled={!categorySlug}
              className={`${inputCls("subcategory")} disabled:opacity-50`}
            >
              <option value="">
                {categorySlug ? "Select a subcategory" : "Pick a category first"}
              </option>
              {subcategories.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </select>
            {errors.subcategory && <p className="mt-1 text-[10px] text-red-500">Subcategory is required</p>}
          </div>

          {/* Price + Delivery */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="gig-price" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                Starting Price <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-brand-gray-light">₹</span>
                <input
                  id="gig-price"
                  type="text"
                  value={startingPrice}
                  onChange={(e) => { setStartingPrice(e.target.value); setErrors({ ...errors, price: false }); }}
                  placeholder="e.g., 800"
                  className={`pl-7 ${inputCls("price")}`}
                />
              </div>
              {errors.price && <p className="mt-1 text-[10px] text-red-500">Price is required</p>}
            </div>
            <div>
              <label htmlFor="gig-delivery" className="mb-1.5 block text-xs font-semibold text-brand-dark">
                Delivery Time <span className="text-red-400">*</span>
              </label>
              <select
                id="gig-delivery"
                value={deliveryTime}
                onChange={(e) => { setDeliveryTime(e.target.value); setErrors({ ...errors, delivery: false }); }}
                className={inputCls("delivery")}
              >
                <option value="">Select delivery time</option>
                {DELIVERY_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {errors.delivery && <p className="mt-1 text-[10px] text-red-500">Delivery time is required</p>}
            </div>
          </div>

          {/* Portfolio URLs */}
          <div>
            <p className="mb-1.5 text-xs font-semibold text-brand-dark">Portfolio Examples</p>
            <p className="mb-2 text-[10px] text-brand-gray">Add links to your best work (Behance, Dribbble, YouTube, Drive)</p>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                placeholder="https://..."
                className="flex-1 rounded-md border border-border/60 bg-white px-3 py-2 text-sm text-brand-dark placeholder:text-brand-gray-light outline-none focus:border-brand-indigo/50 focus:ring-1 focus:ring-brand-indigo/20"
              />
              <button
                type="button"
                onClick={addUrl}
                className="flex items-center gap-1 rounded-md bg-brand-indigo px-3 py-2 text-xs font-semibold text-white hover:bg-brand-indigo/90"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {portfolioUrls.length > 0 && (
              <div className="mt-2.5 space-y-1.5">
                {portfolioUrls.map((url) => (
                  <div key={url} className="flex items-center justify-between rounded-md bg-brand-surface px-3 py-2">
                    <a href={url} target="_blank" rel="noopener noreferrer" className="truncate text-[11px] text-brand-indigo hover:underline">
                      {url}
                    </a>
                    <button type="button" onClick={() => removeUrl(url)} className="ml-2 text-brand-gray hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between border-t border-border/40 pt-5">
            <p className="text-[10px] text-brand-gray">Fields marked with * are required</p>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex items-center gap-2 rounded-md bg-brand-dark px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark/90 disabled:opacity-60"
            >
              {saving ? "Creating..." : "Create Gig"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-lg">
              <Check className="h-4 w-4" />
              Gig created! It&apos;s now live in searches 🔥
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
