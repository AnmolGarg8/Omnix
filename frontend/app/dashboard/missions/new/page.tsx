"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createMission } from "@/lib/api";


export default function NewMissionPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("Daily 9AM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const scheduleMap: Record<string, string> = {
    'Every hour':  '0 * * * *',
    'Every 6h':    '0 */6 * * *',
    'Daily 9AM':   '0 9 * * *',
    'Weekly':      '0 9 * * 1',
  };

  const handleLaunch = async () => {
    setError("");
    setValidationError("");
    
    if (!goal.trim()) {
      setValidationError("Please describe your mission goal");
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const res = await fetch(`${BACKEND}/api/missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          goal_nl: goal,
          name: name || undefined,
          schedule: scheduleMap[schedule] || '0 9 * * *'
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Launch failed");
      }

      if (data && data.mission_id) {
        router.push(`/dashboard/missions/${data.mission_id}`);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div style={{
        background: 'rgba(13, 17, 23, 0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.12)',
        borderRadius: '14px',
        padding: '28px',
        maxWidth: '800px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Inner glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '120px', height: '120px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246,0.4), transparent)' }}/>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F0F6FF', marginBottom: '6px' }}>
            New Mission
          </h1>
          <p style={{ fontSize: '13px', color: '#6B8EAE' }}>
            Describe your goal in plain English. AgentForIt handles the rest.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#F0F6FF', marginBottom: '8px' }}>Goal</div>
            <textarea
              placeholder="e.g. Monitor Amazon and Flipkart for RTX 5090 price changes daily and alert me on Slack"
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value);
                if (e.target.value) setValidationError("");
              }}
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '11px 15px',
                background: 'rgba(17, 25, 39, 0.8)',
                border: `1px solid ${validationError ? '#FF4444' : 'rgba(59, 130, 246, 0.12)'}`,
                borderRadius: '8px',
                color: '#F0F6FF',
                fontSize: '13px',
                fontFamily: 'Space Grotesk, sans-serif',
                resize: 'vertical',
                outline: 'none',
                lineHeight: '1.6',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
            />
            {validationError && (
              <div style={{ color: '#FF4444', fontSize: '11px', marginTop: '6px', fontWeight: '600' }}>
                {validationError}
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#F0F6FF', marginBottom: '8px' }}>Mission name (optional)</div>
            <input
              placeholder="Auto-generated if left blank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 15px',
                background: 'rgba(17, 25, 39, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.12)',
                borderRadius: '8px',
                color: '#F0F6FF',
                fontSize: '13px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#F0F6FF', marginBottom: '8px' }}>Schedule</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {Object.keys(scheduleMap).map(opt => (
                <button key={opt} style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: '1px solid #1C2A3A',
                  background: schedule === opt ? 'rgba(59, 130, 246,0.1)' : 'transparent',
                  color: schedule === opt ? '#3B82F6' : '#6B8EAE',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.2s',
                  borderColor: schedule === opt ? 'rgba(59, 130, 246,0.3)' : '#1C2A3A'
                }} onClick={() => setSchedule(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B8EAE', marginBottom: '10px' }}>
              Example missions — click to fill
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                'Monitor Nike & Adidas for price changes on running shoes under ₹5000',
                'Check TechCrunch & HackerNews daily for AI startup funding news',
                'Track my 3 competitors landing pages for copy changes weekly',
                'Scrape top 20 LinkedIn jobs for React Developer in Bangalore',
                'Monitor Amazon & Flipkart for RTX 5090 stock availability'
              ].map(pill => (
                <span key={pill} onClick={() => setGoal(pill)} style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  background: '#0D1117',
                  border: '1px solid #1C2A3A',
                  fontSize: '11px',
                  color: '#6B8EAE',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}>{pill}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={handleLaunch}
              disabled={loading}
              style={{
                padding: '14px 36px',
                background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '15px',
                borderRadius: '10px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3), 0 8px 32px rgba(59, 130, 246, 0.35), 0 2px 8px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Launching..." : "Launch Mission 🚀"}
            </button>
            {error && (
              <div style={{ color: '#FF4444', fontSize: '12px', marginTop: '12px', fontWeight: '600' }}>
                {error}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
