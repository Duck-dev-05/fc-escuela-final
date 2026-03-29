'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { FaArrowLeft, FaStar, FaBolt, FaShieldAlt, FaCrosshairs, FaTrophy, FaCalendarAlt, FaMapMarkerAlt, FaUserAlt, FaCodeBranch, FaCogs, FaMicrochip } from 'react-icons/fa'

interface Player {
  id: number;
  name: string;
  role: string;
  image: string | null;
  bio: string;
  captain: boolean;
}

export default function PlayerDetailPage() {
  const { id } = useParams()
  const router = useRouter()
   const [player, setPlayer] = useState<Player | null>(null)
   const [loading, setLoading] = useState(true)
   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       setMousePos({
         x: (e.clientX / window.innerWidth) * 100,
         y: (e.clientY / window.innerHeight) * 100,
       });
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPlayer = async () => {
      try {
        const response = await fetch('/api/team')
        if (response.ok) {
          const data = await response.json()
          const roster = Array.isArray(data) ? data : data.team
          const found = roster.find((p: any) => String(p.id) === id)
          setPlayer(found)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchPlayer()
  }, [id])

  if (loading) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 animate-pulse">
             <div className="w-24 h-24 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin shadow-[0_10px_30px_rgba(234,179,8,0.1)]" />
             <p className="text-yellow-600 font-black uppercase tracking-[0.5em] text-[10px]">INITIALIZING_PERSONNEL_LINK...</p>
          </div>
       </div>
     )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-6xl font-black uppercase mb-8 tracking-tighter text-slate-900">Unit_Offline</h1>
        <button onClick={() => router.push('/team')} className="btn-primary px-12 py-4">Return to Command Registry</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-slate-50 selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.04] blur-[120px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.03] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-20 left-10 select-none pointer-events-none opacity-[0.02] whitespace-nowrap z-0">
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">PERSONNEL_INTEL</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20">
          {/* Back Link HUD */}
          <button 
            onClick={() => router.push('/team')}
            className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-yellow-600 transition-all group mb-20"
          >
             <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white/50 flex items-center justify-center group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all shadow-sm">
                <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
             </div>
             <span className="group-hover:translate-x-2 transition-transform italic">Return to Registry</span>
          </button>

          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Personnel <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-200 tracking-[-0.05em] group-hover:text-slate-900 transition-colors">Profile</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase border-b border-slate-100 pb-4 w-full justify-end">
                    <span>UNIT_STATUS</span>
                    <span>//</span>
                    <span className="text-yellow-600/50 flex items-center gap-3 font-mono">
                       ID_VANGUARD_{String(player.id).padStart(3, '0')}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
                    <span className="block skew-x-[15deg]">{player.role}</span>
                 </div>
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
             
             {/* Cinematic Portrait Section */}
             <div className="lg:col-span-5 animate-slide-right relative">
                <div className="absolute -top-10 -left-10 text-[12vw] font-black text-slate-900/[0.02] uppercase tracking-tighter select-none pointer-events-none italic rotate-[-10deg]">VANGUARD</div>
                
                <div className="relative group">
                   <div className="absolute -inset-6 bg-yellow-500/[0.05] blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                   
                   {/* The Main Frame */}
                   <div className="relative aspect-[4/5] glass-card hud-border border-slate-200 p-1 bg-white/50 shadow-[0_20px_60px_rgba(0,0,0,0.03)] overflow-hidden">
                      <div className="w-full h-full relative overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                         {player.image ? (
                            <img 
                               src={`/avatars/${player.image}`} 
                               alt={player.name}
                               className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                            />
                         ) : (
                            <FaUserAlt className="text-[10rem] text-slate-200" />
                         )}

                         {/* Ranging HUD Overlay */}
                         <div className="absolute inset-0 pointer-events-none border-[1px] border-slate-200/50" />
                         <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-yellow-500/20 group-hover:border-yellow-500 transition-colors" />
                         <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-yellow-500/20 group-hover:border-yellow-500 transition-colors" />
                         
                         {/* Dynamic Scanning Bar */}
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-scanline opacity-0 group-hover:opacity-100" />
                         
                         {/* Player Role HUD Labels */}
                         <div className="absolute top-8 right-8 flex flex-col items-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                            {player.captain && (
                               <div className="px-6 py-2 bg-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2 rounded shadow-[0_10px_30px_rgba(234,179,8,0.3)] border border-white/20">
                                  <FaStar className="animate-pulse" /> COMMAND_CORE
                               </div>
                            )}
                            <div className="px-5 py-2 bg-white/90 border border-slate-200 rounded-lg backdrop-blur-xl text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                               {player.role}
                            </div>
                         </div>

                         {/* Name Banner Overlay */}
                         <div className="absolute bottom-10 left-0 w-full px-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                            <div className="p-8 glass-card border-slate-200 bg-white/90 backdrop-blur-2xl relative overflow-hidden shadow-xl">
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                                <h1 className="text-6xl font-black uppercase tracking-tighter text-slate-900 transition-all group-hover:tracking-widest group-hover:text-yellow-600 mb-2 italic">{player.name.split(' ').slice(-1)}</h1>
                                <div className="flex justify-between items-center text-[9px] font-black tracking-[0.4em] text-slate-400">
                                   <span className="uppercase">{player.name}</span>
                                   <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-900">ID://{String(player.id).padStart(4, '0')}</span>
                                </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Performance Intel Section */}
             <div className="lg:col-span-7 space-y-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                 
                 {/* Profile Data Matrix */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Personal Bio Card */}
                    <div className="glass-card hud-border p-10 bg-white/70 border-slate-200 relative overflow-hidden group/bio shadow-sm">
                       <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/bio:opacity-10 transition-opacity">
                          <FaCalendarAlt className="text-4xl text-slate-900" />
                       </div>
                       <h3 className="text-[11px] font-black text-yellow-600 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                          Personnel_Summary
                       </h3>
                       <p className="text-sm font-black uppercase tracking-[0.15em] text-slate-600 leading-loose italic">"{player.bio}"</p>
                       
                       <div className="mt-12 space-y-6 border-t border-slate-100 pt-8">
                          <div className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-colors">
                             <FaCalendarAlt className="text-yellow-600/50" />
                             <span className="text-[10px] font-black tracking-[0.2em] uppercase">Deployment: OCT_2023</span>
                          </div>
                          <div className="flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-colors">
                             <FaMapMarkerAlt className="text-yellow-600/50" />
                             <span className="text-[10px] font-black tracking-[0.2em] uppercase">Sector: ESCUELA_CENTRAL</span>
                          </div>
                       </div>
                    </div>

                    {/* Role Efficacy Card */}
                    <div className="glass-card hud-border p-10 bg-white/70 border-slate-200 flex flex-col justify-between shadow-sm">
                       <h3 className="text-[11px] font-black text-yellow-600 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-600" />
                          Operational_Focus
                       </h3>
                       <div className="space-y-10">
                          {[
                             { label: 'Tactical Discipline', val: '94%', color: 'yellow-500' },
                             { label: 'Physical Endurance', val: '88%', color: 'yellow-500' },
                             { label: 'Technical Precision', val: '91%', color: 'yellow-500' },
                          ].map((stat, idx) => (
                             <div key={idx} className="group/stat">
                                <div className="flex justify-between items-center mb-3 px-1">
                                   <span className="text-[10px] text-slate-900 font-black uppercase tracking-[0.2em] transition-colors group-hover/stat:text-yellow-600">{stat.label}</span>
                                   <span className="text-[10px] text-yellow-600 font-mono italic">{stat.val}</span>
                                </div>
                                <div className="h-[2px] bg-slate-100 relative overflow-visible">
                                   <div className="absolute inset-y-0 left-0 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all duration-1000" style={{ width: stat.val }} />
                                   <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-900 scale-0 group-hover/stat:scale-100 transition-transform" style={{ left: stat.val }} />
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>



             </div>
          </div>
       </div>
    </div>
  );
}
