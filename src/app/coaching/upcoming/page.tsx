"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaCalendarAlt, FaUsers, FaClipboardList, 
  FaShieldAlt, FaArrowLeft, FaCrosshairs, FaCheckCircle, FaClock
} from 'react-icons/fa';

export default function UpcomingOperations() {
  const { data: session } = useSession();
  const [matches, setMatches] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const slots = ['GK', 'LCB', 'RCB', 'LCM', 'CM', 'RCM', 'ST'];

  const getPowerIndex = (matchRef: any, isHome: boolean) => {
    // For Escuela (Home), calculate based on current lineup in match object
    if (isHome) {
      if (!matchRef.homeLineup || matchRef.homeLineup.length === 0) return 30;
      
      const assignedNames = matchRef.homeLineup.map((p: any) => p.name?.toLowerCase().trim()).filter(Boolean);
      const playerPowers = team
        .filter(p => assignedNames.includes(p.name.toLowerCase().trim()))
        .map(p => p.power || 85);
      
      if (playerPowers.length === 0) return 30;
      
      const avgPower = playerPowers.reduce((a, b) => a + b, 0) / playerPowers.length;
      const squadMaturity = (playerPowers.length / 7); 
      return Math.round(avgPower * squadMaturity);
    }

    // For away team
    if (matchRef.awayPower && matchRef.awayPower > 0) return matchRef.awayPower;
    if (!matchRef.awayTeam) return 0;
    const hash = matchRef.awayTeam.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    return 78 + (hash % 15);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [teamRes, matchesRes] = await Promise.all([
          fetch('/api/team'),
          fetch('/api/matches')
        ]);
        
        const teamData = await teamRes.json();
        const matchesData = await matchesRes.json();
        
        setTeam(Array.isArray(teamData) ? teamData : teamData.team || []);
        setMatches(Array.isArray(matchesData) ? matchesData.filter((m: any) => m.status === 'Scheduled') : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const updateLineupSlot = (matchId: string, slotIndex: number, playerName: string) => {
    setMatches(prev => prev.map(m => {
      if (m.id === matchId) {
        const newLineup = [...(m.homeLineup || Array(7).fill({ name: '', position: '' }))];
        if (newLineup.length < 7) {
            // Fill with empty slots if needed
            while(newLineup.length < 7) newLineup.push({ name: '', position: '' });
        }
        newLineup[slotIndex] = { name: playerName, position: slots[slotIndex] };
        return { ...m, homeLineup: newLineup };
      }
      return m;
    }));
  };

  const saveLineup = async (match: any) => {
    setSaving(match.id);
    try {
      const finalHomePower = getPowerIndex(match, true);
      const finalAwayPower = getPowerIndex(match, false);

      const res = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
           homeLineup: JSON.stringify(match.homeLineup),
           homePower: finalHomePower,
           awayPower: finalAwayPower
        })
      });

      if (res.ok) {
        alert(`TACTICAL_DEPLOYMENT_AUTHORIZED: ${match.homeTeam} vs ${match.awayTeam}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-yellow-500 selection:text-slate-950 relative overflow-hidden">
      {/* Immersive Background Vantage */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="py-24 px-8 max-w-7xl mx-auto relative z-10">
        <Link href="/coaching" className="flex items-center gap-3 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] mb-16 group transition-all">
          <FaArrowLeft className="group-hover:-translate-x-2 transition-transform text-yellow-500/50" />
          Mission_Control // Return_Vantage
        </Link>

         <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 gap-12 animate-slide-up">
            <div className="flex flex-col gap-6">
               <div className="relative">
                  <div className="flex items-center gap-3 text-[10px] text-yellow-500 font-black uppercase tracking-[0.6em] mb-4">
                     <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                     Tactical_Overwatch
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] italic mb-2">
                     Upcoming <br />
                     <span className="text-yellow-500 not-italic">Operations</span>
                  </h1>
                  <p className="text-[9px] text-slate-700 font-mono uppercase tracking-[0.4em] ml-1">Registry_Sync: Active_Signals</p>
               </div>
            </div>
            
            {/* Squad_Health HUD 2.0 */}
            <div className="flex flex-wrap gap-10 w-full lg:w-auto">
              <div className="glass-card hud-border px-10 py-6 bg-slate-950/40 min-w-[240px] relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-[2px] h-full bg-green-500/40" />
                 <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    Bio_Status: Available
                 </div>
                 <div className="flex items-end gap-4">
                    <span className="text-5xl font-black text-white font-mono leading-none tracking-tighter italic">{team.filter(p => p.status === 'available').length}</span>
                    <span className="text-slate-700 font-black font-mono text-base mb-1.5 uppercase tracking-widest">/ {team.length} Assets</span>
                 </div>
              </div>
              
              {team.some(p => p.status !== 'available') && (
                 <div className="glass-card hud-border px-10 py-6 bg-slate-950/40 border-red-500/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-red-500/40" />
                    <div className="text-[10px] text-red-500/80 font-black uppercase tracking-[0.4em] mb-4 flex items-center gap-3 italic">
                       <FaShieldAlt className="text-[10px] animate-pulse" /> Signal_Interference
                    </div>
                    <div className="flex gap-3">
                       {team.filter(p => p.status !== 'available').map((p, i) => (
                          <div key={i} className="group relative">
                             <div className="w-10 h-10 rounded border border-white/10 bg-slate-900 overflow-hidden grayscale hover:grayscale-0 transition-all shadow-inner">
                                {p.image ? <img src={`/avatars/${p.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-700">?</div>}
                             </div>
                             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-4 py-1.5 bg-red-600 text-[8px] font-black text-white uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none rounded-sm z-[100] shadow-2xl">
                                {p.name}: {p.status.toUpperCase()}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-80 glass-card animate-pulse bg-white/5 hud-border" />)}
           </div>
        ) : matches.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
               {matches.map((match) => (
                  <div key={match.id} className="glass-card hud-border p-12 bg-slate-950/60 border-white/5 relative overflow-hidden group hover:border-yellow-500/30 hover:bg-slate-900/40 transition-all duration-700 hover:shadow-[0_0_80px_rgba(0,0,0,0.5)] min-h-[580px] flex flex-col justify-between">
                     {/* Neural Background */}
                     <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
                     <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:30px_30px] opacity-20 pointer-events-none" />
                     <div className="absolute top-0 left-0 w-0 h-[2px] bg-yellow-500 group-hover:w-full transition-all duration-700" />
                     
                     <div className="relative z-10">
                        {/* Match Telemetry Header */}
                        <div className="flex items-center justify-between mb-16 pb-8 border-b border-white/5 relative">
                           {/* HUD Bracket Ornamentation */}
                           <div className="absolute -top-4 -right-4 w-4 h-4 border-t border-r border-yellow-500/20 group-hover:border-yellow-500/40 transition-colors" />
                           
                           <div className="flex flex-col gap-3">
                              <div className="flex items-center gap-3">
                                 <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded-sm skew-x-[-15deg]">
                                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.4em] block skew-x-[15deg]">{match.competition}</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 text-[8px] text-slate-500 font-black tracking-[0.2em] pl-1">
                                 <span className="flex items-center gap-2 group-hover:text-white transition-colors uppercase"><FaClock className="text-[8px] text-yellow-500/50" /> {match.time}</span>
                                 <span className="text-slate-800 font-black">//</span>
                                 <span className="flex items-center gap-2 group-hover:text-white transition-colors uppercase"><FaCalendarAlt className="text-[8px] text-yellow-500/50" /> {match.date.split('T')[0]}</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                              <span className="text-[7px] text-slate-600 font-black uppercase tracking-[0.4em] mb-1.5">BIO_SIGNAL_STATUS</span>
                              <div className={`px-6 py-2 border text-[9px] font-black uppercase tracking-[0.4em] backdrop-blur-xl transition-all relative overflow-hidden ${match.homeLineup?.length > 0 ? 'border-green-500/30 text-green-500 bg-green-500/5 px-8' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/5 animate-pulse'}`}>
                                 <div className={`absolute left-0 top-0 w-[2px] h-full ${match.homeLineup?.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                 {match.homeLineup?.length > 0 ? 'SIGNALS_LOCKED' : 'DEPLOY_PENDING'}
                              </div>
                           </div>
                        </div>

                        {/* Operational Teams - Cinematic Typography */}
                        <div className="flex flex-col gap-10">
                           <div className="flex items-center justify-between border-l-2 border-yellow-500/20 pl-6 group-hover:border-yellow-500 transition-colors">
                              <div className="flex flex-col">
                                 <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">HOME_ASSET</span>
                                 <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic group-hover:text-yellow-500 transition-all leading-none">{match.homeTeam}</h3>
                              </div>
                               <div className="flex flex-col items-end">
                                 <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">POWER_INDEX</p>
                                 <div className="flex items-center gap-3">
                                    <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                       <div className="h-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all duration-1000" style={{ width: `${getPowerIndex(match, true)}%` }} />
                                    </div>
                                    <span className="text-sm font-black text-yellow-500 font-mono italic">{getPowerIndex(match, true)}%</span>
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8 px-6">
                              <div className="h-[1px] flex-1 bg-white/5" />
                              <span className="text-slate-800 font-black italic text-sm tracking-[0.3em] uppercase">VERSUS</span>
                              <div className="h-[1px] flex-1 bg-white/5" />
                           </div>

                           <div className="flex items-center justify-between border-r-2 border-white/10 pr-6 text-right group-hover:border-white/20 transition-colors">
                               <div className="flex flex-col items-start">
                                  <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">POWER_INDEX</span>
                                  <div className="flex items-center gap-3">
                                     <span className="text-sm font-black text-white/40 font-mono italic">{getPowerIndex(match, false)}%</span>
                                     <div className="w-16 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-white/10 transition-all duration-1000" style={{ width: `${getPowerIndex(match, false)}%` }} />
                                     </div>
                                  </div>
                               </div>
                              <div className="flex flex-col">
                                 <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2 text-right">OPPOSITION_TARGET</span>
                                 <h3 className="text-4xl md:text-5xl font-black text-white/30 uppercase tracking-tighter group-hover:text-white/60 transition-all leading-none">{match.awayTeam}</h3>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Quick Deployment Matrix */}
                     <div className="mt-16 pt-12 border-t border-white/5 relative z-10 flex flex-col gap-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Auth: Deployment_Alpha</span>
                                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                              </div>
                              <p className="text-[8px] text-slate-700 font-mono italic tracking-widest uppercase ml-1">Sector: 7-A-SIDE // Formation: VANGUARD_231</p>
                           </div>
                           <div className="flex gap-4">
                              <Link 
                                 href={`/coaching/upcoming/${match.id}`}
                                 className="px-8 py-3.5 border border-white/5 bg-slate-950/40 text-[9px] text-slate-400 hover:text-white hover:border-yellow-500/40 font-black uppercase tracking-[0.4em] transition-all flex items-center gap-3 group/btn hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]"
                              >
                                 <FaCrosshairs className="text-[10px] text-yellow-500/50 group-hover/btn:rotate-90 transition-transform" />
                                 Deep_Dive_Vantage
                              </Link>
                              <button 
                                 onClick={() => saveLineup(match)}
                                 disabled={saving === match.id}
                                 className="px-10 py-3.5 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white shadow-[0_0_40px_rgba(234,179,8,0.2)] transition-all flex items-center gap-3 disabled:opacity-50 relative overflow-hidden group/gen"
                              >
                                 {saving === match.id ? (
                                    <>
                                       <div className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                                       SYNCING...
                                    </>
                                 ) : (
                                    <>
                                       <FaShieldAlt className="text-[10px]" />
                                       Authorize_Sync
                                    </>
                                 )}
                                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/gen:translate-x-full transition-transform duration-1000" />
                              </button>
                           </div>
                        </div>
                        
                        {/* Rapid Personnel Selector */}
                        <div className="grid grid-cols-7 gap-3">
                           {slots.map((slot, i) => {
                              const currentPlayer = match.homeLineup?.[i]?.name || '';
                              return (
                                 <div key={i} className="group/slot flex flex-col gap-2 items-center">
                                    <div className={`w-full h-12 flex items-center justify-center bg-slate-950 border transition-all duration-500 relative overflow-hidden ${currentPlayer ? 'border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'border-white/5 text-slate-800 group-hover/slot:border-white/20'}`}>
                                       <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
                                       <span className="text-[9px] font-black italic relative z-10">{slot}</span>
                                       {currentPlayer && <div className="absolute bottom-0 left-0 w-full h-[1px] bg-yellow-500 animate-pulse" />}
                                    </div>
                                    <div className={`w-full h-[3px] transition-all duration-700 ${currentPlayer ? 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] scale-x-100' : 'bg-slate-900 scale-x-[0.2] opacity-20 group-hover/slot:scale-x-50'}`} />
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     {/* Archive Identity HUD */}
                     <div className="absolute -bottom-4 -left-4 text-[100px] font-black text-white/[0.01] select-none pointer-events-none tracking-tighter italic group-hover:text-white/[0.03] transition-colors duration-1000">
                        {match.id.substring(0,8).toUpperCase()}
                     </div>
                  </div>
               ))}
           </div>
        ) : (
           <div className="h-[40vh] flex flex-col items-center justify-center opacity-30 text-center grayscale">
              <FaCrosshairs className="text-6xl mb-6" />
              <p className="text-xl font-black uppercase tracking-[0.5em]">No Upcoming Operations Detected</p>
           </div>
        )}
      </div>
    </div>
  );
}
