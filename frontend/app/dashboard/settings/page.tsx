"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { getSettings, updateSettings } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Key, Database, Zap, Save, Loader2, ArrowRight } from "lucide-react";

export default function SettingsPage() {
  const { getToken } = useAuth();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);


  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const data = await getSettings(token);
      setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = await getToken();
      if (!token || !settings) return;
      await updateSettings(settings, token);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };


  if (loading) return (
    <div className="flex items-center justify-center h-64 opacity-20 animate-pulse">
       <Database size={40} className="text-[#00FF6A]" />
    </div>
  );

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#E8FFE8' }}>Settings</h2>
          <p style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Admin override // Global registry</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          style={{
            padding: '10px 24px',
            background: '#00FF6A',
            color: '#060A06',
            fontWeight: '700',
            fontSize: '13px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow: '0 0 16px rgba(0,255,106,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Synchronize Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div style={{
          background: '#0D130D',
          border: '1px solid #1A2E1A',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,255,106,0.3), transparent)' }}/>
          <section className="space-y-6">
             <div className="space-y-1">
                <div className="flex items-center gap-3 text-[#00FF6A]">
                   <Key size={18} />
                   <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#E8FFE8' }}>Identity & Access</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Secure access tokens for cross-platform intelligence gathering and mission execution.</p>
             </div>
             
             <div className="space-y-5">
                <div className="space-y-1.5">
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B9E6B', marginBottom: '6px', display: 'block' }}>OpenAI API Protocol</label>
                  <input 
                     type="password"
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
                     value={settings?.openai_key || ""}
                     onChange={(e) => setSettings({...settings, openai_key: e.target.value})}
                  />
                </div>

                <div className="space-y-1.5">
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B9E6B', marginBottom: '6px', display: 'block' }}>Anthropic API Terminal</label>
                  <input 
                     type="password"
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
                     value={settings?.anthropic_key || ""}
                     onChange={(e) => setSettings({...settings, anthropic_key: e.target.value})}
                  />
                </div>
             </div>
          </section>
        </div>

        <div style={{
          background: '#0D130D',
          border: '1px solid #1A2E1A',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(0,255,106,0.3), transparent)' }}/>
          <section className="space-y-6">
             <div className="space-y-1">
                <div className="flex items-center gap-3 text-[#00FF6A]">
                   <Zap size={18} />
                   <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#E8FFE8' }}>Operational Core</h3>
                </div>
                <p style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Global system parameters for swarm intelligence and background orchestration.</p>
             </div>

             <div className="space-y-5">
                <div className="space-y-1.5">
                  <label style={{ fontSize: '12px', fontWeight: '500', color: '#6B9E6B', marginBottom: '6px', display: 'block' }}>Ntfy Signal Bridge</label>
                  <input 
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
                     placeholder="https://ntfy.sh/your-topic"
                     value={settings?.ntfy_topic || ""}
                     onChange={(e) => setSettings({...settings, ntfy_topic: e.target.value})}
                  />
                </div>

                <div className="p-6 rounded-xl bg-[#FF4444]/5 border border-[#FF4444]/10 space-y-3">
                   <div className="flex items-center gap-3 text-[#FF4444]">
                      <Shield size={18} />
                      <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#FF4444' }}>Security Protocol</h3>
                   </div>
                   <p style={{ fontSize: '13px', color: '#FF4444', opacity: 0.7, fontWeight: '400' }}>All changes are permanently logged. Access logs may be retained for 30 days.</p>
                </div>
             </div>
          </section>
        </div>
      </div>

      <div className="h-[1px] w-full bg-white/[0.05]"></div>

      <div className="flex items-center justify-between pb-12">
        <div className="flex items-center gap-6">
          <span style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Version // 2.4.0_Stable</span>
          <ArrowRight size={14} className="text-[#6B9E6B]" />
          <span style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>System healthy</span>
        </div>
        <span style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>© 2026 AgentForIt Intel</span>
      </div>
    </div>
  );
}
