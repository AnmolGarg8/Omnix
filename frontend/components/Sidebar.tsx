"use client";
import Link from "next/link";
import { 
  Home, 
  Target, 
  BarChart2, 
  Bell, 
  Settings,
  Plus
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
      width: '240px',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1A2E1A',
      height: '100vh',
      background: 'rgba(6,10,6,0.6)',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ height: '80px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #1A2E1A' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#00FF6A" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="3" fill="#00FF6A" />
            <path d="M25 11L29 7M16 6L16 1" stroke="#00FF6A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#E8FFE8', letterSpacing: '-0.5px' }}>
            <span style={{ color: '#E8FFE8' }}>Agent</span><span style={{ color: '#00FF6A' }}>For</span><span style={{ color: '#E8FFE8' }}>It</span>
          </span>
        </Link>
      </div>
      
      <nav style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#E8FFE8';
                  e.currentTarget.style.background = '#111A11';
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.color = '#6B9E6B';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '9px 12px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                color: isActive ? '#00FF6A' : '#6B9E6B',
                background: isActive ? 'rgba(0,255,106,0.08)' : 'transparent',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <link.icon size={16} color="currentColor" />
              <span style={{ flex: 1 }}>{link.name}</span>
              {isActive && (
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#00FF6A',
                  boxShadow: '0 0 8px #00FF6A',
                  display: 'inline-block'
                }}/>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '20px', borderTop: '1px solid #1A2E1A', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: '#004D20', border: '1.5px solid #00C44F',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', fontWeight: 700, color: '#00FF6A'
        }}>
          AG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#E8FFE8' }}>Anmol Garg</span>
          <span style={{ fontSize: '10px', color: '#6B9E6B', opacity: 0.7 }}>Master Admin</span>
        </div>
      </div>
    </aside>
  );
};
