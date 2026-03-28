'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { 
  FaTrophy, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUsers, FaUser, FaShieldAlt, FaTv, FaCloud,
  FaCheckCircle, FaExclamationTriangle, FaStar, FaChevronLeft, FaTicketAlt
} from 'react-icons/fa'

interface MatchDetailsProps {
  match: Match
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 animate-slide-up">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/matches" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors group">
           <div className="w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center group-hover:border-yellow-500/50 transition-all">
              <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
           </div>
           Return to Fixtures
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
           <span className="text-[9px] uppercase tracking-[0.2em] text-yellow-500 font-bold italic">Live Telemetry Active</span>
        </div>
      </div>

      {/* Main Broadcast Scoreboard */}
      <div className="glass-card hud-border p-8 md:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[9px] text-slate-700 font-mono">
           HUD_OS_v2.4
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-10">
             <FaTrophy className="text-yellow-500 text-xl" />
             <h1 className="text-2xl font-black text-white uppercase tracking-widest">{match.competition}</h1>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 relative">
             {/* Home Team */}
             <div className="flex-1 text-center md:text-right">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{match.homeTeam}</h2>
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.4em]">Home Territory</p>
             </div>

             {/* Score / VS */}
             <div className="shrink-0 flex flex-col items-center justify-center min-w-[200px]">
                {match.score ? (
                   <div className="text-7xl font-black text-white font-mono tracking-tighter bg-black/40 px-10 py-6 rounded-2xl hud-border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                      {match.score}
                   </div>
                ) : (
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="text-2xl font-black text-slate-700 uppercase tracking-[0.5em] italic">VS</span>
                      <div className="w-16 h-1 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                   </div>
                )}
                <div className="mt-6 flex flex-col items-center gap-1">
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{match.time} HRS</span>
                   <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{formattedDate}</span>
                </div>
             </div>

             {/* Away Team */}
             <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{match.awayTeam}</h2>
                <p className="text-[10px] text-yellow-500 font-bold uppercase tracking-[0.4em]">Incursion Unit</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tactical Lineups HUD */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card hud-border p-8 bg-white/[0.02]">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
               <div className="flex items-center gap-3">
                  <FaUsers className="text-yellow-500 text-lg" />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Tactical Deployment</h3>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded bg-yellow-500/20" />
                  <div className="w-2 h-2 rounded bg-yellow-500/50" />
                  <div className="w-2 h-2 rounded bg-yellow-500" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden">
               {/* Team Center Line */}
               <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-white/5 -translate-x-1/2" />
               
               {/* Home Lineup */}
               <div className="space-y-6">
                  <h4 className="text-[10px] text-center font-black text-yellow-500 uppercase tracking-[0.4em] mb-8 bg-yellow-500/5 py-2 rounded border border-yellow-500/10">{match.homeTeam}</h4>
                  <div className="space-y-3">
                    {match.homeLineup?.length ? (
                       match.homeLineup.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 glass-card border-white/5 hover:bg-white/5 transition-all group">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-600 group-hover:text-yellow-500">{(i+1).toString().padStart(2, '0')}</span>
                                <span className="text-xs text-white font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">{p.name}</span>
                             </div>
                             <span className="text-[9px] font-black text-slate-500 px-2 py-0.5 border border-white/10 rounded">{p.position}</span>
                          </div>
                       ))
                    ) : (
                       <p className="text-center text-[10px] text-slate-600 uppercase font-black tracking-widest py-10">Lineup Pending...</p>
                    )}
                  </div>
               </div>

               {/* Away Lineup */}
               <div className="space-y-6">
                  <h4 className="text-[10px] text-center font-black text-slate-400 uppercase tracking-[0.4em] mb-8 bg-white/5 py-2 rounded border border-white/5">{match.awayTeam}</h4>
                  <div className="space-y-3">
                    {match.awayLineup?.length ? (
                       match.awayLineup.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 glass-card border-white/5 hover:bg-white/5 transition-all group">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-600">{(i+1).toString().padStart(2, '0')}</span>
                                <span className="text-xs text-white font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">{p.name}</span>
                             </div>
                             <span className="text-[9px] font-black text-slate-500 px-2 py-0.5 border border-white/10 rounded">{p.position}</span>
                          </div>
                       ))
                    ) : (
                       <p className="text-center text-[10px] text-slate-600 uppercase font-black tracking-widest py-10">Lineup Pending...</p>
                    )}
                  </div>
               </div>
            </div>
          </section>

          {/* Goal Scorers / Events HUD */}
          {match.goalScorers && (
             <section className="glass-card hud-border p-8 bg-white/[0.02]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                   <FaCheckCircle className="text-green-500 text-xs" />
                   Performance Events
                </h3>
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                   <p className="text-xs text-white font-bold tracking-widest uppercase leading-loose">{match.goalScorers}</p>
                </div>
             </section>
          )}
        </div>

        {/* Sidebar HUD Metrics */}
        <div className="space-y-8">
           <section className="glass-card hud-border p-6 bg-white/[0.02]">
              <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-6">Environment & Logistics</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Primary Venue', value: match.venue, icon: FaMapMarkerAlt },
                   { label: 'Stadium Cap', value: match.stadiumCapacity?.toLocaleString(), icon: FaUsers },
                   { label: 'Live Attendance', value: match.attendance?.toLocaleString(), icon: FaUsers, accent: true },
                   { label: 'Atmosphere', value: match.weather, icon: FaCloud },
                   { label: 'Broadcast Unit', value: match.tvBroadcast, icon: FaTv },
                   { label: 'Lead Official', value: match.referee, icon: FaUser },
                 ].map((metric, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                       <div className="w-8 h-8 glass-card border-white/5 flex items-center justify-center shrink-0">
                          <metric.icon className="text-slate-500 text-xs" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{metric.label}</p>
                          <p className={`text-xs font-black uppercase tracking-widest truncate ${metric.accent ? 'text-yellow-500' : 'text-slate-300'}`}>
                             {metric.value || 'N/A'}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="glass-card hud-border p-6 bg-yellow-500/5">
              <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <FaStar className="text-[10px]" />
                 Vanguard Report
              </h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Man of the Match</p>
                    <div className="p-3 glass-card border-yellow-500/20 bg-yellow-500/5 text-xs text-white font-black uppercase tracking-[0.2em]">
                       {match.manOfTheMatch || 'Decision Pending'}
                    </div>
                 </div>
                 {match.cards && (
                    <div>
                       <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1.5">Disciplinary Incidents</p>
                       <div className="p-3 glass-card border-red-500/20 bg-red-500/5 text-xs text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <FaExclamationTriangle className="text-[10px]" />
                          {match.cards}
                       </div>
                    </div>
                 )}
              </div>
           </section>

           <div className="flex flex-col gap-4">
              <Link href={`/ticketing?match=${match.id}`} className="btn-primary w-full h-14 flex items-center justify-center gap-3">
                 <FaTicketAlt className="text-sm" />
                 Allocate Access Pass
              </Link>
           </div>
        </div>
      </div>
    </div>
  )
}