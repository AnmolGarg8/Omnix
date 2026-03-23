"use client";
import React, { useEffect, useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertConfig } from "@/components/AlertConfig";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Mail, 
  Slack, 
  Send, 
  Filter, 
  AlertCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Mocking initial data fetch
    setAlerts([
      {
        alert_id: "1",
        mission_name: "Nike Price Monitor",
        priority: "HIGH",
        brief: "Price for Air Max dropped from ₹12,000 to ₹9,500 on Flipkart.",
        channels: ["email", "slack"],
        sent_at: new Date().toISOString(),
        acknowledged: false
      },
      {
        alert_id: "2",
        mission_name: "TechCrunch AI News",
        priority: "MEDIUM",
        brief: "New report on AI regulation changes in the EU detected.",
        channels: ["ntfy"],
        sent_at: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: true
      }
    ]);
    setSettings({
      email: "user@example.com",
      slack_webhook: "https://hooks.slack.com/services/...",
      alert_min_priority: "LOW"
    });
  }, []);

  const getPriorityColor = (p: string) => {
    switch (p.toUpperCase()) {
      case "CRITICAL": return "bg-[#EF4444]";
      case "HIGH": return "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50";
      case "MEDIUM": return "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50";
      case "LOW": return "bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/50";
      default: return "";
    }
  };

  const getChannelIcon = (c: string) => {
    switch (c) {
      case "email": return <Mail className="w-3.5 h-3.5" />;
      case "slack": return <Slack className="w-3.5 h-3.5" />;
      case "ntfy": return <Send className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-10 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-heading font-bold">Alert Inbox</h2>
          <p className="text-[#94A3B8]">Review and manage your web intelligence alerts.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111118] border border-[#1E1E2E] rounded-md text-xs text-[#94A3B8]">
          <Filter className="w-3.5 h-3.5" /> Filter by Priority
        </div>
      </div>

      {/* Alert List Table */}
      <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-[#0A0A0F]">
            <TableRow className="hover:bg-transparent border-[#1E1E2E]">
              <TableHead className="w-[100px] text-[10px] uppercase text-[#94A3B8]">Priority</TableHead>
              <TableHead className="text-[10px] uppercase text-[#94A3B8]">Mission Context</TableHead>
              <TableHead className="text-[10px] uppercase text-[#94A3B8]">Brief Insight</TableHead>
              <TableHead className="text-[10px] uppercase text-[#94A3B8]">Channels</TableHead>
              <TableHead className="text-[10px] uppercase text-[#94A3B8] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40 text-center text-[#94A3B8]">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  Your alert history is empty.
                </TableCell>
              </TableRow>
            ) : (
              alerts.map((alert) => (
                <TableRow key={alert.alert_id} className={`border-[#1E1E2E] ${alert.acknowledged ? 'opacity-50' : 'hover:bg-[#1E1E2E]/30 bg-[#6366F1]/5'}`}>
                  <TableCell>
                    <Badge className={getPriorityColor(alert.priority)}>{alert.priority}</Badge>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {alert.mission_name}
                    <div className="text-[10px] text-[#94A3B8] font-normal mt-0.5">
                      {new Date(alert.sent_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm max-w-md">
                    <p className="line-clamp-2">{alert.brief}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      {alert.channels.map((c: string) => (
                        <div key={c} className="p-1.5 rounded-sm bg-[#0A0A0F] border border-[#1E1E2E] text-[#94A3B8]" title={c}>
                          {getChannelIcon(c)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#22C55E]/10 hover:text-[#22C55E]">
                        <CheckCheck className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#EF4444]/10 hover:text-[#EF4444]">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Alert Configuration Section */}
      <h3 className="text-xl font-heading font-bold mt-16 flex items-center gap-2">
        <Bell className="w-5 h-5 text-[#6366F1]" />
        Channel Configuration
      </h3>
      <AlertConfig settings={settings} onUpdate={setSettings} />
    </div>
  );
}
