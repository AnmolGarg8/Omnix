"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Sparkles, 
  BrainCircuit, 
  Rocket, 
  Play, 
  Zap, 
  Clock, 
  Globe,
  Plus,
  ArrowRight,
  Cpu
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PRESETS = [
  "Monitor Nike, Adidas, Zara for price changes on running shoes under ₹5000",
  "Check TechCrunch, ProductHunt, HackerNews daily for AI startup funding news",
  "Track my 5 competitors' landing pages for copy or pricing changes",
  "Scrape top 20 LinkedIn job postings for React Developer in Bangalore",
  "Monitor Amazon and Flipkart for RTX 5090 stock availability"
];

export const MissionBuilder = ({ onDeploy }: { onDeploy: (goal: string) => void }) => {
  const [goal, setGoal] = useState("");
  
  return (
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-[0_0_100px_rgba(0,255,106,0.05)] overflow-hidden">
      <div className="h-2 bg-[#00FF6A]/10 absolute top-0 left-0 right-0 overflow-hidden">
         <div className="h-full bg-[#00FF6A] w-1/4 animate-[sweep_4s_linear_infinite] shadow-[0_0_20px_#00FF6A]"></div>
      </div>
      
      <CardHeader className="p-10 pb-6 border-b border-[#1A2E1A] bg-[#111A11]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#060A06] border border-[#1A2E1A] flex items-center justify-center shadow-lg group">
                <BrainCircuit className="w-7 h-7 text-[#00FF6A] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-3xl font-black text-[#E8FFE8] uppercase tracking-tighter">
                   Neural HUD: Goal Acquisition
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[11px] font-black uppercase tracking-[3px] text-[#6B9E6B]">
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#00FF6A]" /> ACTIVE SENSORS READY</span>
                    <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#00FF6A]" /> LLM CORE PRIMED</span>
                 </div>
              </div>
           </div>
           <Badge className="bg-[#111A11] text-[#00FF6A] border border-[#00FF6A]/30 text-[9px] font-black tracking-widest px-4 py-1.5 shadow-[0_0_12px_#00FF6A33]">
              PHASE 5 // STABLE
           </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-10 space-y-10 group">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[5px] text-[#6B9E6B] ml-1">OBJECTIVE PARAMETERS</label>
          <Textarea 
            placeholder="Type your monitoring goal in plain English..."
            className="min-h-[220px] bg-[#060A06] border-[#1A2E1A] text-[#E8FFE8] text-xl p-8 rounded-2xl focus:border-[#00FF6A] transition-all font-bold placeholder:opacity-20 leading-relaxed shadow-inner"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-px bg-gradient-to-r from-transparent via-[#00FF6A] to-transparent flex-1 opacity-20"></div>
             <span className="text-[10px] font-black uppercase tracking-[4px] text-[#6B9E6B]">QUICK INJECTION PRESETS</span>
             <div className="h-px bg-gradient-to-r from-transparent via-[#00FF6A] to-transparent flex-1 opacity-20"></div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {PRESETS.map((p, i) => (
              <button 
                key={i} 
                className="px-6 py-2.5 rounded-full bg-[#111A11] border border-[#1A2E1A] text-[10px] font-black text-[#6B9E6B] hover:text-[#00FF6A] hover:bg-[#00FF6A]/5 hover:border-[#00FF6A]/30 transition-all uppercase tracking-widest hover:-translate-y-0.5"
                onClick={() => setGoal(p)}
              >
                {p.length > 50 ? p.substring(0, 50) + "..." : p}
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-10 pt-0 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8 text-[11px] font-black text-[#6B9E6B] uppercase tracking-[3px]">
           <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00FF6A]" />
              <span className="opacity-80">PARALLEL CRAWL</span>
           </div>
           <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
              <span className="opacity-80">SMART RETRY</span>
           </div>
        </div>
        
        <Button 
          size="lg" 
          className="h-16 px-12 bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-black uppercase tracking-tighter text-xl rounded-full shadow-[0_0_30px_#00FF6A44] hover:shadow-[0_0_50px_#00FF6A88] transition-all group/btn"
          disabled={!goal}
          onClick={() => onDeploy(goal)}
        >
          LAUNCH SWARM <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-1.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};
