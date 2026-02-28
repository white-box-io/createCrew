"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CategoryHero from "@/components/categories/category-hero";
import SubcategoryGrid from "@/components/categories/subcategory-grid";
import FreelancerSection from "@/components/categories/freelancer-section";
import type { Category } from "@/lib/categories-data";

function CategoryContent({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const searchParams = useSearchParams();
  const subSlug = searchParams.get("sub") || "";
  const selectedSub = subSlug
    ? category.subcategories.find((s) => s.slug === subSlug)
    : undefined;

  return (
    <>
      <CategoryHero
        title={category.title}
        description={category.description}
        teaser={category.teaser}
        iconName={category.iconName}
        iconBg={category.iconBg}
        iconColor={category.iconColor}
        subcategoryCount={category.subcategories.length}
        selectedSubTitle={selectedSub?.title}
        categorySlug={slug}
      />
      <SubcategoryGrid
        subcategories={category.subcategories}
        accentColor={category.iconColor}
        categorySlug={slug}
      />
      <FreelancerSection
        categorySlug={slug}
        subSlug={subSlug}
        subcategory={selectedSub}
        accentColor={category.iconColor}
      />
    </>
  );
}

export default function CategoryPageClient({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  return (
    <Suspense fallback={null}>
      <CategoryContent category={category} slug={slug} />
    </Suspense>
  );
}
