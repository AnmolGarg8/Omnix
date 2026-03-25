"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  const { getToken } = useAuth();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await getMissions(token);
      setMissions(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F0F6FF' }}>Missions</h1>
          <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>Manage and monitor your intelligence swarms</p>
        </div>
        <button style={{
          padding: '10px 24px',
          background: '#3B82F6', color: '#080C14',
          fontWeight: '700', fontSize: '13px',
          borderRadius: '8px', border: 'none', cursor: 'pointer',
          fontFamily: 'Space Grotesk, sans-serif'
        }}>+ New Mission</button>
      </div>


      <div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-40 bg-white/[0.03] rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.4 }}>⬡</div>
            <div style={{ fontSize: '18px', fontWeight: '600', color: '#F0F6FF', marginBottom: '8px' }}>No missions deployed</div>
            <div style={{ fontSize: '13px', color: '#6B8EAE', marginBottom: '24px', fontWeight: '400' }}>Deploy your first agent swarm to start monitoring the web</div>
            <button style={{
              padding: '10px 24px',
              background: '#3B82F6', color: '#080C14',
              fontWeight: '700', fontSize: '13px',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif'
            }}>+ New Mission</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {missions.map((mission) => (
              <Link href={`/dashboard/missions/${mission.mission_id}`} key={mission.mission_id}>
                <div 
                  style={{
                    background: '#0D1117',
                    border: '1px solid #1C2A3A',
                    borderRadius: '12px',
                    padding: '18px',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) rotateX(3deg)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246,0.08)'
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246,0.25)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#1C2A3A'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246,0.3), transparent)' }}/>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: getStatusColor(mission.status) }} />
                        <span style={{ fontSize: '10px', fontWeight: '700', color: getStatusColor(mission.status) }}>{mission.status?.toUpperCase()}</span>
                      </div>
                      <span style={{ fontSize: '10px', color: '#6B8EAE', fontWeight: '400' }}>{mission.schedule}</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#F0F6FF', marginBottom: '2px' }}>{mission.name}</h3>
                      <p style={{ fontSize: '11px', color: '#6B8EAE', fontFamily: 'monospace', fontWeight: '400' }}>ID: {mission.mission_id.substring(0, 8)}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[#6B8EAE]">
                        <Activity size={12} />
                        <span style={{ fontSize: '11px', fontWeight: '400' }}>Active monitoring</span>
                      </div>
                      <ArrowRight size={14} className="text-[#3B82F6]" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
