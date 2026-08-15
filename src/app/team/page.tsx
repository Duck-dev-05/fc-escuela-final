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
  available:  { label: 'Available',  color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  injured:    { label: 'Injured',    color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  suspended:  { label: 'Suspended',  color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
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

  // —— Loading ——————————————————————————————————————————————————————————————————
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-emerald-500" />
          <p className="text-sm font-medium text-slate-500">Loading squad...</p>
        </div>
      </div>
    )
  }

  // —— Error ————————————————————————————————————————————————————————————————————
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="max-w-md w-full glass-card p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Something went wrong</h2>
          <p className="mt-3 text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // —— Main —————————————————————————————————————————————————————————————————————
  return (
    <div className="min-h-screen bg-[#080808] text-slate-200">

      {/* —— Hero —— */}
      <section className="relative isolate overflow-hidden border-b border-white/5 pt-28 pb-14 md:pt-32 md:pb-18">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-12"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        {/* Club stripe */}
        <div className="club-top-stripe" />
        {/* Ambient glows */}
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-[80px] -z-10" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-500/6 blur-[80px] -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-emerald-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              FC Escuela Academy
            </p>
            <h1 className="text-5xl font-black uppercase tracking-tight text-white sm:text-6xl md:text-7xl">
              Our{' '}
              <span className="text-gradient-green">Squad</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
              Meet the players and staff that make up the FC Escuela family.
            </p>

            {/* Stats row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-0 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden divide-x divide-white/10">
              {[
                { label: 'Total Players', value: members.length },
                { label: 'Available', value: members.filter((m) => m.status === 'available').length, accent: 'text-red-400' },
                { label: 'Injured', value: members.filter((m) => m.status === 'injured').length, accent: 'text-rose-400' },
              ].map((s) => (
                <div key={s.label} className="flex-1 px-6 py-5 text-center min-w-[100px]">
                  <p className={`text-2xl font-black tracking-tight md:text-3xl ${s.accent || 'text-white'}`}>{s.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* —— Filters —— */}
      <div className="container-custom py-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActiveFilter(f)}
              className={`rounded-xl px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider transition ${
                activeFilter === f
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'glass-card text-slate-500 hover:text-slate-200 hover:bg-white/10'
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

      {/* —— Groups —— */}
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
                <div className="mb-8 flex items-center gap-5">
                  <div>
                    <p className="label-eyebrow mb-0.5">
                      {players.length} {players.length === 1 ? 'player' : 'players'}
                    </p>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">
                      {category}
                    </h2>
                  </div>
                  <div className="flex-1 section-stripe-green" />
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
          <div className="glass-card px-8 py-20 text-center border-dashed">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-600">
              <UserIcon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">Squad not found</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
              No players have been added to the squad yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

// —— Player Card Component ————————————————————————————————————————————————————————
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
        <div className="relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-300 group-hover:-translate-y-1 group-hover:border-red-500/25 group-hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_16px_rgba(16,185,129,0.08)]">

          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[#121a2e]">
            {player.image ? (
              <img
                src={`/avatars/${player.image}`}
                alt={player.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#121a2e] to-[#1e2841]">
                <UserIcon className="h-10 w-10 text-slate-700" />
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#05080f]/90 via-[#05080f]/20 to-transparent transition-opacity duration-300" />

            {/* Captain badge */}
            {player.captain && (
              <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500 shadow-lg shadow-amber-500/30">
                <StarSolid className="h-3.5 w-3.5 text-white" />
              </div>
            )}

            {/* Jersey number */}
            {player.number > 0 && (
              <div className="absolute left-2 top-2 flex h-7 min-w-[28px] items-center justify-center rounded-lg bg-[#080808]/80 border border-white/10 px-1.5 backdrop-blur-sm">
                <span className="text-[11px] font-black text-white">{player.number}</span>
              </div>
            )}

            {/* Name overlay at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-[10px] font-bold leading-none text-red-400 uppercase tracking-wide">
                {roleLabel}
              </p>
              <h3 className="mt-1 text-sm font-black leading-tight text-white break-words">
                {player.name}
              </h3>
            </div>
          </div>

          {/* Footer status */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold ${status.color}`}
            >
              {status.label}
            </span>
            {player.captain && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                Captain
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

