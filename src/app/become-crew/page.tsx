import BecomeCrewHero from "@/components/become-crew/become-crew-hero";
import BecomeCrewBenefits from "@/components/become-crew/become-crew-benefits";
import BecomeCrewStats from "@/components/become-crew/become-crew-stats";
import BecomeCrewCta from "@/components/become-crew/become-crew-cta";

export const metadata = {
  title: "Become a Crew — CreateCrew",
  description: "Join India's fastest-growing creator marketplace as a freelancer. Work with top YouTubers, get guaranteed payments, and grow your career.",
};

export default function BecomeCrewPage() {
  return (
    <>
      <BecomeCrewHero />
      <BecomeCrewBenefits />
      <BecomeCrewStats />
      <BecomeCrewCta />
    </>
  );
}
