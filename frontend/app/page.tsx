"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";

function AgentNetworkCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // Central node — large glowing sphere
    const centerGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0x3B82F6,
      emissive: 0x3B82F6,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8
    });
    const centerNode = new THREE.Mesh(centerGeo, centerMat);
    scene.add(centerNode);

    // Outer ring glow
    const ringGeo = new THREE.TorusGeometry(1.8, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.3 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ring);

    const ring2Geo = new THREE.TorusGeometry(2.4, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.15 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 3;
    scene.add(ring2);

    // Satellite agent nodes
    const agentCount = 6;
    const agents: THREE.Mesh[] = [];
    const agentAngles: number[] = [];
    const agentLines: THREE.Line[] = [];

    for (let i = 0; i < agentCount; i++) {
      const angle = (i / agentCount) * Math.PI * 2;
      agentAngles.push(angle);

      const agentGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const agentMat = new THREE.MeshStandardMaterial({
        color: 0x2563EB,
        emissive: 0x2563EB,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.6
      });
      const agent = new THREE.Mesh(agentGeo, agentMat);
      const radius = 5.5;
      agent.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.5,
        Math.sin(angle) * 1.5
      );
      scene.add(agent);
      agents.push(agent);

      // Connection line from center to agent
      const points = [
        new THREE.Vector3(0, 0, 0),
        agent.position.clone()
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineAttribute = lineGeo.attributes.position as THREE.BufferAttribute;
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x3B82F6,
        transparent: true,
        opacity: 0.2
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);
      agentLines.push(line);

      // Small outer node (target website being crawled)
      const targetGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const targetMat = new THREE.MeshBasicMaterial({ color: 0x1E3A5F, transparent: true, opacity: 0.8 });
      const target = new THREE.Mesh(targetGeo, targetMat);
      target.position.set(
        Math.cos(angle) * (radius + 2.5),
        Math.sin(angle) * (radius + 2.5) * 0.5,
        Math.sin(angle) * 2
      );
      scene.add(target);

      // Line from agent to target
      const outerPoints = [agent.position.clone(), target.position.clone()];
      const outerLineGeo = new THREE.BufferGeometry().setFromPoints(outerPoints);
      const outerLineMat = new THREE.LineBasicMaterial({ color: 0x3B82F6, transparent: true, opacity: 0.1 });
      scene.add(new THREE.Line(outerLineGeo, outerLineMat));
    }

    // Ambient + point lights
    scene.add(new THREE.AmbientLight(0x1E3A5F, 0.8));
    const pointLight = new THREE.PointLight(0x3B82F6, 2, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // Floating particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x3B82F6, size: 0.06, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(particleGeo, particleMat));

    // Animation loop
    let frame = 0;
    let reqId: number;
    const animate = () => {
      frame++;
      const t = frame * 0.008;

      // Pulse center node
      const pulseVal = 1 + Math.sin(t * 2) * 0.08;
      centerNode.scale.set(pulseVal, pulseVal, pulseVal);
      centerMat.emissiveIntensity = 0.5 + Math.sin(t * 2) * 0.2;

      // Rotate rings
      ring.rotation.z = t * 0.3;
      ring2.rotation.y = t * 0.2;

      // Orbit agents around center
      agents.forEach((agent, i) => {
        const baseAngle = agentAngles[i];
        const orbitT = t * 0.4 + baseAngle;
        const radius = 5.5;
        agent.position.set(
          Math.cos(orbitT) * radius,
          Math.sin(orbitT) * radius * 0.4,
          Math.sin(orbitT) * 1.5
        );
        // Update connection lines
        const pos = agentLines[i].geometry.attributes.position as THREE.BufferAttribute;
        pos.setXYZ(1, agent.position.x, agent.position.y, agent.position.z);
        pos.needsUpdate = true;
      });

      // Slowly rotate whole scene
      scene.rotation.y = Math.sin(t * 0.1) * 0.3;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(reqId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      centerGeo.dispose();
      centerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%' }}/>
  );
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{
      backgroundColor: "#080C14",
      backgroundImage: `
        radial-gradient(ellipse 70% 40% at 50% 0%, rgba(59, 130, 246, 0.07), transparent),
        linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px)
      `,
      backgroundSize: "100% 100%, 40px 40px, 40px 40px",
      minHeight: "100vh",
      color: "#F0F6FF",
      fontFamily: "'Space Grotesk', sans-serif"
    }}>
      {/* Navbar */}
      <nav style={{
        position: "fixed",
        top: 0,
        width: "100%",
        height: "72px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        zIndex: 1000,
        backdropFilter: "blur(12px)",
        background: scrolled ? "rgba(8, 12, 20, 0.9)" : "rgba(8, 12, 20, 0.8)",
        borderBottom: "1px solid #1C2A3A",
        transition: "all 0.3s ease"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
            <circle cx="16" cy="16" r="3" fill="#3B82F6" />
            <path d="M25 11L29 7M16 6L16 1" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "20px", fontWeight: 800 }}>
            Agent<span style={{ color: "#3B82F6" }}>For</span>It
          </span>
        </div>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <button style={{
            padding: "8px 20px",
            borderRadius: "8px",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            color: "#3B82F6",
            background: "transparent",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(59, 130, 246, 0.08)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Launch App
          </button>
        </Link>
      </nav>

      <main style={{ paddingTop: "0px" }}>
        {/* Hero Section */}
        <section style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 60px",
          textAlign: "center",
          position: "relative"
        }}>
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "5px 16px", borderRadius: "20px",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            background: "rgba(59, 130, 246, 0.06)",
            fontSize: "11px", fontWeight: "600",
            color: "#3B82F6", letterSpacing: "1.5px",
            marginBottom: "32px",
            opacity: 0,
            animation: "fadeUp 0.7s ease forwards"
          }}>
            <span style={{ 
              width: "6px", height: "6px", borderRadius: "50%", 
              background: "#3B82F6", boxShadow: "0 0 8px #3B82F6", 
              animation: "pulse 1.5s ease-in-out infinite" 
            }}/>
            AUTONOMOUS AGENTS ACTIVE
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)",
            fontWeight: 700,
            color: "#F0F6FF",
            letterSpacing: "-2px",
            lineHeight: "1.1",
            maxWidth: "820px",
            marginBottom: "24px",
            fontFamily: "'Space Grotesk', sans-serif",
            opacity: 0,
            animation: "fadeUp 0.7s ease forwards 0.1s"
          }}>
            Deploy AI <span style={{ color: "#3B82F6" }}>Agents</span> That<br />
            Watch The Web For You.
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: "18px",
            color: "#6B8EAE",
            maxWidth: "560px",
            lineHeight: "1.7",
            marginBottom: "40px",
            fontFamily: "'Space Grotesk', sans-serif",
            opacity: 0,
            animation: "fadeUp 0.7s ease forwards 0.25s"
          }}>
            Describe any goal in plain English. AgentForIt fires parallel browser agents, detects changes, and alerts you — fully automated on a schedule.
          </p>

          {/* CTA Buttons */}
          <div style={{ 
            display: "flex", gap: "12px", alignItems: "center", marginBottom: "64px",
            opacity: 0,
            animation: "fadeUp 0.7s ease forwards 0.4s"
          }}>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "13px 32px",
                background: "#3B82F6",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Space Grotesk', sans-serif",
                textDecoration: "none",
                boxShadow: "0 0 24px rgba(59, 130, 246,0.4)",
                transition: "all 0.2s"
              }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                Launch AgentForIt →
              </button>
            </Link>
            <a href="#features" style={{
              padding: "13px 32px",
              background: "transparent",
              color: "#F0F6FF",
              fontWeight: "600",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #1C2A3A",
              cursor: "pointer",
              fontFamily: "'Space Grotesk', sans-serif",
              textDecoration: "none",
              transition: "all 0.2s"
            }}>
              See How It Works
            </a>
          </div>

          {/* Custom Three.js Agent Network Scene */}
          <div style={{ 
            width: "100%", 
            maxWidth: "960px", 
            height: "420px", 
            borderRadius: "16px", 
            overflow: "hidden", 
            border: "1px solid #1C2A3A", 
            position: "relative",
            background: "#080C14"
          }}>
            <AgentNetworkCanvas />
            <div style={{ 
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: "120px",
              background: "linear-gradient(to bottom, transparent, #080C14)",
              pointerEvents: "none"
            }}/>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ maxWidth: "1200px", margin: "120px auto 0", padding: "0 20px" }} id="features">
          <h2 style={{ fontSize: "32px", fontWeight: 700, textAlign: "center", marginBottom: "48px" }}>How It Works</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <StepCard step="01" title="Describe Your Goal" text="Type any monitoring or research goal in plain English. No code needed." />
            <StepCard step="02" title="Agents Deploy" text="Our swarm protocol fires parallel browser instances to execute your tasks." />
            <StepCard step="03" title="Get Intelligence" text="Receive structured results and instant alerts whenever changes are detected." />
          </div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: "1200px", margin: "140px auto 0", padding: "0 20px" }}>
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <h2 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>Autonomous Intelligence</h2>
            <p style={{ color: "#6B8EAE", fontSize: "16px" }}>The future of web surveillance, powered by agentic AI swarms.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            <FeatureCard icon="⬡" title="Swarm Crawling" desc="Parallel agents fire across any website simultaneously for rapid coverage." />
            <FeatureCard icon="◈" title="LLaMA 3.3 Engine" desc="Advanced reasoning parses complex goals into precise browser actions." />
            <FeatureCard icon="◉" title="Stealth Protocol" desc="TinyFish bypasses anti-bot barriers on Amazon, LinkedIn, and more." />
            <FeatureCard icon="△" title="Change Detection" desc="Automatic anomaly flagging via cross-run LLM comparison." />
            <FeatureCard icon="◫" title="Proactive Signals" desc="Executive summaries delivered via Slack, Email, and Push." />
            <FeatureCard icon="⏱" title="Auto Scheduler" desc="Set it and forget it—unattended cron missions on any interval." />
          </div>
        </section>

        {/* Integrations */}
        <section style={{ textAlign: "center", margin: "140px auto 0", maxWidth: "800px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "32px" }}>Connects To Your Stack</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {["Slack", "Gmail", "Google Calendar", "MongoDB", "Webhook", "Discord", "Teams"].map(name => (
              <div key={name} style={{
                padding: "10px 22px", background: "#0D1117", border: "1px solid #1C2A3A",
                borderRadius: "30px", fontSize: "14px", fontWeight: "600",
                color: "#6B8EAE", display: "flex", alignItems: "center", gap: "10px"
              }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6", boxShadow: "0 0 6px #3B82F6" }}/>
                {name}
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section style={{ maxWidth: "1200px", margin: "140px auto 0", padding: "0 20px" }}>
          <div style={{
            background: "#0D1117", border: "1px solid #1C2A3A", borderRadius: "24px",
            padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(59, 130, 246,0.3), transparent)" }}/>
            <h2 style={{ fontSize: "42px", fontWeight: 700, marginBottom: "16px", letterSpacing: "-1.5px" }}>Start Monitoring The Web Today</h2>
            <p style={{ color: "#6B8EAE", fontSize: "18px", marginBottom: "40px" }}>Deploy your first agent swarm in under 60 seconds.</p>
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#3B82F6", color: "#ffffff", fontWeight: 700,
                padding: "16px 40px", fontSize: "16px", borderRadius: "10px",
                border: "none", cursor: "pointer", boxShadow: "0 0 30px rgba(59, 130, 246,0.4)"
              }}>
                Launch App Now
              </button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1C2A3A", padding: "60px 40px 40px", marginTop: "100px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "40px" }}>
          <div style={{ maxWidth: "240px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L29.8564 10V22L16 30L2.14359 22V10L16 2Z" stroke="#3B82F6" strokeWidth="2" strokeLinejoin="round" />
                <circle cx="16" cy="16" r="3" fill="#3B82F6" />
              </svg>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>Agent<span style={{ color: "#3B82F6" }}>For</span>It</span>
            </div>
            <p style={{ fontSize: "13px", color: "#6B8EAE", lineHeight: 1.6 }}>Next-gen autonomous intelligence swarms for real-time web surveillance.</p>
          </div>
          <div style={{ display: "flex", gap: "60px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontWeight: 700, fontSize: "14px" }}>Platform</span>
              <Link href="/dashboard" style={{ fontSize: "13px", color: "#6B8EAE", textDecoration: "none" }}>Dashboard</Link>
              <Link href="/dashboard/missions" style={{ fontSize: "13px", color: "#6B8EAE", textDecoration: "none" }}>Missions</Link>
              <Link href="/dashboard/alerts" style={{ fontSize: "13px", color: "#6B8EAE", textDecoration: "none" }}>Alerts</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <span style={{ fontWeight: 700, fontSize: "14px" }}>Company</span>
              <span style={{ fontSize: "13px", color: "#6B8EAE" }}>About</span>
              <span style={{ fontSize: "13px", color: "#6B8EAE" }}>Terms</span>
              <span style={{ fontSize: "13px", color: "#6B8EAE" }}>Privacy</span>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: "1200px", margin: "60px auto 0", borderTop: "1px solid #1C2A3A", paddingTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "12px", color: "#6B8EAE" }}>© 2026 AgentForIt. Built for the autonomous web era.</p>
        </div>
      </footer>
    </div>
  );
}

function StepCard({ step, title, text }: any) {
  return (
    <div style={{
      background: "#0D1117", border: "1px solid #1C2A3A", borderRadius: "14px",
      padding: "32px 28px", position: "relative", overflow: "hidden",
      transition: "transform 0.3s, box-shadow 0.3s"
    }} onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-6px) rotateX(3deg)";
      e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246,0.08)";
      e.currentTarget.style.borderColor = "rgba(59, 130, 246,0.25)";
    }} onMouseLeave={e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#1C2A3A";
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(59, 130, 246,0.4), transparent)" }}/>
      <div style={{ fontSize: "28px", color: "#3B82F6", opacity: 0.3, fontWeight: 800, marginBottom: "20px" }}>{step}</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#F0F6FF", marginBottom: "10px" }}>{title}</div>
      <div style={{ fontSize: "14px", color: "#6B8EAE", lineHeight: 1.6 }}>{text}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: any) {
  return (
    <div style={{
      background: "#0D1117", border: "1px solid #1C2A3A", borderRadius: "14px",
      padding: "32px 28px", position: "relative", overflow: "hidden",
      transition: "transform 0.3s, box-shadow 0.3s"
    }} onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-6px) rotateX(-2deg)";
      e.currentTarget.style.boxShadow = "0 20px 50px rgba(0,0,0,0.5), 0 0 20px rgba(59, 130, 246,0.08)";
      e.currentTarget.style.borderColor = "rgba(59, 130, 246,0.25)";
    }} onMouseLeave={e => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "#1C2A3A";
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "10px",
        background: "rgba(59, 130, 246,0.08)", border: "1px solid rgba(59, 130, 246,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", marginBottom: "24px", color: "#3B82F6"
      }}>{icon}</div>
      <div style={{ fontSize: "18px", fontWeight: 700, color: "#F0F6FF", marginBottom: "10px" }}>{title}</div>
      <div style={{ fontSize: "14px", color: "#6B8EAE", lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
}
