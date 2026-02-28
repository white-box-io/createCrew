import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
} from "@/lib/categories-data";
import CategoryHero from "@/components/categories/category-hero";
import SubcategoryGrid from "@/components/categories/subcategory-grid";
import CategoryPageClient from "./category-page-client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Pre-generate all category pages at build time */
export function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

/** Dynamic SEO metadata per category */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: `${category.title} — CreateCrew`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return <CategoryPageClient category={category} slug={slug} />;
}
