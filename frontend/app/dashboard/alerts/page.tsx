"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { getAlerts, acknowledgeAlert, getSettings, updateSettings } from "@/lib/api";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Bell, ShieldAlert, Filter, Search, ArrowRight, Activity } from "lucide-react";

export default function AlertsPage() {
  const { getToken } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    email: "",
    slack_webhook: "",
    ntfy_topic: "",
    alert_min_priority: "MEDIUM"
  });


  useEffect(() => {
    fetchData();
  }, [getToken]);

  const fetchData = async () => {
    try {
      const token = await getToken();
      const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL;
      
      const alRes = await fetch(`${BACKEND}/api/alerts`, { headers: { Authorization: `Bearer ${token}` } });
      const alertsData = await alRes.json();
      setAlerts(Array.isArray(alertsData) ? alertsData : []);

      const setRes = await fetch(`${BACKEND}/api/settings`, { headers: { Authorization: `Bearer ${token}` } });
      const settingsData = await setRes.json();
      if (settingsData) setSettings(settingsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleAcknowledge = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alerts/${id}/acknowledge`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(prev => prev.map(a => a.alert_id === id ? { ...a, acknowledged: true } : a));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/alerts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setAlerts(prev => prev.filter(a => a.alert_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
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
      alert("Settings saved successfully");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#F0F6FF' }}>Security Center</h1>
          <p style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>Real-time intelligence and anomaly detection</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px', alignItems: 'start' }}>
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-white/[0.03] border border-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : alerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '120px 24px', background: 'rgba(13,17,23,0.4)', borderRadius: '16px', border: '1px dashed rgba(59,130,246,0.1)' }}>
              <ShieldAlert size={48} className="mx-auto mb-6 text-[#6B8EAE] opacity-20" />
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#F0F6FF', marginBottom: '8px' }}>Swarm is stable</div>
              <div style={{ fontSize: '13px', color: '#6B8EAE', fontWeight: '400' }}>No critical anomalies detected in the current datastream.</div>
            </div>
          ) : (
            alerts.map((alert) => {
              const priority = alert.priority?.toUpperCase();
              const accentColor = priority === 'CRITICAL' ? '#FF4444' : priority === 'HIGH' ? '#FF6B35' : '#3B82F6';
              
              return (
                <div 
                  key={alert.alert_id} 
                  style={{
                    background: 'rgba(13, 17, 23, 0.8)',
                    border: '1px solid #1C2A3A',
                    borderLeft: `4px solid ${accentColor}`,
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    opacity: alert.acknowledged ? 0.5 : 1,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '9px', fontWeight: '800',
                        padding: '2px 8px', borderRadius: '4px',
                        background: `${accentColor}10`,
                        color: accentColor,
                        border: `1px solid ${accentColor}20`,
                        letterSpacing: '1px'
                      }}>{priority}</span>
                      <span style={{ fontSize: '11px', color: '#6B8EAE', fontFamily: 'monospace' }}>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#F0F6FF', marginBottom: '6px' }}>{alert.mission_name}</div>
                    <div style={{ fontSize: '12px', color: '#6B8EAE', lineHeight: 1.6, fontWeight: '400' }}>{alert.brief}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!alert.acknowledged && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-10 w-10 rounded-lg text-[#3B82F6] hover:bg-[#3B82F6]/10"
                        onClick={() => handleAcknowledge(alert.alert_id)}
                      >
                        <Check size={18} />
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-10 w-10 rounded-lg text-[#FF4444] hover:bg-[#FF4444]/10"
                      onClick={() => handleDelete(alert.alert_id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <div style={{
            background: 'rgba(13, 17, 23, 0.8)',
            border: '1px solid #1C2A3A',
            borderRadius: '14px',
            padding: '24px',
            position: 'sticky',
            top: '24px'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#F0F6FF', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Bell size={16} className="text-[#3B82F6]" /> Notification Config
            </h3>
            
            <div className="space-y-4">
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#6B8EAE', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Primary Email</label>
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={e => setSettings({...settings, email: e.target.value})}
                  className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[13px] p-2.5 rounded-lg border focus:border-[#3B82F6] outline-none" 
                  placeholder="alerts@example.com"
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#6B8EAE', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Slack Webhook</label>
                <input 
                  type="text" 
                  value={settings.slack_webhook}
                  onChange={e => setSettings({...settings, slack_webhook: e.target.value})}
                  className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[13px] p-2.5 rounded-lg border focus:border-[#3B82F6] outline-none"
                  placeholder="https://hooks.slack.com/..."
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#6B8EAE', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>Ntfy Topic</label>
                <input 
                  type="text" 
                  value={settings.ntfy_topic}
                  onChange={e => setSettings({...settings, ntfy_topic: e.target.value})}
                  className="w-full bg-[#111927] border-[#1C2A3A] text-[#F0F6FF] text-[13px] p-2.5 rounded-lg border focus:border-[#3B82F6] outline-none"
                  placeholder="agent_signals"
                />
              </div>
              
              <Button 
                onClick={handleSaveSettings}
                className="w-full mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-[#080C14] font-bold text-[12px] h-10 rounded-lg">
                Save Protocols
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
