"use client";
import React, { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  ReferenceDot 
} from "recharts";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111118] border border-[#1E1E2E] p-3 rounded-lg shadow-xl text-xs space-y-2">
        <p className="font-bold text-[#F1F5F9]">{new Date(label).toDateString()}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-[#94A3B8] capitalize">{entry.name}:</span>
            <span className="font-bold text-[#F1F5F9]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrendChart = ({ data, missionName = "Mission History" }: { data: any[]; missionName?: string }) => {
  const [range, setRange] = useState("30d");

  if (!data || data.length === 0) {
    return (
      <Card className="bg-[#111118] border-[#1E1E2E]">
        <CardContent className="h-[300px] flex items-center justify-center text-[#94A3B8]">
          <p>No trend data available yet</p>
        </CardContent>
      </Card>
    );
  }

  // Find anomaly points for ReferenceDot
  const anomalies = data.filter(d => d.anomalyDetected);

  return (
    <Card className="bg-[#111118] border-[#1E1E2E] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-xl font-heading">{missionName}</CardTitle>
          <CardDescription>Visualizing data trends and detected anomalies</CardDescription>
        </div>
        <div className="flex bg-[#0A0A0F] border border-[#1E1E2E] rounded-md p-1">
          {["7d", "30d", "All"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`text-[10px] px-3 py-1.5 rounded transition-all ${
                range === r 
                  ? "bg-[#6366F1] text-white shadow-lg" 
                  : "text-[#94A3B8] hover:text-[#F1F5F9]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E1E2E" />
            <XAxis 
              dataKey="timestamp" 
              stroke="#4B5563" 
              fontSize={10}
              tickFormatter={(t) => new Date(t).toLocaleDateString([], { month: 'short', day: 'numeric' })} 
            />
            <YAxis stroke="#4B5563" fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, paddingTop: 20 }} />
            
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Primary Value" 
              stroke="#6366F1" 
              strokeWidth={3} 
              dot={{ stroke: '#6366F1', strokeWidth: 2, r: 2, fill: '#0A0A0F' }}
              activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 2, fill: '#F1F5F9' }} 
            />

            {/* Anomaly markers */}
            {anomalies.map((point, index) => (
              <ReferenceDot 
                key={index} 
                x={point.timestamp} 
                y={point.value} 
                r={6} 
                fill="#EF4444" 
                stroke="#0A0A0F" 
                strokeWidth={2} 
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
