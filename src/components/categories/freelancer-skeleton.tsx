export default function FreelancerSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border border-border/40 bg-white p-5">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-brand-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 rounded bg-brand-surface" />
          <div className="h-3 w-20 rounded bg-brand-surface" />
        </div>
      </div>

      {/* Meta */}
      <div className="mb-4 flex gap-4">
        <div className="h-3 w-16 rounded bg-brand-surface" />
        <div className="h-3 w-14 rounded bg-brand-surface" />
        <div className="h-3 w-12 rounded bg-brand-surface" />
      </div>

      {/* Tags */}
      <div className="mb-3 flex gap-1.5">
        <div className="h-5 w-14 rounded-md bg-brand-surface" />
        <div className="h-5 w-16 rounded-md bg-brand-surface" />
        <div className="h-5 w-12 rounded-md bg-brand-surface" />
      </div>

      {/* Bio */}
      <div className="mb-4 h-3.5 w-full rounded bg-brand-surface" />

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/40 pt-4">
        <div className="space-y-1.5">
          <div className="h-2.5 w-16 rounded bg-brand-surface" />
          <div className="h-4 w-14 rounded bg-brand-surface" />
        </div>
        <div className="h-7 w-20 rounded-md bg-brand-surface" />
      </div>
    </div>
  );
}
