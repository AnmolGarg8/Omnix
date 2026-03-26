"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getMissions } from "@/lib/api";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Target, ArrowRight, BrainCircuit, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function MissionsPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/missions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setMissions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [getToken]);

  const handleAction = async (e: React.MouseEvent, id: string, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/missions/${id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Refresh list
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/missions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "#3B82F6";
      case "running": return "#3B82F6";
      case "paused": return "#F59E0B";
      case "failed": return "#FF4444";
      default: return "#6B8EAE";
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F0F6FF' }}>Missions</h1>
          <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>Manage and monitor your intelligence swarms</p>
        </div>
        <Link href="/dashboard/missions/new">
          <button style={{
            padding: '10px 24px',
            background: '#3B82F6', color: '#080C14',
            fontWeight: '700', fontSize: '13px',
            borderRadius: '8px', border: 'none', cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>+ New Mission</button>
        </Link>
      </div>

      <div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white/[0.03] border border-white/10 rounded-xl animate-pulse flex flex-col p-6 space-y-4">
                <div className="h-4 w-1/3 bg-white/10 rounded"></div>
                <div className="h-8 w-2/3 bg-white/10 rounded"></div>
                <div className="h-20 w-full bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', background: 'rgba(13,17,23,0.4)', borderRadius: '16px', border: '1px dashed rgba(59,130,246,0.1)' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.4 }}>⬢</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#F0F6FF', marginBottom: '8px' }}>No missions deployed</div>
            <div style={{ fontSize: '13px', color: '#6B8EAE', marginBottom: '24px', fontWeight: '400' }}>Deploy your first agent swarm to start monitoring the web</div>
            <Link href="/dashboard/missions/new">
              <button style={{
                padding: '10px 24px',
                background: '#3B82F6', color: '#080C14',
                fontWeight: '700', fontSize: '13px',
                borderRadius: '8px', border: 'none', cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif'
              }}>+ New Mission</button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {missions.map((mission) => (
              <div 
                key={mission.mission_id}
                style={{
                  background: 'rgba(13,17,23,0.8)',
                  border: '1px solid #1C2A3A',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(mission.status) }} />
                    <span style={{ fontSize: '10px', fontWeight: '700', color: getStatusColor(mission.status), letterSpacing: '1px' }}>{mission.status?.toUpperCase()}</span>
                  </div>
                  <Badge variant="outline" className="text-[9px] border-blue-500/20 text-blue-400">{mission.schedule}</Badge>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#F0F6FF', marginBottom: '4px' }}>{mission.name}</h3>
                  <p style={{ fontSize: '12px', color: '#6B8EAE', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{mission.goal_nl}</p>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                  <Link href={`/dashboard/missions/${mission.mission_id}`} className="flex-1">
                    <Button variant="outline" className="w-full text-[11px] h-9 font-bold uppercase tracking-wider border-[#1C2A3A] hover:bg-[#1C2A3A]">+ View</Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    onClick={(e) => handleAction(e, mission.mission_id, mission.status === 'paused' ? 'resume' : 'pause')}
                    className="text-[11px] h-9 font-black uppercase text-[#F59E0B] hover:bg-[#F59E0B]/10">
                    {mission.status === 'paused' ? 'Resume' : 'Pause'}
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={(e) => handleAction(e, mission.mission_id, 'run-now')}
                    className="text-[11px] h-9 font-black uppercase text-[#3B82F6] hover:bg-[#3B82F6]/10">
                    Run Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
