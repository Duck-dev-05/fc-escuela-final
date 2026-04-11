'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeftIcon,
  UserIcon,
  StarIcon,
  CalendarIcon,
  ScaleIcon,
  TrophyIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'

interface PlayerPhysical {
  height: string
  weight: string
  age: number
  dob: string
  foot: string
}

interface PlayerStats {
  appearances?: number
  goals?: number
  assists?: number
  cleanSheets?: number
  saves?: number
  tackles?: number
  minutes?: number
}

interface PlayerContract {
  joined: string
  expires: string
}

interface Player {
  id: number
  name: string
  role: string
  image: string
  bio: string
  captain: boolean
  status: 'available' | 'injured' | 'suspended'
  physical?: PlayerPhysical
  stats?: PlayerStats
  contract?: PlayerContract
}

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/30' },
  injured:   { label: 'Injured',   color: 'bg-rose-500/10 text-rose-700 ring-rose-500/30' },
  suspended: { label: 'Suspended', color: 'bg-amber-500/10 text-amber-700 ring-amber-500/30' },
}

const ROLE_LABEL: Record<string, string> = {
  GK: 'Goalkeeper',
  CB: 'Centre Back', LB: 'Left Back', RB: 'Right Back',
  LWB: 'Left Wing Back', RWB: 'Right Wing Back', DF: 'Defender',
  CDM: 'Defensive Midfielder', CM: 'Centre Midfielder', CAM: 'Attacking Midfielder',
  AMF: 'Attacking Midfielder', LM: 'Left Midfielder', RM: 'Right Midfielder', MF: 'Midfielder',
  LW: 'Left Winger', RW: 'Right Winger', CF: 'Centre Forward',
  ST: 'Striker', SS: 'Second Striker', FW: 'Forward',
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string | number | undefined }) {
  if (value === undefined || value === null) return null
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-2xl font-black text-slate-900 md:text-3xl">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
    </div>
  )
}

// ── Info Row ──────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string | undefined }) {
  if (!value) return null
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-900">{value}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PlayerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchPlayer = async () => {
      try {
        const res = await fetch(`/api/team/${id}`)
        if (!res.ok) {
          setError('Player not found.')
          return
        }
        const data = await res.json()
        setPlayer(data)
      } catch {
        setError('Something went wrong loading this player.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlayer()
  }, [id])

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading player…</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error || !player) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
            <UserIcon className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Player unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <Link
            href="/team"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to squad
          </Link>
        </div>
      </div>
    )
  }

  const status = STATUS_CONFIG[player.status] ?? STATUS_CONFIG.available
  const roleLabel = ROLE_LABEL[player.role.toUpperCase()] ?? player.role
  const { stats, physical, contract } = player

  // Determine which stats to show based on role
  const isGK = player.role.toUpperCase() === 'GK'

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <div className="container-custom px-4 pt-28 md:pt-32">

        {/* Back link */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-600 transition hover:text-amber-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All players
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">

          {/* ── Left: Photo ─────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-4"
          >
            <div className="lg:sticky lg:top-28">
              {/* Player image card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md">
                <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-100 to-slate-200">
                  {player.image ? (
                    <img
                      src={`/avatars/${player.image}`}
                      alt={player.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserIcon className="h-20 w-20 text-slate-300" />
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />

                  {/* Captain badge */}
                  {player.captain && (
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-amber-500 px-3 py-1.5 shadow-lg">
                      <StarSolid className="h-3.5 w-3.5 text-slate-950" />
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-950">Captain</span>
                    </div>
                  )}

                  {/* Name & role overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <span className="inline-flex items-center rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                      {player.role}
                    </span>
                    <h1 className="mt-3 text-2xl font-black leading-tight text-white md:text-3xl">
                      {player.name}
                    </h1>
                    <p className="mt-1 text-sm text-white/70">{roleLabel}</p>
                  </div>
                </div>

                {/* Status footer */}
                <div className="flex items-center justify-between px-5 py-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ring-1 ring-inset ${status.color}`}>
                    {status.label}
                  </span>
                  {player.captain && (
                    <div className="flex items-center gap-1 text-amber-600">
                      <StarIcon className="h-4 w-4" />
                      <span className="text-xs font-bold">Captain</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              {player.bio && (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">About</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{player.bio}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* ── Right: Details ───────────────────────────────────────────────── */}
          <div className="space-y-6 lg:col-span-8">

            {/* Stats grid */}
            {stats && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <ChartBarIcon className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Season Stats</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  <StatCard label="Appearances" value={stats.appearances} />
                  {isGK ? (
                    <>
                      <StatCard label="Clean Sheets" value={stats.cleanSheets} />
                      <StatCard label="Saves" value={stats.saves} />
                    </>
                  ) : (
                    <>
                      <StatCard label="Goals" value={stats.goals ?? 0} />
                      <StatCard label="Assists" value={stats.assists ?? 0} />
                      {stats.tackles !== undefined && <StatCard label="Tackles" value={stats.tackles} />}
                    </>
                  )}
                  <StatCard label="Minutes" value={stats.minutes} />
                </div>
              </motion.div>
            )}

            {/* Physical attributes */}
            {physical && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <ScaleIcon className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Physical</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Height" value={physical.height} />
                  <InfoRow label="Weight" value={physical.weight} />
                  <InfoRow label="Age" value={`${physical.age} years`} />
                  <InfoRow label="Date of Birth" value={physical.dob} />
                  <InfoRow label="Preferred Foot" value={physical.foot} />
                </div>
              </motion.div>
            )}

            {/* Contract info */}
            {contract && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-amber-600" />
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Club Details</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Club" value="FC Escuela" />
                  <InfoRow label="Joined" value={contract.joined} />
                  <InfoRow label="Contract Until" value={contract.expires} />
                </div>
              </motion.div>
            )}

            {/* Achievement / form section */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm text-slate-500">FC Escuela Academy player profile.</p>
              <Link
                href="/team"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to squad
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
