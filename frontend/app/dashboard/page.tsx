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
  const [missions, setMissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeMissions: 0,
    totalRuns: 0,
    alertsSent: 0,
    sitesMonitored: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const missionsData = await getMissions();
        setMissions(missionsData || []);
        setStats({
          activeMissions: missionsData?.filter((m:any) => m.status === 'active')?.length || 0,
          totalRuns: missionsData?.reduce((acc:any, m:any) => acc + (m.total_runs || 0), 0) || 0,
          alertsSent: (missionsData?.length || 0) * 2, 
          sitesMonitored: missionsData?.filter((m:any) => m.status === 'active')?.length || 0
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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
        <StatCard index={2} label="Alerts Dispatched" value={stats.alertsSent} delta="URGENT" />
        <StatCard index={3} label="Nodes Protected" value={stats.sitesMonitored} delta="ACTIVE" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px', alignItems: 'start' }}>
        
        {/* Agent Swarm Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#E8FFE8' }}>
              <BrainCircuit size={14} style={{ color: '#00FF6A' }} /> Agent Swarm
            </h3>
            <Link href="/dashboard/missions/new">
               <Button style={{ background: '#00FF6A', color: '#060A06', fontWeight: 600, borderRadius: '8px', boxShadow: '0 0 16px rgba(0,255,106,0.3)', height: '32px', fontSize: '11px', padding: '0 16px' }}>
                 <Plus size={12} style={{ marginRight: '6px' }} /> NEW MISSION
               </Button>
            </Link>
          </div>

          {missions.length === 0 ? (
            <div style={{ background: '#0D130D', border: '1px border-dashed #1A2E1A', borderRadius: '12px', padding: '60px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
              <h4 style={{ fontSize: '20px', fontWeight: 700, color: '#E8FFE8', marginBottom: '8px' }}>Launch Intelligence</h4>
              <p style={{ fontSize: '12px', color: '#6B9E6B', maxWidth: '300px', margin: '0 auto' }}>No active missions. Deploy your first agent swarm to start monitoring the web.</p>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '24px' }}>
                {EXAMPLES.map((ex) => (
                  <Link key={ex} href={`/dashboard/missions/new?goal=${encodeURIComponent(ex)}`}>
                    <span style={{
                      padding: '6px 14px', borderRadius: '20px',
                      background: '#0D130D', border: '1px solid #1A2E1A',
                      fontSize: '11px', color: '#6B9E6B', cursor: 'pointer',
                      transition: 'all 0.2s'
                    }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,106,0.5)'; e.currentTarget.style.color = '#00FF6A'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E1A'; e.currentTarget.style.color = '#6B9E6B'; }}>
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
          <h3 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#E8FFE8' }}>
            <Bell size={14} style={{ color: '#00FF6A' }} /> Signal Log
          </h3>
          <div>
            {[
              { id: 1, p: 'CRITICAL', t: 'Nike price drop detected (−$32)', c: '#FF4444' },
              { id: 2, p: 'HIGH', t: 'Competitor A launched new pricing', c: '#FF6B35' },
              { id: 3, p: 'MEDIUM', t: '5 new job matches in Bangalore', c: '#F59E0B' },
              { id: 4, p: 'LOW', t: 'Routine sync complete for Nodes 1-4', c: '#6B9E6B' },
            ].map(log => (
              <div key={log.id} style={{
                background: '#0D130D', border: '1px solid #1A2E1A', borderRadius: '10px',
                padding: '14px 16px', marginBottom: '10px', borderLeft: `3px solid ${log.c}`,
                transition: 'transform 0.2s', cursor: 'pointer'
              }} onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '8px' }}>
                   <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: `${log.c}15`, color: log.c, border: `1px solid ${log.c}25` }}>{log.p}</span>
                   <span style={{ fontSize: '10px', color: '#6B9E6B' }}>12m ago</span>
                </div>
                <h5 style={{ fontSize: '13px', fontWeight: 600, color: '#E8FFE8' }}>{log.t}</h5>
                <p style={{ fontSize: '12px', color: '#6B9E6B', marginTop: '4px' }}>Agent network confirmed change on endpoint...</p>
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
    background: '#0D130D',
    border: '1px solid #1A2E1A',
    borderRadius: '12px',
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
    cursor: 'pointer'
  }} onMouseEnter={e => {
    e.currentTarget.style.transform = 'translateY(-5px) rotateX(4deg) rotateY(-2deg)'
    e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.6), 0 0 25px rgba(0,255,106,0.1)'
    e.currentTarget.style.borderColor = 'rgba(0,255,106,0.3)'
  }} onMouseLeave={e => {
    e.currentTarget.style.transform = 'none'
    e.currentTarget.style.boxShadow = 'none'
    e.currentTarget.style.borderColor = '#1A2E1A'
  }}>
    <div style={{ fontSize: '11px', fontWeight: 600, color: '#6B9E6B', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '12px' }}>{label}</div>
    <div style={{ fontSize: '36px', fontWeight: 700, color: '#E8FFE8', lineHeight: 1 }}>{value}</div>
    <div style={{ fontSize: '11px', color: '#00FF6A', marginTop: '10px', fontWeight: 700 }}>↑ {delta}</div>
    <div style={{ marginTop: '16px', height: '3px', background: '#1A2E1A', borderRadius: '2px' }}>
      <div style={{ width: '45%', height: '100%', background: '#00FF6A', borderRadius: '2px', boxShadow: '0 0 6px #00FF6A' }}/>
    </div>
  </div>
);

const MissionCard = ({ mission }: { mission: any }) => (
  <Link href={`/dashboard/missions/${mission.mission_id}`} style={{ textDecoration: 'none' }}>
    <div style={{
      background: '#0D130D', border: '1px solid #1A2E1A', borderRadius: '12px',
      padding: '20px', transition: 'all 0.3s', cursor: 'pointer'
    }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,255,106,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1A2E1A'; e.currentTarget.style.transform = 'none'; }}>
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'start', marginBottom: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#111A11', border: '1px solid #1A2E1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
          {mission.category === 'prices' ? '💰' : '🔍'}
        </div>
        <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#00FF6A15', color: '#00FF6A', border: '1px solid #00FF6A25' }}>{mission.status}</span>
      </div>
      <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#E8FFE8', marginBottom: '4px' }}>{mission.name}</h4>
      <div style={{ fontSize: '11px', color: '#6B9E6B', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
