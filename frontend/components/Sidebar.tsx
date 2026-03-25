"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

import { 
  Home, 
  Target, 
  BarChart2, 
  Bell, 
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { name: "Dashboard", icon: Home, href: "/dashboard" },
  { name: "Missions", icon: Target, href: "/dashboard/missions" },
  { name: "Results", icon: BarChart2, href: "/dashboard/results" },
  { name: "Alerts", icon: Bell, href: "/dashboard/alerts" },
  { name: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside style={{
      width: '260px',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'rgba(8, 12, 20, 0.95)',
      borderRight: '1px solid rgba(59, 130, 246, 0.08)',
      backdropFilter: 'blur(20px)',
      padding: '40px 20px',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '60px', padding: '0 20px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#3B82F6" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#F0F6FF', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
            AgentForIt
          </span>
        </Link>
      </div>
      
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '700',
                color: isActive ? '#93C5FD' : '#6B8EAE',
                background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                boxShadow: isActive ? 'inset 0 0 0 1px rgba(59, 130, 246, 0.15)' : 'none',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              <link.icon size={18} strokeWidth={isActive ? 2.5 : 2} color="currentColor" />
              <span>{link.name}</span>
              {isActive && (
                <div style={{
                  marginLeft: 'auto',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#3B82F6',
                  boxShadow: '0 0 8px #3B82F6, 0 0 16px rgba(59, 130, 246, 0.4)',
                  animation: 'dotPulse 2s ease-in-out infinite'
                }}/>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-10 h-10 border border-[#3B82F6]/20 shadow-[0_0_15px_rgba(59, 130, 246,0.1)]"
            }
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#F0F6FF', textTransform: 'uppercase' }}>Active Session</span>
          <span style={{ fontSize: '9px', color: '#6B8EAE', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Authenticated</span>
        </div>
      </div>


    </aside>
  );
};
