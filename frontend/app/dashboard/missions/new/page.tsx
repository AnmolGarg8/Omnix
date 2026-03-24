"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createMission } from "@/lib/api";

export default function NewMissionPage() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("Daily 9AM");
  const [category, setCategory] = useState("research");
  const [loading, setLoading] = useState(false);

  const handleDeploy = async () => {
    setLoading(true);
    try {
      let cron = "0 9 * * *";
      if (schedule === "Every hour") cron = "0 * * * *";
      else if (schedule === "Every 6h") cron = "0 */6 * * *";
      else if (schedule === "Daily 9AM") cron = "0 9 * * *";
      else if (schedule === "Weekly") cron = "0 0 * * 1";

      const payload = { 
        goal_nl: goal, 
        schedule: cron, 
        name: name || "Untitled Mission",
        category 
      };
      const data = await createMission(payload);
      if (data && data.mission_id) {
         router.push(`/dashboard/missions/${data.mission_id}`);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 pb-20">
      <div style={{
        background: '#0D130D',
        border: '1px solid #1A2E1A',
        borderRadius: '14px',
        padding: '28px',
        maxWidth: '800px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,255,106,0.4), transparent)' }}/>
        
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8FFE8', marginBottom: '6px' }}>
            New Mission
          </h1>
          <p style={{ fontSize: '13px', color: '#6B9E6B' }}>
            Describe your goal in plain English. AgentForIt handles the rest.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#E8FFE8', marginBottom: '8px' }}>Goal</div>
            <textarea
              placeholder="e.g. Monitor Amazon and Flipkart for RTX 5090 price changes daily and alert me on Slack"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '14px 16px',
                background: '#111A11',
                border: '1px solid #1A2E1A',
                borderRadius: '10px',
                color: '#E8FFE8',
                fontSize: '14px',
                fontFamily: 'Space Grotesk, sans-serif',
                resize: 'vertical',
                outline: 'none',
                lineHeight: '1.6',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,106,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = '#1A2E1A'}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#E8FFE8', marginBottom: '8px' }}>Mission name (optional)</div>
            <input
              placeholder="Auto-generated if left blank"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#111A11',
                border: '1px solid #1A2E1A',
                borderRadius: '8px',
                color: '#E8FFE8',
                fontSize: '13px',
                fontFamily: 'Space Grotesk, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,255,106,0.4)'}
              onBlur={e => e.currentTarget.style.borderColor = '#1A2E1A'}
            />
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: '500', color: '#E8FFE8', marginBottom: '8px' }}>Schedule</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Every hour', 'Every 6h', 'Daily 9AM', 'Weekly', 'Custom'].map(opt => (
                <button key={opt} style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: '1px solid #1A2E1A',
                  background: schedule === opt ? 'rgba(0,255,106,0.1)' : 'transparent',
                  color: schedule === opt ? '#00FF6A' : '#6B9E6B',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  transition: 'all 0.2s',
                  borderColor: schedule === opt ? 'rgba(0,255,106,0.3)' : '#1A2E1A'
                }} onClick={() => setSchedule(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: '500', color: '#6B9E6B', marginBottom: '10px' }}>
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
                  background: '#0D130D',
                  border: '1px solid #1A2E1A',
                  fontSize: '11px',
                  color: '#6B9E6B',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontFamily: 'Space Grotesk, sans-serif'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(0,255,106,0.3)'
                  e.currentTarget.style.color = '#00FF6A'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#1A2E1A'
                  e.currentTarget.style.color = '#6B9E6B'
                }}>{pill}</span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button 
              onClick={handleDeploy}
              disabled={loading || !goal}
              style={{
                padding: '12px 32px',
                background: '#00FF6A',
                color: '#060A06',
                fontWeight: '700',
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                cursor: (loading || !goal) ? 'not-allowed' : 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                boxShadow: '0 0 20px rgba(0,255,106,0.3)',
                transition: 'all 0.2s',
                opacity: (loading || !goal) ? 0.7 : 1
              }}
            >
              {loading ? "Deploying..." : "Launch Mission 🚀"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
