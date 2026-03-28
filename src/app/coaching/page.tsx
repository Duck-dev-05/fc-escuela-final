"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
   FaUserTie, FaUsers, FaChartLine, FaClipboardList,
   FaShieldAlt, FaArrowRight, FaCrosshairs, FaCalendarAlt, FaHeartbeat, FaVectorSquare
} from 'react-icons/fa';

export default function CoachingMissionControl() {
   const { data: session } = useSession();
   const [players, setPlayers] = useState<any[]>([]);
   const [playerCount, setPlayerCount] = useState(0);
   const [restrictedCount, setRestrictedCount] = useState(0);
   const [matches, setMatches] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
   const [updatingId, setUpdatingId] = useState<number | null>(null);

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
         const [teamRes, matchesRes] = await Promise.all([
            fetch('/api/team'),
            fetch('/api/matches')
         ]);

         const teamData = await teamRes.json();
         const matchesData = await matchesRes.json();

         const playersList = Array.isArray(teamData) ? teamData : teamData.team || [];
         const restricted = playersList.filter((p: any) => p.status !== 'available').length;
         setPlayers(playersList);
         setPlayerCount(playersList.length);
         setRestrictedCount(restricted);
         setMatches(Array.isArray(matchesData) ? matchesData : []);
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   }

   useEffect(() => {
      fetchData();
   }, []);

   const togglePlayerStatus = async (id: number, currentStatus: string) => {
      setUpdatingId(id);
      const newStatus = currentStatus === 'available' ? 'injured' : 'available';
      try {
         await fetch('/api/team', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
         });
         await fetchData();
      } catch (e) {
         console.error('Failed to update status:', e);
      } finally {
         setUpdatingId(null);
      }
   };

   const hubs = [
      {
         title: 'Upcoming Ops',
         desc: 'Match deployment & lineup authorization',
         href: '/coaching/upcoming',
         icon: FaCalendarAlt,
         meta: 'MISSION_READY',
         priority: true
      },
      {
         title: 'Squad Registry',
         desc: 'Personnel deployment & asset management',
         href: '/coaching/squad',
         icon: FaUsers,
         meta: `${playerCount - restrictedCount} ACTIVE // ${restrictedCount} RESTRICTED`
      },
      {
         title: 'Medical Hub',
         desc: 'Health telemetry & recovery protocols',
         href: '/coaching/medical',
         icon: FaHeartbeat,
         meta: `${restrictedCount} RESTRICTED ASSETS`,
         priority: restrictedCount > 0
      },
      {
         title: 'Intelligence',
         desc: 'Performance analytics & post-op metrics',
         href: '/coaching/analysis',
         icon: FaChartLine,
         meta: 'SIGNAL: STABLE'
      },
      {
         title: 'Tactical Board',
         desc: 'High-fidelity strategy & set-piece design',
         href: '/coaching/tactics',
         icon: FaVectorSquare,
         meta: 'v.4.0.1 // ACTIVE'
      },
      {
         title: 'Security Vault',
         desc: 'Encrypted archives & restricted dossiers',
         href: '/coaching/vault',
         icon: FaShieldAlt,
         meta: 'R2: SECURE'
      },
   ];

   return (
      <div className="min-h-screen py-20 px-4 md:px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
         {/* Neural_Orb & Cinematic Background */}
         <div className="absolute inset-0 pointer-events-none">
            <div
               className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.03] blur-[120px] transition-all duration-1000 ease-out z-0"
               style={{
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: 'translate(-50%, -50%)'
               }}
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 z-10" />
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] z-10" />
         </div>

         <div className="max-w-[1600px] mx-auto relative z-20">
            {/* Maximum Impact Operational Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
               <div className="flex flex-col gap-10">
                  <div className="flex items-center gap-6">
                     <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        Tactical_Vantage
                     </div>
                  </div>

                  <div className="relative group/header text-left">
                     <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                     <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic">
                        Mission <br />
                        <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Control</span>
                     </h1>
                  </div>
               </div>

               <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                  <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                     <span className="text-yellow-500/50 flex items-center gap-3 italic font-black uppercase">Real-Time Sync</span>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                     {[
                        { label: 'Personnel', val: playerCount, unit: 'TTL', color: 'text-white' },
                        { label: 'Health', val: playerCount - restrictedCount, unit: 'RDY', color: 'text-yellow-500' },
                        { label: 'Restricted', val: restrictedCount, unit: 'LOCKED', color: 'text-red-500' },
                        { label: 'Ops_Live', val: matches.filter(m => m.status === 'Scheduled').length, unit: 'SYNC', color: 'text-white' },
                     ].map((stat, i) => (
                        <div key={i} className="group p-8 glass-card border-white/5 bg-slate-950/20 hover:border-yellow-500/20 transition-all relative overflow-hidden">
                           <span className="text-[7px] text-slate-600 font-black uppercase tracking-[0.4em] group-hover:text-yellow-500 transition-colors block text-left">{stat.label}</span>
                           <div className="flex items-baseline gap-3">
                              <span className={`text-5xl font-black font-mono tracking-tighter ${stat.color}`}>{stat.val}</span>
                              <span className="text-[8px] text-slate-800 font-bold uppercase tracking-widest">{stat.unit}</span>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Tactical Hubs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 animate-slide-up">
               {hubs.map((hub, idx) => (
                  <div
                     key={idx}
                     className={`group relative glass-card hud-border p-10 transition-all duration-700 hover:bg-slate-900/40 hover:-translate-y-3 flex flex-col justify-between min-h-[480px] border-white/5 hover:border-yellow-500/30 shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-slide-up ${hub.priority ? 'bg-yellow-500/[0.03]' : 'bg-slate-950/40'}`}
                  >
                     <div className="mt-12 flex flex-col items-center">
                        <div className="w-24 h-24 mb-10 text-slate-800 group-hover:text-yellow-500 flex items-center justify-center glass-card border-white/5 bg-slate-900/20 group-hover:border-yellow-500/20 relative transition-all duration-700">
                           <hub.icon size={40} className="group-hover:drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 italic text-center">{hub.title}</h3>
                        <p className="text-[12px] text-slate-600 font-mono leading-relaxed mb-12 text-center uppercase tracking-[0.05em] font-bold italic">{hub.desc}</p>
                     </div>
                     <div className="space-y-10">
                        <Link
                           href={hub.href}
                           className="w-full py-4 bg-yellow-500/5 border border-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-slate-950 text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-4 transition-all italic relative overflow-hidden group/btn"
                        >
                           <span className="relative z-10">AUTHORIZE_OPS</span>
                           <FaArrowRight className="relative z-10 transition-transform group-hover:translate-x-3" />
                        </Link>
                     </div>
                  </div>
               ))}
            </div>

            {/* Primary Command Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
               {/* Left Column: Strategic Vanguard (Quick Prep) */}
               <div className="lg:col-span-12 xl:col-span-5 space-y-12 animate-slide-up">
                  {/* Strategic Vanguard: Next Match HUD */}
                  <section className="glass-card hud-border p-10 bg-yellow-500/[0.03] border-yellow-500/20 relative overflow-hidden group/vanguard shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                     <div className="absolute top-0 right-0 p-4">
                        <div className="flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                           <span className="text-[8px] font-black text-yellow-500 uppercase tracking-widest">Priority_Ops</span>
                        </div>
                     </div>

                     <div className="mb-10 relative z-10 text-left">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-3">
                           Strategic <span className="text-yellow-500">Vanguard</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic leading-relaxed">High-frequency match preparation & formation sync.</p>
                     </div>

                     {matches.filter(m => m.status === 'Scheduled').length > 0 ? (
                        <div className="space-y-8 relative z-10">
                           {matches.filter(m => m.status === 'Scheduled').slice(0, 1).map((match, i) => (
                              <div key={i} className="p-8 glass-card bg-slate-950/60 border-white/5 group-hover/vanguard:border-yellow-500/30 transition-all flex flex-col gap-8">
                                 <div className="flex justify-between items-center">
                                    <div className="flex flex-col gap-1 text-left">
                                       <span className="text-[8px] text-yellow-500/40 font-black uppercase tracking-[0.5em]">{match.competition}</span>
                                       <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">{match.homeTeam} VS {match.awayTeam}</h4>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-lg font-black text-white font-mono leading-none mb-1">{match.time}</p>
                                       <p className="text-[8px] text-slate-700 uppercase font-black tracking-widest">{match.date.split('T')[0]}</p>
                                    </div>
                                 </div>
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="px-6 py-4 bg-yellow-500 text-slate-950 text-[9px] uppercase tracking-widest font-black italic hover:bg-white transition-all">Authorize Lineup</button>
                                    <Link href="/coaching/tactics" className="flex items-center justify-center p-4 glass-card border-white/10 hover:border-yellow-500/40 text-[9px] uppercase font-black text-slate-400 hover:text-white transition-all italic">Tactical Board</Link>
                                 </div>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <div className="py-12 text-center border border-dashed border-white/5 rounded-sm opacity-30">
                           <FaCrosshairs className="text-3xl mx-auto mb-3 text-slate-800" />
                           <p className="text-[8px] font-black uppercase tracking-[0.6em] text-slate-600">Standby_For_Orders</p>
                        </div>
                     )}
                  </section>

                  {/* Quick-Action Personnel Command */}
                  <section className="glass-card hud-border p-10 bg-slate-950/60 border-white/5 relative overflow-hidden group/personnel">
                     <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5 relative z-10">
                        <div className="flex items-center gap-3">
                           <FaUsers className="text-yellow-500 text-xs" />
                           <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">Personnel_Command</h3>
                        </div>
                        <span className="text-[7px] text-slate-700 font-mono tracking-widest uppercase italic">DIRECT_STATUS_LINK</span>
                     </div>

                     <div className="space-y-4 relative z-10 max-h-[420px] overflow-y-auto custom-scrollbar pr-2">
                        {players.map((player, i) => (
                           <div key={i} className="flex items-center justify-between p-4 glass-card bg-slate-900/40 border-white/5 hover:border-white/10 transition-all group/player">
                              <div className="flex items-center gap-4">
                                 <div className="w-8 h-8 rounded-lg bg-slate-950 border border-white/5 overflow-hidden flex items-center justify-center relative">
                                    {player.image ? (
                                       <img src={`/avatars/${player.image}`} alt={player.name} className="w-full h-full object-cover" />
                                    ) : <div className="w-1/2 h-1/2 bg-slate-800 rounded-full" />}
                                    <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-slate-950 ${player.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
                                 </div>
                                 <div className="text-left">
                                    <p className="text-[10px] font-black text-white uppercase italic tracking-tight leading-none mb-1">{player.name}</p>
                                    <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest">{player.role}</p>
                                 </div>
                              </div>
                              <button
                                 onClick={() => togglePlayerStatus(player.id, player.status)}
                                 disabled={updatingId === player.id}
                                 className={`px-4 py-2 text-[8px] font-black uppercase tracking-widest border transition-all ${updatingId === player.id ? 'opacity-20 cursor-wait' : ''} ${player.status === 'available' ? 'border-red-500/20 text-red-500/80 hover:bg-red-500 hover:text-white' : 'border-green-500/20 text-green-500/80 hover:bg-green-500 hover:text-white'}`}
                              >
                                 {updatingId === player.id ? 'SYNCING...' : player.status === 'available' ? 'SET_INJURED' : 'SET_ACTIVE'}
                              </button>
                           </div>
                        ))}
                     </div>

                     {/* Add Health Overwatch Summary here if needed, but the hubs already cover it. */}
                  </section>
               </div>

               {/* Right Column: Intelligence Feed */}
               <div className="lg:col-span-12 xl:col-span-7 space-y-12 animate-slide-up">
                  <section className="glass-card hud-border p-12 bg-slate-950/60 relative overflow-hidden flex flex-col min-h-[760px] group/intel border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
                     <div className="absolute top-0 right-0 p-8 flex items-center gap-4 z-20">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)] animate-ping" />
                     </div>

                     <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-12 border-b border-white/5 relative z-10 gap-8">
                        <div className="flex flex-col gap-3">
                           <div className="flex items-center gap-5">
                              <div className="w-12 h-12 glass-card border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                                 <FaChartLine className="text-yellow-500 text-xl" />
                              </div>
                              <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Neural<span className="text-slate-800 ml-4 group-hover:text-yellow-500 transition-colors">Feed</span></h3>
                           </div>
                        </div>
                     </div>

                     <div className="flex-1 space-y-4 relative z-10 overflow-y-auto max-h-[520px] custom-scrollbar pr-4 pb-8">
                        {loading ? (
                           Array(5).fill(0).map((_, i) => <div key={i} className="h-32 glass-card animate-pulse bg-white/5 mb-4" />)
                        ) : matches.slice(0, 10).map((match, i) => (
                           <div key={i} className="flex flex-col sm:flex-row items-center gap-10 p-10 glass-card border-white/5 bg-slate-950/20 hover:border-yellow-500/30 transition-all duration-700 relative overflow-hidden group/feed">
                              <div className="shrink-0 w-24 h-24 glass-card border-white/5 flex flex-col items-center justify-center bg-slate-950 group-hover/feed:border-yellow-500/40 relative">
                                 <p className="text-[7px] text-slate-700 font-black uppercase tracking-[0.3em] mb-2">{match.status === 'Finished' ? 'POST_OP' : 'PRE_OP'}</p>
                                 <p className="text-2xl font-black text-white font-mono tracking-tighter group-hover/feed:text-yellow-500 italic leading-none">{match.score || 'VS'}</p>
                              </div>
                              <div className="flex-1 overflow-hidden text-left">
                                 <div className="flex items-center gap-5 mb-3">
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${match.status === 'Finished' ? 'text-blue-500' : 'text-yellow-500'}`}>{match.status}</span>
                                    <span className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em]">{match.competition}</span>
                                 </div>
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter truncate italic">{match.homeTeam} vs {match.awayTeam}</h4>
                              </div>
                              <div className="text-right shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                                 <Link
                                    href={match.status === 'Finished' ? "/coaching/analysis" : "/coaching/upcoming"}
                                    className="px-10 py-4 border border-white/5 bg-white/[0.02] text-[10px] text-slate-600 group-hover/feed:text-slate-950 group-hover/feed:bg-yellow-500 hover:border-yellow-500 font-black uppercase tracking-[0.4em] transition-all italic block text-center"
                                 >
                                    {match.status === 'Finished' ? 'ANALYSIS' : 'DEACTIVATE'}
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div className="mt-16 pt-12 border-t border-white/5 relative z-10">
                        <Link href="/coaching/analysis" className="group flex flex-col sm:flex-row items-center justify-between p-12 glass-card border-yellow-500/5 hover:border-yellow-500/40 bg-yellow-500/[0.01] transition-all duration-700 relative overflow-hidden">
                           <div className="relative z-10 text-left">
                              <h4 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic group-hover:text-yellow-500 transition-colors">TACTICAL_ADVISORY_NETWORK</h4>
                              <p className="text-[11px] text-slate-600 font-bold uppercase tracking-[0.4em] italic">Decrypt deep mission data for strategic optimizations</p>
                           </div>
                           <FaArrowRight className="text-2xl text-slate-700 group-hover:text-yellow-500 group-hover:translate-x-3 transition-all mt-8 sm:mt-0" />
                        </Link>
                     </div>
                  </section>
               </div>
            </div>
         </div>
      </div>
   );
}
