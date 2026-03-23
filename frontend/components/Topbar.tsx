"use client";
import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export const Topbar = () => {
  const pathname = usePathname();
  
  const getPageTitle = (path: string) => {
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/missions")) return "Missions";
    if (path.includes("/results")) return "Results";
    if (path.includes("/alerts")) return "Alerts";
    if (path.includes("/settings")) return "Settings";
    return "Dashboard";
  };

  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      borderBottom: '1px solid #1A2E1A',
      background: 'rgba(6,10,6,0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#00FF6A" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="3" fill="#00FF6A" />
            <path d="M16 6L16 1M25 11L29 7" stroke="#00FF6A" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#E8FFE8' }}>Agent</span><span style={{ color: '#00FF6A' }}>For</span><span style={{ color: '#E8FFE8' }}>It</span>
          </span>
        </Link>
        <div style={{ height: '24px', width: '1px', background: '#1A2E1A' }}></div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#E8FFE8', letterSpacing: '-0.5px' }}>
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <Link href="/dashboard/missions/new" style={{ textDecoration: 'none' }}>
          <button style={{
            padding: '8px 18px',
            background: '#00FF6A',
            color: '#060A06',
            fontWeight: '600',
            fontSize: '13px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            textDecoration: 'none',
            boxShadow: '0 0 16px rgba(0,255,106,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Plus size={16} /> NEW MISSION
          </button>
        </Link>
        
        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B9E6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#FF4444',
            color: '#fff',
            fontSize: '9px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #060A06'
          }}>3</span>
        </div>
      </div>
    </header>
  );
};
