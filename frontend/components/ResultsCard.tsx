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
    <Card className="cyber-card bg-[#0D1117] border-[#1C2A3A] shadow-2xl transition-all duration-700 overflow-hidden">
      <div className="scan-top absolute top-0 left-0 right-0 h-1"></div>
      
      <CardHeader className="p-8 pb-4 border-b border-[#1C2A3A] bg-[#111927]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#080C14] border border-[#1C2A3A] flex items-center justify-center shadow-inner group">
                <Database className="w-6 h-6 text-[#3B82F6] group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-xl font-black text-[#F0F6FF] uppercase tracking-tighter">
                   Signal Observation Cluster
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-[#6B8EAE]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {result.timestamp}</span>
                    <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> REF://{result.result_id.substring(0,12)}</span>
                 </div>
              </div>
           </div>
           <Badge className="bg-[#0D1117] text-[#3B82F6] border border-[#3B82F6]/30 font-black text-[9px] uppercase tracking-widest px-4 py-1.5 holographic transition-all">
              DATASET VALIDATED
           </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-10 group">
        <div className="space-y-4">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-[#3B82F6]">
              <Sparkles className="w-4 h-4" /> LLM ANALYSIS ENGINE
           </div>
           <div className="bg-[#080C14] border-l-4 border-[#3B82F6] p-8 rounded-r-2xl text-xl italic text-[#F0F6FF] leading-relaxed font-medium transition-all group-hover:shadow-[0_0_30px_rgba(59, 130, 246,0.05)]">
             "{result.brief}"
           </div>
        </div>

        <div className="space-y-6">
           <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-[4px] text-[#6B8EAE]">STRUCTURAL ANOMALIES</h4>
              <Badge className="bg-[#0D1117] border border-[#FF4444]/30 text-[#FF4444] text-[9px] uppercase tracking-widest px-3">CRITICAL PRIORITY</Badge>
           </div>
           
           <div className="grid grid-cols-1 gap-4">
              {result.anomalies?.map((a: any, i: number) => (
                <div key={i} className="flex flex-col gap-4 p-6 bg-[#111927] border border-[#1C2A3A] rounded-2xl group hover:border-[#3B82F6]/30 transition-all hover:translate-x-1">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <Badge className={`${a.severity === 'CRITICAL' ? 'bg-[#FF4444] text-[#0D1117]' : a.severity === 'HIGH' ? 'bg-[#F59E0B] text-[#0D1117]' : 'bg-[#3B82F6] text-[#0D1117]'} font-black text-[9px] tracking-widest px-3 py-1`}>
                            {a.severity}
                         </Badge>
                         <span className="text-[10px] font-black text-[#6B8EAE] bg-[#080C14] px-3 py-1 rounded-lg border border-[#1C2A3A] uppercase tracking-widest">{a.type}</span>
                      </div>
                      <AlertCircle className="w-4 h-4 text-[#FF4444]/50" />
                   </div>
                   
                   <p className="text-sm font-bold text-[#F0F6FF] group-hover:text-[#3B82F6] transition-colors">{a.description}</p>
                   
                   {a.old_value && (
                      <div className="flex flex-col gap-2 pt-2 border-t border-[#1C2A3A] opacity-80 group-hover:opacity-100 transition-opacity">
                         <div className="flex items-center gap-8 text-[11px] font-mono leading-none py-2">
                            <div className="flex flex-col gap-1">
                               <span className="text-[9px] uppercase tracking-widest text-[#6B8EAE]">PREVIOUS SIGNAL</span>
                               <span className="line-through text-[#6B8EAE] bg-[#080C14] px-4 py-1.5 rounded-lg border border-[#1C2A3A]">{a.old_value}</span>
                            </div>
                            <div className="w-8 h-8 flex items-center justify-center text-[#3B82F6]/40 group-hover:text-[#3B82F6] transition-colors">
                               <ChevronRight className="w-5 h-5 translate-y-2" />
                            </div>
                            <div className="flex flex-col gap-1">
                               <span className="text-[9px] uppercase tracking-widest font-black text-[#3B82F6]">ACTIVE SIGNAL</span>
                               <span className="text-[#3B82F6] bg-[#3B82F6]/10 px-4 py-1.5 rounded-lg border border-[#3B82F6]/40">{a.new_value}</span>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </CardContent>

      <CardFooter className="p-0 border-t border-[#1C2A3A]">
        <button 
          onClick={() => setShowJson(!showJson)}
          className="w-full h-14 bg-[#111927]/30 hover:bg-[#111927] transition-colors flex items-center justify-between px-8 text-[10px] font-black uppercase tracking-widest text-[#6B8EAE] hover:text-[#3B82F6]"
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            {showJson ? "CONTRACT RAW DATABANK" : "EXPAND RAW DATABANK"}
          </div>
          {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {showJson && (
          <div className="bg-[#080C14] p-8 max-h-[600px] overflow-auto font-mono text-xs leading-relaxed border-t border-[#1C2A3A] text-[#6B8EAE] scrollbar-thin scrollbar-thumb-[#1C2A3A]">
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
