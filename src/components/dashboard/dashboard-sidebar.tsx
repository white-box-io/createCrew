"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Bookmark, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  Users, 
  FileText 
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const creatorLinks = [
    { name: "Saved Crew", href: "/dashboard/saved-crew", icon: Users },
    { name: "Manage Jobs", href: "/dashboard/manage-jobs", icon: Briefcase },
  ];

  const freelancerLinks = [
    { name: "Saved Jobs", href: "/dashboard/saved-jobs", icon: Bookmark },
    { name: "Applications", href: "/dashboard/applications", icon: FileText },
  ];

  const sharedLinks = [
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
  ];

  const renderLinks = (title: string, links: typeof creatorLinks) => (
    <div className="mb-6">
      <h3 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
        {title}
      </h3>
      <nav className="flex flex-col gap-1">
        {links.map((link) => {
          // Simple active state checking
          const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#FFF8F5] text-[#F26522]"
                  : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-[#F26522]" : "text-[#9CA3AF]"}`} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <aside className="hidden w-64 shrink-0 border-r border-[#E5E7EB] bg-white px-4 py-8 md:block lg:w-72">
      {renderLinks("Creator POV", creatorLinks)}
      {renderLinks("Freelancer POV", freelancerLinks)}
      
      <div className="mt-2 pt-6 border-t border-[#F3F4F6]">
        <nav className="flex flex-col gap-1">
          {sharedLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#FFF8F5] text-[#F26522]"
                    : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-[#F26522]" : "text-[#9CA3AF]"}`} />
                {link.name}
              </Link>
            );
          })}
          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pathname === "/dashboard/settings"
                ? "bg-[#FFF8F5] text-[#F26522]"
                : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
            }`}
          >
            <Settings className={`h-4 w-4 ${pathname === "/dashboard/settings" ? "text-[#F26522]" : "text-[#9CA3AF]"}`} />
            Settings
          </Link>
        </nav>
      </div>
    </aside>
  );
}
