'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolid } from '@heroicons/react/24/solid'
import { motion, AnimatePresence } from 'framer-motion'
import { adminService } from '@/services/local-api'

interface TeamMember {
  id: string
  name: string
  role: string
  number: number
  image?: string | null
  captain: boolean
  status: 'available' | 'injured' | 'suspended'
  bio?: string
  goals?: number
  matches?: number
}

const STATUS_CONFIG = {
  available: { label: 'Available', color: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/30' },
  injured: { label: 'Injured', color: 'bg-rose-500/10 text-rose-700 ring-rose-500/30' },
  suspended: { label: 'Suspended', color: 'bg-amber-500/10 text-amber-700 ring-amber-500/30' },
}

const ROLE_LABEL: Record<string, string> = {
  GK: 'Goalkeeper',
  CB: 'Centre Back', LB: 'Left Back', RB: 'Right Back',
  LWB: 'Left Wing Back', RWB: 'Right Wing Back', DF: 'Defender',
  CDM: 'Defensive Mid', CM: 'Centre Mid', CAM: 'Attacking Mid',
  AMF: 'Attacking Mid', LM: 'Left Mid', RM: 'Right Mid', MF: 'Midfielder',
  LW: 'Left Wing', RW: 'Right Wing', CF: 'Centre Forward',
  ST: 'Striker', SS: 'Second Striker', FW: 'Forward',
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await adminService.getPlayers()
        const mappedMembers: TeamMember[] = data.map((p) => ({
          id: p.id.toString(),
          name: p.name,
          role: p.role,
          number: p.number,
          image: p.image,
          captain: p.captain,
          status: (p.status?.toLowerCase() as any) || 'available',
          bio: p.bio || undefined,
          goals: p.goals,
          matches: p.matches,
        }))
        setMembers(mappedMembers)
      } catch (err) {
        console.error('Error fetching squad:', err)
        setError('Failed to load the squad. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const groupedMembers = useMemo(() => {
    const categories: Record<string, string[]> = {
      Goalkeepers: ['GK'],
      Defenders: ['CB', 'LB', 'RB', 'LWB', 'RWB', 'DF'],
      Midfielders: ['CDM', 'CM', 'CAM', 'AMF', 'LM', 'RM', 'MF'],
      Forwards: ['LW', 'RW', 'CF', 'ST', 'SS', 'FW'],
    }

    const groups: Record<string, TeamMember[]> = {
      Goalkeepers: [],
      Defenders: [],
      Midfielders: [],
      Forwards: [],
    }

    members.forEach((member) => {
      const role = member.role.toUpperCase()
      let found = false
      for (const [category, roles] of Object.entries(categories)) {
        if (roles.includes(role)) {
          groups[category].push(member)
          found = true
          break
        }
      }
      if (!found) groups['Midfielders'].push(member)
    })

    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => {
        if (a.captain && !b.captain) return -1
        if (!a.captain && b.captain) return 1
        return a.name.localeCompare(b.name)
      })
    })

    return groups
  }, [members])

  const filters = ['All', ...Object.keys(groupedMembers).filter((k) => groupedMembers[k].length > 0)]

  const visibleGroups = useMemo(() => {
    if (activeFilter === 'All') return groupedMembers
    return { [activeFilter]: groupedMembers[activeFilter] }
  }, [activeFilter, groupedMembers])

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading squad…</p>
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ── Hero ── */}
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              FC Escuela Academy
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Our{' '}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                Squad
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">
              Meet the players and staff that make up the FC Escuela family.
            </p>

            {/* Stats row */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { label: 'Total Players', value: members.length },
                { label: 'Available', value: members.filter((m) => m.status === 'available').length },
                { label: 'Injured', value: members.filter((m) => m.status === 'injured').length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-black text-slate-900 md:text-3xl">{s.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="container-custom py-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-xl px-5 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                activeFilter === f
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {f}
              {f !== 'All' && (
                <span className="ml-2 opacity-60">{groupedMembers[f]?.length ?? 0}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Groups ── */}
      <div className="container-custom pb-20 space-y-16">
        <AnimatePresence mode="wait">
          {Object.entries(visibleGroups).map(([category, players]) =>
            players.length > 0 ? (
              <motion.section
                key={category}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.35 }}
              >
                {/* Category header */}
                <div className="mb-8 flex items-center gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
                      {players.length} {players.length === 1 ? 'player' : 'players'}
                    </p>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                      {category}
                    </h2>
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Cards grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {players.map((player, idx) => (
                    <PlayerCard key={player.id} player={player} idx={idx} />
                  ))}
                </div>
              </motion.section>
            ) : null
          )}
        </AnimatePresence>

        {members.length === 0 && !loading && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <UserIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Squad not found</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              No players have been added to the squad yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Player Card Component ───────────────────────────────────────────────────────
function PlayerCard({ player, idx }: { player: TeamMember; idx: number }) {
  const status = STATUS_CONFIG[player.status] ?? STATUS_CONFIG.available
  const roleLabel = ROLE_LABEL[player.role.toUpperCase()] ?? player.role

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.04 }}
    >
      <Link href={`/team/${player.id}`} className="group block">
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-0.5 group-hover:shadow-md">

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
          {player.image ? (
            <img
              src={`/avatars/${player.image}`}
              alt={player.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <UserIcon className="h-10 w-10 text-slate-300" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-60 group-hover:opacity-75 transition-opacity duration-300" />

          {/* Captain badge */}
          {player.captain && (
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg">
              <StarSolid className="h-3.5 w-3.5 text-slate-950" />
            </div>
          )}

          {/* Jersey number */}
          {player.number > 0 && (
            <div className="absolute left-2 top-2 flex h-7 min-w-[28px] items-center justify-center rounded-lg bg-white/90 px-1.5 shadow-sm backdrop-blur-sm">
              <span className="text-[11px] font-black text-slate-900">{player.number}</span>
            </div>
          )}

          {/* Name overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-[11px] font-semibold leading-none text-amber-300 uppercase tracking-wide">
              {roleLabel}
            </p>
            <h3 className="mt-1 text-base font-black leading-tight text-white break-words">
              {player.name}
            </h3>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${status.color}`}
          >
            {status.label}
          </span>
          {player.captain && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
              Captain
            </span>
          )}
        </div>
      </div>
      </Link>
    </motion.div>
  )
}
