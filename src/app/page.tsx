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
  FaFutbol,
  FaChevronRight,
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
      accentColor: 'text-red-400',
      accentBg: 'bg-red-500/10',
      borderAccent: 'border-t-red-600',
    },
    {
      icon: FaBroadcastTower,
      title: 'News Hub',
      desc: 'Stay updated with academy announcements and matchday stories.',
      href: '/news',
      cta: 'Read News',
      accentColor: 'text-slate-200',
      accentBg: 'bg-white/8',
      borderAccent: 'border-t-white/40',
    },
    {
      icon: FaTrophy,
      title: 'Match Center',
      desc: 'View upcoming team fixtures, scores, line-ups, and match reports.',
      href: '/matches',
      cta: 'View Matches',
      accentColor: 'text-red-400',
      accentBg: 'bg-red-500/10',
      borderAccent: 'border-t-red-600',
    },
    {
      icon: FaStar,
      title: 'Gallery',
      desc: 'Relive training and match highlights in our media collection.',
      href: '/gallery',
      cta: 'View Gallery',
      accentColor: 'text-slate-200',
      accentBg: 'bg-white/8',
      borderAccent: 'border-t-white/40',
    },
  ]

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200 overflow-x-hidden">

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
          {/* Deep red vignette overlay */}
          <div className="absolute inset-0 hero-overlay" />
          {/* Red color grading */}
          <div className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center bottom, rgba(185,28,28,0.18) 0%, transparent 65%)' }}
          />
        </motion.div>

        {/* Ambient glows — club red */}
        <div className="absolute -left-60 top-1/3 h-[500px] w-[500px] rounded-full bg-red-700/12 blur-[150px] -z-10 animate-float" />
        <div className="absolute -right-40 top-1/4 h-96 w-96 rounded-full bg-red-800/8 blur-[120px] -z-10 animate-float-delayed" />

        {/* Ghost text decoration — huge background word */}
        <div className="absolute bottom-0 left-0 right-0 text-[clamp(80px,18vw,220px)] font-display uppercase tracking-tighter leading-none ghost-text select-none overflow-hidden -z-5 pointer-events-none">
          ESCUELA
        </div>

        <div className="container-custom w-full relative z-10 pt-44 pb-28">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-5xl text-center"
          >
            {/* Eyebrow badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-500/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-red-400 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Elite Football Academy
              <FaFutbol className="text-[9px] text-red-600" />
            </motion.div>

            {/* Title — Bebas Neue poster style */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="font-display text-[clamp(72px,14vw,160px)] leading-[0.92] uppercase tracking-wide text-white"
            >
              FC{' '}
              <span className="text-gradient-red">Escuela</span>
            </motion.h1>

            {/* Divider line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mx-auto mt-6 mb-6 h-[3px] w-32 rounded-full bg-red-600"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-400 md:text-base"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-red-500 sm:w-auto"
                style={{ boxShadow: '0 0 32px rgba(220,38,38,0.38)' }}
              >
                Join Trials <FaArrowRight className="text-[10px]" />
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-200 backdrop-blur transition-all hover:bg-white/10 hover:border-white/25 sm:w-auto"
              >
                Learn About Us
              </Link>
            </motion.div>

            {/* Stats strip — scoreboard style */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="mt-14 inline-flex rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden divide-x divide-white/8"
            >
              {[
                { value: '2023', label: 'Founded' },
                { value: '50+', label: 'Players' },
                { value: '100%', label: 'Dedicated' },
              ].map((stat) => (
                <div key={stat.label} className="px-8 py-4 text-center group hover:bg-red-600/8 transition-colors">
                  <p className="scoreboard-number text-3xl font-bold text-white tracking-tight group-hover:text-red-400 transition-colors">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div style={{ opacity: opacityHero }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-600">Scroll</span>
          <div className="h-8 w-px bg-gradient-to-b from-red-500/50 to-transparent" />
        </motion.div>
      </section>

      {/* ── NEXT MATCH ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative bg-[#0a0a0a]">
        {/* Subtle red glow from above */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />

        <div className="container-custom">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="label-eyebrow mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                Upcoming Fixture
              </p>
              <h2 className="font-display text-6xl md:text-7xl uppercase tracking-wide text-white">
                Next Match
              </h2>
            </div>
            <Link href="/matches" className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500 hover:text-red-400 transition-colors inline-flex items-center gap-2">
              All Fixtures <FaArrowRight className="text-[10px]" />
            </Link>
          </motion.div>

          {/* Red divider */}
          <div className="divider-red mb-10" />

          {!loading && nextMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="match-card overflow-hidden"
            >
              {/* Competition banner — red */}
              <div className="border-b border-white/5 bg-red-600/10 px-6 py-3 md:px-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FaTrophy className="text-red-400/80 text-xs" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
                    {nextMatch.competition}
                  </p>
                </div>
                <span className="badge-scheduled text-[10px]">Scheduled</span>
              </div>

              {/* Scoreboard layout */}
              <div className="grid gap-0 md:grid-cols-3">
                {/* Home */}
                <div className="flex flex-col items-center justify-center gap-3 border-b border-white/5 p-10 md:border-b-0 md:border-r md:border-r-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Home</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                      <FaFutbol className="text-red-500/60 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white text-center">{nextMatch.homeTeam}</h3>
                </div>

                {/* VS center — scoreboard */}
                <div className="flex flex-col items-center justify-center gap-5 p-10 text-center bg-white/[0.01]">
                  <div className="flex items-center gap-4">
                    <div className="h-px w-10 bg-white/10" />
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-600">vs</span>
                    <div className="h-px w-10 bg-white/10" />
                  </div>
                  {/* Kickoff time — big scoreboard style */}
                  <p className="scoreboard-number text-6xl md:text-7xl font-bold text-white tracking-tight">{nextMatch.time}</p>
                  <div className="flex flex-col gap-2 items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <FaCalendarAlt className="text-red-500/70 text-xs" />
                      {new Date(nextMatch.date).toLocaleDateString(undefined, {
                        weekday: 'long', month: 'short', day: 'numeric',
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <FaMapMarkerAlt className="text-red-500/50 text-[10px]" />
                      {nextMatch.venue}
                    </div>
                  </div>
                  <Link
                    href={`/matches/${nextMatch.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
                    style={{ boxShadow: '0 0 24px rgba(220,38,38,0.30)' }}
                  >
                    Match Details <FaArrowRight />
                  </Link>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center justify-center gap-3 border-t border-white/5 p-10 md:border-t-0 md:border-l md:border-l-white/5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600">Away</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                      <FaShieldAlt className="text-slate-500/60 text-xl" />
                    </div>
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white text-center">{nextMatch.awayTeam}</h3>
                </div>
              </div>
            </motion.div>
          ) : loading ? (
            <div className="flex h-52 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.02]">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
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
                  className="glass-card-hover p-5 border-l-2 border-l-red-600/40 hover:border-l-red-500"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{match.competition}</span>
                    <FaTrophy className="text-red-500/40 text-xs" />
                  </div>
                  <p className="font-display text-xl uppercase tracking-wide text-white">
                    {match.homeTeam} <span className="text-slate-600 font-sans text-base normal-case">vs</span> {match.awayTeam}
                  </p>
                  <p className="mt-2 text-xs text-slate-500 font-mono">
                    {match.time} · {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-500 transition hover:text-red-400"
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
        {/* Red gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/[0.04] to-transparent pointer-events-none" />
        {/* Kit stripe */}
        <div className="absolute inset-0 kit-stripe-bg pointer-events-none opacity-30" />

        <div className="container-custom relative z-10">
          <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-eyebrow mb-3">Academy Modules</p>
              <h2 className="font-display text-6xl md:text-7xl uppercase tracking-wide text-white">
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
                className={`glass-card-hover p-6 md:p-8 border-t-2 ${item.borderAccent}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-xl p-3 ${item.accentBg} ${item.accentColor}`}>
                    <item.icon className="text-xl" />
                  </div>
                  <Link href={item.href} className="text-slate-600 transition hover:text-red-400 p-1">
                    <FaChevronRight className="text-sm" />
                  </Link>
                </div>
                <h3 className="font-display mt-5 text-3xl uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                <Link
                  href={item.href}
                  className={`mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] transition hover:gap-3 ${item.accentColor} opacity-80 hover:opacity-100`}
                >
                  {item.cta} <FaArrowRight className="text-[9px]" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ──────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative section-alt border-y border-white/5">
        {/* Red line top */}
        <div className="absolute top-0 left-0 right-0 divider-red" />

        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="label-eyebrow justify-center mb-3">How We Work</p>
            <h2 className="font-display text-6xl md:text-7xl uppercase tracking-wide text-white">
              Our Methodology
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              { icon: FaShieldAlt, title: 'Precision', desc: 'Every player path is measured and tracked with clear development goals.', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-t-red-600' },
              { icon: FaCogs,      title: 'Structure', desc: 'Progressive training cycles create consistency and match-ready performance.', color: 'text-slate-200', bg: 'bg-white/8', border: 'border-t-white/30' },
              { icon: FaUsers,     title: 'Exposure',  desc: 'We connect talent to opportunities through trusted competitive environments.', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-t-red-600' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`glass-card-hover p-7 text-center border-t-2 ${item.border}`}
              >
                <div className={`mx-auto inline-flex rounded-2xl p-4 ${item.bg} ${item.color} mb-5`}>
                  <item.icon className="text-2xl" />
                </div>
                <h3 className="font-display text-2xl uppercase tracking-wide text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Red line bottom */}
        <div className="absolute bottom-0 left-0 right-0 divider-red" />
      </section>

      {/* ── TEAM PREVIEW ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        {/* Background image accent */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/Team.jpg"
            alt="FC Escuela Team"
            fill
            className="object-cover opacity-8"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]" />
        </div>

        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-20">
            <div className="flex-1">
              <p className="label-eyebrow mb-3">The Squad</p>
              <h2 className="font-display text-6xl md:text-7xl uppercase tracking-wide text-white mb-5">
                Meet The <span className="text-gradient-red">Team</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-8">
                Our coaching staff and academy players are the heart of FC Escuela. 
                Dedicated professionals building the future of football together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/team"
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-red-500"
                  style={{ boxShadow: '0 0 24px rgba(220,38,38,0.28)' }}
                >
                  View Squad <FaArrowRight className="text-[10px]" />
                </Link>
                <Link
                  href="/coaching"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-slate-300 transition hover:bg-white/10"
                >
                  Coaching Staff
                </Link>
              </div>
            </div>

            {/* Stats column */}
            <div className="flex gap-4 md:gap-6">
              {[
                { number: '50+', label: 'Players', sub: 'Academy Squad' },
                { number: '5+', label: 'Coaches', sub: 'Professional Staff' },
                { number: '3+', label: 'Trophies', sub: 'Competitive Record' },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center text-center p-4 rounded-2xl border border-white/10 bg-white/[0.02] min-w-[80px]">
                  <span className="scoreboard-number text-3xl font-bold text-red-400">{s.number}</span>
                  <span className="text-xs font-bold text-white mt-1 uppercase tracking-wider">{s.label}</span>
                  <span className="text-[10px] text-slate-600 mt-0.5">{s.sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-36 overflow-hidden">
        {/* Deep red gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-800 to-[#1a0000]" />
        <div className="absolute inset-0 noise-layer opacity-[0.04]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/10" />
        {/* Kit stripe on red */}
        <div className="absolute inset-0 kit-stripe-bg opacity-20" />
        {/* Floating decor */}
        <div className="absolute -left-16 top-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-red-950/30 blur-3xl" />
        {/* Football watermark */}
        <div className="absolute right-10 top-10 opacity-8 animate-spin-slow">
          <FaFutbol className="text-[200px] text-white" />
        </div>
        {/* White accent line top */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)' }}
        />

        <div className="container-custom relative z-10 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            Enrollment Open
          </div>
          <h2 className="font-display text-7xl md:text-9xl uppercase tracking-wide text-white leading-none">
            Build Your Future
          </h2>
          <div className="mx-auto mt-4 mb-0 h-1 w-24 rounded-full bg-white/40" />
          <p className="mx-auto mt-8 max-w-2xl text-sm text-white/65 md:text-base">
            Join FC Escuela and train in a high-performance environment with clear pathways for growth.
          </p>
          <div className="mx-auto mt-10 flex max-w-sm flex-col gap-3 sm:flex-row sm:max-w-none sm:justify-center">
            <Link
              href="/register"
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-red-700 transition hover:bg-slate-100 sm:px-12"
              style={{ boxShadow: '0 0 40px rgba(255,255,255,0.15)' }}
            >
              Apply Now <FaArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-xl border-2 border-white/25 bg-white/10 backdrop-blur px-10 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-white/20 sm:px-12"
            >
              Discover Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
