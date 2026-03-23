import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Rocket, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Search, 
  BrainCircuit, 
  ArrowRight,
  Monitor,
  Bell
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#6366F1]/30">
      {/* Dynamic Background Noise/Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6366F1]/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#A855F7]/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-2">
           <div className="w-10 h-10 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg shadow-[#6366F1]/30">
              <BrainCircuit className="w-6 h-6 text-white" />
           </div>
           <span className="text-2xl font-heading font-black tracking-tighter uppercase">Omnix</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#94A3B8]">
           <a href="#features" className="hover:text-white transition-colors">Intelligence</a>
           <a href="#pipeline" className="hover:text-white transition-colors">Pipeline</a>
           <a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/sign-in">
              <Button variant="ghost" className="text-[#94A3B8] hover:text-white">Sign In</Button>
           </Link>
           <Link href="/dashboard">
              <Button className="bg-white text-black hover:bg-gray-200 font-bold rounded-full px-6">
                Connect Dashboard
              </Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111118] border border-[#1E1E2E] text-xs font-medium text-[#6366F1] mb-4">
           <Zap className="w-3 h-3 fill-current" />
           <span>Phase 4: Automation Now Live</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tight leading-[0.9] max-w-4xl mx-auto ">
          Deploy AI Agents to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#A855F7]">Watch the Web</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto leading-relaxed">
          Omnix orchestrates parallel AI browser agents across any website.
          Detect changes, generate embeddings, and get smart alerts — zero human involvement.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
           <Link href="/dashboard">
             <Button size="lg" className="h-14 px-10 text-lg bg-[#6366F1] hover:bg-[#5254E0] rounded-full shadow-2xl shadow-[#6366F1]/20 gap-2">
               Get Started for Free <ArrowRight className="w-5 h-5" />
             </Button>
           </Link>
           <Link href="#pipeline">
             <Button variant="outline" size="lg" className="h-14 px-10 text-lg border-[#1E1E2E] bg-transparent hover:bg-[#111118] rounded-full">
               View Pipeline Architecture
             </Button>
           </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-20 relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
           <div className="relative bg-[#0A0A0F] border border-[#1E1E2E] rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                alt="Omnix Dashboard Preview" 
                className="w-full h-auto opacity-80 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
         <FeatureCard 
            icon={<Search className="w-6 h-6 text-[#6366F1]" />}
            title="Parallel Search"
            description="Fires N agents simultaneously to crawl competitors, marketplaces, and news sources in seconds."
         />
         <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-[#A855F7]" />}
            title="LLM Intelligence"
            description="Llama-3.3-70b parses natural goals into tasks and analyzes results for meaningful anomalies."
         />
         <FeatureCard 
            icon={<Globe className="w-6 h-6 text-[#22C55E]" />}
            title="Stealth Native"
            description="Integrated TinyFish stealth technology bypasses anti-bot detections on high-security targets."
         />
         <FeatureCard 
            icon={<Zap className="w-6 h-6 text-[#F59E0B]" />}
            title="Auto-Embeddings"
            description="Voyage AI generates vector embeddings for every run, enabling deep semantic similarity tracking."
         />
         <FeatureCard 
            icon={<Bell className="w-6 h-6 text-[#EF4444]" />}
            title="Alert Orchestration"
            description="Multi-channel alerts via Slack, Email, and Push with smart priority filtering."
         />
         <FeatureCard 
            icon={<Monitor className="w-6 h-6 text-[#6366F1]" />}
            title="Live Proxy"
            description="Watch your agents work in real-time with live iframe feeds and log streaming."
         />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1E1E2E] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-2 grayscale opacity-50">
              <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                 <BrainCircuit className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-heading font-bold uppercase tracking-tighter">Omnix</span>
           </div>
           <p className="text-[#52525B] text-sm">© 2026 Omnix Intelligence Systems. Built for TinyFish $2M Hackathon.</p>
           <div className="flex gap-6 text-[#52525B] text-sm">
              <a href="#" className="hover:text-white">API Docs</a>
              <a href="#" className="hover:text-white">Security</a>
              <a href="#" className="hover:text-white">Status</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="p-8 rounded-3xl bg-[#111118] border border-[#1E1E2E] hover:border-[#6366F1]/50 transition-all group lg:p-10">
     <div className="w-12 h-12 rounded-2xl bg-[#0A0A0F] border border-[#1E1E2E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h3 className="text-xl font-heading font-bold mb-3">{title}</h3>
     <p className="text-[#94A3B8] leading-relaxed text-sm">{description}</p>
  </div>
);
