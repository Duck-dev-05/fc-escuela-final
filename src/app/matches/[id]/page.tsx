'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
import MatchDetails from '@/components/matches/MatchDetails'
import { Match } from '@/types/match'
import Link from 'next/link'

function friendlyError(raw: string | null): string {
  if (!raw) return 'We could not load this match.'
  if (raw.startsWith('ERR_')) {
    if (raw.includes('TELEMETRY') || raw.includes('LINK')) return 'Connection issue. Try again in a moment.'
    if (raw.includes('ABSENT') || raw.includes('DISCONNECTED')) return 'This match was not found or is no longer available.'
  }
  return raw
}

export default function MatchPage() {
  const params = useParams<{ id: string }>()
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!params?.id) return

    const load = async () => {
      try {
        const res = await fetch(`/api/matches/${params.id}`)
        const data = await res.json()

        if (!res.ok || data.error) {
          setError(friendlyError(data.error || null))
          setMatch(null)
        } else {
          setMatch(data)
          setError(null)
        }
      } catch {
        setError('Connection issue. Try again in a moment.')
        setMatch(null)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [params?.id])

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-28 text-slate-900 md:pt-32">
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
            <p className="text-sm font-medium text-slate-600">Loading match…</p>
          </motion.div>
        ) : error || !match ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="container-custom px-4"
          >
            <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center shadow-sm md:py-14">
              <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
                <FaExclamationTriangle className="text-xl" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                Match unavailable
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{error}</p>
              <Link
                href="/matches"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950"
              >
                <FaArrowLeft className="text-[10px]" />
                All matches
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="container-custom px-4"
          >
            <div className="mb-8">
              <Link
                href="/matches"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-600 transition hover:text-amber-700"
              >
                <FaArrowLeft className="text-[10px]" />
                All matches
              </Link>
            </div>
            <MatchDetails match={match as Match} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
