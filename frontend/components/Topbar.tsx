"use client";
import React from "react";
import Link from "next/link";
import { Plus, Bell as BellIcon, Search } from "lucide-react";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Overview";
    if (path.includes("/missions")) return "Missions";
    if (path.includes("/results")) return "Analytics";
    if (path.includes("/alerts")) return "Signals";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header style={{
      height: '100px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 60px',
      background: 'transparent',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <h1 style={{ fontSize: '24px', fontVariationSettings: '"wght" 800', color: '#F0F6FF', letterSpacing: '-0.5px', textTransform: 'uppercase' }}>
          {getPageTitle(pathname)}
        </h1>
        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} color="#6B8EAE" style={{ position: 'absolute', left: '16px', opacity: 0.5 }} />
          <input 
            type="text" 
            placeholder="Search Intelligence..." 
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '12px',
              padding: '10px 16px 10px 42px',
              fontSize: '11px',
              color: '#F0F6FF',
              width: '280px',
              outline: 'none',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
           <div style={{ position: 'relative', cursor: 'pointer', opacity: 0.7 }}>
             <BellIcon size={20} color="#6B8EAE" />
             <div style={{
               position: 'absolute',
               top: '-2px',
               right: '-2px',
               width: '8px',
               height: '8px',
               borderRadius: '50%',
               background: '#FF4444',
               border: '2px solid #080C14'
             }}></div>
           </div>
        </div>

        <Link href="/dashboard/missions/new" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '12px 24px',
            background: 'rgba(59, 130, 246,1)',
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '11px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 25px rgba(59, 130, 246,0.2)',
            transition: 'all 0.3s ease'
          }}>
            <Plus size={14} strokeWidth={3} /> New Deployment
          </button>
        </Link>
      </div>
    </header>
  );
};
