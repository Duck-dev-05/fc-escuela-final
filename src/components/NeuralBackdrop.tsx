"use client";

import { useEffect, useState } from "react";

interface NeuralBackdropProps {
  ghostText?: string;
}

export default function NeuralBackdrop({ ghostText }: NeuralBackdropProps) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Neural Orb Dynamic Glow */}
      <div 
        className="absolute w-[1000px] h-[1000px] rounded-full bg-yellow-500/[0.04] blur-[150px] transition-all duration-1000 ease-out"
        style={{ 
          left: `${mousePos.x}%`, 
          top: `${mousePos.y}%`, 
          transform: 'translate(-50%, -50%)' 
        }} 
      />

      {/* Cinematic Grid & Grain */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.2] brightness-50 contrast-125 mix-blend-overlay" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      {/* Scanning Line Sweep */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="w-full h-[1px] bg-yellow-500/10 absolute top-0 animate-scan-sweep opacity-30 shadow-[0_0_15px_rgba(234,179,8,0.2)]" />
      </div>

      {/* Ghost Typography Texture */}
      {ghostText && (
        <div className="absolute top-[15%] left-[5%] select-none opacity-[0.025] whitespace-nowrap overflow-hidden">
          <span className="text-[25vw] font-black ghost-text leading-none uppercase italic tracking-tighter block -translate-y-1/2">
            {ghostText}
          </span>
        </div>
      )}

      {/* HUD Corner Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 border-t border-l border-white/5 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-b border-r border-white/5 pointer-events-none" />
      
      {/* Vercel-style Radial Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
    </div>
  );
}
