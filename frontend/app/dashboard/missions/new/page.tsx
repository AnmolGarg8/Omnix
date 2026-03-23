"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createMission } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Plus, 
  Rocket, 
  Sparkles, 
  Calendar, 
  Search, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function NewMissionPage() {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("0 9 * * *");
  const [category, setCategory] = useState("research");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleDeploy = async () => {
    setLoading(true);
    try {
      const payload = { 
        goal_nl: goal, 
        schedule, 
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

  const templates = [
    { title: "Price Watch", goal: "Monitor iPhone 16 Pro price on Amazon and BestBuy. Alert if it drops below $900." },
    { title: "Competitor Intel", goal: "Daily crawl of competitor-site.com/blog. Extract and summarize new product announcements." },
    { title: "SaaS Monitoring", goal: "Login to dashboard.stripe.com. Extract monthly recurring revenue (MRR) and churn rate every morning." }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 pb-20">
      <div className="space-y-2">
        <h2 className="text-4xl font-black font-heading tracking-tight flex items-center gap-3">
          <Rocket className="w-10 h-10 text-[#6366F1]" /> 
          Deploy New Agent
        </h2>
        <p className="text-[#94A3B8] text-lg">Describe what you want to monitor, and OMNIX intelligence will handle the rest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-[#111118] border-[#1E1E2E] shadow-2xl overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-[#6366F1] via-[#A855F7] to-[#EC4899] opacity-70"></div>
              <CardHeader className="pb-4">
                 <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#A855F7]" />
                    Human-Language Mission Goal
                 </CardTitle>
                 <CardDescription>Zero selectors, zero selectors. Just describe your monitoring goal.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <Textarea 
                    placeholder="e.g. Find the latest 5 laptops under $1000 on Dell.com, extract their specs, summarize changes daily."
                    className="min-h-[180px] bg-[#0A0A0F] border-[#1E1E2E] text-lg p-6 focus:border-[#6366F1] transition-all"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                 />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-[#52525B]">Agent Name (Optional)</label>
                       <Input 
                          placeholder="e.g. Amazon Price Tracker" 
                          className="bg-[#0A0A0F] border-[#1E1E2E]"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-[#52525B]">Schedule Frequency</label>
                       <Select value={schedule} onValueChange={(val) => val && setSchedule(val)}>
                          <SelectTrigger className="bg-[#0A0A0F] border-[#1E1E2E]">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#111118] border-[#1E1E2E]">
                             <SelectItem value="0 9 * * *">Daily at 9 AM</SelectItem>
                             <SelectItem value="0 */6 * * *">Every 6 Hours</SelectItem>
                             <SelectItem value="0 0 * * 1">Weekly on Monday</SelectItem>
                             <SelectItem value="manual">Manual Trigger Only</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-[#1E1E2E] bg-[#1E1E2E]/10 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs text-[#52525B]">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    Auto-Stealth Enabled
                 </div>
                 <Button 
                    size="lg" 
                    className="bg-[#6366F1] hover:bg-[#5254E0] font-bold px-10 rounded-full"
                    disabled={!goal || loading}
                    onClick={handleDeploy}
                 >
                    {loading ? "Deploying Agents..." : "Deploy Mission Now"}
                 </Button>
              </CardFooter>
           </Card>
        </div>

        <div className="space-y-6">
           <div className="p-1 px-3 w-fit rounded-full bg-[#111118] border border-[#1E1E2E] text-xs font-bold text-[#A855F7] mb-2 uppercase tracking-tight">
              Quick Templates
           </div>
           {templates.map((t, i) => (
              <button 
                key={i} 
                onClick={() => { setGoal(t.goal); setName(t.title); }}
                className="w-full text-left p-4 rounded-xl border border-[#1E1E2E] bg-[#111118]/50 hover:bg-[#1E1E2E] transition-all group lg:p-6"
              >
                <h4 className="font-bold flex items-center justify-between group-hover:text-[#6366F1]">
                  {t.title} <ChevronRight className="w-4 h-4" />
                </h4>
                <p className="text-xs text-[#52525B] mt-2 line-clamp-2 leading-relaxed">{t.goal}</p>
              </button>
           ))}
           
           <Card className="bg-transparent border-[#1E1E2E] border-dashed mt-8 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                 <div className="w-12 h-12 rounded-full bg-[#111118] flex items-center justify-center">
                    <BrainCircuit className="w-6 h-6 text-[#52525B]" />
                 </div>
                 <div className="space-y-1">
                    <h5 className="font-bold text-sm">Visual Prompting</h5>
                    <p className="text-[10px] text-[#52525B]">Highlight areas on a live screenshot. (Coming Phase 6)</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
