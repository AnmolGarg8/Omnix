"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { createMission } from "@/lib/api";
import { Loader2, Rocket, Sparkles } from "lucide-react";

const EXAMPLES = [
  "Monitor Nike, Adidas, Zara for price changes on running shoes under ₹5000",
  "Check TechCrunch, ProductHunt, HackerNews daily for AI startup funding news",
  "Track my 5 competitors' landing pages for copy or pricing changes",
  "Scrape top 20 LinkedIn job postings for React Developer in Bangalore",
  "Monitor Amazon and Flipkart for RTX 5090 stock availability"
];

const SCHEDULES = [
  { label: "Every Hour", value: "0 * * * *" },
  { label: "Every 6 Hours", value: "0 */6 * * *" },
  { label: "Daily at 9 AM", value: "0 9 * * *" },
  { label: "Weekly on Monday", value: "0 9 * * 1" },
  { label: "Custom", value: "custom" }
];

export const MissionBuilder = () => {
  const router = useRouter();
  const [goal, setGoal] = useState("");
  const [schedule, setSchedule] = useState("0 9 * * *");
  const [customSchedule, setCustomSchedule] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing your goal...");

  const handleSubmit = async () => {
    if (!goal) return;
    setIsLoading(true);
    setLoadingText("Analyzing your goal...");
    
    try {
      const payload = {
        goal_nl: goal,
        schedule: schedule === "custom" ? customSchedule : schedule,
        name: name || undefined
      };
      
      const res = await createMission(payload);
      setLoadingText("Spinning up agents...");
      
      // Artificial delay to show progress and excitement
      setTimeout(() => {
        router.push(`/dashboard/missions/${res.mission_id}`);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-[#111118] border-[#1E1E2E]">
        <CardHeader>
          <CardTitle className="text-2xl font-heading flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#6366F1]" />
            Define Your Mission
          </CardTitle>
          <CardDescription>
            Describe what you want to monitor in plain English. Omnix will architect the agents for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Goal Input */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#94A3B8]">Mission Goal</Label>
            <Textarea
              className="min-h-[120px] bg-[#0A0A0F] border-[#1E1E2E] focus:ring-[#6366F1] resize-none"
              placeholder="e.g. Monitor Amazon and Flipkart for RTX 5090 availability and price drops daily..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setGoal(ex)}
                className="text-xs px-3 py-1.5 rounded-full bg-[#1E1E2E] border border-[#1E1E2E] hover:border-[#6366F1] transition-colors text-[#94A3B8] hover:text-[#F1F5F9]"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Schedule */}
          <div className="space-y-4 pt-4 border-t border-[#1E1E2E]">
            <Label className="text-sm font-medium text-[#94A3B8]">Execution Schedule</Label>
            <RadioGroup
              defaultValue="0 9 * * *"
              onValueChange={setSchedule}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {SCHEDULES.map((s) => (
                <div key={s.value} className="flex items-center space-x-2 p-3 rounded-md bg-[#0A0A0F] border border-[#1E1E2E]">
                  <RadioGroupItem value={s.value} id={`s-${s.value}`} />
                  <Label htmlFor={`s-${s.value}`}>{s.label}</Label>
                </div>
              ))}
            </RadioGroup>
            
            {schedule === "custom" && (
              <Input
                className="bg-[#0A0A0F] border-[#1E1E2E]"
                placeholder="Enter cron expression (e.g. 0 0 * * *)"
                value={customSchedule}
                onChange={(e) => setCustomSchedule(e.target.value)}
              />
            )}
          </div>

          {/* Mission Name */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-[#94A3B8]">Mission Name (Optional)</Label>
            <Input
              className="bg-[#0A0A0F] border-[#1E1E2E]"
              placeholder="Auto-generated if left blank"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end p-6 bg-[#111118]/50 rounded-b-lg border-t border-[#1E1E2E]">
          <Button
            size="lg"
            className="bg-[#6366F1] hover:bg-[#5254E0] px-8 py-6 text-lg h-auto shadow-[0_0_20px_rgba(99,102,241,0.15)] group"
            onClick={handleSubmit}
            disabled={isLoading || !goal}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {loadingText}
              </>
            ) : (
              <>
                Launch Mission
                <Rocket className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
