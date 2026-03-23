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
import { Bell, Mail, Slack, Send, Loader2 } from "lucide-react";

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
    <Card className="bg-[#111118] border-[#1E1E2E]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#6366F1]" />
          Alert Orchestration
        </CardTitle>
        <CardDescription>Configure how and when you want to be notified of web intelligence changes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-[#94A3B8]">
            <Mail className="w-4 h-4" /> Email Destination
          </Label>
          <Input 
            className="bg-[#0A0A0F] border-[#1E1E2E]" 
            placeholder="alerts@yourdomain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Slack */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-[#94A3B8]">
            <Slack className="w-4 h-4" /> Slack Webhook URL
          </Label>
          <div className="flex gap-2">
            <Input 
              className="bg-[#0A0A0F] border-[#1E1E2E] flex-1" 
              placeholder="https://hooks.slack.com/services/..."
              value={slack}
              onChange={(e) => setSlack(e.target.value)}
            />
            <Button variant="ghost" className="border border-[#1E1E2E]">Test</Button>
          </div>
        </div>

        {/* Ntfy */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-[#94A3B8]">
            <Send className="w-4 h-4" /> Ntfy.sh Topic
          </Label>
           <div className="flex gap-2">
            <Input 
              className="bg-[#0A0A0F] border-[#1E1E2E] flex-1" 
              placeholder="my-secret-omnix-topic"
              value={ntfy}
              onChange={(e) => setNtfy(e.target.value)}
            />
            <Button variant="ghost" className="border border-[#1E1E2E]">Test</Button>
          </div>
          <p className="text-[10px] text-[#94A3B8]">Get push notifications via ntfy.sh app</p>
        </div>

        {/* Threshold */}
        <div className="space-y-2 pt-4 border-t border-[#1E1E2E]">
          <Label className="text-[#94A3B8]">Minimum Alert Priority</Label>
          <Select value={minPriority} onValueChange={(val) => val && setMinPriority(val)}>
             <SelectTrigger className="bg-[#0A0A0F] border-[#1E1E2E]">
               <SelectValue placeholder="Select Threshold" />
             </SelectTrigger>
             <SelectContent className="bg-[#111118] border-[#1E1E2E]">
               <SelectItem value="LOW">All Alerts (Low+)</SelectItem>
               <SelectItem value="MEDIUM">Medium+ only</SelectItem>
               <SelectItem value="HIGH">High+ only</SelectItem>
               <SelectItem value="CRITICAL">Critical only</SelectItem>
             </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="bg-[#111118]/50 p-4 border-t border-[#1E1E2E] flex justify-end">
        <Button 
          className="bg-[#6366F1] hover:bg-[#5254E0] shadow-lg shadow-[#6366F1]/15"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Alert Config
        </Button>
      </CardFooter>
    </Card>
  );
};
