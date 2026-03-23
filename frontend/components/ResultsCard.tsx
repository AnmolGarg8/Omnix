"use client";
import React, { useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Database, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Layers,
  Sparkles,
  Cpu
} from "lucide-react";

export const ResultsCard = ({ result }: { result: any }) => {
  const [showJson, setShowJson] = useState(false);

  if (!result) return null;

  return (
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl transition-all duration-700 overflow-hidden">
      <div className="scan-top absolute top-0 left-0 right-0 h-1"></div>
      
      <CardHeader className="p-8 pb-4 border-b border-[#1A2E1A] bg-[#111A11]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#060A06] border border-[#1A2E1A] flex items-center justify-center shadow-inner group">
                <Database className="w-6 h-6 text-[#00FF6A] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-xl font-black text-[#E8FFE8] uppercase tracking-tighter">
                   Signal Observation Cluster
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-[#6B9E6B]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {result.timestamp}</span>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> REF://{result.result_id.substring(0,12)}</span>
                 </div>
              </div>
           </div>
           <Badge className="bg-[#0D130D] text-[#00FF6A] border border-[#00FF6A]/30 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 holographic transition-all">
              DATASET VALIDATED
           </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-10 group">
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-[#00FF6A]">
              <Sparkles className="w-4 h-4" /> LLM ANALYSIS ENGINE
           </div>
           <div className="bg-[#060A06] border-l-4 border-[#00FF6A] p-8 rounded-r-2xl text-xl italic text-[#E8FFE8] leading-relaxed font-medium transition-all group-hover:shadow-[0_0_30px_rgba(0,255,106,0.05)]">
             "{result.brief}"
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-[4px] text-[#6B9E6B]">STRUCTURAL ANOMALIES</h4>
              <Badge className="bg-[#0D130D] border border-[#FF4444]/30 text-[#FF4444] text-[9px] uppercase tracking-widest px-3">CRITICAL PRIORITY</Badge>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {result.anomalies?.map((a: any, i: number) => (
                <div key={i} className="flex flex-col gap-4 p-6 bg-[#111A11] border border-[#1A2E1A] rounded-2xl group hover:border-[#00FF6A]/30 transition-all hover:translate-x-1">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Badge className={`${a.severity === 'CRITICAL' ? 'bg-[#FF4444] text-[#0D130D]' : a.severity === 'HIGH' ? 'bg-[#F59E0B] text-[#0D130D]' : 'bg-[#00FF6A] text-[#0D130D]'} font-black text-[9px] tracking-widest px-3 py-1`}>
                            {a.severity}
                         </Badge>
                         <span className="text-[10px] font-black text-[#6B9E6B] bg-[#060A06] px-3 py-1 rounded-lg border border-[#1A2E1A] uppercase tracking-widest">{a.type}</span>
                      </div>
                      <AlertCircle className="w-4 h-4 text-[#FF4444]/50" />
                   </div>
                   
                   <p className="text-sm font-bold text-[#E8FFE8] group-hover:text-[#00FF6A] transition-colors">{a.description}</p>
                   
                   {a.old_value && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-[#1A2E1A] opacity-80 group-hover:opacity-100 transition-opacity">
                         <div className="flex items-center gap-8 text-[11px] font-mono leading-none py-2">
                            <div className="flex flex-col gap-1">
                               <span className="text-[9px] uppercase tracking-widest text-[#6B9E6B]">PREVIOUS SIGNAL</span>
                               <span className="line-through text-[#6B9E6B] bg-[#060A06] px-4 py-1.5 rounded-lg border border-[#1A2E1A]">{a.old_value}</span>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center text-[#00FF6A]/40 group-hover:text-[#00FF6A] transition-colors">
                               <ChevronRight className="w-5 h-5 translate-y-2" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="text-[9px] uppercase tracking-widest font-black text-[#00FF6A]">ACTIVE SIGNAL</span>
                               <span className="text-[#00FF6A] bg-[#00FF6A]/10 px-4 py-1.5 rounded-lg border border-[#00FF6A]/40">{a.new_value}</span>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </CardContent>

      <CardFooter className="p-0 border-t border-[#1A2E1A]">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="w-full h-14 bg-[#111A11]/30 hover:bg-[#111A11] transition-colors flex items-center justify-between px-8 text-[10px] font-black uppercase tracking-widest text-[#6B9E6B] hover:text-[#00FF6A]"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            {showJson ? "CONTRACT RAW DATABANK" : "EXPAND RAW DATABANK"}
          </div>
          {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showJson && (
          <div className="bg-[#060A06] p-8 max-h-[600px] overflow-auto font-mono text-xs leading-relaxed border-t border-[#1A2E1A] text-[#6B9E6B] scrollbar-thin scrollbar-thumb-[#1A2E1A]">
            <pre>{JSON.stringify(result.raw_json, null, 2)}</pre>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
