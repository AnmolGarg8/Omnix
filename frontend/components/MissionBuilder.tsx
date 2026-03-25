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
    <Card className="cyber-card bg-[#0D1117] border-[#1C2A3A] shadow-[0_0_100px_rgba(59, 130, 246,0.05)] overflow-hidden">
      <div className="h-2 bg-[#3B82F6]/10 absolute top-0 left-0 right-0 overflow-hidden">
         <div className="h-full bg-[#3B82F6] w-1/4 animate-[sweep_4s_linear_infinite] shadow-[0_0_20px_#3B82F6]"></div>
      </div>
      
      <CardHeader className="p-10 pb-6 border-b border-[#1C2A3A] bg-[#111927]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#080C14] border border-[#1C2A3A] flex items-center justify-center shadow-lg group">
                <BrainCircuit className="w-7 h-7 text-[#3B82F6] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-3xl font-black text-[#F0F6FF] uppercase tracking-tighter">
                   Neural HUD: Goal Acquisition
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[11px] font-black uppercase tracking-[3px] text-[#6B8EAE]">
                    <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-[#3B82F6]" /> ACTIVE SENSORS READY</span>
                    <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-[#3B82F6]" /> LLM CORE PRIMED</span>
                 </div>
              </div>
           </div>
           <Badge className="bg-[#111927] text-[#3B82F6] border border-[#3B82F6]/30 text-[9px] font-black tracking-widest px-4 py-1.5 shadow-[0_0_12px_#3B82F633]">
              PHASE 5 // STABLE
           </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-10 space-y-10 group">
        <div className="space-y-4">
          <label className="text-[11px] font-black uppercase tracking-[5px] text-[#6B8EAE] ml-1">OBJECTIVE PARAMETERS</label>
          <Textarea 
            placeholder="Type your monitoring goal in plain English..."
            className="min-h-[220px] bg-[#080C14] border-[#1C2A3A] text-[#F0F6FF] text-xl p-8 rounded-2xl focus:border-[#3B82F6] transition-all font-bold placeholder:opacity-20 leading-relaxed shadow-inner"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent flex-1 opacity-20"></div>
             <span className="text-[10px] font-black uppercase tracking-[4px] text-[#6B8EAE]">QUICK INJECTION PRESETS</span>
             <div className="h-px bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent flex-1 opacity-20"></div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center">
            {PRESETS.map((p, i) => (
              <button 
                key={i} 
                className="px-6 py-2.5 rounded-full bg-[#111927] border border-[#1C2A3A] text-[10px] font-black text-[#6B8EAE] hover:text-[#3B82F6] hover:bg-[#3B82F6]/5 hover:border-[#3B82F6]/30 transition-all uppercase tracking-widest hover:-translate-y-0.5"
                onClick={() => setGoal(p)}
              >
                {p.length > 50 ? p.substring(0, 50) + "..." : p}
              </button>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-10 pt-0 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="flex items-center gap-8 text-[11px] font-black text-[#6B8EAE] uppercase tracking-[3px]">
           <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#3B82F6]" />
              <span className="opacity-80">PARALLEL CRAWL</span>
           </div>
           <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
              <span className="opacity-80">SMART RETRY</span>
           </div>
        </div>
        
        <Button 
          size="lg" 
          className="h-16 px-12 bg-[#3B82F6] text-[#ffffff] hover:bg-[#2563EB] font-black uppercase tracking-tighter text-xl rounded-full shadow-[0_0_30px_#3B82F644] hover:shadow-[0_0_50px_#3B82F688] transition-all group/btn"
          disabled={!goal}
          onClick={() => onDeploy(goal)}
        >
          LAUNCH SWARM <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-1.5 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};
