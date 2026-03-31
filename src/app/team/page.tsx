'use client'

import { useState, useEffect, useMemo } from 'react'
import { StarIcon, UserIcon, ArrowRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, useScroll, useTransform } from 'framer-motion'

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image?: string | null;
  captain: boolean;
  status: 'available' | 'injured' | 'suspended';
  bio?: string;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { data: session, status } = useSession();
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) throw new Error('Roster unavailable.')
        const data = await response.json()
        setMembers(Array.isArray(data) ? data : data.team)
      } catch (err) {
        setError('Failed to load squad.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  const groupedMembers = useMemo(() => {
    const categories = {
      'Goalkeepers': ['GK'],
      'Defenders': ['CB', 'LB', 'RB', 'LWB', 'RWB'],
      'Midfielders': ['CDM', 'CM', 'CAM', 'AMF', 'LM', 'RM'],
      'Forwards': ['LW', 'RW', 'CF', 'ST', 'SS']
    };

    const groups: Record<string, TeamMember[]> = {
      'Goalkeepers': [],
      'Defenders': [],
      'Midfielders': [],
      'Forwards': []
    };

    members.forEach(member => {
      const role = member.role.toUpperCase();
      for (const [category, roles] of Object.entries(categories)) {
        if (roles.includes(role)) {
          groups[category].push(member);
          return;
        }
      }
      // Default to Midfielders if role is unknown
      groups['Midfielders'].push(member);
    });

    // Sort within groups
    Object.keys(groups).forEach(cat => {
      groups[cat].sort((a, b) => {
        if (a.captain && !b.captain) return -1;
        if (!a.captain && b.captain) return 1;
        return a.name.localeCompare(b.name);
      });
    });

    return groups;
  }, [members]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-l-2 border-yellow-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-b-2 border-r-2 border-slate-200 rounded-full animate-reverse-spin opacity-50"></div>
          </div>
          <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Synchronizing Squad...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-40 relative overflow-hidden bg-slate-50 selection:bg-yellow-500 selection:text-slate-950">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
        <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-yellow-500/[0.03] to-transparent" />
      </div>

       <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10 pt-16">
         {/* Unified Cinematic Hero */}
         <section className="relative mb-24 group/hero">
          {/* Background Ghost Parallax */}
          <motion.div
            className="absolute -top-32 left-1/2 -translate-x-1/2 text-[25vw] font-black text-slate-900/[0.03] select-none pointer-events-none z-0 italic tracking-tighter hidden xl:block whitespace-nowrap"
            style={{ y }}
          >
            SQUAD_PORTAL
          </motion.div>

          <div className="flex flex-col items-center text-center relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 mb-10"
            >
              <span className="text-[12px] text-slate-950 font-black uppercase tracking-[0.5em]">ROSTER</span>
              <div className="h-[30px] w-[1px] bg-yellow-500" />
            </motion.div>

            <h1 className="text-[8vw] lg:text-[8rem] font-black text-slate-950 uppercase tracking-[-0.05em] leading-[0.8] italic mb-8 group-hover/hero:scale-[1.01] transition-transform duration-1000 select-none">
              Team <br />
              <span className="text-slate-200 block mt-4" style={{ WebkitTextStroke: '1.5px #0f172a' }}>Squad</span>
            </h1>
          </div>
        </section>

        {/* Positional Groups */}
        <div className="space-y-32">
          {Object.entries(groupedMembers).map(([category, players]) => (
            players.length > 0 && (
              <section key={category} className="relative">
                {/* Category Header */}
                <div className="flex items-center gap-8 mb-16">
                  <h2 className="text-3xl font-black text-slate-950 uppercase tracking-tighter italic whitespace-nowrap">{category}</h2>
                  <div className="h-[1px] flex-1 bg-slate-100" />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-10">
                  {players.map((player, idx) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <div
                        onClick={() => router.push(`/team/${player.id}`)}
                        className="group cursor-pointer relative"
                      >
                        {/* Portrait Frame */}
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-slate-100 shadow-sm transition-all duration-700 group-hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 ring-1 ring-slate-200/50 group-hover:ring-yellow-500/20">
                          {player.image ? (
                            <img
                              src={`/avatars/${player.image}`}
                              alt={player.name}
                              className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-50">
                              <UserIcon className="h-16 w-16 text-slate-200" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700" />

                          {/* Info Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col items-start gap-3 transform transition-all duration-700 group-hover:translate-y-1 opacity-100">
                            <div className="flex items-center justify-between w-full">
                              <span className="px-2.5 py-1 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[8px] font-black uppercase tracking-widest rounded-lg">
                                {player.role}
                              </span>
                              {player.captain && (
                                <StarIcon className="h-4 w-4 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] fill-yellow-500" />
                              )}
                            </div>

                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic group-hover:text-yellow-400 transition-colors">
                              {player.name.split(' ').slice(-1)}
                            </h3>
                            <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em] font-mono whitespace-nowrap">
                              {player.name}
                            </p>
                          </div>
                        </div>

                        {/* Accent Line */}
                        <div className="absolute -bottom-1.5 right-8 left-8 h-1 bg-yellow-500/0 group-hover:bg-yellow-500 transition-all duration-700 shadow-[0_0_15px_rgba(234,179,8,0.3)]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          ))}

        </div>
      </div>
    </div>
  )
}