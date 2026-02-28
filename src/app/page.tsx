import Hero from "@/components/landing/hero";
import TrustedBy from "@/components/landing/trusted-by";
import Categories from "@/components/landing/categories";
import HowItWorks from "@/components/landing/how-it-works";
import FeaturedFreelancers from "@/components/landing/featured-freelancers";
import Testimonials from "@/components/landing/testimonials";
import CtaBanner from "@/components/landing/cta-banner";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Categories />
      <HowItWorks />
      <FeaturedFreelancers />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
