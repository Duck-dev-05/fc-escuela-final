'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminService } from '@/services/local-api'
import { adminClient } from '@/services/admin-client'
import { Match } from '@/types/match'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  FaTrophy,
  FaTicketAlt,
  FaUsers,
  FaArrowRight,
  FaBroadcastTower,
  FaShieldAlt,
  FaCogs,
  FaStar,
} from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session, status: authStatus } = useSession()

  const { scrollYProgress } = useScroll();
  const yHero = useTransform(scrollYProgress, [0, 1], [0, 300]);

  useEffect(() => {
    if (authStatus === 'authenticated' && (session?.user as any).roles === 'coach') {
      router.push('/coaching')
    }
  }, [authStatus, session, router])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true)
        
        // 🚀 Step 1: Try fetching from the Remote Admin API (Port 3001)
        const remoteData = await adminClient.fetchAllData()
        let rawMatches: Match[] = []

        if (remoteData && remoteData.matches?.length > 0) {
          console.log('[HOME_SYNC]: Using Remote Admin Data')
          rawMatches = adminClient.mapRemoteMatches(remoteData.matches)
        } else {
          // 🏠 Fallback: Use Local API (Port 3000)
          console.log('[HOME_SYNC]: Falling back to Local Data')
          const data = await adminService.getMatches()
          rawMatches = data.map(m => ({
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
        }

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
      accent: 'bg-sky-500/10 text-sky-700',
    },
    {
      icon: FaBroadcastTower,
      title: 'News Hub',
      desc: 'Stay updated with academy announcements and matchday stories.',
      href: '/news',
      cta: 'Read News',
      accent: 'bg-yellow-500/10 text-yellow-700',
    },
    {
      icon: FaTicketAlt,
      title: 'Ticketing',
      desc: 'Secure your seat and manage all your upcoming fixture passes.',
      href: '/ticketing',
      cta: 'Get Tickets',
      accent: 'bg-emerald-500/10 text-emerald-700',
    },
    {
      icon: FaStar,
      title: 'Gallery',
      desc: 'Relive training and match highlights in our media collection.',
      href: '/gallery',
      cta: 'View Gallery',
      accent: 'bg-purple-500/10 text-purple-700',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      <section className="relative isolate overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
        <motion.div style={{ y: yHero }} className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt="FC Escuela hero backdrop"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-slate-50/85 to-slate-50" />
        </motion.div>
        <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-yellow-400/20 blur-3xl -z-10" />
        <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-4xl text-center"
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-yellow-700">
              <span className="h-2 w-2 rounded-full bg-yellow-500" />
              Elite Football Academy
            </div>
            <h1 className="text-5xl font-black uppercase tracking-tight text-slate-900 sm:text-6xl md:text-7xl">
              FC Escuela
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-700 md:text-base">
              Building the next generation of football talent through structured coaching, modern analysis, and
              competitive match exposure.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-yellow-500 sm:w-auto"
              >
                Join Trials <FaArrowRight />
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 sm:w-auto"
              >
                Learn About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="container-custom">
          {!loading && nextMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-6 py-4 md:px-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                  Next Match • {nextMatch.competition}
                </p>
              </div>
              <div className="grid gap-6 p-6 md:grid-cols-3 md:p-10">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Home</p>
                  <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900">{nextMatch.homeTeam}</h3>
                </div>
                <div className="flex flex-col items-center justify-center gap-3 text-center">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Kickoff</span>
                  <p className="text-4xl font-black text-slate-900">{nextMatch.time}</p>
                  <p className="text-sm font-medium text-slate-600">
                    {new Date(nextMatch.date).toLocaleDateString(undefined, {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                  <Link
                    href="/ticketing"
                    className="mt-2 inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 transition hover:bg-yellow-400"
                  >
                    Book Tickets <FaArrowRight />
                  </Link>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Away</p>
                  <h3 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-900">{nextMatch.awayTeam}</h3>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex h-44 items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500/20 border-t-yellow-500" />
            </div>
          )}

          {upcomingMatches.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {upcomingMatches.map((match, idx) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">{match.competition}</span>
                    <FaTrophy className="text-yellow-500" />
                  </div>
                  <p className="mt-3 text-lg font-bold text-slate-900">
                    {match.homeTeam} <span className="text-slate-500">vs</span> {match.awayTeam}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    {match.time} •{' '}
                    {new Date(match.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <Link
                    href={`/matches/${match.id}`}
                    className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-700 transition hover:text-yellow-600"
                  >
                    Match Details <FaArrowRight />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-custom">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Academy Modules</p>
              <h2 className="mt-2 text-4xl font-black uppercase tracking-tight text-slate-900 md:text-5xl">Everything In One Place</h2>
            </div>
            <p className="max-w-md text-sm text-slate-600">
              A cleaner platform experience for players, parents, and coaches to access the most important academy tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {modules.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-xl p-3 ${item.accent}`}>
                    <item.icon className="text-lg" />
                  </div>
                  <Link href={item.href} className="text-slate-500 transition hover:text-slate-900">
                    <FaArrowRight />
                  </Link>
                </div>
                <h3 className="mt-5 text-2xl font-black uppercase tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                <Link
                  href={item.href}
                  className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:text-yellow-600"
                >
                  {item.cta} <FaArrowRight />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16 md:py-24">
        <div className="container-custom">
          <h2 className="text-center text-4xl font-black uppercase tracking-tight text-slate-900 md:text-5xl">
            Our Methodology
          </h2>
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-3">
            {[
              { icon: FaShieldAlt, title: 'Precision', desc: 'Every player path is measured and tracked with clear development goals.' },
              { icon: FaCogs, title: 'Structure', desc: 'Progressive training cycles create consistency and match-ready performance.' },
              { icon: FaUsers, title: 'Exposure', desc: 'We connect talent to opportunities through trusted competitive environments.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto inline-flex rounded-full bg-yellow-500/10 p-3 text-yellow-700">
                  <item.icon className="text-xl" />
                </div>
                <h3 className="mt-4 text-xl font-black uppercase tracking-tight text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-yellow-500 py-20 md:py-24">
        <div className="container-custom text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-800">Enrollment Open</p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-tight text-slate-900 md:text-6xl">
            Build Your Future
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-800 md:text-base">
            Join FC Escuela and train in a high-performance environment with clear pathways for growth.
          </p>
          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-slate-800"
            >
              Apply Now <FaArrowRight />
            </Link>
            <Link
              href="/about"
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-900/20 bg-white/80 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-900 transition hover:bg-white"
            >
              Discover Academy
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
