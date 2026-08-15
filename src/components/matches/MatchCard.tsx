'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaCircle } from 'react-icons/fa'

interface MatchCardProps {
  match: Match
}

const statusConfig: Record<string, { bg: string; text: string; border: string; dot?: string }> = {
  Cancelled: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
  },
  Finished: {
    bg: 'bg-white/5',
    text: 'text-slate-500',
    border: 'border-white/10',
  },
  Scheduled: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/25',
    dot: 'text-red-500',
  },
  Live: {
    bg: 'bg-red-500/15',
    text: 'text-red-300',
    border: 'border-red-500/30',
    dot: 'text-red-400',
  },
}

export default function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const statusKey = match.status || 'Scheduled'
  const style = statusConfig[statusKey] || statusConfig.Scheduled

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="match-card flex h-full flex-col p-5 md:p-6 border-l-2 border-l-red-600/40 hover:border-l-red-500 transition-colors"
    >
      {/* Header — competition + status */}
      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500/70">
            <FaTrophy className="text-xs" />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {match.competition}
          </span>
        </div>
        <span className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
          {style.dot && <FaCircle className={`text-[6px] ${style.dot} animate-pulse`} />}
          {statusKey}
        </span>
      </div>

      {/* Teams / Score — scoreboard layout */}
      <div className="flex flex-1 items-center justify-between gap-2 py-5">
        {/* Home */}
        <div className="flex-1 text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Home</p>
          <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide text-white leading-tight">
            {match.homeTeam}
          </h3>
        </div>

        {/* Score or VS */}
        <div className="flex shrink-0 flex-col items-center px-3">
          {match.score ? (
            <div className="rounded-xl border border-white/10 bg-[#141414] px-5 py-2.5">
              <span className="scoreboard-number text-2xl font-bold tracking-tight text-white">
                {match.score}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-600">vs</span>
              <div className="h-px w-8 bg-red-500/20" />
              <span className="scoreboard-number text-[11px] font-bold text-slate-600">{match.time}</span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex-1 text-center">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Away</p>
          <h3 className="font-display text-xl md:text-2xl uppercase tracking-wide text-white leading-tight">
            {match.awayTeam}
          </h3>
        </div>
      </div>

      {/* Footer — date, venue, link */}
      <div className="mt-auto flex flex-col gap-3 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3 text-slate-500">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <FaCalendarAlt className="shrink-0 text-red-500/60 text-[11px]" />
            {formattedDate}
          </div>
          <div className="flex min-w-0 max-w-[160px] items-center gap-1.5 text-xs font-medium">
            <FaMapMarkerAlt className="shrink-0 text-red-500/60 text-[11px]" />
            <span className="truncate">{match.venue}</span>
          </div>
        </div>
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-red-400 transition hover:bg-red-600 hover:border-red-600 hover:text-white sm:self-auto"
        >
          Details
          <FaArrowRight className="text-[9px]" />
        </Link>
      </div>
    </motion.article>
  )
}
