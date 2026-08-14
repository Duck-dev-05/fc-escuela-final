'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaTrophy, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

interface MatchCardProps {
  match: Match
}

const statusStyles: Record<string, { bg: string; text: string; border: string }> = {
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
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
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
  const statusStyle = statusStyles[statusKey] || statusStyles.Scheduled

  return (
    <motion.article
      whileHover={{ y: -3, scale: 1.005 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="flex h-full flex-col rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-sm p-5 transition hover:border-amber-500/20 hover:bg-white/[0.05] md:p-6"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500/70">
            <FaTrophy className="text-xs" />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {match.competition}
          </span>
        </div>
        <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
          {statusKey}
        </span>
      </div>

      {/* Teams */}
      <div className="relative flex flex-1 items-center justify-between gap-2 py-6">
        {/* Ghost "vs" */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-black uppercase tracking-widest text-white/[0.03]">vs</span>
        </div>

        {/* Home */}
        <div className="relative z-10 flex-1 text-center">
          <h3 className="text-base font-black uppercase tracking-tight text-white md:text-lg">
            {match.homeTeam}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Home</p>
        </div>

        {/* Score / VS badge */}
        <div className="relative z-10 flex shrink-0 flex-col items-center px-2">
          {match.score ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 font-mono text-xl font-black tracking-tight text-white">
              {match.score}
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-600">
              vs
            </div>
          )}
        </div>

        {/* Away */}
        <div className="relative z-10 flex-1 text-center">
          <h3 className="text-base font-black uppercase tracking-tight text-white md:text-lg">
            {match.awayTeam}
          </h3>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">Away</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-slate-500">
          <div className="flex items-center gap-1.5 text-xs font-medium">
            <FaCalendarAlt className="shrink-0 text-amber-500/60 text-[11px]" />
            {formattedDate}
          </div>
          <div className="flex min-w-0 max-w-[160px] items-center gap-1.5 text-xs font-medium">
            <FaMapMarkerAlt className="shrink-0 text-amber-500/60 text-[11px]" />
            <span className="truncate">{match.venue}</span>
          </div>
        </div>
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 transition hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950 sm:self-auto"
        >
          Details
          <FaArrowRight className="text-[9px]" />
        </Link>
      </div>
    </motion.article>
  )
}
