"use client";
import React, { useEffect, useState } from "react";
import { getMissions } from "@/lib/api";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Rocket, 
  ArrowRight,
  Bell, 
  BrainCircuit
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const EXAMPLES = [
  "Monitor Nike, Adidas for price changes",
  "TechCrunch AI startup news",
  "Competitor pricing shifts",
  "LinkedIn job postings daily",
  "Amazon RTX 5090 restock"
];

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [missions, setMissions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    activeMissions: 0,
    totalRuns: 0,
    sitesMonitored: 0,
    alertCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        // Fetch missions
        const misRes = await fetch(`${BACKEND}/api/missions`, { headers: { Authorization: `Bearer ${token}` } });
        const missionsData = await misRes.json();
        
        // Fetch alerts
        const alRes = await fetch(`${BACKEND}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } });
        const alertsData = await alRes.json();
        
        setMissions(Array.isArray(missionsData) ? missionsData : []);
        setStats({
          activeMissions: missionsData.filter((m: any) => m.status === 'active').length,
          totalRuns: missionsData.reduce((acc: number, m: any) => acc + (m.total_runs || 0), 0),
          sitesMonitored: missionsData.reduce((acc: number, m: any) => acc + (m.agent_tasks?.length || 0), 0),
          alertCount: (alertsData || []).length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [getToken]);

  if (isLoading) return <DashboardSkeleton />;


  return (
    <div style={{ paddingBottom: '80px', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* 4-Column Stat Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '40px'
      }}>
        <StatCard index={0} label="Active Missions" value={stats.activeMissions} delta="+12%" />
        <StatCard index={1} label="Total Runs" value={stats.totalRuns} delta="STABLE" />
        <StatCard index={2} label="Alerts Dispatched" value={stats.alertCount} delta="URGENT" />
        <StatCard index={3} label="Nodes Protected" value={stats.sitesMonitored} delta="ACTIVE" />
      </div>


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        
        {/* Agent Swarm Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h3 style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: '#F0F6FF', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <BrainCircuit size={16} style={{ color: '#3B82F6' }} /> Agent Swarm
            </h3>
            <Link href="/dashboard/missions/new" style={{ textDecoration: 'none' }}>
               <button 
                 style={{
                   padding: '5px 12px',
                   background: 'transparent',
                   color: '#3B82F6',
                   fontWeight: '600',
                   fontSize: '12px',
                   borderRadius: '6px',
                   border: '1px solid rgba(59, 130, 246,0.3)',
                   cursor: 'pointer',
                   fontFamily: 'Space Grotesk, sans-serif',
                   display: 'flex',
                   alignItems: 'center',
                   gap: '5px',
                   transition: 'all 0.2s ease'
                 }}
                 onMouseEnter={e => {
                   e.currentTarget.style.background = 'rgba(59, 130, 246,0.08)'
                   e.currentTarget.style.borderColor = 'rgba(59, 130, 246,0.6)'
                 }}
                 onMouseLeave={e => {
                   e.currentTarget.style.background = 'transparent'
                   e.currentTarget.style.borderColor = 'rgba(59, 130, 246,0.3)'
                 }}
               >
                 <Plus size={14} /> NEW MISSION
               </button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div style={{ background: '#0D1117', border: '1px border-dashed #1C2A3A', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#F0F6FF', marginBottom: '8px' }}>Launch Intelligence</h4>
              <p style={{ fontSize: '12px', color: '#6B8EAE', maxWidth: '300px', margin: '0 auto' }}>No active missions. Deploy your first agent swarm to start monitoring the web.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`}>
                    <span style={{
                      padding: '6px 14px', borderRadius: '20px',
                      background: '#0D1117', border: '1px solid #1C2A3A',
                      fontSize: '11px', color: '#6B8EAE', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59, 130, 246,0.5)'; e.currentTarget.style.color = '#3B82F6'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1C2A3A'; e.currentTarget.style.color = '#6B8EAE'; }}>
                      {ex}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                {missions.map(mission => (
                  <MissionCard key={mission.mission_id} mission={mission} />
                ))}
            </div>
          )}
        </div>

        {/* Signal Log Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#F0F6FF' }}>
            <Bell size={14} style={{ color: '#3B82F6' }} /> Signal Log
          </h3>
          <div>
            {[
              { id: 1, p: 'CRITICAL', t: 'Nike price drop detected (−$32)', c: '#FF4444' },
              { id: 2, p: 'HIGH', t: 'Competitor A launched new pricing', c: '#FF6B35' },
              { id: 3, p: 'MEDIUM', t: '5 new job matches in Bangalore', c: '#F59E0B' },
              { id: 4, p: 'LOW', t: 'Routine sync complete for Nodes 1-4', c: '#6B8EAE' },
            ].map(log => (
              <div key={log.id} style={{
                background: 'rgba(13, 17, 23, 0.9)', 
                border: '1px solid rgba(59, 130, 246, 0.1)',
                borderRadius: '10px',
                padding: '16px 18px', 
                marginBottom: '10px', 
                borderLeft: `2px solid ${log.c}`,
                boxShadow: `-2px 0 12px ${log.c}15`,
                transition: 'all 0.2s ease', 
                cursor: 'pointer'
              }} onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateX(3px)';
                e.currentTarget.style.boxShadow = `-2px 0 20px ${log.c}33`;
              }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = `-2px 0 12px ${log.c}15`;
                }}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                   <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${log.c}15`, color: log.c, border: `1px solid ${log.c}25` }}>{log.p}</span>
                   <span style={{ fontSize: '10px', color: '#6B8EAE' }}>12m ago</span>
                </div>
                <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#F0F6FF' }}>{log.t}</h5>
                <p style={{ fontSize: '12px', color: '#6B8EAE', marginTop: '4px' }}>Agent network confirmed change on endpoint...</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const StatCard = ({ label, value, delta, index }: any) => (
  <div className={`float-${index}`} style={{
    background: 'rgba(13, 17, 23, 0.8)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(59, 130, 246, 0.12)',
    borderRadius: '14px',
    padding: '22px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'pointer'
  }} onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-6px) rotateX(3deg) rotateY(-1deg)'
    e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.08)'
    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'
  }} onMouseLeave={e => {
    e.currentTarget.style.transform = 'none'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.12)'
  }}>
    {/* Inner glow */}
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '120px', height: '120px',
      background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
      pointerEvents: 'none'
    }} />
    {/* Top shine */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent)'
    }} />

    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B8EAE', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>{label}</div>
    <div style={{ fontSize: '36px', fontWeight: 700, color: '#F0F6FF', lineHeight: 1, letterSpacing: '-1px' }}>{value}</div>
    <div style={{ fontSize: '12px', color: '#3B82F6', marginTop: '10px', fontWeight: 500 }}>↑ {delta}</div>
    <div style={{ marginTop: '16px', height: '3px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '2px' }}>
      <div style={{ width: '45%', height: '100%', background: '#3B82F6', borderRadius: '2px', boxShadow: '0 0 6px #3B82F6' }}/>
    </div>
  </div>
);

const MissionCard = ({ mission }: { mission: any }) => (
  <Link href={`/dashboard/missions/${mission.mission_id}`} style={{ textDecoration: 'none' }}>
    <div style={{
      background: 'rgba(13, 17, 23, 0.9)', 
      border: '1px solid rgba(59, 130, 246, 0.1)', 
      borderRadius: '14px',
      padding: '20px', 
      transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease', 
      cursor: 'pointer'
    }} onMouseEnter={e => { 
      e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.25)'; 
      e.currentTarget.style.transform = 'translateY(-6px) rotateX(3deg) rotateY(-1deg)';
      e.currentTarget.style.boxShadow = '0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(59, 130, 246, 0.2), 0 0 40px rgba(59, 130, 246, 0.08)';
    }}
      onMouseLeave={e => { 
        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.1)'; 
        e.currentTarget.style.transform = 'none'; 
        e.currentTarget.style.boxShadow = 'none';
      }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#111927', border: '1px solid rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          {mission.category === 'prices' ? '💰' : '🔍'}
        </div>
        <span style={{ 
          fontSize: '9px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', 
          background: 'rgba(59, 130, 246, 0.1)', color: '#93C5FD', border: '1px solid rgba(59, 130, 246, 0.2)' 
        }}>{mission.status}</span>
      </div>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#F0F6FF', marginBottom: '4px' }}>{mission.name}</h4>
      <div style={{ fontSize: '11px', color: '#6B8EAE', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Agent #04</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>Sync in 12m</span>
      </div>
    </div>
  </Link>
);

const DashboardSkeleton = () => (
  <div style={{ padding: '40px' }}>
     <Skeleton style={{ height: '40px', width: '200px', marginBottom: '24px' }} />
     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[1,2,3,4].map(i => <Skeleton key={i} style={{ height: '140px', borderRadius: '12px' }} />)}
     </div>
  </div>
);
