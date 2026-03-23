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
  CheckCircle2, 
  AlertTriangle, 
  Code, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  GitCompare
} from "lucide-react";

export const ResultsCard = ({ result, previousResult }: { result: any; previousResult?: any }) => {
  const [showRaw, setShowRaw] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const getSeverityColor = (severity: string) => {
    switch (severity.toUpperCase()) {
      case "CRITICAL": return "bg-[#EF4444] text-white";
      case "HIGH": return "bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444]/50";
      case "MEDIUM": return "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/50";
      case "LOW": return "bg-[#94A3B8]/20 text-[#94A3B8] border-[#94A3B8]/50";
      default: return "bg-[#94A3B8]/20 text-[#94A3B8]";
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(result.raw_json, null, 2));
  };

  return (
    <Card className="bg-[#111118] border-[#1E1E2E] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between border-b border-[#1E1E2E] p-4">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium">Result ID: {result.result_id.substring(0, 8)}</h3>
            <span className="text-xs text-[#94A3B8]">{new Date(result.timestamp).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result.changes_detected ? (
            <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30 gap-1 px-2">
              <AlertTriangle className="w-3 h-3" /> Changes Detected
            </Badge>
          ) : (
            <Badge className="bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30 gap-1 px-2">
              <CheckCircle2 className="w-3 h-3" /> No Significant Changes
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4 space-y-4">
        {/* LLM Brief Callout */}
        <div className="bg-[#6366F1]/10 border-l-2 border-[#6366F1] p-3 rounded-r-md">
          <p className="text-sm text-[#F1F5F9] leading-relaxed italic">
            "{result.brief}"
          </p>
        </div>

        {/* Anomaly Badges */}
        {result.anomalies && result.anomalies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {result.anomalies.map((anno: any, i: number) => (
              <div key={i} className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border flex items-center gap-1.5 ${getSeverityColor(anno.severity)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {anno.type}: {anno.description}
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="border-[#1E1E2E] h-8 text-xs gap-1.5"
            onClick={() => setShowRaw(!showRaw)}
          >
            <Code className="w-3.5 h-3.5" />
            {showRaw ? "Hide Raw JSON" : "View Raw JSON"}
          </Button>
          {previousResult && (
            <Button 
              variant="outline" 
              size="sm" 
              className="border-[#1E1E2E] h-8 text-xs gap-1.5"
              onClick={() => setShowCompare(!showCompare)}
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-[#94A3B8] hover:text-[#6366F1]"
            onClick={copyToClipboard}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        {/* Raw JSON Viewer */}
        {showRaw && (
          <div className="bg-[#05050A] rounded-md border border-[#1E1E2E] p-3 overflow-hidden">
            <pre className="text-[10px] font-mono text-[#F1F5F9] overflow-x-auto max-h-[300px]">
              {JSON.stringify(result.raw_json, null, 2)}
            </pre>
          </div>
        )}

        {/* Compare Logic Placeholder */}
        {showCompare && previousResult && (
          <div className="grid grid-cols-2 gap-4 bg-[#05050A] rounded-md border border-[#1E1E2E] p-3">
             <div className="space-y-2">
               <span className="text-[10px] font-bold text-[#94A3B8] uppercase">Previous Run</span>
               <pre className="text-[10px] font-mono text-zinc-500 overflow-x-auto max-h-[200px]">
                 {JSON.stringify(previousResult.raw_json, null, 2)}
               </pre>
             </div>
             <div className="space-y-2 border-l border-[#1E1E2E] pl-4">
               <span className="text-[10px] font-bold text-[#6366F1] uppercase">Current Run</span>
               <pre className="text-[10px] font-mono text-[#F1F5F9] overflow-x-auto max-h-[200px]">
                 {JSON.stringify(result.raw_json, null, 2)}
               </pre>
             </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 border-t border-[#1E1E2E] flex justify-end">
        <Button variant="link" className="text-[#6366F1] text-xs h-8 p-0 gap-1">
          View Full Agent Run <ExternalLink className="w-3 h-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};
