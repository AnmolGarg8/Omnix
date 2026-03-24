"use client";
import Link from "next/link";
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
      background: 'linear-gradient(to right, rgba(6,10,6,0.8), transparent)',
      backdropFilter: 'blur(8px)',
      padding: '40px 20px',
      zIndex: 100
    }}>
      <div style={{ marginBottom: '60px', padding: '0 20px' }}>
        <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(0,255,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0,255,106,0.2)' }}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#00FF6A" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#E8FFE8', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
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
                color: isActive ? '#00FF6A' : '#6B9E6B',
                background: isActive ? 'rgba(0,255,106,0.08)' : 'transparent',
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
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: '#00FF6A',
                  boxShadow: '0 0 10px #00FF6A'
                }}/>
              )}
            </Link>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', opacity: 0.8 }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '12px',
          background: '#004D20', border: '1.5px solid #00FF6A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 800, color: '#00FF6A',
          boxShadow: '0 0 15px rgba(0,255,106,0.1)'
        }}>
          AG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#E8FFE8', textTransform: 'uppercase' }}>Anmol Garg</span>
          <span style={{ fontSize: '9px', color: '#6B9E6B', fontWeight: 700, textTransform: 'uppercase', opacity: 0.6 }}>Secure ID // 0X8F</span>
        </div>
      </div>
    </aside>
  );
};
