'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import MatchList from '@/components/matches/MatchList'
import { Match } from '@/types/match'
import { FaTrophy } from 'react-icons/fa'
import { adminService } from '@/services/local-api'

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await adminService.getMatches()

        if (!Array.isArray(data)) {
          console.warn('Invalid matches response:', data)
          setMatches([])
          return
        }

        const mappedMatches: Match[] = data
          .filter((m) => !!m)
          .map((m) => {
            const row = m as {
              id?: string | number
              homeTeam?: string
              awayTeam?: string
              date?: string | number | Date
              time?: string
              venue?: string
              competition?: string
              status?: string
              score?: string | null
              stadiumCapacity?: number
              createdAt?: string | number | Date
              updatedAt?: string | number | Date
            }
            return {
              id: row?.id?.toString() || Math.random().toString(),
              homeTeam: row?.homeTeam || 'FC Escuela',
              awayTeam: row?.awayTeam || 'Opponent',
              date: new Date(row?.date || Date.now()),
              time: row?.time || '15:00',
              venue: row?.venue || 'HQ Stadium',
              competition: row?.competition || 'Friendly Match',
              status:
                row?.status ||
                (new Date(row?.date || 0) < new Date() ? 'Finished' : 'Scheduled'),
              score: row?.score || null,
              stadiumCapacity: row?.stadiumCapacity,
              createdAt: new Date(row?.createdAt || Date.now()),
              updatedAt: new Date(row?.updatedAt || Date.now()),
            }
          })
        setMatches(mappedMatches)
      } catch (err) {
        console.error('Failed to load matches:', err)
        setMatches([])
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
          <p className="text-sm font-medium text-slate-500">Loading matches…</p>
        </div>
      </div>
    )
  }

  const scheduled = matches.filter((m) => m.status === 'Scheduled')
  const finished  = matches.filter((m) => m.status === 'Finished')

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/5 pt-36 pb-16 md:pt-40 md:pb-20">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        {/* Club stripe */}
        <div className="club-top-stripe" />
        {/* Red glows */}
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-red-700/10 blur-[80px] -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-red-900/8 blur-[80px] -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="label-eyebrow mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Academy Fixtures
            </p>
            <h1 className="font-display text-7xl md:text-8xl uppercase tracking-wide text-white">
              Matches
            </h1>
            <p className="mt-4 max-w-xl text-sm text-slate-500 md:text-base">
              Upcoming fixtures and recent results. Open a match for venue, time, lineups, and report.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="container-custom py-14 md:py-20">

        {scheduled.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-16 md:mb-24"
          >
            <div className="mb-8 flex flex-col gap-2 pb-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-eyebrow mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  Next up
                </p>
                <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
                  Upcoming Fixtures
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-red-500">
                {scheduled.length} scheduled
              </span>
            </div>
            <div className="divider-red mb-8" />
            <MatchList matches={scheduled} />
          </motion.section>
        )}

        {finished.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-14"
          >
            <div className="mb-8 flex flex-col gap-2 pb-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="label-eyebrow-gold mb-1">Archive</p>
                <h2 className="font-display text-4xl md:text-5xl uppercase tracking-wide text-white">
                  Past Results
                </h2>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
                {finished.length} matches
              </span>
            </div>
            <div className="divider-white mb-8" />
            <MatchList matches={finished} />
          </motion.section>
        )}

        {matches.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card px-8 py-20 text-center"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-slate-600">
              <FaTrophy className="text-2xl" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-white md:text-2xl">
              No fixtures yet
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
              When matches are added from the academy system, they will show up here automatically.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
