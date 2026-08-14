"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
   FaArrowLeft, FaUsers, FaCrosshairs, FaShieldAlt,
   FaCheckCircle, FaExclamationTriangle, FaMapMarkerAlt, FaClock,
   FaTv, FaCloudSun, FaUserSecret, FaLandmark, FaTimes, FaRunning, FaStar, FaBolt, FaFilter, FaLayerGroup, FaChevronDown, FaUserAlt, FaSatellite, FaMicrochip, FaCubes, FaGlobe
} from 'react-icons/fa';
import Spinner from '@/components/Spinner';

export default function MatchPreparation() {
   const params = useParams<{ id: string }>();
   const { data: session } = useSession();
   const [match, setMatch] = useState<any>(null);
   const [team, setTeam] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [activeSlot, setActiveSlot] = useState<string | null>(null);
   const [inspectingPlayer, setInspectingPlayer] = useState<any>(null);
   const [showAllPlayers, setShowAllPlayers] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
   const pitchRef = useRef<HTMLDivElement>(null);
   const [tilt, setTilt] = useState({ x: 0, y: 0 });

   const slots = [
      { id: 'ST', label: 'ST', top: '15%', left: '50%' },
      { id: 'LCM', label: 'LCM', top: '35%', left: '26%' },
      { id: 'RCM', label: 'RCM', top: '35%', left: '74%' },
      { id: 'CM', label: 'CM', top: '50%', left: '50%' },
      { id: 'LCB', label: 'LCB', top: '68%', left: '26%' },
      { id: 'RCB', label: 'RCB', top: '68%', left: '74%' },
      { id: 'GK', label: 'GK', top: '86%', left: '50%' },
   ];

   const roleMapping: Record<string, string[]> = {
      'GK': ['GK', 'GOALKEEPER', 'BR', 'MON'],
      'LCB': ['CB', 'LB', 'RB', 'DF', 'DEFENDER', 'HV'],
      'RCB': ['CB', 'LB', 'RB', 'DF', 'DEFENDER', 'HV'],
      'LCM': ['CM', 'CDM', 'CAM', 'AMF', 'LM', 'RM', 'MF', 'MIDFIELDER', 'TV'],
      'CM': ['CM', 'CDM', 'CAM', 'AMF', 'LM', 'RM', 'MF', 'MIDFIELDER', 'TV'],
      'RCM': ['CM', 'CDM', 'CAM', 'AMF', 'LM', 'RM', 'MF', 'MIDFIELDER', 'TV'],
      'ST': ['ST', 'CF', 'LW', 'RW', 'FW', 'FORWARD', 'STRIKER', 'TĐ'],
   };

   const tacticalLinks = [
      { from: 'GK', to: 'LCB' }, { from: 'GK', to: 'RCB' },
      { from: 'LCB', to: 'LCM' }, { from: 'LCB', to: 'CM' },
      { from: 'RCB', to: 'RCM' }, { from: 'RCB', to: 'CM' },
      { from: 'LCM', to: 'ST' }, { from: 'CM', to: 'ST' }, { from: 'RCM', to: 'ST' },
   ];

   const getPowerIndex = (name: string, dbValue?: number, isHome?: boolean) => {
      // For away team, prioritize database value or fallback to name-hash
      if (!isHome) {
         if (dbValue !== undefined && dbValue !== null && dbValue > 0) return dbValue;
         if (!name) return 0;
         const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
         return 78 + (hash % 15);
      }

      // For Escuela (Home), calculate based on CURRENT LINEUP in state
      if (!match?.homeLineup || match.homeLineup.length === 0) return 30; // Base baseline
      
      const assignedPlayers = match.homeLineup.map((p: any) => p.name.toLowerCase().trim());
      const playerPowers = team
         .filter(p => assignedPlayers.includes(p.name.toLowerCase().trim()))
         .map(p => p.power || 85);
      
      if (playerPowers.length === 0) return 30;
      
      const avgPower = playerPowers.reduce((a, b) => a + b, 0) / playerPowers.length;
      // Bonus for full squad (7 players)
      const squadMaturity = (playerPowers.length / 7); 
      return Math.round(avgPower * squadMaturity);
   };

   const getFormationType = (lineup: any[]) => {
      const assigned = lineup?.filter(p => p.name).length || 0;
      if (assigned === 0) return 'PENDING SELECTION';
      if (assigned < 7) return `INCOMPLETE (${assigned}/7)`;
      return '2-3-1 FORMATION';
   };

   useEffect(() => {
      async function fetchData() {
         if (!params?.id) return;
         try {
            const [matchRes, teamRes] = await Promise.all([
               fetch(`/api/matches/${params.id}`),
               fetch('/api/team')
            ]);

            const matchData = await matchRes.json();
            const teamData = await teamRes.json();

            setMatch(matchData);
            setTeam(Array.isArray(teamData) ? teamData : teamData.team || []);
         } catch (e) {
            console.error('DATA_LOAD_FAILED:', e);
         } finally {
            setLoading(false);
         }
      }
      fetchData();

      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setActiveSlot(null);
            setShowAllPlayers(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, [params?.id]);

   const updatePosition = (slotId: string, playerName: string) => {
      const newLineup = [...(match.homeLineup || [])];
      const index = newLineup.findIndex((p: any) => p.position === slotId);

      if (playerName !== '') {
         const otherPosIndex = newLineup.findIndex((p: any) =>
            p.name.toLowerCase().trim() === playerName.toLowerCase().trim()
         );
         if (otherPosIndex >= 0) {
            newLineup.splice(otherPosIndex, 1);
         }
      }

      if (index >= 0) {
         if (playerName === '') {
            newLineup.splice(index, 1);
         } else {
            newLineup[index] = { name: playerName, position: slotId };
         }
      } else if (playerName !== '') {
         newLineup.push({ name: playerName, position: slotId });
      }

      setMatch({ ...match, homeLineup: newLineup });
      setActiveSlot(null);
      setShowAllPlayers(false);
   };

   const handleSlotClick = (slot: any) => {
      const assigned = match.homeLineup?.find((p: any) => p.position === slot.id);
      if (assigned) {
         const pDetails = team.find(p => p.name.toLowerCase().trim() === assigned.name.toLowerCase().trim());
         setInspectingPlayer({ ...(pDetails || assigned), slot: slot.id });
         setActiveSlot(null);
      } else {
         setActiveSlot(activeSlot === slot.id ? null : slot.id);
         setInspectingPlayer(null);
      }
   };

   const saveOperation = async () => {
      setSaving(true);
      try {
         const finalHomePower = getPowerIndex(match.homeTeam, match.homePower, true);
         const finalAwayPower = getPowerIndex(match.awayTeam, match.awayPower, false);

         const res = await fetch(`/api/matches/${params.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
               homeLineup: JSON.stringify(match.homeLineup),
               homePower: finalHomePower,
               awayPower: finalAwayPower
            }),
         });
         if (res.ok) {
            alert('TACTICAL LINEUP SAVED');
         }
      } catch (e) {
         console.error(e);
      } finally {
         setSaving(false);
      }
   };

   const handlePitchMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!pitchRef.current) return;
      const rect = pitchRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * 6, y: -x * 6 });
   };

   const handlePitchLeave = () => {
      setTilt({ x: 0, y: 0 });
   };

    const filteredTeam = team.filter(player => {
       const isAlreadyAssignedElsewhere = match.homeLineup?.some((p: any) =>
          p.name.toLowerCase().trim() === player.name.toLowerCase().trim() && p.position !== activeSlot
       );
       if (isAlreadyAssignedElsewhere) return false;

       if (showAllPlayers) return true;
       if (!activeSlot) return true;
       const allowedRoles = roleMapping[activeSlot] || [];
       return allowedRoles.includes(player.role.toUpperCase().trim());
    });

    const bench = team.filter(player => {
       const isAssigned = match?.homeLineup?.some((p: any) => 
          p.name.toLowerCase().trim() === player.name.toLowerCase().trim()
       );
       return !isAssigned;
    });

   if (loading) return <Spinner />;
   if (!match) return <div className="p-20 text-white font-black text-center uppercase tracking-[0.2em]">Match Not Found</div>;

   return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-yellow-500 selection:text-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

         <div className="max-w-[1700px] mx-auto relative z-10 pt-24 px-8">
            <Link href="/coaching/upcoming" className="flex items-center gap-3 text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-[0.4em] mb-12 group transition-all">
               <FaArrowLeft className="group-hover:-translate-x-2 transition-transform text-yellow-500/50" />
               Match List // Back to Coaching
            </Link>

            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
               <div className="animate-slide-up flex-1 w-full">
                  
                   <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-8 pb-8 border-b border-white/5 relative group/header">
                      <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.2em] mb-1">
                             <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                             Tactical Board
                          </div>
                          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none italic">
                            {match.homeTeam} <br />
                            <span className="text-xl md:text-2xl not-italic font-black text-slate-800 tracking-widest uppercase block mt-2 opacity-50 select-none">VS</span>
                            <span className="text-slate-500 group-hover:text-white transition-colors duration-700">{match.awayTeam}</span>
                         </h1>
                      </div>

                     <div className="flex gap-10 items-center animate-slide-left">
                        <div className="flex flex-col items-end gap-2 relative">
                           <div className="absolute -top-4 -right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-500/20 pointer-events-none" />
                           <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-2 border-r-2 border-yellow-500 pr-4">Team Power Index</span>
                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1 truncate max-w-[100px]">{match.homeTeam}</p>
                                 <p className="text-4xl font-black text-yellow-500 font-mono italic">{getPowerIndex(match.homeTeam, match.homePower, true)}%</p>
                              </div>
                              <div className="w-[1px] h-12 bg-white/5" />
                              <div className="text-left">
                                 <p className="text-[8px] text-slate-700 font-black uppercase tracking-widest mb-1 truncate max-w-[100px]">{match.awayTeam}</p>
                                 <p className="text-4xl font-black text-white/40 font-mono italic">{getPowerIndex(match.awayTeam, match.awayPower, false)}%</p>
                              </div>
                           </div>
                           <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative mt-4">
                              <div className="absolute inset-y-0 left-0 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all duration-1000" style={{ width: `${getPowerIndex(match.homeTeam, match.homePower, true)}%` }} />
                              <div className="absolute inset-y-0 left-0 bg-white/10" style={{ width: `${getPowerIndex(match.awayTeam, match.awayPower, false)}%` }} />
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-12 text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4">
                     <span className="flex items-center gap-3"><FaLandmark className="text-yellow-500/30" /> {match.venue}</span>
                     <span>//</span>
                     <span className="flex items-center gap-3"><FaClock className="text-yellow-500/30" /> {match.time} HRS</span>
                     <div className="flex-1" />
                     <span className="flex items-center gap-3 text-slate-800"><FaGlobe className="text-yellow-500/30" /> DATA CONNECTED</span>
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-start md:items-end gap-12">
                  <button 
                     onClick={saveOperation}
                     disabled={saving}
                     className="px-12 py-4 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white shadow-[0_0_40px_rgba(234,179,8,0.2)] transition-all flex items-center gap-4 disabled:opacity-50 relative overflow-hidden group/gen active:scale-95"
                  >
                     {saving ? (
                        <>
                           <div className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
                           SYNCING...
                        </>
                     ) : (
                        <>
                           <FaShieldAlt className="text-[10px] group-hover:rotate-12 transition-transform" />
                           Save Lineup
                        </>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>

                  <div className="flex gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                     <div className="glass-card hud-border px-8 py-4 bg-slate-950/40 border-green-500/20 relative">
                        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-green-500/20" />
                        <div className="text-[8px] text-green-500/80 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                           <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Players Available
                        </div>
                        <div className="flex items-baseline gap-2">
                           <span className="text-2xl font-black text-white font-mono">{team.filter(p => p.status === 'available').length}</span>
                           <span className="text-[9px] text-slate-700 font-mono">/ {team.length}</span>
                        </div>
                     </div>
                     {team.some(p => p.status !== 'available') && (
                        <div className="glass-card hud-border px-8 py-4 bg-slate-950/40 border-red-500/20 relative">
                           <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-red-500/20" />
                           <div className="text-[8px] text-red-500/80 font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Restrictions
                           </div>
                           <div className="flex gap-1.5">
                              {team.filter(p => p.status !== 'available').map((p, i) => (
                                 <div key={i} className="group relative">
                                    <div className="w-6 h-6 rounded border border-white/10 bg-slate-900 overflow-hidden grayscale border-red-500/20">
                                       {p.image ? <img src={`/avatars/${p.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-700">?</div>}
                                    </div>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-600 text-[6px] font-black text-white uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 rounded-sm">
                                       {p.name}: {p.status}
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
                <div className="lg:col-span-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <div
                     ref={pitchRef}
                     onMouseMove={handlePitchMove}
                     onMouseLeave={handlePitchLeave}
                     className="glass-card hud-border p-4 bg-slate-950/60 relative aspect-[1/1.2] md:aspect-[1.6/1] shadow-[0_40px_100px_rgba(0,0,0,0.8)] group/pitch overflow-hidden transition-all duration-300"
                     style={{ 
                        perspective: '2000px',
                        transform: `perspective(2000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
                     }}
                  >
                     <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-white/5 pointer-events-none z-40" />
                     <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-white/5 pointer-events-none z-40" />
                     <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-white/5 pointer-events-none z-40" />
                     <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-white/5 pointer-events-none z-40" />

                     <div 
                        className="absolute inset-4 border border-white/10 rounded-sm bg-slate-900/20 backdrop-blur-sm transition-transform duration-1000 group-hover/pitch:rotate-x-6 group-hover/pitch:scale-[1.01] shadow-inner"
                        style={{ transformStyle: 'preserve-3d' }}
                     >
                        <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
                        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
                        
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.03),transparent_60%)] group-hover/pitch:bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.06),transparent_70%)] transition-all duration-1000" />
                        
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[18%] border-x border-b border-white/10 bg-white/[0.01]" />
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-[18%] border-x border-t border-white/10 bg-white/[0.01]" />
                        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 shadow-[0_0_10px_rgba(255,255,255,0.05)]" />
                        <div className="absolute top-1/2 left-1/2 w-48 h-48 border border-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                        
                        <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500/20 animate-vantage-scan-x z-10 pointer-events-none" />
                        <div className="absolute inset-x-0 top-0 h-1 bg-yellow-500/10 animate-vantage-scan-y z-10 pointer-events-none" style={{ animationDelay: '1.5s'}} />
                     </div>

                     <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                        <defs>
                           <filter id="glow">
                              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                              <feMerge>
                                 <feMergeNode in="coloredBlur"/>
                                 <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                           </filter>
                        </defs>
                        {tacticalLinks.map((link, idx) => {
                           const fromSlot = slots.find(s => s.id === link.from);
                           const toSlot = slots.find(s => s.id === link.to);
                           if (!fromSlot || !toSlot) return null;
                           const fromAssigned = match.homeLineup?.some((p: any) => p.position === fromSlot.id && p.name);
                           const toAssigned = match.homeLineup?.some((p: any) => p.position === toSlot.id && p.name);
                           const isActive = fromAssigned && toAssigned;
                           return (
                              <g key={idx}>
                                 <line
                                    x1={fromSlot.left} y1={fromSlot.top}
                                    x2={toSlot.left} y2={toSlot.top}
                                    stroke={isActive ? '#eab308' : '#ffffff'}
                                    strokeWidth={isActive ? '1.5' : '0.5'}
                                    strokeOpacity={isActive ? '0.4' : '0.1'}
                                    strokeDasharray={isActive ? "4 8" : "none"}
                                    className={isActive ? 'animate-neural-pulse' : ''}
                                    filter={isActive ? "url(#glow)" : ""}
                                 />
                                 {isActive && (
                                    <circle r="2" fill="#eab308" className="animate-signal-pulse">
                                       <animateMotion 
                                          dur="3s" 
                                          repeatCount="indefinite" 
                                          path={`M ${fromSlot.left} ${fromSlot.top} L ${toSlot.left} ${toSlot.top}`} 
                                       />
                                    </circle>
                                 )}
                              </g>
                           );
                        })}
                     </svg>

                     {slots.map((slot) => {
                        const assignedPlayer = match.homeLineup?.find((p: any) => p.position === slot.id);
                        const isOpen = activeSlot === slot.id;
                        const isBottomHalf = parseInt(slot.top) > 50;
                        return (
                           <div key={slot.id} className={`absolute ${isOpen ? 'z-[100]' : 'z-30'}`} style={{ top: slot.top, left: slot.left, transform: 'translate(-50%, -50%)' }}>
                               <div className={`absolute -inset-8 rounded-full border border-yellow-500/0 group-hover:border-yellow-500/5 transition-all duration-1000 ${assignedPlayer ? 'animate-spin-slow border-yellow-500/10' : ''}`} />
                               <div className={`absolute -inset-12 rounded-full border border-yellow-500/0 group-hover:border-yellow-500/5 transition-all duration-1000 ${assignedPlayer ? 'animate-reverse-spin border-yellow-500/5' : ''}`} />

                               <div className="absolute inset-0 pointer-events-none">
                                  <div className={`absolute inset-[-15%] rounded-full border border-yellow-500/0 transition-all duration-700 ${assignedPlayer ? 'border-yellow-500/20 animate-pulse' : 'group-hover:border-yellow-500/40'}`} />
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500/0 group-hover:border-yellow-500/60 transition-all duration-500" />
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500/0 group-hover:border-yellow-500/60 transition-all duration-500" />
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500/0 group-hover:border-yellow-500/60 transition-all duration-500" />
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500/0 group-hover:border-yellow-500/60 transition-all duration-500" />
                               </div>

                               <button
                                  onClick={(e) => { e.stopPropagation(); handleSlotClick(slot); }}
                                  className={`w-32 h-32 md:w-36 md:h-36 rounded-full border flex flex-col items-center justify-center transition-all duration-700 hover:scale-110 active:scale-95 relative z-30 group shadow-[0_30px_60px_rgba(0,0,0,0.6)]
                                     ${assignedPlayer ? 'border-yellow-500 bg-slate-950 shadow-[0_0_80px_rgba(234,179,8,0.4)]' : 
                                       isOpen ? 'border-yellow-500 bg-slate-900 shadow-[0_0_50px_rgba(234,179,8,0.3)]' :
                                       'border-white/10 bg-slate-950/95 hover:border-yellow-500/40'}`}
                               >
                                  <div className={`absolute inset-1 rounded-full border border-white/5 transition-all duration-700 ${assignedPlayer ? 'border-yellow-500/20 bg-yellow-500/5' : ''}`} />
                                  
                                  <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none rounded-full" />
                                  <span className={`text-[24px] md:text-[30px] font-black italic tracking-tighter transition-all duration-500 ${assignedPlayer ? 'text-yellow-500 scale-110' : 'text-slate-800 group-hover:text-white'}`}>{slot.label}</span>
                                  
                                  {assignedPlayer && (
                                     <>
                                        <div className="absolute -top-3 -right-3 w-10 h-10 bg-yellow-500 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.9)] animate-bounce-slow">
                                           <FaStar size={18} className="text-slate-950" />
                                        </div>
                                        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 group-hover:scale-110 transition-transform duration-500 z-50">
                                           <div className="relative glass-card bg-slate-950/95 backdrop-blur-xl px-5 py-2 border border-yellow-500/50 shadow-[0_15px_40px_rgba(0,0,0,0.9)] group-hover:border-yellow-500 transition-colors min-w-[160px]">
                                              <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-yellow-500" />
                                              <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-yellow-500" />
                                              
                                              <div className="flex flex-col items-center">
                                                 <span className="text-[7px] text-yellow-500/60 font-black uppercase tracking-[0.2em] mb-0.5">PLAYER ASSIGNED</span>
                                                 <span className="text-[11px] md:text-[14px] font-black text-white uppercase tracking-[0.1em] font-mono leading-none truncate w-full text-center">{assignedPlayer.name}</span>
                                              </div>
                                           </div>
                                        </div>
                                     </>
                                  )}
                               </button>

                               {isOpen && (
                                 <div 
                                    ref={dropdownRef} 
                                    onClick={(e) => e.stopPropagation()}
                                    className={`absolute left-1/2 -translate-x-1/2 z-[110] w-[400px] md:w-[450px] glass-card hud-border bg-slate-950 shadow-[0_50px_100px_rgba(0,0,0,0.9)] animate-dropdown-reveal border-white/10
                                       ${isBottomHalf ? 'bottom-full mb-6 origin-bottom' : 'top-full mt-6 origin-top'}`}
                                 >
                                    <div className="p-5 border-b border-white/5 bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent flex items-center justify-between">
                                       <div>
                                          <p className="text-[11px] font-black text-white uppercase tracking-[0.2em] italic mb-1">Position: {slot.id}</p>
                                          <div className="flex gap-2 items-center text-[7px] text-slate-500 font-black uppercase tracking-widest">
                                             <span>Available: <span className="text-yellow-500">{filteredTeam.length}</span></span>
                                          </div>
                                       </div>
                                       <button onClick={(e) => { e.stopPropagation(); setShowAllPlayers(!showAllPlayers); }} className={`text-[8px] font-black uppercase px-3 py-2 border rounded-sm transition-all ${showAllPlayers ? 'bg-yellow-500 text-slate-950 border-yellow-500' : 'text-slate-500 border-white/10 hover:border-white/30'}`}>
                                           {showAllPlayers ? 'Show All' : 'Filter Roles'}
                                        </button>
                                     </div>
                                     <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-3 space-y-2 relative bg-[#050505]/80">
                                        <button onClick={() => updatePosition(slot.id, '')} className="w-full text-left p-4 hover:bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center border border-red-500/20 rounded-lg group/withdraw">
                                           <FaTimes className="mr-3 group-hover/withdraw:rotate-90 transition-transform" /> REMOVE PLAYER
                                        </button>
                                        <div className="h-[1px] bg-white/5 my-3" />
                                        {filteredTeam.map((p, idx) => {
                                           const isUnavailable = p.status !== 'available';
                                           return (
                                              <button 
                                                 key={idx} 
                                                 onClick={() => !isUnavailable && updatePosition(slot.id, p.name)} 
                                                 className={`w-full text-left p-4 flex items-center gap-4 border rounded-lg transition-all group relative overflow-hidden
                                                    ${isUnavailable ? 'border-red-500/20 bg-red-500/5 cursor-not-allowed opacity-60' : 'border-white/5 hover:border-yellow-500/40 hover:bg-white/[0.05]'}`}
                                              >
                                                 {isUnavailable && (
                                                    <div className="absolute top-0 right-0 px-3 py-1 bg-red-600 text-[7px] font-black text-white uppercase tracking-widest">
                                                       {p.status}
                                                    </div>
                                                 )}
                                                 <div className={`w-12 h-12 rounded bg-slate-900 border overflow-hidden relative ${isUnavailable ? 'border-red-500/30' : 'border-white/10'}`}>
                                                    {p.image ? <img src={`/avatars/${p.image}`} className={`w-full h-full object-cover ${isUnavailable ? 'grayscale' : ''}`} /> : <FaUserAlt className="absolute inset-0 m-auto text-slate-700" />}
                                                 </div>
                                                 <div className="flex-1">
                                                    <p className={`text-[11px] font-black uppercase ${isUnavailable ? 'text-red-500/50' : 'text-white group-hover:text-yellow-500'} transition-colors`}>{p.name}</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                                       <FaCubes className="text-[6px]" /> {p.role}
                                                    </p>
                                                 </div>
                                              </button>
                                           );
                                        })}
                                     </div>
                                 </div>
                              )}
                           </div>
                        );
                     })}

                      <div className="absolute top-8 right-8 z-40 animate-slide-left group/oracle">
                        <div className="glass-card hud-border bg-slate-950/90 px-8 py-5 backdrop-blur-2xl relative border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-700">
                           <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-500/30" />
                           <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-500/30" />
                           
                           <div className="flex flex-col gap-4">
                              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                 <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Formation Monitor</p>
                                 </div>
                                 <span className="text-[7px] text-slate-800 font-mono">STABLE</span>
                              </div>
                              
                              <div className="space-y-1">
                                 <h4 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none group-hover:text-yellow-500 transition-colors">
                                    {getFormationType(match.homeLineup || []).split(' ')[0]}
                                 </h4>
                                 <p className="text-[9px] font-black text-yellow-500/80 uppercase tracking-widest italic">{getFormationType(match.homeLineup || []).split(' ').slice(1).join(' ')}</p>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                 {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
                                    <div key={i} className={`h-1 flex-1 ${i <= (match.homeLineup?.length || 0) * 1.7 ? 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-slate-900'}`} />
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  {inspectingPlayer && (
                     <div className="glass-card hud-border p-10 bg-slate-950/80 backdrop-blur-xl border-yellow-500/30 animate-fade-in relative">
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-500/40" />
                        <div className="flex justify-between items-center mb-10">
                           <span className="text-[9px] text-yellow-500 font-black uppercase tracking-[0.2em]">Player Details</span>
                           <button onClick={() => setInspectingPlayer(null)} className="text-slate-500 hover:text-white transition-colors"><FaTimes /></button>
                        </div>
                        <div className="flex gap-8 mb-10">
                           <div className="w-24 h-24 glass-card border-yellow-500/40 overflow-hidden relative shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                              {inspectingPlayer.image ? <img src={`/avatars/${inspectingPlayer.image}`} className="w-full h-full object-cover" /> : <FaRunning className="m-auto mt-4 text-4xl text-yellow-500" />}
                           </div>
                           <div>
                              <h3 className="text-3xl font-black text-white uppercase italic truncate max-w-[180px] tracking-tighter leading-none mb-2">{inspectingPlayer.name}</h3>
                              <div className="flex flex-col gap-1">
                                 <span className="text-yellow-500 font-black text-[9px] uppercase tracking-[0.2em]">{inspectingPlayer.slot} // {inspectingPlayer.role}</span>
                                 <span className="text-slate-600 font-mono text-[7px] uppercase tracking-widest">STATUS: ACTIVE</span>
                              </div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <button onClick={() => { updatePosition(inspectingPlayer.slot, ''); setInspectingPlayer(null); }} className="py-4 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 transition-colors">Withdraw</button>
                           <button onClick={() => { setInspectingPlayer(null); setActiveSlot(inspectingPlayer.slot); }} className="py-4 bg-yellow-500 text-slate-950 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white transition-colors">Reassign</button>
                        </div>
                     </div>
                  )}

                   <section className="glass-card hud-border p-10 bg-slate-950/40 relative">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5" />
                      <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.2em] mb-10 pb-6 border-b border-white/5 flex items-center gap-3 italic">
                         <FaRunning className="text-sm" /> Match Readiness
                      </h3>
                      <div className="space-y-8">
                         <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Squad Size</span>
                            <span className="text-white font-mono font-black text-2xl tracking-tighter">{match.homeLineup?.length || 0} <span className="text-slate-700">/ 07</span></span>
                         </div>
                         <div className="h-[2px] bg-slate-900 rounded-full relative overflow-hidden border border-white/5 shadow-inner">
                            <div 
                               className="absolute inset-y-0 left-0 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.8)] transition-all duration-1000 ease-out" 
                               style={{ width: `${(match.homeLineup?.length || 0) / 7 * 100}%` }} 
                            />
                         </div>
                         <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-[0.2em]">
                            <span className={match.homeLineup?.length === 7 ? 'text-green-500' : 'text-slate-700'}>{match.homeLineup?.length === 7 ? 'FULL SQUAD' : 'INCOMPLETE LINEUP'}</span>
                            <span className="text-slate-800">Match Status: Pending</span>
                         </div>
                      </div>
                   </section>
 
                    <section className="glass-card hud-border p-10 bg-slate-950/40 relative">
                       <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5" />
                       <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-10 pb-6 border-b border-white/5 flex items-center gap-3 italic">
                          <FaUsers className="text-yellow-500/50" /> Reserves // Bench
                       </h3>
                       <div className="grid grid-cols-1 gap-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                          {bench.length > 0 ? bench.map((p, i) => (
                             <div key={i} className="flex items-center gap-6 p-4 glass-card border-white/5 bg-slate-900/40 hover:border-yellow-500/20 transition-all group/bench relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover/bench:border-yellow-500/40" />
                                <div className="w-12 h-12 glass-card border-white/10 overflow-hidden shrink-0">
                                   {p.image ? <img src={`/avatars/${p.image}`} className="w-full h-full object-cover grayscale group-hover/bench:grayscale-0 transition-all" /> : <FaUserAlt className="m-auto mt-3 text-2xl text-slate-800" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="text-[11px] font-black text-white uppercase truncate tracking-tighter group-hover/bench:text-yellow-500 transition-colors">{p.name}</p>
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'available' ? 'bg-green-500' : 'bg-red-500'} animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]`} />
                                      <span className="text-[7px] text-slate-600 font-mono tracking-widest uppercase">{p.role} // {p.status.toUpperCase()}</span>
                                   </div>
                                </div>
                             </div>
                          )) : (
                             <div className="py-10 text-center border border-dashed border-white/5 rounded-lg">
                                <p className="text-[8px] text-slate-700 font-black uppercase tracking-[0.2em]">No Reserves Available</p>
                             </div>
                          )}
                       </div>
                    </section>

                   <section className="glass-card hud-border p-10 bg-slate-950/40 relative">
                       <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/5" />
                      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-10 pb-6 border-b border-white/5 flex items-center gap-3">
                         <FaMicrochip className="text-yellow-500/50" /> Match Briefing
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                         {[
                            { icon: FaLandmark, val: match.venue, label: 'Venue' },
                            { icon: FaClock, val: match.time, label: 'Kick-off' },
                            { icon: FaCloudSun, val: match.weather || 'STABLE', label: 'Weather' },
                            { icon: FaTv, val: 'ACTIVE', label: 'Data Link' }
                         ].map((it, i) => (
                            <div key={i} className="p-6 glass-card border-white/5 bg-slate-900/40 hover:border-yellow-500/20 transition-all group/it relative overflow-hidden">
                               <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover/it:border-yellow-500/40" />
                               <it.icon className="text-slate-700 text-[12px] mb-4 group-hover/it:text-yellow-500 transition-colors" />
                               <p className="text-[7px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">{it.label}</p>
                               <p className="text-[10px] text-white font-black uppercase truncate italic tracking-widest">{it.val}</p>
                            </div>
                         ))}
                      </div>
                   </section>
                </div>
             </div>
          </div>
       </div>
    );
}
