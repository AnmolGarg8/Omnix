import { MissionBuilder } from "@/components/MissionBuilder";

export default function NewMissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-heading font-bold">New Mission</h2>
        <p className="text-[#94A3B8]">
          Architect and launch your AI agents across the web in seconds.
        </p>
      </div>
      
      <MissionBuilder />
    </div>
  );
}
