'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { FaClipboardList, FaMap, FaArrowsAlt, FaCogs, FaProjectDiagram, FaPencilAlt, FaTrash, FaSave } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type FormationType = '2-3-1' | '3-2-1' | '2-2-2' | '3-1-2';

interface PlayerPos {
   pos: string;
   name: string;
   top: string;
   left: string;
}

export default function TacticalBoard() {
   const router = useRouter()
   const [activeFormation, setActiveFormation] = useState<FormationType>('2-3-1')
   
   // High-Fidelity Tactical State
   const [tokens, setTokens] = useState<PlayerPos[]>([])
   const [isDrawing, setIsDrawing] = useState(false)
   const [activeTokenIdx, setActiveTokenIdx] = useState<number | null>(null)
   const canvasRef = useRef<HTMLCanvasElement>(null)
   const containerRef = useRef<HTMLDivElement>(null)

   const formations: FormationType[] = ['2-3-1', '3-2-1', '2-2-2', '3-1-2']

   const formationPresets: Record<FormationType, PlayerPos[]> = {
      '2-3-1': [
         { pos: 'GK', name: 'Thành Đạt', top: '85%', left: '50%' },
         { pos: 'CB', name: 'Bảo Khánh', top: '70%', left: '32%' },
         { pos: 'CB', name: 'Nhật Minh', top: '70%', left: '68%' },
         { pos: 'CDM', name: 'Việt Hùng', top: '48%', left: '50%' },
         { pos: 'LW', name: 'Anh Phương', top: '32%', left: '22%' },
         { pos: 'RW', name: 'Minh Việt', top: '32%', left: '78%' },
         { pos: 'CF', name: 'Minh Đức', top: '15%', left: '50%' },
      ],
      '3-2-1': [
         { pos: 'GK', name: 'Thành Đạt', top: '85%', left: '50%' },
         { pos: 'LCB', name: 'Bảo Khánh', top: '75%', left: '25%' },
         { pos: 'CB', name: 'Nhật Minh', top: '75%', left: '50%' },
         { pos: 'RCB', name: 'Bảo Phong', top: '75%', left: '75%' },
         { pos: 'LCM', name: 'Việt Hùng', top: '45%', left: '35%' },
         { pos: 'RCM', name: 'Anh Phương', top: '45%', left: '65%' },
         { pos: 'CF', name: 'Minh Đức', top: '18%', left: '50%' },
      ],
      '2-2-2': [
         { pos: 'GK', name: 'Thành Đạt', top: '85%', left: '50%' },
         { pos: 'CB', name: 'Bảo Khánh', top: '72%', left: '35%' },
         { pos: 'CB', name: 'Nhật Minh', top: '72%', left: '65%' },
         { pos: 'LCM', name: 'Việt Hùng', top: '45%', left: '30%' },
         { pos: 'RCM', name: 'Anh Phương', top: '45%', left: '70%' },
         { pos: 'LCF', name: 'Minh Việt', top: '18%', left: '35%' },
         { pos: 'RCF', name: 'Minh Đức', top: '18%', left: '65%' },
      ],
      '3-1-2': [
         { pos: 'GK', name: 'Thành Đạt', top: '85%', left: '50%' },
         { pos: 'LCB', name: 'Bảo Khánh', top: '75%', left: '25%' },
         { pos: 'CB', name: 'Nhật Minh', top: '75%', left: '50%' },
         { pos: 'RCB', name: 'Bảo Phong', top: '75%', left: '75%' },
         { pos: 'CDM', name: 'Việt Hùng', top: '45%', left: '50%' },
         { pos: 'LCF', name: 'Anh Phương', top: '18%', left: '35%' },
         { pos: 'RCF', name: 'Minh Đức', top: '18%', left: '65%' },
      ]
   }

   // Initialize/Sync Tokens on Formation Change
   useEffect(() => {
      setTokens(formationPresets[activeFormation])
   }, [activeFormation])

   // Drawing Engine Logic
   const startDrawing = (e: React.MouseEvent) => {
      if (!isDrawing || !canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;

      ctx.beginPath();
      ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
      
      const draw = (moveEvent: MouseEvent) => {
         ctx.lineTo((moveEvent.clientX - rect.left) * scaleX, (moveEvent.clientY - rect.top) * scaleY);
         ctx.strokeStyle = '#eab308';
         ctx.lineWidth = 4;
         ctx.setLineDash([10, 10]); 
         ctx.stroke();
      };

      const stop = () => {
         window.removeEventListener('mousemove', draw);
         window.removeEventListener('mouseup', stop);
      };

      window.addEventListener('mousemove', draw);
      window.addEventListener('mouseup', stop);
   };

   const clearLayer = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
         ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
   };

   const deployPositioning = () => {
      // Mission Critical Feedback
      const btn = document.getElementById('deploy-btn');
      if (btn) {
         btn.innerText = 'AUTHORIZING...';
         setTimeout(() => {
            btn.innerText = 'DEPLOY_SUCCESS // SYNC_LOCK';
            setTimeout(() => {
               btn.innerText = 'Deploy_Positioning';
            }, 2000);
         }, 1000);
      }
      console.log('Tactical deployment authorized:', tokens);
   };

   // Drag & Deploy Logic
   const handleTokenDrag = (idx: number, e: React.MouseEvent) => {
      if (isDrawing) return;
      setActiveTokenIdx(idx);
      
      const onMove = (moveEvent: MouseEvent) => {
         if (!containerRef.current) return;
         const rect = containerRef.current.getBoundingClientRect();
         const newX = ((moveEvent.clientX - rect.left) / rect.width) * 100;
         const newY = ((moveEvent.clientY - rect.top) / rect.height) * 100;
         
         setTokens(prev => prev.map((t, i) => i === idx ? { ...t, left: `${newX}%`, top: `${newY}%` } : t));
      };

      const onUp = () => {
         setActiveTokenIdx(null);
         window.removeEventListener('mousemove', onMove);
         window.removeEventListener('mouseup', onUp);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
   };

   return (
      <div className="min-h-screen py-20 px-8 max-w-7xl mx-auto bg-[#020202] selection:bg-yellow-500 selection:text-black">
         {/* Header HUD */}
         <div className="flex flex-col md:flex-row items-center justify-between mb-16 animate-slide-up bg-slate-950/20 p-8 rounded-2xl border border-white/5">
            <div className="flex items-center gap-8">
               <div className="w-20 h-20 glass-card hud-border flex items-center justify-center bg-slate-950 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.1)] group">
                  <FaClipboardList className="text-3xl text-yellow-500 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-yellow-500" />
               </div>
               <div>
                  <h1 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">Tactical <span className="text-yellow-500">Protocol</span></h1>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.5em] mt-3">Personnel_Positioning_Matrix // v.4.0.1</p>
               </div>
            </div>
            <div className="hidden lg:flex items-center gap-6">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1.5">Active_Deployment</span>
                  <div className="px-6 py-2 glass-card border-yellow-500/30 bg-yellow-500/5 rounded-full">
                     <span className="text-[11px] text-yellow-500 font-black uppercase tracking-widest">{activeFormation} HUD_MOD</span>
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>

            {/* Pitch Environment (Cinematic) */}
            <div className="lg:col-span-8 group/pitch">
               <div 
                  ref={containerRef}
                  className="aspect-[4/5] glass-card hud-border bg-slate-950/40 relative overflow-hidden flex items-center justify-center border-white/5 shadow-2xl transition-all duration-700 group-hover/pitch:border-yellow-500/20 cursor-crosshair"
               >
                  {/* Canvas Drawing Layer */}
                  <canvas 
                      ref={canvasRef}
                      width={1000}
                      height={1250}
                      className="absolute inset-0 w-full h-full pointer-events-none z-30"
                   />

                   {/* Interaction Area for Drawing */}
                   <div 
                      className={`absolute inset-0 z-40 ${isDrawing ? 'pointer-events-auto' : 'pointer-events-none'}`}
                      onMouseDown={startDrawing}
                   />

                  {/* Pitch Markings Overlay */}
                  <div className="absolute inset-8 border border-white/10 opacity-20 pointer-events-none" />
                  <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[1px] bg-white/10 opacity-20 pointer-events-none" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border border-white/10 opacity-20 pointer-events-none" />
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-80 h-40 border border-white/10 opacity-20 pointer-events-none" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-80 h-40 border border-white/10 opacity-20 pointer-events-none" />

                  {/* Ghost Typography */}
                  <span className="absolute text-[24vw] font-black text-white/[0.01] uppercase tracking-tighter select-none pointer-events-none italic rotate-[-15deg]">Tactics</span>

                  {/* Dynamic 7-a-Side Lineup */}
                  {tokens.map((player, idx) => (
                     <div
                        key={`${activeFormation}-${idx}`}
                        onMouseDown={(e) => handleTokenDrag(idx, e)}
                        className={`absolute flex flex-col items-center transition-all duration-500 group/player hover:z-20 cursor-grab active:cursor-grabbing pointer-events-auto z-50 ${activeTokenIdx === idx ? 'scale-110' : ''}`}
                        style={{ top: player.top, left: player.left, transform: 'translate(-50%, -50%)' }}
                     >
                        {/* Player Node */}
                        <div className="relative">
                           <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full opacity-0 group-hover/player:opacity-100 transition-opacity" />
                           <div className={`w-14 h-14 rounded-full bg-slate-900 border-2 flex items-center justify-center font-black text-[11px] shadow-[0_0_20px_rgba(234,179,8,0.2)] group-hover/player:scale-125 group-hover/player:bg-yellow-500 group-hover/player:text-slate-950 transition-all z-10 relative ${activeTokenIdx === idx ? 'border-white bg-yellow-500 text-slate-950 shadow-[0_0_30px_rgba(234,179,8,0.6)]' : 'border-yellow-500 text-yellow-500'}`}>
                              {player.pos}
                           </div>
                           <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-950 border border-yellow-500/50 flex items-center justify-center text-[7px] text-yellow-500 font-mono z-20">
                              {idx + 1}
                           </div>
                        </div>

                        {/* Player Label Card */}
                        <div className={`mt-4 bg-slate-950/90 backdrop-blur-xl px-4 py-1.5 rounded-lg border shadow-2xl transition-all group-hover/player:border-yellow-500 group-hover/player:shadow-yellow-500/20 ${activeTokenIdx === idx ? 'border-yellow-500' : 'border-yellow-500/20'}`}>
                           <p className="text-[9px] text-white font-black uppercase tracking-[0.2em] whitespace-nowrap">{player.name}</p>
                        </div>
                     </div>
                  ))}

                  {/* Data Overlay Footer */}
                  <div className="absolute bottom-8 left-10 text-[8px] text-slate-700 font-mono space-y-2 opacity-50 group-hover/pitch:opacity-100 transition-opacity">
                     <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p>SYNC_STATUS: OPTIMAL</p>
                     </div>
                     <p>PITCH_REF: [21.02, 105.85]</p>
                     <p>TELEMETRY_LINK: CMN73-TK</p>
                  </div>
               </div>
            </div>

            {/* Tactical Controls */}
            <div className="lg:col-span-4 space-y-10">

               {/* FORMATION MATRIX Card */}
               <div className="glass-card hud-border p-10 bg-slate-950/60 border-white/5 relative group transition-all hover:bg-slate-950 border-yellow-500/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                  <div className="absolute top-0 left-0 w-2 h-10 border-t-2 border-l-2 border-yellow-500 opacity-60" />
                  <div className="absolute bottom-0 right-0 w-10 h-2 border-b-2 border-r-2 border-yellow-500 opacity-60" />

                  <div className="flex items-center gap-5 mb-12">
                     <FaMap className="text-yellow-500 text-xl" />
                     <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">Formation Matrix</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     {formations.map((f) => (
                        <button
                           key={f}
                           onClick={() => setActiveFormation(f)}
                           className={`h-22 rounded-2xl border-2 transition-all font-black text-sm tracking-widest flex items-center justify-center relative overflow-hidden group/btn ${f === activeFormation
                                 ? 'border-yellow-500/60 text-yellow-500 bg-yellow-500/5 shadow-[0_0_20px_rgba(234,179,8,0.1)]'
                                 : 'border-white/5 text-slate-500 hover:text-white hover:bg-white/10 hover:border-white/10'
                              }`}
                        >
                           <span className="relative z-10">{f}</span>
                           {f === activeFormation && <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" />}
                        </button>
                     ))}
                  </div>

                  <div className="mt-12 space-y-6">
                     {/* PENCIL_TOOL Button */}
                     <button 
                        onClick={() => setIsDrawing(!isDrawing)}
                        className={`w-full py-5 border transition-all text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 italic ${isDrawing ? 'bg-yellow-500 text-slate-950 border-yellow-500' : 'glass-card border-white/10 text-white hover:bg-white/10'}`}
                     >
                        <FaPencilAlt /> {isDrawing ? 'Drawing_ON' : 'Pencil_Tool'}
                     </button>

                     <button 
                        onClick={clearLayer}
                        className="w-full py-5 glass-card border-white/10 rounded-2xl text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] hover:text-red-500 hover:border-red-500/30 transition-all flex items-center justify-center gap-4 italic"
                     >
                        <FaTrash /> Clear_Layer
                     </button>

                     {/* DEPLOY_POSITIONING Button */}
                     <button 
                        id="deploy-btn"
                        onClick={deployPositioning}
                        className="w-full py-5 bg-[#EAB308] text-slate-950 text-[11px] font-black uppercase tracking-[0.4em] hover:bg-yellow-400 transition-all flex items-center justify-center gap-4 shadow-[0_10px_40px_rgba(234,179,8,0.3)] hover:-translate-y-1 active:translate-y-0 relative overflow-hidden"
                     >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shimmer" />
                        <FaArrowsAlt className="text-sm" /> Deploy_Positioning
                     </button>
                  </div>
               </div>

               {/* STRATEGIC_OVERLAY Card */}
               <div className="glass-card hud-border p-10 bg-slate-950/20 border-white/5">
                  <div className="flex items-center gap-4 mb-10">
                     <FaProjectDiagram className="text-yellow-500/50" />
                     <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Operational_Intel</h3>
                  </div>
                  <div className="space-y-8">
                     {[
                        { label: 'Defensive Elasticity', val: '72%', color: 'yellow-500' },
                        { label: 'Offensive Overlap', val: '84%', color: 'yellow-500' },
                        { label: 'Zonal Transition', val: 'HIGH', color: 'green-500' },
                     ].map((item, idx) => (
                        <div key={idx} className="group/intel">
                           <div className="flex justify-between items-center mb-2 px-1">
                              <span className="text-[10px] text-white font-black uppercase tracking-wider group-hover/intel:text-yellow-500 transition-colors">{item.label}</span>
                              <span className={`text-[10px] text-${item.color} font-mono font-bold`}>{item.val}</span>
                           </div>
                           <div className="h-[2px] bg-white/5 relative overflow-hidden">
                              <div
                                 className={`absolute inset-y-0 left-0 bg-yellow-500/40 transition-all duration-1000`}
                                 style={{ width: item.val === 'HIGH' ? '100%' : item.val }}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="mt-10 p-6 border-l-2 border-yellow-500/20 bg-slate-900/40">
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-loose italic">
                        "Syncing formation {activeFormation} with active unit telemetry..."
                     </p>
                  </div>
               </div>

            </div>

         </div>
      </div>
   )
}
