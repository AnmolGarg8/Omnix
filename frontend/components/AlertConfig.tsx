"use client";
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Bell, Mail, Slack, Send, Loader2, ShieldCheck, Activity } from "lucide-react";

export const AlertConfig = ({ settings, onUpdate }: { settings: any; onUpdate: (s: any) => void }) => {
  const [email, setEmail] = useState("");
  const [slack, setSlack] = useState("");
  const [ntfy, setNtfy] = useState("");
  const [minPriority, setMinPriority] = useState("LOW");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmail(settings.email || "");
      setSlack(settings.slack_webhook || "");
      setNtfy(settings.ntfy_topic || "");
      setMinPriority(settings.alert_min_priority || "LOW");
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    // Mimic API delay
    await new Promise(r => setTimeout(r, 1000));
    onUpdate({
      email,
      slack_webhook: slack,
      ntfy_topic: ntfy,
      alert_min_priority: minPriority
    });
    setIsSaving(false);
  };

  return (
    <Card className="cyber-card bg-[#0D1117]/40 border-[#1C2A3A]/40 overflow-hidden relative shadow-none hover:border-[#3B82F6]/10 transition-all">
      <CardHeader className="p-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className="p-1.5 rounded-md bg-[#FF4444]/10 border border-[#FF4444]/20">
                <Bell size={18} className="text-[#FF4444]" />
             </div>
             <CardTitle className="text-sm font-bold uppercase tracking-[2px] text-[#F0F6FF]">
               Orchestration
             </CardTitle>
          </div>
          <div className="px-2 py-0.5 rounded border border-[#3B82F6]/20 bg-[#3B82F6]/5 text-[8px] font-bold text-[#3B82F6] uppercase tracking-widest animate-pulse">
            LIVE_ROUTING
          </div>
        </div>
        <CardDescription className="text-[10px] font-bold text-[#6B8EAE] uppercase tracking-widest opacity-60 leading-relaxed">CONFIGURE_EXTERNAL_SIGNAL_PATHWAYS</CardDescription>
      </CardHeader>
      
      <CardContent className="p-8 pt-6 space-y-10">
        {/* Email */}
        <div className="space-y-3">
          <Label className="text-[9px] font-bold uppercase tracking-[2px] text-[#6B8EAE] ml-1 flex items-center gap-2 opacity-80">
            <Mail size={12} className="text-[#3B82F6]" /> EMAIL_OUTPOST
          </Label>
          <Input 
            className="bg-[#080C14] border-[#1C2A3A] h-11 rounded-lg text-xs font-medium focus:border-[#3B82F6] transition-all" 
            placeholder="alerts@agentforit.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Slack / Ntfy Combined better */}
        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-[9px] font-bold uppercase tracking-[2px] text-[#6B8EAE] ml-1 flex items-center gap-2 opacity-80">
              <Slack size={12} className="text-[#3B82F6]" /> SLACK_TUNNEL
            </Label>
            <Input 
              className="bg-[#080C14] border-[#1C2A3A] h-11 rounded-lg text-xs font-medium focus:border-[#3B82F6] transition-all" 
              placeholder="WEBHOOK_URL"
              value={slack}
              onChange={(e) => setSlack(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-[9px] font-bold uppercase tracking-[2px] text-[#6B8EAE] ml-1 flex items-center gap-2 opacity-80">
              <Send size={12} className="text-[#3B82F6]" /> NTFY_TOPIC
            </Label>
            <Input 
              className="bg-[#080C14] border-[#1C2A3A] h-11 rounded-lg text-xs font-medium focus:border-[#3B82F6] transition-all" 
              placeholder="TOPIC_REF"
              value={ntfy}
              onChange={(e) => setNtfy(e.target.value)}
            />
          </div>
        </div>

        {/* Threshold */}
        <div className="pt-6 border-t border-[#1C2A3A]/40 space-y-3">
          <Label className="text-[9px] font-bold uppercase tracking-[2px] text-[#6B8EAE] ml-1 opacity-80">SENSITIVITY_THRESHOLD</Label>
          <Select value={minPriority} onValueChange={(val) => val && setMinPriority(val)}>
             <SelectTrigger className="bg-[#080C14] border-[#1C2A3A] h-11 rounded-lg text-xs font-medium focus:border-[#3B82F6] transition-all">
               <SelectValue placeholder="PRIORITY" />
             </SelectTrigger>
             <SelectContent className="bg-[#0D1117] border-[#1C2A3A] text-[#F0F6FF] font-bold uppercase tracking-widest text-[10px]">
               <SelectItem value="LOW">LOW_VERBOSITY</SelectItem>
               <SelectItem value="MEDIUM">MEDIUM_BALANCED</SelectItem>
               <SelectItem value="HIGH">HIGH_SEV_ONLY</SelectItem>
               <SelectItem value="CRITICAL">ROOT_CRITICAL</SelectItem>
             </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter className="bg-[#111927]/20 p-8 border-t border-[#1C2A3A]/40">
        <Button 
          className="w-full bg-[#3B82F6] text-[#080C14] hover:bg-[#00D156] font-bold uppercase tracking-widest rounded-lg h-11 text-[10px] shadow-[0_4px_15px_rgba(59, 130, 246,0.1)] transition-all"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <ShieldCheck size={14} className="mr-2" />}
          UPGRADE_PERMISSIONS
        </Button>
      </CardFooter>
    </Card>
  );
};
