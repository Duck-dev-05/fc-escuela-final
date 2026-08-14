"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHeartbeat, FaShieldAlt, FaCapsules, FaArrowLeft, FaSyringe } from 'react-icons/fa';

export default function MedicalCentre() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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

  async function fetchData() {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      setPlayers(Array.isArray(data) ? data : data.team || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const restrictedPlayers = players.filter(p => p.status !== 'available');

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 relative overflow-hidden bg-[#020202] selection:bg-red-500 selection:text-white">
       {/* Bio-Signal Background Layer */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[1000px] h-[1000px] rounded-full bg-red-500/[0.02] blur-[150px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px] z-10" />
       </div>

       <div className="max-w-[1600px] mx-auto relative z-20">
          {/* Header Sectors */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 gap-12 animate-slide-up">
              <div className="flex flex-col gap-8">
                 <Link href="/coaching" className="flex items-center gap-3 text-[9px] text-slate-500 font-black uppercase tracking-[0.5em] hover:text-white transition-colors group">
                    <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
                    Back_To_Coaching
                 </Link>
                 
                 <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 text-[9px] text-red-500 font-black uppercase tracking-[0.2em]">
                        Medical Status
                     </div>
                 </div>

                 <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-[0.85]">
                    Medical <span className="text-red-500">Centre</span>
                 </h1>
              </div>

              <div className="grid grid-cols-3 gap-6 w-full lg:w-auto">
                  {[
                    { label: 'Overall Fitness', val: '94.8%', icon: FaHeartbeat, color: 'text-green-500' },
                    { label: 'Injured', val: restrictedPlayers.length, icon: FaShieldAlt, color: 'text-red-500' },
                    { label: 'Doubtful', val: '02', icon: FaSyringe, color: 'text-yellow-500' },
                  ].map((stat, i) => (
                    <div key={i} className="group p-8 glass-card border-white/5 bg-slate-950/40 relative overflow-hidden text-left">
                       <stat.icon className={`text-[10px] mb-4 ${stat.color} opacity-40`} />
                       <span className="text-[7px] text-slate-700 font-black uppercase tracking-[0.4em] block mb-1">{stat.label}</span>
                       <span className={`text-3xl font-black font-mono tracking-tighter text-white`}>{stat.val}</span>
                    </div>
                 ))}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
             {/* Left Column: Bio-Scan Visualization Placeholder */}
             <div className="lg:col-span-7 space-y-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <section className="glass-card hud-border p-12 bg-slate-950/60 relative overflow-hidden min-h-[800px] flex flex-col items-center justify-center border-white/5 group/scan shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                   <div className="absolute inset-0 bg-grid-red-500/[0.01] bg-[size:20px_20px]" />
                   
                   {/* Scanning HUD Brackets */}
                   <div className="absolute top-10 left-10 w-32 h-32 border-t-2 border-l-2 border-red-500 animate-pulse-slow" />
                   <div className="absolute top-10 right-10 w-32 h-32 border-t-2 border-r-2 border-red-500 animate-pulse-slow" />
                   <div className="absolute bottom-10 left-10 w-32 h-32 border-b-2 border-l-2 border-red-500 animate-pulse-slow" />
                   <div className="absolute bottom-10 right-10 w-32 h-32 border-b-2 border-r-2 border-red-500 animate-pulse-slow" />

                   <div className="relative z-10 text-center flex flex-col items-center gap-12">
                      <div className="w-64 h-[600px] relative opacity-20 group-hover/scan:opacity-40 transition-opacity duration-[2000ms]">
                         {/* Body Scan Silhouette Placeholder */}
                         <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 via-transparent to-red-500/10 rounded-full blur-3xl animate-pulse" />
                         <div className="w-full h-full border border-red-500/10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 shadow-[0_0_20px_red] animate-scan-slow" />
                         </div>
                      </div>
                      
                      <div className="max-w-md">
                         <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">Player Diagnostics</h3>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] leading-relaxed">System monitoring for player physical readiness and fitness trends. Monitoring for common injuries, muscle fatigue, and hydration levels.</p>
                      </div>
                   </div>
                </section>
             </div>

             {/* Right Column: Restriction Registry */}
             <div className="lg:col-span-5 space-y-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <section className="glass-card hud-border p-10 bg-slate-950/60 border-white/5 relative overflow-hidden min-h-[800px]">
                   <div className="flex flex-col gap-2 mb-12 border-b border-white/5 pb-8">
                       <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic"><span className="text-red-500">Injury</span>_Logs</h3>
                       <span className="text-[8px] text-slate-700 font-mono tracking-[0.2em] uppercase">RESTRICTED PLAYERS</span>
                   </div>

                   <div className="space-y-6">
                      {restrictedPlayers.length > 0 ? (
                         restrictedPlayers.map((player, i) => (
                            <div key={i} className="group/player p-8 glass-card bg-slate-900/40 border-white/5 hover:border-red-500/30 transition-all relative overflow-hidden">
                               <div className="absolute top-0 right-0 p-4">
                                  <span className={`text-[7px] font-black uppercase tracking-[0.3em] px-2 py-0.5 border ${player.status === 'injured' ? 'border-red-500/40 text-red-500' : 'border-yellow-500/40 text-yellow-500'}`}>
                                     {player.status === 'injured' ? 'INJURED' : 'RESTRICTED'}
                                  </span>
                               </div>
                               
                               <div className="flex gap-6 items-start mb-8 text-left">
                                  <div className="w-16 h-16 rounded-xl bg-slate-950 border border-white/5 overflow-hidden p-1">
                                     {player.image ? (
                                        <img src={`/avatars/${player.image}`} alt={player.name} className="w-full h-full object-cover rounded-lg" />
                                     ) : <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700 font-black italic">P_{player.id}</div>}
                                  </div>
                                  <div className="flex flex-col">
                                     <h4 className="text-xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">{player.name}</h4>
                                     <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">{player.role} // PLAYER_{player.id}</span>
                                  </div>
                               </div>

                               <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                  <div className="flex flex-col gap-1 text-left">
                                     <span className="text-[7px] text-slate-700 font-black uppercase tracking-widest">Diagnostic</span>
                                     <span className="text-[10px] text-white font-black uppercase italic tracking-tight">{player.medical?.type || 'Under Review'}</span>
                                  </div>
                                  <div className="flex flex-col gap-1 text-right">
                                     <span className="text-[7px] text-slate-700 font-black uppercase tracking-widest">Est_Return</span>
                                     <span className="text-[10px] text-red-500 font-black uppercase italic tracking-tight">{player.medical?.recovery || 'TBC'}</span>
                                  </div>
                               </div>
                            </div>
                         ))
                      ) : (
                         <div className="py-32 text-center border border-dashed border-white/5 rounded-sm opacity-20">
                            <FaShieldAlt className="text-5xl mx-auto mb-6 text-slate-800" />
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">ALL PLAYERS AVAILABLE</p>
                         </div>
                      )}
                   </div>

                   {/* Footer CTA */}
                   <div className="mt-12 pt-10 border-t border-white/5">
                      <button className="w-full py-5 bg-red-500/5 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-[0.6em] transition-all italic shadow-[0_15px_40px_rgba(239,68,68,0.1)]">
                         REPORT NEW INJURY
                      </button>
                   </div>
                </section>
             </div>
          </div>
       </div>

       <style jsx global>{`
          @keyframes pulse-slow {
             0%, 100% { opacity: 0.1; }
             50% { opacity: 0.4; }
          }
          @keyframes scan-slow {
             0% { transform: translateY(0); opacity: 0; }
             50% { opacity: 1; }
             100% { transform: translateY(600px); opacity: 0; }
          }
          .animate-pulse-slow {
             animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          .animate-scan-slow {
             animation: scan-slow 8s linear infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
             width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
             background: rgba(255, 255, 255, 0.02);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
             background: rgba(239, 68, 68, 0.2);
             border-radius: 2px;
          }
       `}</style>
    </div>
  );
}
