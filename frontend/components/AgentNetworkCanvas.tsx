"use client";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export function AgentNetworkCanvas() {
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
    <div ref={mountRef} style={{ width: '100%', height: '100%', background: '#080C14' }}/>
  );
}
