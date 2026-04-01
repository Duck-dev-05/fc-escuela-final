'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminService, AdminMatch } from '@/services/admin-api'
import { Match } from '@/types/match'
import Image from 'next/image'
import { FaTrophy, FaTicketAlt, FaUsers, FaArrowRight, FaBroadcastTower, FaMicrochip, FaCogs, FaShieldAlt, FaChartLine } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const { data: session, status: authStatus } = useSession();

  useEffect(() => {
    if (authStatus === 'authenticated' && (session?.user as any).roles === 'coach') {
      router.push('/coaching');
    }
  }, [authStatus, session, router]);

  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        const data = await adminService.getMatches();
        
        const mappedMatches: Match[] = data.map(m => ({
          id: m.id.toString(),
          homeTeam: m.match.split(' vs ')[0] || 'FC Escuela',
          awayTeam: m.match.split(' vs ')[1] || 'Opponent',
          date: new Date(m.date),
          time: "20:00",
          venue: m.stadium,
          competition: m.competition,
          status: 'Scheduled',
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        const upcomingMatches = mappedMatches
          .filter((match: Match) => match && match.date && match.date > new Date())
          .sort((a: Match, b: Match) => a.date.getTime() - b.date.getTime())

        setNextMatch(upcomingMatches[0] || null)
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNextMatch()
  }, [])


  return (
    <div className="min-h-screen bg-transparent selection:bg-yellow-500/10 overflow-x-hidden">

      {/* 🚀 ELITE HERO: ROYAL LIGHT SYNC */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Backdrop Architecture */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Team final.jpg"
            alt="Elite Squad"
            fill
            sizes="100vw"
            className="object-cover opacity-10 scale-105 animate-pulse-slow active:scale-100 transition-transform duration-[20s]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/40 to-white" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(234,179,8,0.05)_0%,transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        {/* Master Branding: Ghost Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden select-none">
          <h2 className="text-[20vw] font-black text-slate-900/[0.02] italic tracking-tighter leading-none whitespace-nowrap">
            ESCUELA PORTAL
          </h2>
        </div>

        {/* Primary HERO Content: Vertical Centering 2.0 */}
        <div className="container-custom relative z-20 px-4 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center mb-20 relative group cursor-default">
            <h1 className="text-4xl sm:text-7xl md:text-[8rem] lg:text-[10rem] font-black text-center leading-[0.75] tracking-[-0.08em] uppercase italic relative">
              <span className="block text-slate-900 group-hover:tracking-normal transition-all duration-1000">FC <span className="text-yellow-600">ESCUELA</span></span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-10 md:gap-14 items-center justify-center w-full max-w-lg md:max-w-none px-6 mt-12">
            <Link href="/matches" className="magnetic-card h-20 w-full sm:w-80 flex items-center justify-center px-12 rounded-2xl glass-card border-slate-200 bg-white/50 group relative overflow-hidden hover:border-yellow-500/40 transition-all">
              <span className="relative z-10 text-lg font-black text-slate-500 uppercase tracking-[0.2em] italic group-hover:text-yellow-600 transition-colors flex items-center gap-6 whitespace-nowrap">
                <FaTrophy className="text-xl opacity-50 transition-opacity group-hover:opacity-100" /> Matches
              </span>
              <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            <Link href="/ticketing" className="magnetic-card h-20 w-full sm:w-80 flex items-center justify-center px-12 rounded-2xl bg-yellow-500 border border-yellow-500 group relative overflow-hidden shadow-[0_20px_60px_rgba(234,179,8,0.3)]">
              <span className="relative z-10 text-lg font-black text-slate-950 uppercase tracking-[0.2em] italic group-hover:text-white transition-colors flex items-center gap-6 whitespace-nowrap">
                Tickets <FaTicketAlt className="text-xl transition-transform group-hover:scale-110" />
              </span>
              <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* 📊 TACTICAL INTEL: BROADCAST BENTO GRID */}
      <section className="py-48 md:py-64 relative border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="container-custom px-6 md:px-12 2xl:px-32">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch relative">
            {/* Spotlight Match Intel */}
            <div className="lg:col-span-1 glass-card hud-border p-8 md:p-12 rounded-xl bg-white/80 relative overflow-hidden group flex flex-col items-center justify-center text-center">
              <div className="absolute top-0 inset-x-0 p-4 opacity-30 font-mono text-[8px] uppercase tracking-widest text-center border-b border-slate-100 text-slate-400">REALTIME_TELEMETRY</div>
              <div className="pt-8 w-full h-full flex flex-col justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-yellow-600/60 font-black text-[10px] uppercase tracking-[0.4em] mb-8 block">NEXT_DEPLOYMENT</span>
                  <div className="flex flex-col items-center gap-8 mb-12">
                    <h3 className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">{nextMatch?.homeTeam || 'SQUAD_A'}</h3>
                    <div className="h-[1.5px] w-32 bg-slate-100" />
                    <h3 className="text-3xl md:text-5xl font-black text-slate-400 italic uppercase tracking-tighter leading-none">VS {nextMatch?.awayTeam || 'SQUAD_B'}</h3>
                  </div>
                </div>

                <div className="space-y-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl font-black text-yellow-600 italic tracking-[0.2em]">{nextMatch?.time || '20:00'}</div>
                    <div className="py-2.5 px-8 glass-card border-yellow-500/20 bg-yellow-500/5 rounded-lg">
                      <span className="text-[10px] font-black text-yellow-600 uppercase tracking-widest">{nextMatch?.venue || 'NEUTRAL_TERRITORY'}</span>
                    </div>
                  </div>
                  <Link href="/ticketing" className="w-full py-6 bg-slate-50 border border-slate-100 hover:border-yellow-500/40 hover:bg-yellow-500 hover:text-slate-950 flex items-center justify-center gap-4 transition-all duration-500 rounded-xl group/btn">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Tactical Pass</span>
                    <FaTicketAlt className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Mission Intelligence (NEW) */}
            <div className="lg:col-span-1 glass-card hud-border rounded-xl bg-white/80 p-8 md:p-10 flex flex-col items-center justify-between text-center group overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 p-4 opacity-30 font-mono text-[8px] uppercase tracking-widest text-center border-b border-slate-100 text-slate-400">V05_DATA_SYNC</div>
              <div className="pt-8 flex flex-col items-center flex-1">
                <FaBroadcastTower className="text-4xl text-yellow-600/40 mb-8 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none mb-6">Live <span className="text-yellow-600 block mt-2">Intelligence</span></h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8 max-w-xs">Synchronized tactical telemetry and deployment archives accessible to authorized personnel only.</p>
              </div>
              <Link href="/matches" className="w-full flex items-center justify-center gap-4 p-5 glass-card border-slate-200 bg-slate-950 text-white rounded-xl hover:bg-yellow-500 hover:text-slate-950 transition-all group/btn shadow-xl">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Intercept Feed</span>
                <div className="h-8 w-8 rounded-full border border-white/20 flex items-center justify-center group-hover/btn:border-slate-950/20 group-hover/btn:scale-110 transition-all">
                  <FaArrowRight className="text-xs" />
                </div>
              </Link>
            </div>

            {/* Matrix Sidecard */}
            <div className="lg:col-span-1 glass-card hud-border rounded-xl bg-white/80 p-8 md:p-10 flex flex-col items-center justify-between text-center group overflow-hidden relative">
              <div className="absolute inset-x-0 top-0 p-4 opacity-30 font-mono text-[8px] uppercase tracking-widest text-center border-b border-slate-100 text-slate-400">V04_MATRIX_SCAN</div>
              <div className="pt-8 flex flex-col items-center flex-1">
                <FaUsers className="text-4xl text-yellow-600/40 mb-8 group-hover:scale-110 transition-transform duration-700" />
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none mb-6">Vanguard <span className="text-yellow-600 block mt-2">Registry</span></h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed mb-8 max-w-xs">Authorized operators only. Deploying legacy protocols for the next tactical season.</p>
              </div>
              <Link href="/register" className="w-full flex items-center justify-center gap-4 p-5 glass-card border-slate-200 bg-slate-50 rounded-xl hover:border-yellow-500/40 hover:bg-yellow-500 hover:text-slate-950 transition-all group/btn">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Initialize Access</span>
                <div className="h-8 w-8 rounded-full border border-current flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                  <FaArrowRight className="text-xs" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 🔮 OPERATIONAL PHILOSOPHY: FLUID LAYOUT */}
      <section className="py-40 md:py-64 relative overflow-hidden bg-slate-50">
        <div className="container-custom px-6 sm:px-12">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-12 group">
              <div className="w-12 h-[2px] bg-yellow-500" />
              <span className="text-yellow-600 font-black text-[10px] uppercase tracking-[1em]">DESIGN_LEGACY</span>
              <div className="w-12 h-[2px] bg-yellow-500" />
            </div>
            <h2 className="text-5xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.8] mb-12 italic">Built for <span className="text-yellow-600">Infinity</span></h2>
            <p className="text-lg md:text-2xl text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed mb-16 opacity-80">Elite architectural vision honoring our heritage while projecting tactical superiority into the next century.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-24 w-full">
              <div className="flex flex-col items-center space-y-6">
                <FaShieldAlt className="text-4xl text-yellow-600/40" />
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Vault Protocol</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Zero-day encrypted telemetry.</p>
              </div>
              <div className="flex flex-col items-center space-y-6">
                <FaCogs className="text-4xl text-yellow-600/40" />
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Agile Engines</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Live tactical synchronization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏁 FINAL TERMINAL: ACCESS GRANTED */}
      <section className="py-48 relative overflow-hidden bg-white border-t border-slate-100">
        <div className="container-custom relative z-10 text-center px-6">
          <div className="max-w-5xl mx-auto flex flex-col items-center">
            <div className="glass-card border-yellow-500/20 px-8 py-3 mb-16 animate-pulse-subtle inline-block">
              <span className="text-xs font-black text-yellow-600 uppercase tracking-[1em]">TERMINATE_VOID</span>
            </div>
            <h2 className="text-6xl sm:text-[10rem] font-black text-slate-900 uppercase tracking-tighter leading-[0.8] mb-12 italic">Secure Your <span className="text-yellow-600 block mt-4">Legacy</span></h2>
            <p className="text-xl md:text-2xl text-slate-400 font-bold uppercase tracking-[0.3em] max-w-3xl mb-24 opacity-80">Authorized recruitment for the next tactical season is currently <span className="text-slate-900">ACTIVE</span>.</p>
            <div className="flex flex-col sm:flex-row gap-10 items-center justify-center">
              <Link href="/register" className="py-8 px-24 bg-yellow-500 text-slate-950 text-xl font-black uppercase tracking-widest italic rounded-xl shadow-[0_20px_60px_rgba(234,179,8,0.2)] hover:scale-110 transition-transform">Enroll Now</Link>
              <Link href="/gallery" className="py-8 px-16 border border-slate-200 text-slate-400 text-xl font-black uppercase tracking-widest italic rounded-xl hover:text-slate-900 hover:border-slate-300 transition-all">Archive</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
