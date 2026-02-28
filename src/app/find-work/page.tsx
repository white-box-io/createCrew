import FindWorkHero from "@/components/find-work/find-work-hero";
import JobGrid from "@/components/find-work/job-grid";

export const metadata = {
  title: "Find Work — CreateCrew",
  description: "Browse open jobs from India's top content creators. Apply directly and start working.",
};

export default function FindWorkPage() {
  return (
    <>
      <FindWorkHero />
      <JobGrid />
    </>
  );
}
