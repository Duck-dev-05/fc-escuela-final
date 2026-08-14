'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminService } from '@/services/local-api'
import { Match } from '@/types/match'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FaTrophy,
  FaUsers,
  FaArrowRight,
  FaBroadcastTower,
  FaShieldAlt,
  FaCogs,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa'
import { useSession } from 'next-auth/react'

export default function Home() {
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  const { scrollYProgress } = useScroll()
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacityHero = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        const data = await adminService.getMatches()
        const rawMatches: Match[] = data.map(m => ({
          id: m?.id?.toString() || Math.random().toString(),
          homeTeam: m?.homeTeam || 'FC Escuela',
          awayTeam: m?.awayTeam || 'Opponent',
          date: new Date(m?.date || Date.now()),
          time: m?.time || "15:00",
          venue: m?.venue || "HQ Stadium",
          competition: m?.competition || "Friendly Match",
          status: m?.status || (new Date(m?.date!) < new Date() ? 'Finished' : 'Scheduled'),
          score: m?.score || null,
          createdAt: new Date(m?.createdAt || Date.now()),
          updatedAt: new Date(m?.updatedAt || Date.now())
        }))
        const filtered = rawMatches
          .filter((match: Match) => match && match.date && match.date > new Date())
          .sort((a: Match, b: Match) => a.date.getTime() - b.date.getTime())
        setNextMatch(filtered[0] || null)
        setUpcomingMatches(filtered.slice(1, 4))
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  const modules = [
    {
      icon: FaUsers,
      title: 'Squad Intel',
      desc: 'Track roster data, player availability, and individual development records.',
      href: '/team',
      cta: 'Explore Team',
      accentBg: 'bg-sky-500/10',
      accentText: 'text-sky-400',
      glow: 'hover:shadow-[0_0_24px_rgba(56,189,248,0.1)]',
    },
    {
      icon: FaBroadcastTower,
      title: 'News Hub',
      desc: 'Stay updated with academy announcements and matchday stories.',
      href: '/news',
      cta: 'Read News',
      accentBg: 'bg-amber-500/10',
      accentText: 'text-amber-400',
      glow: 'hover:shadow-[0_0_24px_rgba(245,158,11,0.1)]',
    },
    {
      icon: FaTrophy,
      title: 'Match Center',
      desc: 'View upcoming team fixtures, scores, line-ups, and match reports.',
      href: '/matches',
      cta: 'View Matches',
      accentBg: 'bg-emerald-500/10',
      accentText: 'text-emerald-400',
      glow: 'hover:shadow-[0_0_24px_rgba(52,211,153,0.1)]',
    },
    {
      icon: FaStar,
      title: 'Gallery',
      desc: 'Relive training and match highlights in our media collection.',
      href: '/gallery',
      cta: 'View Gallery',
      accentBg: 'bg-purple-500/10',
      accentText: 'text-purple-400',
      glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.1)]',
    },
  ]

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden min-h-screen flex items-center">
        {/* Background image with parallax */}
        <motion.div style={{ y: yHero }} className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt="FC Escuela hero"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>

        {/* Ambient glows */}
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] -z-10 animate-float" />
        <div className="absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-sky-500/8 blur-[100px] -z-10 animate-float-delayed" />

        {/* Scan line */}
        <div className="absolute inset-0 -z-10 animate-scan" />

        {/* Ghost text decoration */}
        <div className="absolute bottom-0 left-0 right-0 text-[clamp(80px,18vw,220px)] font-black uppercase tracking-tighter leading-none ghost-text select-none overflow-hidden opacity-30 -z-5 pointer-events-none">
          ESCUELA
        </div>

        <div className="container-custom w-full relative z-10 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Elite Football Academy
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-6xl font-black uppercase tracking-tight text-white sm:text-7xl md:text-8xl lg:text-[100px] leading-none"
            >
              FC{' '}
              <span className="text-gradient-gold">Escuela</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mx-auto mt-7 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base"
            >
              Building the next generation of football talent through structured coaching,
              modern analysis, and competitive match exposure.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition-all hover:bg-amber-400 sm:w-auto"
                style={{ boxShadow: '0 0 24px rgba(245,158,11,0.35)' }}
              >
                Join Trials <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-200 backdrop-blur transition-all hover:bg-white/10 hover:border-white/25 sm:w-auto"
              >
                Learn About Us
              </Link>
            </motion.div>

            {/* Stats strip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16"
            >
              {[
                { value: '2023', label: 'Founded' },
                { value: '50+', label: 'Academy Players' },
                { value: '100%', label: 'Dedicated' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: opacityHero }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-slate-600 to-transparent" />
        </motion.div>
      </section>

      {/* ── NEXT MATCH ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative">
        <div className="container-custom">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col gap-2 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="label-eyebrow">Upcoming Fixture</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                Next Match
              </h2>
            </div>
            <Link href="/matches" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-amber-400 transition-colors inline-flex items-center gap-2">
              All Fixtures <FaArrowRight className="text-[10px]" />
            </Link>
          </motion.div>

          {!loading && nextMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl hud-border"
            >
              {/* Comp label */}
              <div className="border-b border-white/8 bg-amber-500/5 px-6 py-3 md:px-10">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-500">
                  {nextMatch.competition} · Live Countdown
                </p>
              </div>

              <div className="grid gap-0 md:grid-cols-3">
                {/* Home */}
                <div className="flex flex-col items-center justify-center gap-3 border-b border-white/5 p-8 md:border-b-0 md:border-r">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Home</p>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white text-center">{nextMatch.homeTeam}</h3>
                </div>

                {/* VS */}
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-white/10" />
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">vs</span>
                    <div className="h-px w-8 bg-white/10" />
                  </div>
                  <p className="text-5xl font-black text-white tracking-tight">{nextMatch.time}</p>
                  <div className="flex flex-col gap-1.5 items-center">
                    <div className="flex items-center gap-1.5 text-sm text-slate-400">
                      <FaCalendarAlt className="text-amber-500/70 text-xs" />
                      {new Date(nextMatch.date).toLocaleDateString(undefined, {
                        weekday: 'long', month: 'short', day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <FaMapMarkerAlt className="text-amber-500/50 text-[10px]" />
                      {nextMatch.venue}
                    </div>
                  </div>
                  <Link
                    href={`/matches/${nextMatch.id}`}
                    className="mt-1 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.18em] text-slate-950 transition hover:bg-amber-400"
                    style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                  >
                    Match Details <FaArrowRight />
                  </Link>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center justify-center gap-3 border-t border-white/5 p-8 md:border-t-0 md:border-l">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">Away</p>
                  <h3 className="text-3xl font-black uppercase tracking-tight text-white text-center">{nextMatch.awayTeam}</h3>
                </div>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="flex h-52 items-center justify-center rounded-3xl border border-white/8 bg-white/[0.02]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-amber-500" />
            </div>
          ) : null}

          {/* More upcoming */}
          {upcomingMatches.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {upcomingMatches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="glass-card-hover p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{match.competition}</span>
                    <FaTrophy className="text-amber-500/60 text-xs" />
                  </div>
                  <p className="text-base font-bold text-white">
                    {match.homeTeam} <span className="text-slate-500 font-normal">vs</span> {match.awayTeam}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {match.time} · {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 transition hover:text-amber-400"
                  >
                    Details <FaArrowRight className="text-[9px]" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── MODULES ──────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative">
        {/* Section bg accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.025] to-transparent pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-eyebrow">Academy Modules</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
                Everything In One Place
              </h2>
            </div>
            <p className="max-w-md text-sm text-slate-500">
              A unified platform for players, parents, and coaches to access the most important academy tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.07 }}
                className={`glass-card-hover p-6 md:p-8 ${item.glow}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-xl p-3 ${item.accentBg} ${item.accentText}`}>
                    <item.icon className="text-xl" />
                  </div>
                  <Link href={item.href} className="text-slate-600 transition hover:text-amber-400">
                    <FaArrowRight className="text-sm" />
                  </Link>
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                <Link
                  href={item.href}
                  className={`mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition hover:gap-3 ${item.accentText} opacity-80 hover:opacity-100`}
                >
                  {item.cta} <FaArrowRight className="text-[9px]" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 border-y border-white/5 bg-white/[0.015]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="label-eyebrow justify-center">How We Work</p>
            <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
              Our Methodology
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              { icon: FaShieldAlt, title: 'Precision', desc: 'Every player path is measured and tracked with clear development goals.', color: 'text-amber-400', bg: 'bg-amber-500/8' },
              { icon: FaCogs,      title: 'Structure', desc: 'Progressive training cycles create consistency and match-ready performance.', color: 'text-sky-400', bg: 'bg-sky-500/8' },
              { icon: FaUsers,     title: 'Exposure',  desc: 'We connect talent to opportunities through trusted competitive environments.', color: 'text-emerald-400', bg: 'bg-emerald-500/8' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="glass-card-hover p-7 text-center"
              >
                <div className={`mx-auto inline-flex rounded-2xl p-4 ${item.bg} ${item.color} mb-5`}>
                  <item.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Gold gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700" />
        <div className="absolute inset-0 noise-layer opacity-[0.04]" />
        {/* Dark overlay tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 to-slate-950/10" />
        {/* Floating decor */}
        <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-slate-950/20 blur-3xl" />

        <div className="container-custom relative z-10 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-950/70 mb-4">Enrollment Open</p>
          <h2 className="text-4xl font-black uppercase tracking-tight text-slate-950 md:text-6xl lg:text-7xl">
            Build Your Future
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-amber-950/70 md:text-base">
            Join FC Escuela and train in a high-performance environment with clear pathways for growth.
          </p>
          <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3 sm:flex-row sm:max-w-none sm:justify-center">
            <Link
              href="/register"
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-slate-950 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 sm:px-10"
            >
              Apply Now <FaArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl border-2 border-slate-950/20 bg-white/30 backdrop-blur px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-white/50 sm:px-10"
            >
              Discover Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
