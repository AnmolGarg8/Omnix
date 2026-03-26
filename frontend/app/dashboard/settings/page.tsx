"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getSettings, updateSettings } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, Database, Zap, Save, Loader2, ArrowRight, Bell } from "lucide-react";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<any>({
    email: "",
    slack_webhook: "",
    ntfy_topic: "",
    alert_min_priority: "MEDIUM",
    openai_key: "",
    anthropic_key: ""
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data) setSettings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [getToken]);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      alert("System protocols updated.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };


  if (loading) return (
    <div className="flex h-screen items-center justify-center font-black animate-pulse uppercase tracking-[10px] text-[#3B82F6]">SYNCHRONIZING CORE...</div>
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#F0F6FF' }}>Global Config</h2>
          <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>Administrative bypass // System-wide protocols</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{
            padding: '12px 28px',
            background: '#3B82F6',
            color: '#080C14',
            fontWeight: '800',
            fontSize: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Apply Protocols
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div style={{
          background: 'rgba(13, 17, 23, 0.8)',
          border: '1px solid #1C2A3A',
          borderRadius: '16px',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <section className="space-y-8">
             <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#3B82F6]">
                   <Bell size={20} />
                   <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#F0F6FF', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Signal Routing</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400', lineHeight: '1.6' }}>Define endpoints for autonomous intelligence alerts and anomaly reports.</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">Target Email</label>
                  <input 
                     type="email"
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.email}
                     onChange={(e) => setSettings({...settings, email: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">Slack Webhook URL</label>
                  <input 
                     type="text"
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.slack_webhook}
                     onChange={(e) => setSettings({...settings, slack_webhook: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">Ntfy Infrastructure Topic</label>
                  <input 
                     type="text"
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.ntfy_topic}
                     onChange={(e) => setSettings({...settings, ntfy_topic: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">Minimum Alert Priority</label>
                  <select 
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.alert_min_priority}
                     onChange={(e) => setSettings({...settings, alert_min_priority: e.target.value})}
                  >
                    <option value="LOW">LOW - LOG EVERYTHING</option>
                    <option value="MEDIUM">MEDIUM - STANDARD ALERTS</option>
                    <option value="HIGH">HIGH - CRITICAL ONLY</option>
                  </select>
                </div>
             </div>
          </section>
        </div>

        <div style={{
          background: 'rgba(13, 17, 23, 0.8)',
          border: '1px solid #1C2A3A',
          borderRadius: '16px',
          padding: '32px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <section className="space-y-8">
             <div className="space-y-2">
                <div className="flex items-center gap-3 text-[#3B82F6]">
                   <Key size={20} />
                   <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#F0F6FF', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Intelligence Keys</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400', lineHeight: '1.6' }}>System-level authentication for the LLM backplane used by all agent swarms.</p>
             </div>

             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">OpenAI Backbone Token</label>
                  <input 
                     type="password"
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.openai_key}
                     onChange={(e) => setSettings({...settings, openai_key: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-[#6B8EAE] uppercase tracking-widest pl-1">Anthropic Override Key</label>
                  <input 
                     type="password"
                     className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[14px] p-3 rounded-xl border focus:border-[#3B82F6] outline-none transition-all"
                     value={settings.anthropic_key}
                     onChange={(e) => setSettings({...settings, anthropic_key: e.target.value})}
                  />
                </div>

                <div className="p-6 rounded-2xl bg-[#FF4444]/5 border border-[#FF4444]/10 space-y-4">
                   <div className="flex items-center gap-3 text-[#FF4444]">
                      <Shield size={20} />
                      <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#FF4444', textTransform: 'uppercase', letterSpacing: '1px' }}>System Guard</h3>
                   </div>
                   <p style={{ fontSize: '12px', color: '#FF4444', opacity: 0.8, fontWeight: '500', lineHeight: '1.5' }}>Tokens are encrypted at rest but will be active for all background agent monitoring tasks.</p>
                </div>
             </div>
          </section>
        </div>
      </div>


      <div className="h-[1px] w-full bg-white/[0.05]"></div>

      <div className="flex items-center justify-between pb-12">
        <div className="flex items-center gap-6">
          <span style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>Version // 2.4.0_Stable</span>
          <ArrowRight size={14} className="text-[#6B8EAE]" />
          <span style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>System healthy</span>
        </div>
        <span style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>© 2026 AgentForIt Intel</span>
      </div>
    </div>
  );
}
