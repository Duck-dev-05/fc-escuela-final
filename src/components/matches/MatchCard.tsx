'use client'

import { Match } from '@/types/match'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowRight, FaTrophy, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa'

interface MatchCardProps {
  match: Match
}

const statusStyles: Record<string, string> = {
  Cancelled: 'border-red-200 bg-red-50 text-red-800',
  Finished: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  Scheduled: 'border-amber-200 bg-amber-50 text-amber-900',
}

export default function MatchCard({ match }: MatchCardProps) {
  const matchDate = new Date(match.date)
  const formattedDate = matchDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })

  const statusKey = match.status || 'Scheduled'
  const statusClass =
    statusStyles[statusKey] || 'border-slate-200 bg-slate-50 text-slate-700'

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md md:p-6"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FaTrophy className="text-sm" />
          </div>
          <span className="truncate text-xs font-semibold uppercase tracking-wider text-slate-600">
            {match.competition}
          </span>
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClass}`}
        >
          {statusKey}
        </span>
      </div>

      <div className="relative flex flex-1 items-center justify-between gap-2 py-6">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-black uppercase tracking-widest text-slate-100">vs</span>
        </div>
        <div className="relative z-10 flex-1 text-center">
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900 md:text-lg">
            {match.homeTeam}
          </h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Home</p>
        </div>
        <div className="relative z-10 flex shrink-0 flex-col items-center px-2">
          {match.score ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 font-mono text-xl font-black tracking-tight text-slate-900">
              {match.score}
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
              vs
            </div>
          )}
        </div>
        <div className="relative z-10 flex-1 text-center">
          <h3 className="text-base font-black uppercase tracking-tight text-slate-900 md:text-lg">
            {match.awayTeam}
          </h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">Away</p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-4 text-slate-600">
          <div className="flex items-center gap-2 text-xs font-medium">
            <FaCalendarAlt className="shrink-0 text-amber-600" />
            {formattedDate}
          </div>
          <div className="flex min-w-0 max-w-[160px] items-center gap-2 text-xs font-medium">
            <FaMapMarkerAlt className="shrink-0 text-amber-600" />
            <span className="truncate">{match.venue}</span>
          </div>
        </div>
        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-slate-900 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950 sm:self-auto"
        >
          Details
          <FaArrowRight className="text-[9px]" />
        </Link>
      </div>
    </motion.article>
  )
}
