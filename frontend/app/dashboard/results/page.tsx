"use client";
import React, { useEffect, useState } from "react";
import { getResults, getMissions } from "@/lib/api";
import { ResultsCard } from "@/components/ResultsCard";
import { TrendChart } from "@/components/TrendChart";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutList, Search, Activity } from "lucide-react";

export default function ResultsPage() {
  const [missions, setMissions] = useState<any[]>([]);
  const [selectedMissionId, setSelectedMissionId] = useState<string>("all");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [missionsData, resultsData] = await Promise.all([
          getMissions(),
          getResults("all", 1) // Assuming "all" is a valid backend query for dev
        ]);
        setMissions(missionsData);
        setResults(resultsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredResults = selectedMissionId === "all" 
    ? results 
    : results.filter(r => r.mission_id === selectedMissionId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-heading font-bold">Mission Insights</h2>
          <p className="text-[#94A3B8]">Review the findings across your automated web agents.</p>
        </div>
        
        <div className="w-full md:w-64">
           <Select onValueChange={(val) => val && setSelectedMissionId(val)} defaultValue="all">
             <SelectTrigger className="bg-[#111118] border-[#1E1E2E]">
               <SelectValue placeholder="Filter by Mission" />
             </SelectTrigger>
             <SelectContent className="bg-[#111118] border-[#1E1E2E]">
               <SelectItem value="all">All Missions</SelectItem>
               {missions.map(m => (
                 <SelectItem key={m.mission_id} value={m.mission_id}>{m.name}</SelectItem>
               ))}
             </SelectContent>
           </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[300px] w-full bg-[#111118]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px] w-full bg-[#111118]" />
            <Skeleton className="h-[400px] w-full bg-[#111118]" />
          </div>
        </div>
      ) : results.length === 0 ? (
        <div className="bg-[#111118] border border-[#1E1E2E] rounded-xl p-20 text-center space-y-4">
           <Activity className="w-16 h-16 mx-auto mb-4 opacity-10" />
           <h3 className="text-xl font-bold">No missions executed yet</h3>
           <p className="text-[#94A3B8] max-w-md mx-auto">Launch a mission to start collecting web intelligence and visualizing trends.</p>
        </div>
      ) : (
        <>
          {/* Trend Chart across all/selected results */}
          <TrendChart 
            data={filteredResults.map(r => ({
              timestamp: r.timestamp,
              value: r.raw_json?.price || r.raw_json?.count || Math.random() * 100, // Placeholder mapping
              anomalyDetected: r.changes_detected
            }))}
            missionName={selectedMissionId === "all" ? "Combined Trends" : missions.find(m => m.mission_id === selectedMissionId)?.name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredResults.map((result, i) => (
              <ResultsCard 
                key={result.result_id} 
                result={result} 
                previousResult={i < filteredResults.length - 1 ? filteredResults[i+1] : null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
