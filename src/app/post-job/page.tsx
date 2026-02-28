import PostJobForm from "@/components/post-job/post-job-form";
import PostJobSidebar from "@/components/post-job/post-job-sidebar";

export const metadata = {
  title: "Post a Job — CreateCrew",
  description: "Post your job and find the perfect freelancer for your content team.",
};

export default function PostJobPage() {
  return (
    <section className="bg-brand-surface py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">
            Post a Job
          </h1>
          <p className="mt-2 text-sm text-brand-gray">
            Tell us what you need — we&apos;ll match you with the right creator.
          </p>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          <div className="flex-1">
            <PostJobForm />
          </div>
          <div className="hidden w-72 flex-shrink-0 lg:block">
            <PostJobSidebar />
          </div>
        </div>
      </div>
    </section>
  );
}
