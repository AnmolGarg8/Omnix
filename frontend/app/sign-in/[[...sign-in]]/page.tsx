"use client";
import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#080C14] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        
        {/* Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className={`z-10 w-full max-w-md p-4 transition-all duration-1000 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {/* Logo/Brand Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4 relative">
             <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-xl animate-pulse" />
             <div className="relative w-full h-full bg-[#0D1117] border border-blue-500/30 rounded-xl flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
                  <circle cx="16" cy="16" r="3" fill="#3B82F6" />
                </svg>
             </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF]">
            Agent<span className="text-blue-500">For</span>It
          </h1>
          <p className="text-[#6B8EAE] text-sm mt-2 font-medium">Deploy intelligence swarms to the web</p>
        </div>

        {/* Clerk Sign In Card with minimal styling override via appearance */}
        <div className="relative group">
           {/* Glow Effect */}
           <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
           
           <div className="relative">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "bg-[#0D1117] border border-blue-500/10 shadow-2xl rounded-2xl",
                    headerTitle: "text-[#F0F6FF] font-bold",
                    headerSubtitle: "text-[#6B8EAE]",
                    socialButtonsBlockButton: "bg-[#111927] border border-blue-500/10 hover:bg-[#1C2A3A] transition-all text-[#F0F6FF]",
                    socialButtonsBlockButtonText: "text-[#F0F6FF] font-medium",
                    formFieldLabel: "text-[#6B8EAE] font-medium",
                    formFieldInput: "bg-[#111927] border border-blue-500/10 text-[#F0F6FF] focus:border-blue-500/50 transition-all",
                    footerActionLink: "text-blue-500 hover:text-blue-400 font-semibold",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20",
                    dividerText: "text-[#6B8EAE]",
                    dividerLine: "bg-blue-500/10"
                  }
                }}
              />
           </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-[#6B8EAE] hover:text-[#F0F6FF] transition-colors flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to homepage
          </Link>
        </div>
      </div>
      
      {/* Bottom Subtle Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080C14] to-transparent pointer-events-none" />
    </div>
  );
}
