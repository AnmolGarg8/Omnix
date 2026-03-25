"use client";
import React from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, Database, Clock } from "lucide-react";

export const TrendChart = ({ data }: { data: any[] }) => {
  return (
    <Card className="cyber-card bg-[#0D1117] border-[#1C2A3A] shadow-2xl overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-[#1C2A3A] bg-[#111927]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#080C14] border border-[#1C2A3A] flex items-center justify-center shadow-inner group-hover:border-[#3B82F6]/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-xl font-black text-[#F0F6FF] uppercase tracking-tighter">
                   TEMPORAL PRICE ANALYSIS
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-[#6B8EAE]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> AGGREGATED DEVIATIONS</span>
                    <span className="flex items-center gap-1.5 text-[#3B82F6]/60"><Activity className="w-3.5 h-3.5" /> LIVE NODES ACTIVE</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#111927] border border-[#1C2A3A] rounded-full text-[9px] font-black tracking-widest text-[#6B8EAE] hover:text-[#3B82F6] transition-colors cursor-pointer">7D</span>
              <span className="px-3 py-1 bg-[#3B82F6] border border-[#3B82F6] rounded-full text-[9px] font-black tracking-widest text-[#080C14] shadow-[0_0_12px_#3B82F666] transition-colors cursor-pointer">30D</span>
              <span className="px-3 py-1 bg-[#111927] border border-[#1C2A3A] rounded-full text-[9px] font-black tracking-widest text-[#6B8EAE] hover:text-[#3B82F6] transition-colors cursor-pointer">ALL</span>
           </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-10 pt-14">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="#1C2A3A" 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                stroke="#6B8EAE" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontStyle: 'uppercase', fontWeight: 'bold' }}
              />
              <YAxis 
                stroke="#6B8EAE" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0D1117", 
                  borderColor: "#1C2A3A", 
                  color: "#F0F6FF",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
                itemStyle={{ color: "#3B82F6" }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
