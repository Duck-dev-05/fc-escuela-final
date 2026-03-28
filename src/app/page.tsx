'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { matchApi, Match } from '@/services/api'
import Image from 'next/image'
import { FaTrophy, FaTicketAlt, FaUsers, FaArrowRight, FaBroadcastTower, FaMicrochip } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const [nextMatch, setNextMatch] = useState<Match | null>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
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
        const response = await matchApi.getAll()
        const allMatches = response.data
          .filter((match: Match) => new Date(match.date) > new Date())
          .sort((a: Match, b: Match) => new Date(a.date).getTime() - new Date(b.date).getTime())
        
        setNextMatch(allMatches[0] || null)
        setUpcomingMatches(allMatches.slice(1))
      } catch (err) {
        console.error('Error fetching matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNextMatch()
  }, [])

  return (
    <div className="min-h-screen bg-transparent selection:bg-yellow-500/30 selection:text-yellow-200 overflow-x-hidden animate-scan">

      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Layer: Atmospheric Protocol */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Team.jpg"
            alt="Elite Squad"
            fill
            sizes="100vw"
            className="object-cover w-full h-full opacity-30 scale-105 animate-pulse-slow active:scale-100 transition-transform duration-[20s]"
            priority
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]" />

          {/* Atmos Layer: Sublte Technical Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-yellow-500/5 blur-[120px] rounded-full animate-pulse-slow" />

          {/* HUD Grid Layer */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(rgba(234, 179, 8, 0.15) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
          
          {/* Atmospheric Metadata Nodes */}
          <div className="absolute inset-0 pointer-events-none z-10">
            <div className="absolute top-[20%] left-[10%] animate-float opacity-20 hidden lg:block">
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] font-mono">EST_2012</span>
            </div>
            <div className="absolute bottom-[20%] right-[10%] animate-float-delayed opacity-20 hidden lg:block">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.5em] font-mono">NODE_V_4.2</span>
            </div>
            <div className="absolute top-[40%] right-[15%] animate-float opacity-10 hidden lg:block">
               <div className="flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-yellow-500" />
                 <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest font-mono">SIG_STABLE</span>
               </div>
            </div>
          </div>

          {/* Constant technical scan-line */}
          <div className="absolute inset-0 pointer-events-none opacity-5 z-10">
            <div className="w-full h-[2px] bg-yellow-500 h-screen-scan animate-scan" />
          </div>
        </div>

        {/* Ghost Typography Layer: ARCHITECTURAL AURA */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
          <h2 className="ghost-text text-[35vw] font-black leading-none select-none opacity-5 translate-y-16 tracking-tighter italic">
            ESCUELA
          </h2>
        </div>

        {/* Main Content Node: PRECISION HUD */}
        <div className="container-custom relative z-20 px-4 flex flex-col items-center animate-slide-up">
          <div className="flex flex-col items-center mb-16 relative">
            <div className="w-16 h-[2px] bg-yellow-500 mb-8 shadow-[0_0_20px_rgba(234,179,8,1)] animate-pulse" />
            <h1 className="text-7xl md:text-[12rem] font-black text-center leading-[0.85] tracking-[-0.09em] uppercase group italic relative">
              <span className="block text-white/95 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:translate-y-[-5px]">FC <span className="text-yellow-500 inline-block drop-shadow-[0_0_50px_rgba(234,179,8,0.4)]">ESCUELA</span></span>
              <span className="block text-slate-400/20 absolute -bottom-4 md:-bottom-8 left-1/2 -translate-x-1/2 w-full blur-[2px] select-none pointer-events-none scale-y-[-0.4] opacity-30">ESCUELA</span>
              <span className="block text-white/80 mt-2 md:mt-4 tracking-tighter transition-transform duration-700 group-hover:translate-y-[5px]">PORTAL</span>
            </h1>
            
            {/* Subtle Title Underline Glow */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <Link href="/matches" className="glass-card hud-border group h-20 flex items-center px-16 rounded-2xl relative overflow-hidden bg-yellow-500/5 hover:bg-yellow-500 transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
              <span className="relative z-10 text-xl font-black text-white group-hover:text-slate-950 uppercase tracking-widest">Access Center</span>
              <FaArrowRight className="ml-5 transition-transform group-hover:translate-x-3 relative z-10 text-white group-hover:text-slate-950" />
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Link>
            <Link href="/coaching" className="glass-card hud-border h-20 flex items-center px-16 rounded-2xl group bg-white/[0.02] hover:bg-yellow-500/10 transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
              <span className="text-xl font-black text-slate-400 group-hover:text-yellow-500 uppercase tracking-widest transition-colors flex items-center gap-3">
                 <FaMicrochip className="text-sm" /> Tactical Vantage
              </span>
            </Link>
            <Link href="/ticketing" className="glass-card hud-border h-20 flex items-center px-12 rounded-2xl group bg-white/[0.02] hover:bg-white/[0.08] transition-all duration-700 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
              <span className="text-xl font-black text-slate-600 group-hover:text-white uppercase tracking-widest transition-colors">Pass</span>
            </Link>
          </div>
        </div>

        {/* Corner HUD Reticles */}
        <div className="absolute top-40 left-10 w-32 h-32 border-l border-t border-white/5 opacity-40 xl:block hidden" />
        <div className="absolute bottom-40 right-10 w-32 h-32 border-r border-b border-white/5 opacity-40 xl:block hidden" />
      </section>

      {/* Deployment Feed (Next Match): CINEMATIC HUD */}
      <section className="py-40 relative bg-transparent overflow-hidden">
        {/* Section Background Aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-full bg-yellow-500/[0.02] blur-[150px] rounded-full pointer-events-none" />

        <div className="container-custom relative z-10">
          <div className="flex flex-col items-center text-center mb-16 animate-slide-up relative">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none">
              <span className="text-[10vw] font-black text-white italic select-none tracking-tighter">ENGAGEMENT</span>
            </div>
            <div className="w-8 h-[1px] bg-yellow-500/30 mb-6" />
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none relative z-10">
              Next <span className="text-yellow-500 italic">Engagement</span>
            </h2>
          </div>

          {loading ? (
            <div className="max-w-6xl mx-auto glass-card hud-border p-12 animate-pulse overflow-hidden rounded-2xl">
              <div className="h-64 bg-white/[0.02] flex items-center justify-center relative">
                <div className="w-full h-1 bg-yellow-500/10 animate-scan absolute top-0" />
                <span className="text-yellow-500/30 font-black tracking-[1em] uppercase text-xs animate-pulse">Initializing Deployment Feed...</span>
              </div>
            </div>
          ) : nextMatch ? (
            <div className="space-y-16">
              {/* Primary Engagement Spotlight: RELATIVELY CENTERED HUD */}
              <div className="max-w-7xl mx-auto animate-slide-up relative" style={{ animationDelay: '0.2s' }}>
                {/* Background Architectural Layer */}
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent z-0" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-64 bg-gradient-to-b from-transparent via-yellow-500/20 to-transparent z-0" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-0 items-center">
                  {/* Home Team Node */}
                  <div className="flex flex-col items-center group/team">
                    <div className="relative w-48 h-60 md:w-56 md:h-72 perspective-1000">
                      <div className="absolute inset-0 bg-yellow-500/5 blur-[60px] rounded-full scale-110 opacity-0 group-hover/team:opacity-100 transition-opacity duration-1000" />
                      <div className="w-full h-full glass-card hud-border p-1 bg-slate-950/40 relative transform-gpu transition-all duration-700 group-hover/team:rotate-y-12 group-hover/team:scale-105 rounded-[1.5rem] overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
                         <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] font-mono">HOME_UNIT</span>
                            <div className="w-24 h-24 glass-card hud-border flex items-center justify-center bg-slate-950 shadow-2xl rounded-2xl border-white/5 group-hover/team:border-yellow-500/50 transition-colors">
                              <span className="text-5xl font-black text-white">{nextMatch.homeTeam[0]}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover/team:text-yellow-500 transition-colors">{nextMatch.homeTeam}</h3>
                         </div>
                         {/* HUD Scanning pattern */}
                         <div className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500/10 animate-scan opacity-0 group-hover/team:opacity-100" />
                      </div>
                    </div>
                  </div>

                  {/* Tactical Focus Area */}
                  <div className="flex flex-col items-center justify-center text-center px-12 order-first lg:order-none mb-8 lg:mb-0">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 glass-card hud-border bg-yellow-500/5 rounded-full mb-8 border-yellow-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.4em] font-mono">{nextMatch.competition}</span>
                    </div>

                    <div className="relative mb-8">
                      <span className="text-[8rem] font-black text-white/[0.02] italic tracking-tighter leading-none select-none">VS</span>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-2" />
                         <span className="text-3xl font-black text-white tracking-widest italic group-hover:text-yellow-500 transition-colors uppercase">TACTICAL</span>
                         <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-2" />
                      </div>
                    </div>

                    <div className="space-y-6 max-w-sm">
                      <div className="text-2xl font-black text-white font-mono tracking-tighter bg-white/[0.01] px-8 py-3 rounded-xl border border-white/5 shadow-2xl backdrop-blur-xl group hover:border-yellow-500/30 transition-all">
                        {new Date(nextMatch.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()} <span className="text-yellow-500/40 mx-2">/</span> {nextMatch.time}
                      </div>
                      <div className="flex items-center justify-center gap-3 py-2 px-5 glass-card border-white/5 rounded-lg">
                        <FaBroadcastTower className="text-yellow-500 w-3 h-3 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] font-mono">{nextMatch.venue}</span>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                      <Link href="/ticketing" className="inline-block glass-card hud-border px-12 py-5 bg-white/5 group relative overflow-hidden rounded-xl shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:bg-white/10 transition-all duration-700 border-white/10">
                        <span className="relative z-10 font-black text-white uppercase tracking-[0.3em] text-[10px]">Secure Pass</span>
                      </Link>
                      <Link href="/coaching/upcoming" className="inline-block glass-card hud-border px-12 py-5 bg-yellow-500 group relative overflow-hidden rounded-xl shadow-[0_0_40px_rgba(234,179,8,0.2)] hover:shadow-[0_0_60px_rgba(234,179,8,0.4)] transition-all duration-700">
                        <span className="relative z-10 font-black text-slate-950 uppercase tracking-[0.3em] text-[10px] group-hover:text-white transition-colors duration-500 italic">Manage_Deployment</span>
                        <div className="absolute inset-0 bg-slate-950 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                      </Link>
                    </div>
                  </div>

                  {/* Away Team Node */}
                  <div className="flex flex-col items-center group/team">
                    <div className="relative w-48 h-60 md:w-56 md:h-72 perspective-1000">
                      <div className="absolute inset-0 bg-blue-500/5 blur-[60px] rounded-full scale-110 opacity-0 group-hover/team:opacity-100 transition-opacity duration-1000" />
                      <div className="w-full h-full glass-card hud-border p-1 bg-slate-950/40 relative transform-gpu transition-all duration-700 group-hover/team:-rotate-y-12 group-hover/team:scale-105 rounded-[1.5rem] overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-50" />
                         <div className="absolute inset-0 p-6 flex flex-col justify-between items-center text-center">
                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.5em] font-mono">AWAY_OPERATOR</span>
                            <div className="w-24 h-24 glass-card hud-border flex items-center justify-center bg-slate-950 shadow-2xl rounded-2xl border-white/5 group-hover/team:border-white transition-colors">
                              <span className="text-5xl font-black text-white">{nextMatch.awayTeam[0]}</span>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover/team:text-yellow-500 transition-colors uppercase">{nextMatch.awayTeam}</h3>
                         </div>
                         {/* HUD Scanning pattern */}
                         <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 animate-scan opacity-0 group-hover/team:opacity-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Tactical grid: Upcoming Deployments */}
              {upcomingMatches.length > 0 && (
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-6 mb-12 px-6">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.8em] whitespace-nowrap">Upcoming Tactical Deployments</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 max-w-7xl mx-auto">
                    {upcomingMatches.map((match, idx) => (
                      <div key={match.id} className="glass-card hud-border p-8 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-500 group relative rounded-3xl overflow-hidden">
                        <div className="flex justify-between items-start mb-10">
                          <span className="text-[9px] font-black text-yellow-500/50 uppercase tracking-[0.3em] font-mono">{match.competition}</span>
                          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] font-mono">{match.time}</span>
                        </div>
                        
                        <div className="flex items-center justify-around gap-4 mb-8">
                           <div className="text-center">
                             <div className="w-16 h-16 glass-card hud-border flex items-center justify-center bg-slate-950/50 rounded-xl mb-3 group-hover:border-yellow-500/30 transition-all">
                               <span className="text-2xl font-black text-white/80">{match.homeTeam[0]}</span>
                             </div>
                             <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate w-24 block">{match.homeTeam}</span>
                           </div>
                           <span className="text-xs font-black text-slate-700 italic">VS</span>
                           <div className="text-center">
                             <div className="w-16 h-16 glass-card hud-border flex items-center justify-center bg-slate-950/50 rounded-xl mb-3 group-hover:border-blue-500/30 transition-all">
                               <span className="text-2xl font-black text-white/80">{match.awayTeam[0]}</span>
                             </div>
                             <span className="text-[10px] font-black text-white uppercase tracking-tighter truncate w-24 block">{match.awayTeam}</span>
                           </div>
                        </div>

                        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{match.date}</span>
                           <Link href="/ticketing" className="text-[9px] font-black text-yellow-500 uppercase tracking-widest hover:text-white transition-colors underline underline-offset-4 decoration-yellow-500/30">
                             Reserve Pass
                           </Link>
                        </div>
                        
                        <div className="absolute top-0 right-0 w-1 h-0 group-hover:h-full bg-yellow-500/20 transition-all duration-700" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-6xl mx-auto glass-card hud-border p-24 text-center rounded-[3rem]">
               <div className="w-20 h-[2px] bg-white/10 mx-auto mb-10" />
               <h3 className="text-4xl font-black text-white/40 uppercase tracking-tighter mb-6">No Tactical Data Streams Found</h3>
               <p className="text-slate-600 font-bold uppercase tracking-[0.2em] text-xs">Awaiting primary deployment schedule synchronization.</p>
            </div>
          )}
        </div>
      </section>

      {/* Network Modules Section: INTERACTIVE CORE NODES */}
      <section className="py-56 bg-slate-950/40 border-y border-white/5 relative overflow-hidden group">
        {/* Geometric Background Detail */}
        <div className="absolute top-0 right-0 w-[40vw] h-[40vw] border border-white/5 rounded-full -translate-y-1/2 translate-x-1/2 opacity-20 animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] border border-white/5 rounded-full translate-y-1/2 -translate-x-1/2 opacity-20 animate-pulse-slow" />
        
        {/* HUD Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(rgba(234,179,8,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.2) 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        <div className="container-custom relative z-10">
          <div className="text-center mb-32 animate-slide-up">
            <span className="text-xs font-black text-yellow-500 uppercase tracking-[1em] mb-6 block">CORE_MODULES_V4</span>
            <h2 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter italic">Tactical <span className="text-yellow-500">Framework</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
            {[
              {
                title: 'Elite Stadium',
                icon: <FaTrophy className="text-yellow-500" />,
                desc: 'High-fidelity cinematic arena featuring broadcast-tier telemetry systems and elite atmosphere protocols.',
                ref: 'SYS_LOC_01'
              },
              {
                title: 'Smart Pass',
                icon: <FaTicketAlt className="text-yellow-500" />,
                desc: 'Zero-friction digital ticketing system with instant auth signature and authenticated seat protocols.',
                ref: 'SYS_ACC_04'
              },
              {
                title: 'Vanguard Society',
                icon: <FaUsers className="text-yellow-500" />,
                desc: 'Exclusive fan collective for authenticated elite operators only. Access classified club telemetry.',
                ref: 'SYS_SOC_09'
              }
            ].map((module, i) => (
              <div key={i} className="glass-card hud-border p-16 transition-all duration-700 hover:bg-white/[0.04] animate-slide-up group relative overflow-hidden rounded-[2rem] border-white/5 hover:border-yellow-500/20 shadow-2xl" 
                   style={{ animationDelay: `${i * 200}ms` }}>
                
                <div className="flex justify-between items-start mb-12">
                   <div className="text-4xl opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700">{module.icon}</div>
                   <span className="text-[10px] font-black text-slate-700 font-mono tracking-widest">{module.ref}</span>
                </div>

                <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8 group-hover:text-yellow-500 transition-colors">{module.title}</h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity duration-700">{module.desc}</p>

                {/* Tactical HUD accents */}
                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                   <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                   </div>
                   <span className="text-[9px] font-black text-yellow-500 italic tracking-[0.3em]">INITIALIZE</span>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 border-r border-t border-yellow-500/0 group-hover:border-yellow-500/40 transition-all duration-700 rounded-tr-[2rem]" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l border-b border-yellow-500/0 group-hover:border-yellow-500/40 transition-all duration-700 rounded-bl-[2rem]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Archive Pulse: EDITORIAL TELEMETRY */}
      <section className="py-56 relative bg-slate-950/20 overflow-hidden">
        {/* Atmospheric Title Ghosting */}
        <div className="absolute top-0 left-0 opacity-[0.03] select-none pointer-events-none translate-x-[-10%] translate-y-[10%]">
          <span className="text-[25vw] font-black text-white tracking-tighter leading-none italic uppercase">ARCHIVE</span>
        </div>

        <div className="container-custom relative z-10 px-6">
          <div className="flex flex-col items-center md:items-start mb-32 animate-slide-up">
            <div className="flex items-center gap-6 mb-8">
               <div className="w-16 h-[1px] bg-yellow-500" />
               <span className="text-xs font-black text-yellow-500 uppercase tracking-[1em]">INTEL_FEEDS</span>
            </div>
            <h2 className="text-7xl md:text-[10rem] font-black text-white uppercase tracking-tighter leading-none m-0 shadow-white/5">Visual <span className="text-yellow-500 italic">Telemetry</span></h2>
          </div>
 
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-slide-up">
            {/* Spotlight Article */}
            <div className="lg:col-span-12 relative group overflow-hidden rounded-[3rem] glass-card hud-border p-3 bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-1000">
              <div className="relative w-full h-[600px] md:h-[800px] overflow-hidden rounded-[2.5rem]">
                <Image
                  src="/images/Team.jpg"
                  alt="Elite Squad Intel"
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-[20s] group-hover:scale-105 group-hover:rotate-1"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Tactical HUD Overlay for Spotlight */}
                <div className="absolute inset-0 border border-white/5 m-12 rounded-[1.5rem] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                   <div className="absolute top-0 left-0 p-8">
                      <div className="w-4 h-4 border-l border-t border-yellow-500" />
                   </div>
                   <div className="absolute bottom-0 right-0 p-8">
                      <div className="w-4 h-4 border-r border-b border-yellow-500" />
                   </div>
                </div>
 
                <div className="absolute bottom-16 left-16 right-16 z-20">
                  <div className="flex items-center gap-6 mb-8">
                     <span className="px-4 py-1 glass-card border-yellow-500/30 bg-yellow-500/10 text-[10px] font-black text-yellow-500 uppercase tracking-widest rounded-full">SQUAD_INTEL</span>
                     <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">NODE_FE_001</span>
                  </div>
                  <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter mb-10 drop-shadow-2xl">Combat Unit Alpha: <span className="text-white/60">Operational Readiness Report</span></h3>
                  <Link href="/news" className="inline-flex items-center gap-6 text-xs font-black text-white uppercase tracking-[0.5em] group/link hover:text-yellow-500 transition-colors">
                    Access Intel Report
                    <FaArrowRight className="transition-transform group-hover/link:translate-x-4" />
                  </Link>
                </div>
 
                {/* Tactical Scanning Line */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity duration-1000">
                  <div className="w-full h-1 bg-yellow-400 absolute top-0 animate-scan" />
                </div>
              </div>
            </div>
            
            {/* Secondary Grid would go here if we had more news data, but we follow current structure */}
          </div>
 
          <div className="mt-32 text-center">
            <Link href="/gallery" className="glass-card hud-border py-8 px-24 group relative overflow-hidden rounded-[2rem] bg-white/[0.02] hover:bg-yellow-500 transition-all duration-700">
              <span className="relative z-10 group-hover:text-slate-950 transition-colors uppercase tracking-[0.5em] font-black text-xs">Access Full Vault Archive</span>
              <div className="absolute inset-y-0 left-0 w-0 group-hover:w-full bg-white transition-all duration-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA: VANGUARD INITIATION: HIGH IMPACT ENDPOINT */}
      <section className="py-72 relative group overflow-hidden bg-slate-950">
        {/* Dynamic Atmospheric Layer: Mesh Gradients */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-yellow-500 blur-[200px] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
           <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 blur-[150px] rounded-full opacity-10" />
        </div>

        {/* HUD Reticle Divider */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
           <div className="w-[1px] h-[70%] bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
        </div>

        <div className="absolute inset-0 bg-yellow-500/[0.01] transition-colors group-hover:bg-yellow-500/[0.03]" />
 
        <div className="container-custom relative z-10 text-center animate-slide-up px-6">
          <div className="flex flex-col items-center mb-20 relative">
             <span className="text-yellow-500 font-black text-xs uppercase tracking-[1em] mb-10">VANGUARD_REGISTRY_V1</span>
             <h2 className="text-7xl md:text-[11rem] font-black text-white uppercase tracking-tighter mb-4 leading-[0.8] shadow-white/5 relative z-10">
               Join the <span className="text-yellow-500 italic block mt-4">Vanguard</span>
             </h2>
             {/* Subtitle Accent */}
             <div className="w-1 h-20 bg-gradient-to-b from-yellow-500 to-transparent mt-12 mb-4" />
          </div>

          <p className="text-lg md:text-2xl text-slate-400 font-bold uppercase tracking-[0.4em] max-w-4xl mx-auto mb-24 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity duration-700">
            Become an architect of the club's legacy. Access elite <span className="text-white">combat telemetry</span>, tactical updates, and classified operational content.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-12 relative z-10">
            <Link href="/auth/register" className="glass-card hud-border py-8 px-24 text-2xl font-black bg-yellow-500 text-slate-950 rounded-[2rem] shadow-[0_0_80px_rgba(234,179,8,0.2)] hover:shadow-[0_0_100px_rgba(234,179,8,0.5)] transition-all duration-700 uppercase tracking-widest hover:scale-105">
              Initiate Registry
            </Link>
            <Link href="/news" className="glass-card hud-border py-8 px-24 text-2xl font-black bg-white/[0.02] text-white rounded-[2rem] hover:bg-white/[0.08] transition-all duration-700 uppercase tracking-widest border-white/10">
              Pulse / Intel
            </Link>
          </div>
        </div>
 
        {/* Decorative HUD Elements: Corner Reticles */}
        <div className="absolute top-20 left-20 w-40 h-40 border-l border-t border-white/5 opacity-40" />
        <div className="absolute bottom-20 right-20 w-40 h-40 border-r border-b border-white/5 opacity-40" />
      </section>
    </div>
  )
}
