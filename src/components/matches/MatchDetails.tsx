'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { 
  FaTrophy, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUsers, FaUser, FaShieldAlt, FaTv, FaCloud,
  FaCheckCircle, FaExclamationTriangle, FaStar, FaChevronLeft, FaTicketAlt,
  FaMicrochip, FaChartLine, FaBrain
} from 'react-icons/fa'
import { useSession } from 'next-auth/react'

interface MatchDetailsProps {
  match: Match
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const { data: session } = useSession()
  const isCoach = (session?.user as any)?.roles === 'coach'

  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Parse tactical notes if available for coach
  let tacticalNotes = null
  if (isCoach && match.notes) {
    try {
      tacticalNotes = JSON.parse(match.notes)
    } catch (e) {
      tacticalNotes = { summary: match.notes }
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 pb-20 animate-slide-up">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link href="/matches" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-yellow-600 transition-colors group">
           <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white/50 flex items-center justify-center group-hover:border-yellow-500/50 transition-all shadow-sm">
              <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
           </div>
           Return to Fixtures
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
           <span className="text-[9px] uppercase tracking-[0.2em] text-yellow-600 font-bold italic">Live Telemetry Active</span>
        </div>
      </div>

      {/* Main Broadcast Scoreboard */}
      <div className="glass-card hud-border p-8 md:p-12 relative overflow-hidden bg-white/80 border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.03)]">
        <div className="absolute top-0 right-0 p-4 border-l border-b border-slate-100 text-[9px] text-slate-300 font-mono italic">
           HUD_OS_v2.4
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-10">
             <FaTrophy className="text-yellow-600 text-xl" />
             <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest">{match.competition}</h1>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 relative">
             {/* Home Team */}
             <div className="flex-1 text-center md:text-right">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">{match.homeTeam}</h2>
                <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-[0.4em]">Home Territory</p>
             </div>

             {/* Score / VS */}
             <div className="shrink-0 flex flex-col items-center justify-center min-w-[200px]">
                {match.score ? (
                   <div className="text-7xl font-black text-slate-900 font-mono tracking-tighter bg-slate-100 px-10 py-6 rounded-2xl hud-border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                      {match.score}
                   </div>
                ) : (
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                      <span className="text-2xl font-black text-slate-200 uppercase tracking-[0.5em] italic">VS</span>
                      <div className="w-16 h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                   </div>
                )}
                <div className="mt-6 flex flex-col items-center gap-1">
                   <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{match.time} HRS</span>
                   <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{formattedDate}</span>
                </div>
             </div>

             {/* Away Team */}
             <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">{match.awayTeam}</h2>
                <p className="text-[10px] text-yellow-600 font-bold uppercase tracking-[0.4em]">Incursion Unit</p>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Tactical Lineups HUD */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-card hud-border p-8 bg-white/70 border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <FaUsers className="text-yellow-600 text-lg" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tactical Deployment</h3>
               </div>
               <div className="flex gap-2">
                  <div className="w-2 h-2 rounded bg-yellow-600/10" />
                  <div className="w-2 h-2 rounded bg-yellow-600/30" />
                  <div className="w-2 h-2 rounded bg-yellow-600" />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative overflow-hidden">
               {/* Team Center Line */}
               <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-[1px] bg-slate-100 -translate-x-1/2" />
               
               {/* Home Lineup */}
               <div className="space-y-6">
                  <h4 className="text-[10px] text-center font-black text-yellow-600 uppercase tracking-[0.4em] mb-8 bg-yellow-500/5 py-2 rounded border border-yellow-500/10">{match.homeTeam}</h4>
                  <div className="space-y-3">
                    {match.homeLineup?.length ? (
                       match.homeLineup.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 glass-card border-slate-100 hover:bg-slate-50 transition-all group bg-white/50">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-300 group-hover:text-yellow-600">{(i+1).toString().padStart(2, '0')}</span>
                                <span className="text-xs text-slate-900 font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">{p.name}</span>
                             </div>
                             <span className="text-[9px] font-black text-slate-400 px-2 py-0.5 border border-slate-100 rounded">{p.position}</span>
                          </div>
                       ))
                    ) : (
                       <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest py-10">Lineup Pending...</p>
                    )}
                  </div>
               </div>

               {/* Away Lineup */}
               <div className="space-y-6">
                  <h4 className="text-[10px] text-center font-black text-slate-400 uppercase tracking-[0.4em] mb-8 bg-slate-50 py-2 rounded border border-slate-100">{match.awayTeam}</h4>
                  <div className="space-y-3">
                    {match.awayLineup?.length ? (
                       match.awayLineup.map((p, i) => (
                          <div key={i} className="flex items-center justify-between p-3 glass-card border-slate-100 hover:bg-slate-50 transition-all group bg-white/50">
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-slate-300">{(i+1).toString().padStart(2, '0')}</span>
                                <span className="text-xs text-slate-900 font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform">{p.name}</span>
                             </div>
                             <span className="text-[9px] font-black text-slate-400 px-2 py-0.5 border border-slate-100 rounded">{p.position}</span>
                          </div>
                       ))
                    ) : (
                       <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-widest py-10">Lineup Pending...</p>
                    )}
                  </div>
               </div>
            </div>
          </section>

          {/* Goal Scorers / Events HUD */}
          {match.goalScorers && (
             <section className="glass-card hud-border p-8 bg-white/70 border-slate-200 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                   <FaCheckCircle className="text-green-500 text-xs" />
                   Performance Events
                </h3>
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-xl">
                   <p className="text-xs text-slate-900 font-bold tracking-widest uppercase leading-loose italic">{match.goalScorers}</p>
                </div>
             </section>
          )}

          {/* COACHING_INTELLIGENCE_ONLY (Role-Protected) */}
          {isCoach && tacticalNotes && (
             <section className="glass-card hud-border p-8 bg-slate-900 border-yellow-500/30 shadow-[0_20px_60px_rgba(234,179,8,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 text-[8px] text-yellow-500/30 font-mono tracking-tighter">
                   SECURE_COACH_VANGUARD_FEED
                </div>
                
                <h3 className="text-sm font-black text-yellow-500 uppercase tracking-widest mb-8 flex items-center gap-3">
                   <FaBrain className="text-yellow-500 animate-pulse" />
                   Tactical Intelligence Feed
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Tactical Score</p>
                      <div className="flex items-end gap-2 text-3xl font-black text-white font-mono">
                         {tacticalNotes.tactical_score || 'N/A'}<span className="text-xs text-slate-600 mb-1">/100</span>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Possession Unit</p>
                      <div className="flex items-end gap-2 text-3xl font-black text-white font-mono">
                         {tacticalNotes.possession || 'N/A'}<span className="text-xs text-slate-600 mb-1">%</span>
                      </div>
                   </div>
                   <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Payload On Target</p>
                      <div className="flex items-end gap-2 text-3xl font-black text-white font-mono">
                         {tacticalNotes.shots_on_target || 'N/A'}<span className="text-xs text-slate-600 mb-1">SNT</span>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-yellow-500/5 border border-yellow-500/10 rounded-xl">
                   <h4 className="text-[10px] text-yellow-500 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FaChartLine />
                      Strategic Summary
                   </h4>
                   <p className="text-sm text-slate-300 font-medium leading-relaxed italic">
                      "{tacticalNotes.coach_summary || 'No detailed analysis available for this fixture.'}"
                   </p>
                </div>
             </section>
          )}
        </div>

        {/* Sidebar HUD Metrics */}
        <div className="space-y-8">
           <section className="glass-card hud-border p-6 bg-white/70 border-slate-200">
              <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-6">Environment & Logistics</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Primary Venue', value: match.venue, icon: FaMapMarkerAlt },
                   { label: 'Stadium Cap', value: match.stadiumCapacity?.toLocaleString(), icon: FaUsers },
                   { label: 'Live Attendance', value: match.attendance?.toLocaleString(), icon: FaUsers, accent: true },
                   { label: 'Atmosphere', value: match.weather, icon: FaCloud },
                   { label: 'Broadcast Unit', value: match.tvBroadcast, icon: FaTv },
                   { label: 'Lead Official', value: match.referee, icon: FaUser },
                 ].map((metric, i) => (
                    <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100 last:border-0">
                       <div className="w-8 h-8 glass-card border-slate-200 bg-white/50 flex items-center justify-center shrink-0">
                          <metric.icon className="text-slate-300 text-xs" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">{metric.label}</p>
                          <p className={`text-xs font-black uppercase tracking-widest truncate ${metric.accent ? 'text-yellow-600' : 'text-slate-900'}`}>
                             {metric.value || 'N/A'}
                          </p>
                       </div>
                    </div>
                 ))}
              </div>
           </section>

           <section className="glass-card hud-border p-6 bg-yellow-500/[0.03] border-yellow-500/10">
              <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                 <FaStar className="text-[10px]" />
                 Vanguard Report
              </h3>
              <div className="space-y-4">
                 <div>
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1.5 font-bold">Man of the Match</p>
                    <div className="p-3 glass-card border-yellow-500/20 bg-white/50 text-xs text-slate-900 font-black uppercase tracking-[0.2em] shadow-sm italic">
                       {match.manOfTheMatch || 'Decision Pending'}
                    </div>
                 </div>
                 {match.cards && (
                    <div>
                       <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1.5 font-bold">Disciplinary Incidents</p>
                       <div className="p-3 glass-card border-red-500/20 bg-red-500/5 text-xs text-red-600 font-bold uppercase tracking-widest flex items-center gap-2 italic">
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