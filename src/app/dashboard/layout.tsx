import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#F9FAFB]">
      <DashboardSidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Mobile notice for now */}
        <div className="block border-b border-[#E5E7EB] bg-white px-4 py-3 md:hidden">
          <p className="text-xs font-semibold text-[#6B7280]">
            Dashboard navigation is currently optimized for desktop.
          </p>
        </div>
        {children}
      </main>
    </div>
  );
}
