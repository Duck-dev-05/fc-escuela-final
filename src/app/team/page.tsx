'use client'

import { useState, useEffect } from 'react'
import { FaUserShield, FaStar, FaInfoCircle, FaTrophy, FaLayerGroup, FaUserAlt, FaBolt, FaShieldAlt, FaCrosshairs } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) throw new Error('Registry access denied.')
        const data = await response.json()
        setMembers(Array.isArray(data) ? data : data.team)
      } catch (err) {
        setError('Telemetry Retrieval Failure.')
      } finally {
        setLoading(false)
      }
    }
    fetchTeam()
  }, [])

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020202]">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-20 h-20 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
           <p className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">Synchronizing_Unit_Registry</p>
        </div>
      </div>
    )
  }

  const roleOrder = ['GK', 'CB', 'LB', 'RB', 'CDM', 'AMF', 'LW', 'RW', 'CF'];
  const sortedMembers = [...members].sort((a, b) => {
    if (a.captain && !b.captain) return -1;
    if (!a.captain && b.captain) return 1;
    const aRoleIdx = roleOrder.indexOf(a.role.toUpperCase());
    const bRoleIdx = roleOrder.indexOf(b.role.toUpperCase());
    if (aRoleIdx !== -1 && bRoleIdx !== -1) return aRoleIdx - bRoleIdx;
    if (aRoleIdx !== -1) return -1;
    if (bRoleIdx !== -1) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="min-h-screen bg-[#020202] pt-40 pb-60 relative overflow-hidden">
      {/* Cinematic Background Scenline & Effects */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
         <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
         <div className="absolute top-0 left-0 w-full h-[1px] bg-yellow-500/20 animate-scanline" />
      </div>

      <div className="container-custom relative z-10">
        {/* Header Section */}
        <div className="mb-32 animate-slide-up">
          <div className="flex flex-col items-center text-center">
             <div className="inline-flex items-center gap-4 mb-8 px-5 py-2 glass-card border-yellow-500/20 rounded-full bg-yellow-500/5">
                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-500 font-black">Official_Combat_Unit // Campaign_24-25</span>
             </div>
             
             <div className="relative">
                <span className="absolute -top-16 left-1/2 -translate-x-1/2 text-[15vw] font-black text-white/[0.02] uppercase tracking-tighter select-none pointer-events-none italic rotate-[-2deg]">ELITE_PLR</span>
                <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                   Combat <span className="text-yellow-500">Unit</span>
                </h1>
             </div>
             
             <p className="mt-8 text-slate-500 max-w-2xl text-[10px] font-black uppercase tracking-[0.4em] leading-loose">
                Real-time personnel telemetry and operational role synchronization. High-fidelity access to the FC Escuela master registry.
             </p>
          </div>
        </div>

        {/* Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {sortedMembers.map((member, idx) => (
            <div
              key={member.id}
              className="group relative cursor-pointer"
              onClick={() => router.push(`/team/${member.id}`)}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
               {/* Card Container */}
               <div className="glass-card hud-border p-1 bg-slate-950/40 border-white/5 group-hover:border-yellow-500/30 transition-all duration-700 overflow-hidden shadow-2xl">
                  {/* Internal Padding Wrapper */}
                  <div className="p-8 relative">
                     {/* Technical Overlays */}
                     <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-yellow-500/30">
                        REF_N{idx.toString().padStart(3, '0')}
                     </div>
                     <div className="absolute bottom-0 left-0 p-4 font-mono text-[7px] text-slate-700">
                        LAT: 21.0285 // LNG: 105.8542
                     </div>

                     <div className="flex flex-col items-center">
                        {/* Avatar Hub */}
                        <div className="relative mb-10">
                           {/* Glow Effect */}
                           <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                           
                           {/* Image Container */}
                           <div className="relative w-44 h-44 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-yellow-500 shadow-2xl bg-slate-900 flex items-center justify-center transition-all duration-700">
                              {member.image ? (
                                <img
                                  src={`/avatars/${member.image}`}
                                  alt={member.name}
                                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                  onError={e => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <FaUserAlt className="text-6xl text-slate-800" />
                              )}
                              
                              {/* Corner Ranging Reticules */}
                              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-yellow-500/30" />
                              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-yellow-500/30" />
                              
                              {/* Scanner Line animation on hover */}
                              <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500/40 opacity-0 group-hover:animate-scanline group-hover:opacity-100" />
                           </div>

                           {/* Captain Badge */}
                           {member.captain && (
                              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-yellow-500 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.5)] z-20 border-4 border-slate-950 animate-pulse">
                                 <FaStar className="text-xl" />
                              </div>
                           )}
                        </div>

                        {/* Text Content */}
                        <div className="text-center w-full space-y-4">
                           <div className="flex items-center justify-center gap-3">
                              <span className="w-1.5 h-[1px] bg-yellow-500/50" />
                              <div className="px-5 py-2 bg-slate-950/80 border border-white/10 rounded-lg backdrop-blur-xl text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                 {member.role}
                              </div>
                              <span className="w-1.5 h-[1px] bg-yellow-500/50" />
                           </div>

                           <h2 className="text-5xl font-black text-white uppercase tracking-tighter transition-all group-hover:tracking-widest group-hover:text-yellow-500 duration-500">
                              {member.name.split(' ').slice(-1)}
                           </h2>
                           
                           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {member.name}
                           </p>

                           {/* Mock HUD Telemetry Stats */}
                           <div className="pt-8 grid grid-cols-3 gap-4 border-t border-white/5 opacity-40 group-hover:opacity-100 transition-opacity">
                              <div className="flex flex-col items-center">
                                 <FaBolt className="text-yellow-500 mb-2 text-[10px]" />
                                 <span className="text-[8px] font-mono text-white">PX_92</span>
                              </div>
                              <div className="flex flex-col items-center">
                                 <FaShieldAlt className="text-yellow-500 mb-2 text-[10px]" />
                                 <span className="text-[8px] font-mono text-white">DF_88</span>
                              </div>
                              <div className="flex flex-col items-center">
                                 <FaCrosshairs className="text-yellow-500 mb-2 text-[10px]" />
                                 <span className="text-[8px] font-mono text-white">AT_94</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>

        {/* Footer Statistics Bar */}
        <div className="mt-40 glass-card hud-border p-12 bg-slate-950/20 border-white/5 animate-slide-up">
           <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-8">
                 <div className="w-20 h-20 glass-card hud-border flex items-center justify-center bg-yellow-500/10 border-yellow-500/20">
                    <FaLayerGroup className="text-3xl text-yellow-500" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Unit Overview</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">Collective readiness and personnel metrics</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-16 text-center lg:text-left h-full border-white/5 lg:border-l lg:pl-16">
                 <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">Total_Assets</p>
                    <p className="text-4xl font-black text-white font-mono">{members.length}</p>
                 </div>
                 <div>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">Ready_State</p>
                    <p className="text-4xl font-black text-yellow-500 font-mono">100%</p>
                 </div>
                 <div className="hidden md:block">
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-3">Sync_Status</p>
                    <p className="text-4xl font-black text-green-500 font-mono animate-pulse">LIVE</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}