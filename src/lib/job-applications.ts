/* ── Job Applications Data Layer ── */
/* localStorage-based for dummy frontend */

const APPLICATIONS_KEY = "createcrew_job_applications";

export type ApplicationStatus = "submitted" | "shortlisted" | "hired" | "rejected";

export interface JobApplication {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerUsername: string;
  freelancerAvatar: string;
  freelancerGradientFrom: string;
  freelancerGradientTo: string;
  freelancerRating: number;        // e.g. 4.8
  proposedPrice: number;
  deliveryDays: number;
  portfolioSampleUrl: string;
  pitch: string;                   // max 300 chars
  questionForCreator?: string;
  position: number;                // e.g. 7 (of 15)
  status: ApplicationStatus;
  createdAt: string;               // ISO
}

/* ── localStorage Helpers ── */

function getAll(): JobApplication[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(APPLICATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveAll(apps: JobApplication[]): void {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(apps));
}

/* ── Public API ── */

export function getApplicationsForJob(jobId: string): JobApplication[] {
  return getAll().filter((a) => a.jobId === jobId);
}

export function getMyApplications(freelancerId: string): JobApplication[] {
  return getAll().filter((a) => a.freelancerId === freelancerId);
}

export function hasApplied(jobId: string, freelancerId: string): boolean {
  return getAll().some((a) => a.jobId === jobId && a.freelancerId === freelancerId);
}

export function getApplicationById(id: string): JobApplication | null {
  return getAll().find((a) => a.id === id) || null;
}

export function submitApplication(app: Omit<JobApplication, "id" | "position" | "status" | "createdAt">): JobApplication {
  const all = getAll();
  const jobApps = all.filter((a) => a.jobId === app.jobId);
  const position = jobApps.length + 1;

  const newApp: JobApplication = {
    ...app,
    id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    position,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  all.push(newApp);
  saveAll(all);
  return newApp;
}

export function shortlistApplication(appId: string): void {
  const all = getAll();
  const app = all.find((a) => a.id === appId);
  if (app) {
    app.status = "shortlisted";
    saveAll(all);
  }
}

export function hireApplication(appId: string): void {
  const all = getAll();
  const app = all.find((a) => a.id === appId);
  if (app) {
    // Hire this one, reject others for the same job
    app.status = "hired";
    all.forEach((a) => {
      if (a.jobId === app.jobId && a.id !== appId && a.status !== "shortlisted") {
        a.status = "rejected";
      }
    });
    saveAll(all);
  }
}

export function rejectApplication(appId: string): void {
  const all = getAll();
  const app = all.find((a) => a.id === appId);
  if (app) {
    app.status = "rejected";
    saveAll(all);
  }
}

export function getShortlistedCount(jobId: string): number {
  return getAll().filter((a) => a.jobId === jobId && a.status === "shortlisted").length;
}
