'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { FaChevronRight, FaTrophy, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

interface MatchCardProps {
  match: Match
}

export default function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const statusColors = {
    'Cancelled': 'text-red-500 border-red-500/20 bg-red-500/5',
    'Finished': 'text-green-500 border-green-500/20 bg-green-500/5',
    'Scheduled': 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
    'Ongoing': 'text-blue-500 border-blue-500/20 bg-blue-500/5 animate-pulse',
    'Postponed': 'text-amber-600 border-amber-600/20 bg-amber-600/5',
  }

  return (
    <div className="glass-card hud-border p-8 group hover:bg-white transition-all duration-500 relative overflow-hidden animate-slide-up border-slate-200 bg-white/70 shadow-sm">
      {/* HUD Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col space-y-8">
        {/* Header: Competition & Status */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <FaTrophy className="text-yellow-600/50 text-xs" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {match.competition}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${statusColors[match.status as keyof typeof statusColors] || statusColors.Scheduled}`}>
            {match.status}
          </div>
        </div>

        {/* Core: Teams & Score */}
        <div className="flex justify-between items-center px-2">
          <div className="text-center flex-1">
            <p className="font-black text-2xl text-slate-900 uppercase tracking-tighter group-hover:text-yellow-600 transition-colors leading-tight">
               {match.homeTeam}
            </p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Home Unit</p>
          </div>
          
          <div className="flex flex-col items-center px-6 gap-2 shrink-0">
             {match.score ? (
                <div className="text-4xl font-black text-slate-900 font-mono tracking-tighter bg-slate-100 px-4 py-2 rounded-xl hud-border border-slate-200">
                   {match.score}
                </div>
             ) : (
                <div className="text-xs font-black text-slate-300 uppercase tracking-widest italic pt-2">vs</div>
             )}
          </div>

          <div className="text-center flex-1">
            <p className="font-black text-2xl text-slate-900 uppercase tracking-tighter group-hover:text-yellow-600 transition-colors leading-tight">
               {match.awayTeam}
            </p>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Away Unit</p>
          </div>
        </div>

        {/* Footer: Meta & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-100 gap-6">
          <div className="flex flex-wrap justify-center sm:justify-start gap-6">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-yellow-600/50 text-[10px]" />
              <div className="flex flex-col">
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Kickoff</span>
                 <span className="text-[10px] text-slate-900 font-bold uppercase tracking-widest">{formattedDate} // {match.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-600/50 text-[10px]" />
              <div className="flex flex-col">
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Venue</span>
                 <span className="text-[10px] text-slate-900 font-bold uppercase tracking-widest truncate max-w-[120px]">{match.venue}</span>
              </div>
            </div>
          </div>

          <Link
            href={`/matches/${match.id}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 glass-card hud-border text-slate-900 border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-950 transition-all group scale-100 hover:scale-105 active:scale-95 shadow-sm bg-white/50"
          >
            Telemetry 
            <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
      
      {/* Decorative Corner */}
      <div className="absolute -bottom-[1px] -right-[1px] w-8 h-8 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-0 w-[150%] h-[150%] bg-yellow-500/[0.03] -rotate-45 translate-x-1/2 translate-y-1/2" />
      </div>
    </div>
  )
}