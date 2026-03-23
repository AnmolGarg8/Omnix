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
  Rocket, 
  Sparkles, 
  Search, 
  BrainCircuit, 
  CheckCircle2, 
  ChevronRight,
  Cpu,
  Target
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
    <div className="max-w-4xl mx-auto p-6 space-y-16 pb-20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111A11] border border-[#00FF6A]/30 text-[10px] font-black tracking-[3px] text-[#00FF6A] uppercase mb-4 holographic">
           <Cpu className="w-3 h-3" /> NEURAL ARCHITECT
        </div>
        <h2 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-4">
          <Target className="w-12 h-12 text-[#00FF6A]" /> 
          Initialize Swarm
        </h2>
        <p className="text-[#6B9E6B] text-lg font-bold tracking-tight max-w-2xl opacity-80 uppercase leading-relaxed">Describe the target objective in natural language. AgentForIt will decompose the goal into autonomous browser tasks.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">
           <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-[#00FF6A] via-[#00C44F] to-[#00FF6A] scan-top opacity-50"></div>
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-2xl font-black flex items-center gap-3 uppercase tracking-tighter">
                    <Sparkles className="w-6 h-6 text-[#00FF6A]" />
                    Human-Language Objective
                 </CardTitle>
                 <CardDescription className="text-xs font-bold text-[#6B9E6B] uppercase tracking-widest mt-2">Zero selectors. Zero scraping code. Just pure intent.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-0 space-y-8">
                 <Textarea 
                    placeholder="e.g. Detect if any new listings appear on Craiglist for 'Vintage Rolex' under $5000. Alert immediately."
                    className="min-h-[220px] bg-[#060A06] border-[#1A2E1A] text-[#E8FFE8] text-xl p-8 rounded-2xl focus:border-[#00FF6A] transition-all font-bold placeholder:opacity-20 leading-relaxed shadow-inner"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                 />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">MISSION NOMENCLATURE</label>
                       <Input 
                          placeholder="ASSIGN NAME..." 
                          className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                       />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-[3px] text-[#6B9E6B] ml-1">SYNC FREQUENCY</label>
                       <Select value={schedule} onValueChange={(val) => val && setSchedule(val)}>
                          <SelectTrigger className="bg-[#060A06] border-[#1A2E1A] h-14 rounded-xl text-xs font-black uppercase tracking-widest focus:border-[#00FF6A]">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#0D130D] border-[#1A2E1A] text-[#E8FFE8] font-bold text-xs uppercase tracking-widest">
                             <SelectItem value="0 9 * * *">Daily @ 0900Z</SelectItem>
                             <SelectItem value="0 */6 * * *">6H RECURRING</SelectItem>
                             <SelectItem value="0 0 * * 1">Weekly (Mon)</SelectItem>
                             <SelectItem value="manual">Manual Override Only</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 bg-[#111A11]/20 flex items-center justify-between border-t border-[#1A2E1A]/30 h-24">
                 <div className="flex items-center gap-2 text-[10px] font-black text-[#6B9E6B] uppercase tracking-widest">
                    <CheckCircle2 className="w-4 h-4 text-[#00FF6A]" />
                    Stealth Native Enabled
                 </div>
                 <Button 
                    size="lg" 
                    className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-black uppercase tracking-tighter px-12 rounded-full h-12 text-lg shadow-[0_0_20px_#00FF6A33] hover:shadow-[0_0_30px_#00FF6A66] transition-all"
                    disabled={!goal || loading}
                    onClick={handleDeploy}
                 >
                    {loading ? "INITIALIZING SWARM..." : "DEPLOY INTELLIGENCE"}
                 </Button>
              </CardFooter>
           </Card>
        </div>

        <div className="space-y-8">
           <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black uppercase tracking-[4px] text-[#00FF6A]">OPERATIONAL TEMPLATES</span>
              <div className="w-full h-px bg-gradient-to-r from-[#00FF6A] to-transparent opacity-20 mt-1"></div>
           </div>
           
           <div className="space-y-4">
              {templates.map((t, i) => (
                 <button 
                   key={i} 
                   onClick={() => { setGoal(t.goal); setName(t.title); }}
                   className="cyber-card w-full text-left p-6 bg-[#0D130D]/80 border-[#1A2E1A] hover:bg-[#111A11] transition-all group flex flex-col gap-3"
                 >
                   <div className="flex items-center justify-between">
                      <h4 className="font-black text-sm uppercase group-hover:text-[#00FF6A] transition-colors tracking-tight">
                        {t.title}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-[#6B9E6B] group-hover:text-[#00FF6A] transition-all" />
                   </div>
                   <p className="text-[11px] text-[#6B9E6B] line-clamp-2 leading-relaxed font-medium">{t.goal}</p>
                 </button>
              ))}
           </div>
           
           <Card className="bg-[#060A06] border-[#1A2E1A] border-dashed grayscale hover:grayscale-0 transition-all opacity-40 cursor-not-allowed">
              <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-16 h-16 rounded-full bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center">
                    <BrainCircuit className="w-8 h-8 text-[#6B9E6B]" />
                 </div>
                 <div className="space-y-2">
                    <h5 className="font-black text-xs uppercase tracking-widest text-[#E8FFE8]">Tactical HUD</h5>
                    <p className="text-[10px] text-[#6B9E6B] font-bold uppercase tracking-tight">Visual agent selection coming in Stage 6 update.</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
