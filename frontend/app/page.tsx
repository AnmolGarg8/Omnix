"use client";
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
  Bell,
  Cpu
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#060A06] text-[#E8FFE8] selection:bg-[#00FF6A]/30 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Particles */}
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{ 
              left: `${i * 20 + 10}%`, 
              animationDelay: `${i * 2}s`,
              animationDuration: `${7 + i}s`
            }} 
          />
        ))}

        {/* Floating 3D Cube Mockup */}
        <div className="absolute top-1/4 right-[10%] opacity-20 hidden lg:block">
           <div className="w-16 h-16 relative preserve-3d animate-[spin_10s_linear_infinite]">
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform translate-z-8"></div>
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform -translate-z-8"></div>
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform rotate-y-90 translate-z-8"></div>
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform -rotate-y-90 translate-z-8"></div>
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform rotate-x-90 translate-z-8"></div>
              <div className="absolute inset-0 border border-[#00FF6A] bg-[#00FF6A]/5 transform -rotate-x-90 translate-z-8"></div>
           </div>
        </div>

        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF6A]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00C44F]/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto backdrop-blur-sm">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-[#00FF6A] rounded-xl flex items-center justify-center shadow-lg shadow-[#00FF6A]/30">
              <BrainCircuit className="w-6 h-6 text-[#060A06]" />
           </div>
           <Link href="/" className="flex items-center gap-2">
           <span className="text-2xl font-black tracking-tighter uppercase text-[#00FF6A] font-heading">AgentForIt</span>
        </Link>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-[#6B9E6B]">
           <a href="#features" className="hover:text-[#00FF6A] transition-colors">Intelligence</a>
           <a href="#pipeline" className="hover:text-[#00FF6A] transition-colors">Pipeline</a>
           <a href="/dashboard" className="hover:text-[#00FF6A] transition-colors">Dashboard</a>
        </div>
        <div className="flex items-center gap-4">
           <Link href="/dashboard">
              <Button className="bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] font-bold rounded-full px-8 shadow-[0_0_20px_rgba(0,255,106,0.2)]">
                Launch System
              </Button>
           </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-center space-y-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D130D] border border-[#1A2E1A] text-[10px] font-bold text-[#00FF6A] mb-4 uppercase tracking-[2px] scan-top">
           <Cpu className="w-3 h-3" />
           <span>AUTONOMOUS AGENTS ACTIVE</span>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter text-[#E8FFE8] leading-[0.8] animate-in fade-in slide-in-from-bottom duration-700">
          AgentForIt orchestrates parallel AI browser agents.
        </h1>
        
        <p className="text-lg md:text-xl text-[#6B9E6B] max-w-2xl mx-auto leading-relaxed">
          Describe any research goal — get structured intelligence on local or global schedules.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6">
           <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg bg-[#00FF6A] text-[#060A06] hover:bg-[#00D156] rounded-full shadow-2xl shadow-[#00FF6A]/20 gap-2 font-bold uppercase tracking-tight">
                Connect Intelligence <ArrowRight className="w-5 h-5" />
              </Button>
           </Link>
        </div>

        {/* Dashboard Preview Mockup */}
        <div className="mt-24 relative group max-w-5xl mx-auto">
           <div className="absolute -inset-1 bg-[#00FF6A] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
           <div className="relative cyber-card overflow-hidden bg-[#0D130D]">
              <div className="h-4 bg-[#111A11] border-b border-[#1A2E1A] flex items-center gap-1.5 px-4">
                 <div className="w-2 h-2 rounded-full bg-[#1A2E1A]"></div>
                 <div className="w-2 h-2 rounded-full bg-[#1A2E1A]"></div>
                 <div className="w-2 h-2 rounded-full bg-[#1A2E1A]"></div>
              </div>
              <img 
                src="/dashboard-mockup.png" 
                alt="AgentForIt Dashboard Preview" 
                className="w-full h-auto opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060A06] via-transparent to-transparent"></div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
         <FeatureCard 
            icon={<Search className="w-6 h-6 text-[#00FF6A]" />}
            title="SWARM CRAWLING"
            description="N agents fire simultaneously to monitor competitors and news at the speed of light."
         />
         <FeatureCard 
            icon={<BrainCircuit className="w-6 h-6 text-[#00FF6A]" />}
            title="Llama-3.3 INTELLIGENCE"
            description="Llama-3.3-70b parses complex instructions into perfect browser automation tasks."
         />
         <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-[#00FF6A]" />}
            title="STEALTH PROTOCOL"
            description="TinyFish native stealth bypasses high-security anti-bot systems automatically."
         />
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1A2E1A] py-16 px-6 bg-[#0D130D]/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#00FF6A] rounded-md flex items-center justify-center">
                 <BrainCircuit className="w-5 h-5 text-[#060A06]" />
              </div>
              <div className="flex flex-col gap-4">
              <span className="text-xl font-black uppercase tracking-tighter text-[#00FF6A]">AgentForIt</span>
              <p className="text-[#6B9E6B] text-xs font-mono uppercase">Next-Gen Autonomous Intelligence Swarms.</p>
           </div>
           </div>
           <p className="text-[#6B9E6B] text-xs font-mono">© 2026 AgentForIt INTELLIGENCE SYSTEMS. ENCRYPTED DEPLOYMENT.</p>
           <div className="flex gap-8 text-[#6B9E6B] text-[10px] font-bold uppercase tracking-[2px]">
              <a href="#" className="hover:text-[#00FF6A]">API</a>
              <a href="#" className="hover:text-[#00FF6A]">SECURITY</a>
              <a href="#" className="hover:text-[#00FF6A]">STATUS</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: any) => (
  <div className="cyber-card p-10 group bg-[#0D130D]">
     <div className="w-14 h-14 rounded-2xl bg-[#111A11] border border-[#1A2E1A] flex items-center justify-center mb-8 group-hover:border-[#00FF6A]/50 transition-colors">
        {icon}
     </div>
     <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">{title}</h3>
     <p className="text-[#6B9E6B] leading-relaxed text-sm font-medium">{description}</p>
     <div className="mt-6 w-0 group-hover:w-full h-[1px] bg-[#00FF6A]/30 transition-all duration-500"></div>
  </div>
);
