'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import MatchList from '@/components/matches/MatchList'
import { Match } from '@/types/match'
import { FaArrowRight, FaTrophy } from 'react-icons/fa'
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading matches…</p>
        </div>
      </div>
    )
  }

  const scheduled = matches.filter((m) => m.status === 'Scheduled')
  const finished = matches.filter((m) => m.status === 'Finished')

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-16 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Academy fixtures
              </p>
              <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 md:text-5xl">
                Matches
              </h1>
              <p className="mt-3 max-w-xl text-sm text-slate-600 md:text-base">
                Upcoming fixtures and recent results. Open a match for venue, time, lineups, and report.
              </p>
            </div>
            <Link
              href="/ticketing"
              className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-slate-800 transition hover:border-slate-400 hover:bg-slate-100 md:self-auto"
            >
              Get tickets <FaArrowRight className="text-[10px]" />
            </Link>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12 md:py-16">
        {scheduled.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-14 md:mb-20"
          >
            <div className="mb-8 flex flex-col gap-2 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Next up</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                  Upcoming fixtures
                </h2>
              </div>
            </div>
            <MatchList matches={scheduled} />
          </motion.section>
        )}

        {finished.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="mb-14"
          >
            <div className="mb-8 flex flex-col gap-2 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Archive</p>
                <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                  Past results
                </h2>
              </div>
            </div>
            <MatchList matches={finished} />
          </motion.section>
        )}

        {matches.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm md:py-20"
          >
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <FaTrophy className="text-2xl" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 md:text-2xl">
              No fixtures yet
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
              When matches are added from the academy system, they will show up here automatically.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
