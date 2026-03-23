import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  Home, 
  Target, 
  BarChart2, 
  Bell, 
  Settings,
  Plus
} from "lucide-react";

const NAV_LINKS = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Missions", icon: Target, href: "/dashboard/missions" },
  { name: "Results", icon: BarChart2, href: "/dashboard/results" },
  { name: "Alerts", icon: Bell, href: "/dashboard/alerts" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="w-[240px] flex flex-col border-r border-[#1E1E2E] h-screen bg-[#111118]">
      <div className="h-16 flex items-center px-6 border-b border-[#1E1E2E]">
        <Link href="/dashboard" className="text-xl font-heading font-bold text-[#6366F1]">
          OMNIX
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors 
                     hover:bg-[#1E1E2E] text-[#94A3B8] hover:text-[#F1F5F9] group font-medium"
          >
            <link.icon className="w-5 h-5" />
            <span>{link.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1E1E2E] flex items-center gap-3">
        <UserButton afterSignOutUrl="/" />
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate">...</span>
          <span className="text-xs text-[#94A3B8] truncate">Account</span>
        </div>
      </div>
    </aside>
  );
};
