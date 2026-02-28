import type { Metadata } from "next";
import FindCrewsClient from "./find-crews-client";

export const metadata: Metadata = {
  title: "Find Crew by Skills — CreateCrew",
  description:
    "Browse verified creators and freelancers by skill. Find video editors, thumbnail designers, scriptwriters, and more.",
};

export default function FindCrewsPage() {
  return <FindCrewsClient />;
}
