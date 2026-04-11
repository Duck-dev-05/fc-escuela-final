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
  FaTicketAlt,
  FaTv,
  FaCloudSun,
  FaArrowRight,
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
      pill: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      bar: 'from-emerald-500 to-emerald-400',
    }
  if (s === 'cancelled')
    return {
      pill: 'border-red-200 bg-red-50 text-red-900',
      bar: 'from-red-500 to-red-400',
    }
  return {
    pill: 'border-amber-200 bg-amber-50 text-amber-900',
    bar: 'from-amber-500 to-amber-400',
  }
}

export default function MatchDetails({ match }: MatchDetailsProps) {
  const matchDate = new Date(match.date)
  const status = match.status || 'Scheduled'
  const scoreParts = parseScore(match.score ?? null)
  const tone = statusStyles(status)
  const isUpcoming = status.toLowerCase() === 'scheduled'

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
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md ring-1 ring-slate-900/5"
      >
        <div className={`h-1.5 bg-gradient-to-r ${tone.bar}`} aria-hidden />

        <div className="border-b border-slate-100 px-5 py-5 sm:px-8 sm:py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-amber-400 shadow-sm">
                <FaTrophy className="text-lg" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Fixture detail
                </p>
                <p className="mt-0.5 text-base font-bold text-slate-900 sm:text-lg">{match.competition}</p>
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
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(245,158,11,0.06),transparent)]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6">
            {/* Home */}
            <div className="flex flex-col items-center text-center lg:items-end lg:text-right">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Home</span>
              <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row-reverse lg:items-center lg:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg font-black text-slate-700 ring-2 ring-white shadow-sm sm:h-20 sm:w-20 sm:text-xl">
                  {teamInitials(match.homeTeam)}
                </div>
                <h2 className="max-w-[16rem] text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:max-w-none">
                  {match.homeTeam}
                </h2>
              </div>
            </div>

            {/* Score / time */}
            <div className="flex justify-center lg:px-4">
              {scoreParts ? (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-5 shadow-inner sm:gap-5 sm:px-8 sm:py-6">
                  <span className="text-4xl font-black tabular-nums text-slate-900 sm:text-5xl md:text-6xl">
                    {scoreParts[0]}
                  </span>
                  <span className="text-xl font-light text-slate-300 sm:text-2xl">:</span>
                  <span className="text-4xl font-black tabular-nums text-slate-900 sm:text-5xl md:text-6xl">
                    {scoreParts[1]}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-50/90 to-white px-8 py-6 text-center shadow-sm sm:px-10 sm:py-8">
                  <div className="flex items-center gap-2 text-amber-700">
                    <FaClock className="text-sm" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Kickoff</span>
                  </div>
                  <p className="mt-2 text-4xl font-black tabular-nums tracking-tight text-slate-900 sm:text-5xl">
                    {match.time}
                  </p>
                  <p className="mt-2 text-xs font-medium text-slate-500">Shown in local time</p>
                </div>
              )}
            </div>

            {/* Away */}
            <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Away</span>
              <div className="mt-4 flex flex-col items-center gap-4 lg:flex-row lg:items-center lg:gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg font-black text-slate-600 shadow-sm sm:h-20 sm:w-20 sm:text-xl">
                  {teamInitials(match.awayTeam)}
                </div>
                <h2 className="max-w-[16rem] text-2xl font-black uppercase leading-tight tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:max-w-none">
                  {match.awayTeam}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Meta tiles */}
        <div className="border-t border-slate-100 bg-slate-50/90 px-5 py-6 sm:px-8 md:px-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {metaRows.map((row, idx) => (
              <motion.div
                key={`${row.label}-${idx}`}
                custom={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700">
                  <row.icon className="text-sm" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{row.label}</p>
                  <p className="mt-1 text-sm font-semibold leading-snug text-slate-900">{row.val}</p>
                  {row.sub && <p className="mt-0.5 text-xs text-slate-400">{row.sub}</p>}
                </div>
              </motion.div>
            ))}
          </div>

          {isUpcoming && (
            <motion.div
              custom={metaRows.length}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="mt-5 flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:px-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                  <FaTicketAlt className="text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Going to the match?</p>
                  <p className="text-xs text-slate-600">Secure seats from the ticketing desk.</p>
                </div>
              </div>
              <Link
                href={`/ticketing?ref=${match.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-center text-xs font-bold uppercase tracking-[0.12em] text-slate-950 transition hover:bg-amber-400"
              >
                Get tickets
                <FaArrowRight className="text-[10px]" />
              </Link>
            </motion.div>
          )}
        </div>
      </motion.section>

      <SquadFormation match={match} />

      {/* Report + sidebar */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="space-y-5 lg:col-span-8">
          <div className="flex flex-col gap-1 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Report</p>
              <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                Match summary
              </h3>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <p className="text-base leading-relaxed text-slate-600">
              {match.description ||
                'Coaching staff can add tactics, key moments, and development notes here when available.'}
            </p>

            {match.notes ? (
              <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 md:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Staff notes</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{match.notes}</p>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 border-l-4 border-l-amber-500 bg-slate-50/50 p-5">
                <div className="flex items-center gap-2 text-amber-800">
                  <FaFutbol />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Goal scorers</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-900">
                  {match.goalScorers || 'Not recorded'}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 border-l-4 border-l-rose-400 bg-slate-50/50 p-5">
                <div className="flex items-center gap-2 text-rose-700">
                  <FaInfoCircle />
                  <span className="text-[11px] font-semibold uppercase tracking-wider">Discipline</span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-900">
                  {match.cards || 'None recorded'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <aside className="space-y-5 lg:col-span-4">
          <div className="border-b border-slate-200 pb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Highlights</p>
            <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900">Awards & crowd</h3>
          </div>

          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50/80 p-6 text-center shadow-sm md:p-7"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-400/15 blur-2xl" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Player of the match</p>
            <div className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/25">
              <FaTrophy className="text-xl" />
            </div>
            <p className="mt-5 text-xl font-black uppercase tracking-tight text-slate-900 md:text-2xl">
              {match.manOfTheMatch || 'TBD'}
            </p>
            <p className="mt-2 text-xs text-slate-500">Selected after the final whistle when recorded.</p>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-7"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-amber-400">
                  <FaUsers className="text-base" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Attendance</p>
                  <p className="text-2xl font-black tabular-nums text-slate-900 md:text-3xl">
                    {match.attendance != null ? match.attendance.toLocaleString() : '—'}
                  </p>
                </div>
              </div>
            </div>

            {capacityPct !== null ? (
              <>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all"
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
                <p className="mt-2 text-xs font-medium text-slate-500">
                  {capacityPct}% of stadium capacity ({match.stadiumCapacity!.toLocaleString()} seats)
                </p>
              </>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Stadium capacity is not set for this fixture.</p>
            )}
          </motion.div>
        </aside>
      </div>
    </div>
  )
}
