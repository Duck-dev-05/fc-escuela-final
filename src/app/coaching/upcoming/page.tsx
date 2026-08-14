"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  FaCalendarAlt, FaUsers, FaClipboardList, 
  FaShieldAlt, FaArrowLeft, FaCrosshairs, FaCheckCircle, FaClock
} from 'react-icons/fa';

export default function UpcomingMatches() {
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
        alert(`LINEUP SAVED: ${match.homeTeam} vs ${match.awayTeam}`);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-yellow-500 selection:text-slate-950 relative overflow-hidden">
      {/* Immersive Background Vantage */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-yellow-500/[0.02] to-transparent" />
        <div className="absolute inset-0 bg-noise opacity-[0.01]" />
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto relative z-10 pt-24">
        <Link href="/coaching" className="flex items-center gap-2 text-[8px] font-black text-slate-400 hover:text-slate-950 uppercase tracking-[0.4em] mb-12 group transition-all">
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-yellow-500" />
          COACH_PORTAL // BACK
        </Link>

         <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-16 gap-10 animate-slide-up">
            <div className="flex flex-col gap-4">
               <div className="relative">
                  <div className="flex items-center gap-2 text-[8px] text-yellow-600 font-black uppercase tracking-[0.2em] mb-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                     DEPLOYMENT_LIST
                  </div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-2">
                     Upcoming <span className="text-gradient-gold italic">Matches</span>
                   </h1>
                   <p className="text-[8px] text-slate-400 font-mono uppercase tracking-[0.4em] ml-0.5">Tactical Readiness: Phase 04</p>
               </div>
            </div>
            
            {/* Squad_Health HUD 3.0 */}
            <div className="flex flex-wrap gap-6 w-full lg:w-auto">
              <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 px-8 py-4 rounded-2xl min-w-[200px] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-[2px] h-full bg-emerald-500/30" />
                  <div className="text-[8px] text-slate-400 font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-2">
                     <div className="w-1 h-1 rounded-full bg-emerald-500" />
                     Personnel Active
                  </div>
                  <div className="flex items-end gap-3">
                     <span className="text-3xl font-black text-slate-950 font-mono leading-none tracking-tighter italic">{team.filter(p => p.status === 'available').length}</span>
                     <span className="text-slate-300 font-black font-mono text-[10px] mb-0.5 uppercase tracking-widest">/ {team.length} UNIT_CAP</span>
                  </div>
              </div>
              
              {team.some(p => p.status !== 'available') && (
                 <div className="bg-white/80 backdrop-blur-2xl border border-slate-100 px-8 py-4 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[2px] h-full bg-rose-500/30" />
                    <div className="text-[8px] text-rose-500 font-black uppercase tracking-[0.4em] mb-3 flex items-center gap-2 italic">
                       <FaShieldAlt className="text-[8px]" /> Medical Restriction
                    </div>
                    <div className="flex gap-2">
                       {team.filter(p => p.status !== 'available').map((p, i) => (
                          <div key={i} className="group relative">
                             <div className="w-8 h-8 rounded border border-slate-100 bg-slate-50 overflow-hidden grayscale hover:grayscale-0 transition-all">
                                {p.image ? <img src={`/avatars/${p.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300">?</div>}
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>

        {loading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-slate-50/50 rounded-2xl animate-pulse" />)}
           </div>
        ) : matches.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {matches.map((match) => (
                  <div key={match.id} className="group bg-white/80 backdrop-blur-2xl border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-yellow-500/20 transition-all duration-500 flex flex-col justify-between min-h-[480px]">
                     <div className="relative z-10">
                        {/* Match Telemetry Header */}
                        <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50 relative">
                           <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                 <span className="px-2 py-0.5 bg-slate-950 text-white text-[7px] font-black uppercase tracking-[0.4em] rounded">{match.competition}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[7px] text-slate-400 font-black tracking-[0.2em] pl-0.5">
                                 <span className="flex items-center gap-1.5 uppercase hover:text-slate-950 transition-colors"><FaClock className="text-[7px] text-yellow-500" /> {match.time}</span>
                                 <span className="flex items-center gap-1.5 uppercase hover:text-slate-950 transition-colors"><FaCalendarAlt className="text-[7px] text-yellow-500" /> {match.date.split('T')[0]}</span>
                              </div>
                           </div>
                           <div className="flex flex-col items-end">
                                <span className="text-[6px] text-slate-300 font-black uppercase tracking-[0.4em] mb-1">ROSTER_STATUS</span>
                                <div className={`px-4 py-1.5 border text-[8px] font-black uppercase tracking-[0.3em] rounded-lg transition-all ${match.homeLineup?.length > 0 ? 'border-emerald-100 text-emerald-600 bg-emerald-50/50' : 'border-yellow-100 text-yellow-600 bg-yellow-50/50'}`}>
                                   {match.homeLineup?.length > 0 ? 'READY' : 'TBD'}
                                </div>
                           </div>
                        </div>

                        {/* Teams - Editorial Spacing */}
                        <div className="flex flex-col gap-8">
                            <div className="flex items-center justify-between pl-4 border-l-2 border-slate-50 group-hover:border-yellow-500/30 transition-colors">
                               <div className="flex flex-col">
                                  <span className="text-[7px] text-slate-300 font-black uppercase tracking-[0.4em] mb-1">HOME</span>
                                  <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic leading-none">{match.homeTeam}</h3>
                              </div>
                               <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-2">
                                     <div className="w-12 h-[1px] bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500" style={{ width: `${getPowerIndex(match, true)}%` }} />
                                     </div>
                                     <span className="text-[9px] font-black text-slate-950 font-mono italic">{getPowerIndex(match, true)}%</span>
                                  </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-4 px-4">
                              <div className="h-[1px] flex-1 bg-slate-50" />
                              <span className="text-slate-200 font-black italic text-[9px] tracking-[0.4em] uppercase">VS</span>
                              <div className="h-[1px] flex-1 bg-slate-50" />
                           </div>

                           <div className="flex items-center justify-between pr-4 text-right">
                               <div className="flex flex-col items-start">
                                  <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-black text-slate-300 font-mono italic">{getPowerIndex(match, false)}%</span>
                                     <div className="w-12 h-[1px] bg-slate-100 rounded-full">
                                        <div className="h-full bg-slate-200" style={{ width: `${getPowerIndex(match, false)}%` }} />
                                     </div>
                                  </div>
                               </div>
                              <div className="flex flex-col">
                                 <span className="text-[7px] text-slate-300 font-black uppercase tracking-[0.4em] mb-1">AWAY</span>
                                 <h3 className="text-3xl font-black text-slate-200 uppercase tracking-tighter leading-none">{match.awayTeam}</h3>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Action HUD */}
                     <div className="mt-12 pt-8 border-t border-slate-50 flex flex-col gap-8">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                               <span className="text-[8px] font-black text-slate-950 uppercase tracking-[0.2em] ">Deployment Type</span>
                               <p className="text-[7px] text-slate-400 font-mono italic tracking-widest uppercase">7-SIDE // PRECISION</p>
                            </div>
                           <div className="flex gap-3">
                               <Link 
                                  href={`/coaching/upcoming/${match.id}`}
                                  className="px-5 py-2.5 bg-slate-50 text-[8px] text-slate-500 hover:text-slate-950 font-black uppercase tracking-[0.4em] rounded-xl transition-all border border-slate-100"
                               >
                                  Edit
                               </Link>
                              <button 
                                 onClick={() => saveLineup(match)}
                                 disabled={saving === match.id}
                                 className="px-6 py-2.5 bg-yellow-500 text-slate-950 text-[8px] font-black uppercase tracking-[0.4em] hover:bg-slate-950 hover:text-white rounded-xl transition-all shadow-lg flex items-center gap-2"
                              >
                                 {saving === match.id ? "SYNCING" : "SAVE"}
                              </button>
                           </div>
                        </div>
                        
                        {/* Status Grid */}
                        <div className="grid grid-cols-7 gap-1">
                           {slots.map((slot, i) => {
                              const currentPlayer = match.homeLineup?.[i]?.name || '';
                              return (
                                 <div key={i} className={`h-8 flex items-center justify-center border transition-all duration-300 rounded ${currentPlayer ? 'border-yellow-500 bg-yellow-50/50 text-yellow-700' : 'border-slate-50 bg-slate-50/30 text-slate-200'}`}>
                                    <span className="text-[7px] font-black font-mono">{slot}</span>
                                 </div>
                              );
                           })}
                        </div>
                     </div>
                  </div>
               ))}
           </div>
        ) : (
           <div className="py-24 text-center border-2 border-dashed border-slate-50 rounded-[2rem]">
              <FaCrosshairs className="text-3xl text-slate-100 mx-auto mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">No Operations Pending</p>
           </div>
        )}
      </div>
    </div>
  );
}
