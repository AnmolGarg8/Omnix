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
    <Card className="cyber-card bg-[#0D130D] border-[#1A2E1A] shadow-2xl overflow-hidden group">
      <CardHeader className="p-8 pb-4 border-b border-[#1A2E1A] bg-[#111A11]">
        <div className="flex items-center justify-between mb-4">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#060A06] border border-[#1A2E1A] flex items-center justify-center shadow-inner group-hover:border-[#00FF6A]/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-[#00FF6A]" />
              </div>
              <div className="flex flex-col">
                 <CardTitle className="text-xl font-black text-[#E8FFE8] uppercase tracking-tighter">
                   TEMPORAL PRICE ANALYSIS
                 </CardTitle>
                 <div className="flex items-center gap-4 mt-1 text-[10px] font-black uppercase tracking-widest text-[#6B9E6B]">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> AGGREGATED DEVIATIONS</span>
                    <span className="flex items-center gap-1.5 text-[#00FF6A]/60"><Activity className="w-3.5 h-3.5" /> LIVE NODES ACTIVE</span>
                 </div>
              </div>
           </div>
           <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#111A11] border border-[#1A2E1A] rounded-full text-[9px] font-black tracking-widest text-[#6B9E6B] hover:text-[#00FF6A] transition-colors cursor-pointer">7D</span>
              <span className="px-3 py-1 bg-[#00FF6A] border border-[#00FF6A] rounded-full text-[9px] font-black tracking-widest text-[#060A06] shadow-[0_0_12px_#00FF6A66] transition-colors cursor-pointer">30D</span>
              <span className="px-3 py-1 bg-[#111A11] border border-[#1A2E1A] rounded-full text-[9px] font-black tracking-widest text-[#6B9E6B] hover:text-[#00FF6A] transition-colors cursor-pointer">ALL</span>
           </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-10 pt-14">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF6A" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#00FF6A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="4 4" 
                stroke="#1A2E1A" 
                vertical={false} 
              />
              <XAxis 
                dataKey="date" 
                stroke="#6B9E6B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tick={{ fontStyle: 'uppercase', fontWeight: 'bold' }}
              />
              <YAxis 
                stroke="#6B9E6B" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#0D130D", 
                  borderColor: "#1A2E1A", 
                  color: "#E8FFE8",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
                }}
                itemStyle={{ color: "#00FF6A" }}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#00FF6A" 
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
