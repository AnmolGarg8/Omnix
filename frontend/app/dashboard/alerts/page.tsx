"use client";
import React, { useEffect, useState } from "react";
import { getAlerts, acknowledgeAlert, getSettings, updateSettings } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Trash2, Bell, ShieldAlert, Filter, Search, ArrowRight, Activity } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert(id);
      fetchAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case "CRITICAL": return "#FF4444";
      case "HIGH": return "#F59E0B";
      case "MEDIUM": return "#00FF6A";
      default: return "#6B9E6B";
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#E8FFE8' }}>Alerts</h1>
          <p style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Real-time detection and response feed</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B9E6B] opacity-50" />
             <input 
               type="text" 
               placeholder="Filter signals..." 
               style={{
                width: '260px',
                padding: '10px 14px 10px 40px',
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
        </div>
      </div>

      <div className="max-w-4xl space-y-4">
        {loading ? (
          <div className="space-y-4 opacity-20">
             {[1,2,3].map(i => (
                <div key={i} className="h-24 bg-white/[0.03] rounded-xl animate-pulse"></div>
             ))}
          </div>
        ) : alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px' }}>
             <ShieldAlert size={40} className="mx-auto mb-4 text-[#6B9E6B] opacity-40" />
             <div style={{ fontSize: '18px', fontWeight: '600', color: '#E8FFE8', marginBottom: '8px' }}>No alerts detected</div>
             <div style={{ fontSize: '13px', color: '#6B9E6B', fontWeight: '400' }}>Your system is currently monitoring for any anomalies</div>
          </div>
        ) : (
          alerts.map((alert) => {
            const priority = alert.priority?.toUpperCase();
            const accentColor = priority === 'CRITICAL' ? '#FF4444' : priority === 'HIGH' ? '#FF6B35' : '#F59E0B';
            
            return (
              <div 
                key={alert.alert_id} 
                className="group"
                style={{
                  background: '#0D130D',
                  border: '1px solid #1A2E1A',
                  borderLeft: `3px solid ${accentColor}`,
                  borderRadius: '10px',
                  padding: '16px 18px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'transform 0.2s, border-color 0.2s',
                  cursor: 'pointer',
                  opacity: alert.acknowledged ? 0.6 : 1
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateX(3px)'
                  e.currentTarget.style.borderColor = 'rgba(0,255,106,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.borderColor = '#1A2E1A'
                }}
                onClick={() => !alert.acknowledged && handleAcknowledge(alert.alert_id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: '700',
                      padding: '2px 8px', borderRadius: '4px',
                      background: `${accentColor}15`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`
                    }}>{priority}</span>
                    <span style={{ fontSize: '11px', color: '#6B9E6B', marginLeft: 'auto' }}>{alert.sent_at}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#E8FFE8', marginBottom: '4px' }}>{alert.mission_name}</div>
                  <div style={{ fontSize: '12px', color: '#6B9E6B', lineHeight: 1.5, fontWeight: '400' }}>{alert.brief}</div>
                </div>
                {!alert.acknowledged && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-[#6B9E6B] hover:text-[#00FF6A] hover:bg-[#00FF6A]/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAcknowledge(alert.alert_id);
                    }}
                  >
                    <Check size={14} />
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
