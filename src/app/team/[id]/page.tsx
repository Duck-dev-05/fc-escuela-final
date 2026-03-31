'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeftIcon, StarIcon, TrophyIcon, 
  CalendarIcon, MapPinIcon, UserIcon,
  ShieldCheckIcon, BoltIcon, AdjustmentsHorizontalIcon,
  IdentificationIcon, ScaleIcon, ClockIcon,
  ChartBarIcon, PresentationChartLineIcon, DocumentCheckIcon,
  SparklesIcon, RectangleStackIcon, AcademicCapIcon
} from '@heroicons/react/24/outline'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Player {
  id: string;
  name: string;
  role: string;
  image: string | null;
  bio: string;
  captain: boolean;
  physical: {
    height: string;
    weight: string;
    age: number;
    dob: string;
    foot: string;
  };
  stats: {
    appearances: number;
    goals?: number;
    assists?: number;
    cleanSheets?: number;
    saves?: number;
    tackles?: number;
    minutes: number;
  };
  contract: {
    joined: string;
    expires: string;
  };
}

// Custom Radar Chart SVG Component
function AttributeMatrix({ stats }: { stats: any }) {
  const points = [
    { label: 'TACTICAL', val: 92 },
    { label: 'PHYSICAL', val: 88 },
    { label: 'TECHNICAL', val: 94 },
    { label: 'MENTAL', val: 90 },
    { label: 'SPEED', val: 86 }
  ];
  
  const size = 480;
  const center = size / 2;
  const radius = center * 0.7;
  
  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / points.length - Math.PI / 2;
    const distance = (value / 100) * radius;
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle)
    };
  };

  const pathData = points.map((p, i) => {
    const coords = getCoordinates(i, p.val);
    return `${i === 0 ? 'M' : 'L'} ${coords.x} ${coords.y}`;
  }).join(' ') + ' Z';

  return (
    <div className="relative flex flex-col items-center scale-110 lg:scale-125">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grids */}
        {[25, 50, 75, 100].map((r, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(r / 100) * radius}
            fill="none"
            stroke="rgba(0, 0, 0, 0.03)"
            strokeWidth="0.5"
          />
        ))}
        {/* Data Area */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.5, ease: "circOut" }}
          d={pathData}
          fill="rgba(234, 179, 8, 0.05)"
          stroke="#000"
          strokeWidth="1.5"
        />
        {/* Labels */}
        {points.map((p, i) => {
          const coords = getCoordinates(i, 115);
          return (
            <text
              key={i}
              x={coords.x}
              y={coords.y}
              textAnchor="middle"
              className="text-[9px] font-black uppercase tracking-[0.4em] fill-slate-300"
            >
              {p.label}
            </text>
          );
        })}
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
         <span className="text-7xl font-black italic text-slate-950 leading-none">92</span>
         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">GRADE A+</span>
      </div>
    </div>
  );
}

export default function PlayerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const nameY = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    if (!id) return;
    const fetchPlayer = async () => {
      try {
        const response = await fetch('/api/team')
        if (!response.ok) throw new Error('Player profile unavailable.')
        const data = await response.json()
        const roster = Array.isArray(data.team) ? data.team : data
        const found = roster.find((p: any) => String(p.id) === id)
        if (!found) throw new Error('Unit not found.')
        setPlayer(found)
      } catch (err) {
        setError('Failed to load player intel.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlayer()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-12">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-slate-950 rounded-full animate-spin-slow opacity-20" />
            <div className="absolute inset-4 border-b-2 border-yellow-500 rounded-full animate-reverse-spin opacity-40" />
          </div>
          <p className="text-slate-950 font-black uppercase tracking-[0.6em] text-[10px] animate-pulse">SYNCHRONIZING ARCHIVE...</p>
        </div>
      </div>
    )
  }

  if (error || !player) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <h1 className="text-7xl font-black uppercase mb-12 tracking-tighter text-slate-950 italic">ARCHIVE_NOT_FOUND</h1>
        <button onClick={() => router.push('/team')} className="px-16 py-6 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-slate-800 transition-all shadow-2xl">RETURN TO ROSTER</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white selection:bg-yellow-500 selection:text-slate-950 overflow-x-hidden">
       {/* Hero Section */}
       <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-white">
          {/* Back to Roster Action */}
          <div className="absolute top-8 left-8 md:left-16 z-50">
             <motion.button 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               onClick={() => router.push('/team')}
               className="group flex items-center gap-3 text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] hover:text-yellow-600 transition-colors"
             >
                <ArrowLeftIcon className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" />
                <span className="italic">ROSTER</span>
             </motion.button>
          </div>

          <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
             {player.image ? (
                <img 
                   src={`/avatars/${player.image}`} 
                   alt={player.name}
                   className="w-full h-full object-cover transition-all duration-1000"
                />
             ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                   <UserIcon className="h-[15vw] text-slate-100" />
                </div>
             )}
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white" />
          </motion.div>

          {/* Player Name Overlay */}
          <div className="absolute inset-x-0 bottom-8 flex flex-col items-center z-20">
             <motion.h1 
               style={{ y: nameY }}
               className="text-[8vw] lg:text-[7rem] font-black text-slate-950 uppercase tracking-[-0.05em] leading-none italic select-none"
             >
                {player.name}
             </motion.h1>
             <div className="h-[40px] w-[1px] bg-yellow-500 mt-6" />
          </div>
       </section>

       {/* SECTION 2: Narrative Profile */}
       <section className="relative z-30 max-w-[1600px] mx-auto px-8 md:px-16 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
             <div className="lg:col-span-12 space-y-16">
                <div className="flex flex-col lg:flex-row gap-8 items-baseline justify-between border-b border-slate-100 pb-8">
                   <div className="space-y-3">
                      <span className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.5em]">ELITE ARCHIVE NO. {String(player.id).padStart(3, '0')}</span>
                      <h2 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter leading-none italic">
                         {player.role}
                      </h2>
                   </div>
                   
                   <div className="flex flex-col items-end text-right">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">STATUS</span>
                      <span className="text-xl font-black text-slate-950 italic">FIRST TEAM</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 pt-8">
                   <div className="lg:col-span-8">
                      <p className="text-2xl md:text-3xl font-black text-slate-950 leading-[1.3] uppercase tracking-tight italic opacity-90 pr-8">
                        {player.bio}
                      </p>
                   </div>
                   <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
                      <SignatureOverlay name={player.name} color="#000" />
                   </div>
                </div>
             </div>
          </div>


          {/* SECTION 3: Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center py-16">
             <div className="lg:col-span-6 order-2 lg:order-1 flex justify-center">
                <AttributeMatrix stats={player.stats} />
             </div>

             <div className="lg:col-span-6 space-y-12 order-1 lg:order-2">
                <div className="space-y-4">
                   <h3 className="text-3xl md:text-4xl font-black text-slate-950 uppercase tracking-tighter italic">
                      Technical <br />
                      <span className="text-slate-200" style={{ WebkitTextStroke: '1px #0f172a' }}>Dominance.</span>
                   </h3>
                </div>

                <div className="grid grid-cols-1 gap-10 pt-4">
                   {[
                      { label: 'Tactical', val: '94%' },
                      { label: 'Technical', val: '91%' },
                      { label: 'Mental', val: '96%' },
                   ].map((item, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="space-y-3"
                      >
                         <div className="flex justify-between items-baseline">
                            <span className="text-[10px] font-black text-slate-950 uppercase tracking-[0.2em]">{item.label}</span>
                            <span className="text-xl font-black text-slate-900 italic">{item.val}</span>
                         </div>
                         <div className="h-[1px] w-full bg-slate-100 relative">
                            <motion.div 
                               initial={{ width: 0 }}
                               whileInView={{ width: item.val }}
                               transition={{ duration: 2, ease: "circOut" }}
                               className="h-full bg-slate-950 absolute top-0 left-0" 
                            />
                         </div>
                      </motion.div>
                   ))}
                </div>
             </div>
          </div>

          {/* SECTION 4: Physical Matrix */}
          <div className="py-24 border-t border-slate-50">
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                {[
                   { label: 'HEIGHT', val: player.physical.height, icon: ScaleIcon, code: 'H_UNIT_V2' },
                   { label: 'WEIGHT', val: player.physical.weight, icon: BoltIcon, code: 'M_LOAD_STABLE' },
                   { label: 'CYCLE', val: player.physical.age, icon: ClockIcon, code: 'ELITE_MATURITY' },
                   { label: 'VECTOR', val: player.physical.foot, icon: SparklesIcon, code: 'PREF_COORD' },
                ].map((p, i) => (
                   <div key={i} className="group flex flex-col gap-5 border-l border-slate-100 pl-8 hover:border-yellow-500 transition-colors">
                      <div className="flex items-center gap-3">
                         <span className="text-[8px] font-black text-slate-200 uppercase tracking-tighter">0{i+1}</span>
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{p.label}</span>
                      </div>
                      <div className="space-y-1">
                         <span className="block text-4xl font-black text-slate-950 uppercase tracking-tighter italic">{p.val}</span>
                         <span className="block text-[7px] font-bold text-slate-300 uppercase tracking-[0.3em] font-mono">{p.code}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* SECTION 5: Legacy & Commitment */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 py-24 border-t border-slate-50">
             <div className="lg:col-span-8 space-y-16">
                <div className="space-y-12">
                   {[
                      { year: '2026', title: 'Champions Circuit MVP', desc: 'Recognized as the primary tactical node in the flagship hub.', icon: StarIcon },
                      { year: '2025', title: 'Scoring Protocol Alpha', desc: 'Achieving a record-breaking efficiency of 28 targets.', icon: TrophyIcon },
                      { year: '2024', title: 'First Team Deployment', desc: 'Full integration into the elite performance unit.', icon: IdentificationIcon },
                   ].map((item, i) => (
                      <div key={i} className="group relative">
                         <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16 pb-12 border-b border-slate-50 last:border-0 last:pb-0">
                            <div className="flex flex-col gap-2 shrink-0">
                               <span className="text-3xl font-black italic text-slate-950 uppercase tracking-tighter w-20">{item.year}</span>
                               <div className="h-0.5 w-8 bg-yellow-500" />
                            </div>
                            <div className="space-y-4 pt-1">
                               <div className="flex items-center gap-4">
                                  <item.icon className="h-4 w-4 text-slate-950" />
                                  <h4 className="text-[11px] font-black text-slate-950 uppercase tracking-[0.4em]">{item.title}</h4>
                               </div>
                               <p className="text-[13px] text-slate-400 font-medium uppercase tracking-[0.05em] leading-relaxed max-w-lg transition-colors group-hover:text-slate-600">
                                  {item.desc}
                               </p>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
             </div>

             <div className="lg:col-span-4">
                <div className="p-10 bg-slate-50/50 rounded-[4rem] border border-slate-100/50 space-y-12 h-full flex flex-col justify-between">
                   <div className="space-y-10">
                      <div className="space-y-3">
                         <span className="block text-[10px] text-slate-300 font-black uppercase tracking-widest">TENURE_SYNC</span>
                         <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                            <span className="text-3xl font-black uppercase tracking-tighter italic">UNTIL {player.contract.expires}</span>
                         </div>
                      </div>
                      
                      <div className="space-y-3 pt-10 border-t border-slate-100">
                         <span className="block text-[10px] text-slate-300 font-black uppercase tracking-widest">ASSIGNMENT</span>
                         <span className="block text-4xl font-black italic text-slate-950 uppercase tracking-tighter leading-none">ELITE <br /> UNIT</span>
                      </div>
                   </div>

                   <div className="pt-8">
                      <div className="h-[1px] w-full bg-slate-200 mb-8" />
                      <div className="flex items-center gap-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                         <span>REF: CLUB_OFFICIAL_STAMP</span>
                         <div className="w-3 h-3 rounded-full border border-slate-200" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </section>

       {/* SECTION 6: High-End Data Synthesis */}
       <section className="bg-slate-50/30 py-32 px-8 border-t border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
             <div className="flex items-center gap-3 text-[8px] font-black text-slate-200 uppercase tracking-[0.5em] font-mono">
                <span>METRIC_SURFACE_ACTIVE</span>
                <div className="w-1 h-1 rounded-full bg-slate-200 animate-pulse" />
             </div>
          </div>

          <div className="max-w-[1600px] mx-auto">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
                {[
                  { label: 'DEPLOYS', val: player.stats.appearances, sub: 'SEASON_TOTAL' },
                  { label: 'TENURE', val: `${player.stats.minutes}m`, sub: 'ACTIVE_PLAYTIME' },
                  ...(player.role === 'GK' ? [
                    { label: 'SAVES', val: player.stats.saves, sub: 'TARGET_DEFENSE' },
                    { label: 'CLEAN SHEETS', val: player.stats.cleanSheets, sub: 'ZERO_RATIO' }
                  ] : [
                    { label: 'TARGETS', val: player.stats.goals, sub: 'PRIMARY_STRIKE' },
                    { label: 'ASSISTS', val: player.stats.assists, sub: 'TACTICAL_FEED' }
                  ])
                ].map((s, i) => (
                   <div key={i} className="flex flex-col items-center md:items-start gap-4">
                      <div className="flex items-center gap-3">
                         <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{s.label}</span>
                      </div>
                      <span className="block text-6xl font-black text-slate-950 italic tracking-tighter leading-none">{s.val}</span>
                      <span className="block text-[7px] font-bold text-slate-200 uppercase tracking-[0.4em] pt-2 border-t border-slate-100 w-full">{s.sub}</span>
                   </div>
                ))}
             </div>
          </div>
       </section>

       {/* Footer: Archive Completion */}
       <section className="h-80 w-full bg-white flex flex-col items-center justify-center border-t border-slate-50 relative overflow-hidden">
          <div className="flex flex-col items-center gap-8 relative z-10">
             <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] font-black text-slate-200 uppercase tracking-[1em] mb-4">END_OF_ARCHIVE</span>
                <div className="h-16 w-[1px] bg-gradient-to-b from-slate-100 to-transparent" />
             </div>
             <div className="space-y-4 text-center">
                <p className="text-[11px] font-black text-slate-950 uppercase tracking-[0.6em] italic">ESCUELA FIRST TEAM // HUB_05</p>
                <div className="flex justify-center items-center gap-6">
                   <div className="h-[1px] w-12 bg-slate-100" />
                   <span className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.4em]">VALIDATED BY CENTRAL CORE</span>
                   <div className="h-[1px] w-12 bg-slate-100" />
                </div>
             </div>
          </div>
          
          {/* Subtle Background Mark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
             <span className="text-[20vw] font-black text-slate-950 italic uppercase tracking-tighter">FLAGSHIP</span>
          </div>
       </section>
    </div>
  )
}

function SignatureOverlay({ name, color }: { name: string, color: string }) {
  return (
    <div className="relative h-24 flex items-center justify-center opacity-40 select-none pointer-events-none">
       <span 
         className="text-6xl font-black italic uppercase tracking-[-0.1em] scale-y-150 rotate-[-4deg]"
         style={{ color }}
       >
         {name.split(' ').slice(-1)}
       </span>
    </div>
  )
}
