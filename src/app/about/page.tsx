import AboutHero from "@/components/about/about-hero";
import AboutStats from "@/components/about/about-stats";
import AboutStory from "@/components/about/about-story";
import AboutValues from "@/components/about/about-values";
import AboutCta from "@/components/about/about-cta";

export const metadata = {
  title: "About Us — CreateCrew",
  description: "We're building India's first marketplace purpose-built for content creators and the freelancers who power them.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutValues />
      <AboutCta />
    </>
  );
}
