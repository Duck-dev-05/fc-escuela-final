'use client'

import Link from 'next/link'
import { Match } from '@/types/match'
import { motion } from 'framer-motion'
import {
  FaTrophy,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUserTie,
  FaFutbol,
  FaInfoCircle,
  FaUsers,
  FaTv,
  FaCloudSun,
} from 'react-icons/fa'
import SquadFormation from './SquadFormation'

interface MatchDetailsProps {
  match: Match
}

function parseScore(score: string | null | undefined): [string, string] | null {
  if (!score || !score.trim()) return null
  const parts = score.split(/[-–—]/).map((p) => p.trim())
  if (parts.length >= 2) return [parts[0], parts[1]]
  return null
}

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase() || 'FC'
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05 },
  }),
}

function statusStyles(status: string) {
  const s = status.toLowerCase()
  if (s === 'finished')
    return {
      pill: 'border-white/10 bg-white/5 text-slate-400',
      bar: 'from-white/10 to-white/5',
    }
  if (s === 'cancelled')
    return {
      pill: 'border-red-950 bg-red-950/20 text-red-400',
      bar: 'from-red-800 to-red-900',
    }
  return {
    pill: 'border-red-500/30 bg-red-500/10 text-red-400',
    bar: 'from-red-600 to-red-500',
  }
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const matchDate = new Date(match.date)
  const status = match.status || 'Scheduled'
  const scoreParts = parseScore(match.score ?? null)
  const tone = statusStyles(status)

  const metaRows: {
    label: string
    val: string
    icon: typeof FaCalendarAlt
    sub?: string
  }[] = [
    {
      label: 'Date',
      val: matchDate.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }),
      icon: FaCalendarAlt,
    },
    {
      label: 'Kickoff',
      val: match.time,
      icon: FaClock,
      sub: 'Local time',
    },
    {
      label: 'Venue',
      val: match.venue,
      icon: FaMapMarkerAlt,
    },
    {
      label: 'Referee',
      val: match.referee || 'To be confirmed',
      icon: FaUserTie,
    },
  ]

  if (match.weather) {
    metaRows.push({
      label: 'Conditions',
      val: match.weather,
      icon: FaCloudSun,
    })
  }

  if (match.tvBroadcast) {
    metaRows.push({
      label: 'Broadcast',
      val: match.tvBroadcast,
      icon: FaTv,
    })
  }

  const capacityPct =
    match.stadiumCapacity && match.stadiumCapacity > 0
      ? Math.min(100, Math.round(((match.attendance || 0) / match.stadiumCapacity) * 100))
      : null

  return (
    <div className="space-y-10 md:space-y-14">
      {/* Scoreboard */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0e] shadow-2xl"
      >
        <div className={`h-1.5 bg-gradient-to-r ${tone.bar}`} aria-hidden />

        <div className="border-b border-white/5 px-5 py-5 sm:px-8 sm:py-6 bg-white/[0.01]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/10 text-red-500 border border-red-500/20 shadow-sm">
                <FaTrophy className="text-lg" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Fixture detail
                </p>
                <p className="font-display mt-0.5 text-xl font-bold text-white uppercase tracking-wider">{match.competition}</p>
              </div>
            </div>
            <span
              className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-wider ${tone.pill}`}
            >
              {status}
            </span>
          </div>
        </div>

        <div className="relative px-5 py-10 sm:px-8 sm:py-12 md:px-10 md:py-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(239,68,68,0.06),transparent)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
            {/* Home */}
            <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Home</span>
              <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row-reverse lg:items-center lg:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-black text-white ring-2 ring-white/5 shadow-sm sm:h-20 sm:w-20 sm:text-xl">
                  {teamInitials(match.homeTeam)}
                </div>
                <h2 className="font-display max-w-[16rem] text-3xl uppercase leading-tight tracking-wider text-white sm:text-4xl md:text-5xl lg:max-w-none">
                  {match.homeTeam}
                </h2>
              </div>
            </div>

            {/* Score / time */}
            <div className="flex justify-center lg:px-4">
              {scoreParts ? (
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-5 shadow-inner sm:gap-5 sm:px-8 sm:py-6">
                  <span className="scoreboard-number text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                    {scoreParts[0]}
                  </span>
                  <span className="text-xl font-light text-slate-600 sm:text-2xl">:</span>
                  <span className="scoreboard-number text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                    {scoreParts[1]}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                  <div className="flex items-center gap-2 text-red-400">
                    <FaClock className="text-sm" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Kickoff</span>
                  </div>
                  <p className="scoreboard-number mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {match.time}
                  </p>
                  <p className="mt-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Local time</p>
                </div>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Away</span>
              <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#141414] text-lg font-black text-slate-300 shadow-sm sm:h-20 sm:w-20 sm:text-xl">
                  {teamInitials(match.awayTeam)}
                </div>
                <h2 className="font-display max-w-[16rem] text-3xl uppercase leading-tight tracking-wider text-white sm:text-4xl md:text-5xl lg:max-w-none">
                  {match.awayTeam}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Meta tiles */}
        <div className="border-t border-white/5 bg-[#141414]/40 px-5 py-6 sm:px-8 md:px-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {metaRows.map((row, idx) => (
              <motion.div
                key={`${row.label}-${idx}`}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                  <row.icon className="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-200">{row.val}</p>
                  {row.sub && <p className="mt-0.5 text-xs text-slate-400">{row.sub}</p>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <SquadFormation match={match} />

      {/* Report + sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-5 lg:col-span-8">
          <div className="flex flex-col gap-1 border-b border-white/5 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Report</p>
              <h3 className="font-display text-3xl uppercase tracking-wide text-white">
                Match summary
              </h3>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-white/10 bg-[#0e0e0e] p-6 shadow-sm md:p-8"
          >
            <p className="text-sm leading-relaxed text-slate-300">
              {match.description ||
                'Coaching staff can add tactics, key moments, and development notes here when available.'}
            </p>

            {match.notes ? (
              <div className="mt-6 rounded-2xl border border-white/5 bg-[#141414]/60 p-4 md:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Staff notes</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{match.notes}</p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 border-l-4 border-l-red-500 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-red-400">
                  <FaFutbol />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Goal scorers</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-200">
                  {match.goalScorers || 'Not recorded'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 border-l-4 border-l-rose-500 bg-white/[0.02] p-5">
                <div className="flex items-center gap-2 text-rose-400">
                  <FaInfoCircle />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Discipline</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-200">
                  {match.cards || 'None recorded'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="border-b border-white/5 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Highlights</p>
            <h3 className="font-display mt-1 text-3xl uppercase tracking-wide text-white">Awards & crowd</h3>
          </div>

          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e0e] p-6 text-center shadow-sm md:p-7"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Player of the match</p>
            <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-md shadow-red-950/20">
              <FaTrophy className="text-xl" />
            </div>
            <p className="font-display mt-5 text-2xl uppercase tracking-wider text-white">
              {match.manOfTheMatch || 'TBD'}
            </p>
            <p className="mt-2 text-[10px] text-slate-500 uppercase tracking-wide">Selected after the final whistle when recorded.</p>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-3xl border border-white/10 bg-[#0e0e0e] p-6 shadow-sm md:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
                  <FaUsers className="text-base" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Attendance</p>
                  <p className="scoreboard-number text-2xl font-bold text-white md:text-3xl">
                    {match.attendance != null ? match.attendance.toLocaleString() : '—'}
                  </p>
                </div>
              </div>
            </div>

            {capacityPct !== null ? (
              <>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all"
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  {capacityPct}% of stadium capacity ({match.stadiumCapacity!.toLocaleString()} seats)
                </p>
              </>
            ) : (
              <p className="mt-4 text-xs text-slate-500">Stadium capacity is not set for this fixture.</p>
            )}
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
