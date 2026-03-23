import Link from "next/link";
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
    <aside className="w-[220px] flex flex-col border-r border-[#1A2E1A] h-screen bg-[#0D130D]">
      <div className="h-24 flex items-center px-6 border-b border-[#1A2E1A] bg-[#060A06]">
        <Link href="/dashboard" className="flex flex-col gap-1 group">
          <div className="flex items-center gap-3">
            {/* Hexagonal Agent Network Icon */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_8px_rgba(0,255,106,0.4)]">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#00FF6A" strokeWidth="1.5" strokeLinejoin="round" />
              <circle cx="16" cy="16" r="3" fill="#00FF6A" />
              <circle cx="16" cy="6" r="1.5" fill="#00FF6A" />
              <circle cx="25" cy="11" r="1.5" fill="#00FF6A" />
              <circle cx="25" cy="21" r="1.5" fill="#00FF6A" />
              <circle cx="16" cy="26" r="1.5" fill="#00FF6A" />
              <circle cx="7" cy="21" r="1.5" fill="#00FF6A" />
              <circle cx="7" cy="11" r="1.5" fill="#00FF6A" />
              <path d="M16 16L16 6M16 16L25 11M16 16L25 21M16 16L16 26M16 16L7 21M16 16L7 11" stroke="#00FF6A" strokeWidth="1" strokeOpacity="0.5" />
              {/* Upward Arrows */}
              <path d="M25 11L29 7M29 7H26M29 7V10" stroke="#00FF6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 6L16 1M16 1L13 3M16 1L19 3" stroke="#00FF6A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-black tracking-tight flex items-baseline">
              <span className="text-[#E8FFE8]">Agent</span>
              <span className="text-[#00FF6A]">For</span>
              <span className="text-[#E8FFE8]">It</span>
            </span>
          </div>
          <span className="text-[9px] font-black text-[#6B9E6B] tracking-[2px] uppercase opacity-70">
            MULTI-AGENT WEB INTELLIGENCE
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="flex items-center justify-between px-3 py-2 rounded-md transition-colors 
                     hover:bg-[#1E1E2E] text-[#6B9E6B] hover:text-[#00FF6A] group font-medium"
          >
            <div className="flex items-center gap-3">
              <link.icon className="w-5 h-5" />
              <span>{link.name}</span>
            </div>
            {/* Active Dot */}
            <div className="w-[7px] h-[7px] rounded-full bg-[#00FF6A] opacity-0 group-hover:opacity-100 shadow-[0_0_8px_#00FF6A] transition-opacity"></div>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#1A2E1A] flex items-center gap-3 bg-[#111A11]">
        <div className="w-8 h-8 rounded-full bg-[#004D20] border border-[#00FF6A]/30 flex items-center justify-center font-bold text-xs text-[#00FF6A]">
          AG
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate text-[#F1F5F9]">Anmol Garg</span>
          <span className="text-xs text-[#94A3B8] truncate italic">Master Admin</span>
        </div>
      </div>
    </aside>
  );
};
