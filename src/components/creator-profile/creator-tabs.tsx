"use client";

interface CreatorTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "content", label: "My Content" },
  { id: "jobs", label: "Active Jobs" },
  { id: "about", label: "About" },
];

export default function CreatorTabs({ activeTab, onTabChange }: CreatorTabsProps) {
  return (
    <div className="border-b border-border/60 bg-white">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex items-center gap-0 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative px-5 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-brand-dark"
                  : "text-brand-gray hover:text-brand-dark"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-coral" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
