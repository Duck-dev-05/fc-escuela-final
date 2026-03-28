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
       <div className="min-h-screen bg-[#020202] flex items-center justify-center">
          <div className="flex flex-col items-center gap-8 animate-pulse">
             <div className="w-24 h-24 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin shadow-[0_0_30px_rgba(234,179,8,0.2)]" />
             <p className="text-yellow-500 font-black uppercase tracking-[0.5em] text-[10px]">INITIALIZING_PERSONNEL_LINK...</p>
          </div>
       </div>
     )
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center text-white p-8">
        <h1 className="text-6xl font-black uppercase mb-8 tracking-tighter">Unit_Offline</h1>
        <button onClick={() => router.push('/team')} className="btn-primary px-12 py-4">Return to Command Registry</button>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.03] blur-[120px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 z-10" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.03] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-20 left-10 select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0">
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">PERSONNEL_INTEL</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20">
          {/* Back Link HUD */}
          <button 
            onClick={() => router.push('/team')}
            className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 hover:text-yellow-500 transition-all group mb-20"
          >
             <div className="w-12 h-12 rounded-lg border border-white/5 bg-slate-950/40 flex items-center justify-center group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all">
                <FaArrowLeft className="group-hover:-translate-x-2 transition-transform" />
             </div>
             <span className="group-hover:translate-x-2 transition-transform italic">Return to Registry</span>
          </button>

          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Personnel_Access: Sector_02
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {String(player.id).padStart(3, '0')}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Personnel <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Profile</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>UNIT_STATUS</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       ID_VANGUARD_{String(player.id).padStart(3, '0')}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">{player.role}</span>
                 </div>
              </div>
          </div>

      <div className="container-custom py-40 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Cinematic Portrait Section */}
            <div className="lg:col-span-5 animate-slide-right relative">
               <div className="absolute -top-10 -left-10 text-[12vw] font-black text-white/[0.03] uppercase tracking-tighter select-none pointer-events-none italic rotate-[-10deg]">VANGUARD</div>
               
               <div className="relative group">
                  <div className="absolute -inset-6 bg-yellow-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                  
                  {/* The Main Frame */}
                  <div className="relative aspect-[4/5] glass-card hud-border border-white/10 p-1 bg-slate-900/40 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                     <div className="w-full h-full relative overflow-hidden bg-slate-950 flex items-center justify-center border border-white/5">
                        {player.image ? (
                           <img 
                              src={`/avatars/${player.image}`} 
                              alt={player.name}
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                           />
                        ) : (
                           <FaUserAlt className="text-[10rem] text-slate-800/50" />
                        )}

                        {/* Ranging HUD Overlay */}
                        <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5" />
                        <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-yellow-500/30 group-hover:border-yellow-500 transition-colors" />
                        <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-yellow-500/30 group-hover:border-yellow-500 transition-colors" />
                        
                        {/* Dynamic Scanning Bar */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent animate-scanline opacity-0 group-hover:opacity-100" />
                        
                        {/* Player Role HUD Labels */}
                        <div className="absolute top-8 right-8 flex flex-col items-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-700">
                           {player.captain && (
                              <div className="px-6 py-2 bg-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-[0.4em] flex items-center gap-2 rounded shadow-[0_0_30px_rgba(234,179,8,0.5)] border border-white/20">
                                 <FaStar className="animate-pulse" /> COMMAND_CORE
                              </div>
                           )}
                           <div className="px-5 py-2 bg-slate-950/80 border border-white/10 rounded-lg backdrop-blur-xl text-white font-black text-[10px] uppercase tracking-[0.2em]">
                           {player.role}
                        </div>
                        </div>

                        {/* Name Banner Overlay */}
                        <div className="absolute bottom-10 left-0 w-full px-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                           <div className="p-8 glass-card border-yellow-500/20 bg-black/80 backdrop-blur-2xl relative overflow-hidden">
                               <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/50" />
                               <h1 className="text-6xl font-black uppercase tracking-tighter text-white transition-all group-hover:tracking-widest group-hover:text-yellow-500 mb-2">{player.name.split(' ').slice(-1)}</h1>
                               <div className="flex justify-between items-center text-[9px] font-black tracking-[0.4em] text-yellow-500/60">
                                  <span>{player.name}</span>
                                  <span className="font-mono bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20 text-yellow-500">ID://{String(player.id).padStart(4, '0')}</span>
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
                   <div className="glass-card hud-border p-10 bg-slate-950/40 border-white/5 relative overflow-hidden group/bio">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/bio:opacity-10 transition-opacity">
                         <FaCalendarAlt className="text-4xl" />
                      </div>
                      <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                         Personnel_Summary
                      </h3>
                      <p className="text-sm font-bold uppercase tracking-[0.15em] text-white/90 leading-loose italic">"{player.bio}"</p>
                      
                      <div className="mt-12 space-y-6 border-t border-white/5 pt-8">
                         <div className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
                            <FaCalendarAlt className="text-yellow-500/50" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Deployment: OCT_2023</span>
                         </div>
                         <div className="flex items-center gap-4 text-slate-500 hover:text-white transition-colors">
                            <FaMapMarkerAlt className="text-yellow-500/50" />
                            <span className="text-[10px] font-black tracking-[0.2em] uppercase">Sector: ESCUELA_CENTRAL</span>
                         </div>
                      </div>
                   </div>

                   {/* Role Efficacy Card */}
                   <div className="glass-card hud-border p-10 bg-slate-950/40 border-white/5 flex flex-col justify-between">
                      <h3 className="text-[11px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-10 flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
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
                                  <span className="text-[10px] text-white font-black uppercase tracking-[0.2em] transition-colors group-hover/stat:text-yellow-500">{stat.label}</span>
                                  <span className="text-[10px] text-yellow-500 font-mono italic">{stat.val}</span>
                               </div>
                               <div className="h-[2px] bg-white/5 relative overflow-visible">
                                  <div className={`absolute inset-y-0 left-0 bg-${stat.color} shadow-[0_0_15px_rgba(234,179,8,0.6)] transition-all duration-1000`} style={{ width: stat.val }} />
                                  <div className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white scale-0 group-hover/stat:scale-100 transition-transform" style={{ left: stat.val }} />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>

                {/* HUD Global Telemetry - Ready for 7-a-side metrics */}
                <div className="glass-card hud-border p-12 bg-yellow-500/[0.02] border-yellow-500/10 relative group/tele">
                   <div className="absolute top-4 right-6 font-mono text-[7px] text-yellow-500/40">OPERATIONAL_LOAD: 82.4%</div>
                   <div className="flex items-center gap-4 mb-12">
                      <FaTrophy className="text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                      <h3 className="text-[11px] font-black text-white uppercase tracking-[0.5em]">Command_Readiness_Report</h3>
                   </div>
                   
                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                      <div className="flex flex-col items-center group/item hover:scale-110 transition-transform duration-500">
                         <div className="w-16 h-16 rounded-2xl glass-card border-white/5 bg-slate-900 mb-6 flex items-center justify-center group-hover/item:border-yellow-500/50 transition-colors">
                            <FaBolt className="text-yellow-500 text-2xl" />
                         </div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Power_Index</p>
                         <p className="text-4xl font-black font-mono tracking-tighter text-white">92.4</p>
                      </div>
                      <div className="flex flex-col items-center group/item hover:scale-110 transition-transform duration-500">
                         <div className="w-16 h-16 rounded-2xl glass-card border-white/5 bg-slate-900 mb-6 flex items-center justify-center group-hover/item:border-yellow-500/50 transition-colors">
                            <FaShieldAlt className="text-yellow-500 text-2xl" />
                         </div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Def_Protocol</p>
                         <p className="text-4xl font-black font-mono tracking-tighter text-white">88.9</p>
                      </div>
                      <div className="flex flex-col items-center group/item hover:scale-110 transition-transform duration-500">
                         <div className="w-16 h-16 rounded-2xl glass-card border-white/5 bg-slate-900 mb-6 flex items-center justify-center group-hover/item:border-yellow-500/50 transition-colors">
                            <FaCrosshairs className="text-yellow-500 text-2xl" />
                         </div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Precision</p>
                         <p className="text-4xl font-black font-mono tracking-tighter text-white">96.1</p>
                      </div>
                      <div className="flex flex-col items-center group/item hover:scale-110 transition-transform duration-500">
                         <div className="w-16 h-16 rounded-full border-4 border-green-500/20 bg-green-500/5 mb-6 flex items-center justify-center font-black font-mono text-xs text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                            <div className="animate-pulse">FIT_01</div>
                         </div>
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">Condition</p>
                         <p className="text-2xl font-black text-green-500 uppercase italic">Optimal</p>
                      </div>
                   </div>
                </div>

                {/* Technical Footnote / Encryption Vibe */}
                <div className="relative group/note p-12 glass-card hud-border bg-slate-950/20 border-white/5 overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/20 group-hover/note:bg-yellow-500 transition-colors" />
                   <div className="absolute top-0 right-0 p-3 opacity-10">
                      <FaCodeBranch className="text-2xl" />
                   </div>
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                      <FaCogs className="text-yellow-500/50" />
                      Strategic_Operational_Note // ST-GRID-772
                   </h4>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.25em] leading-[2.2] max-w-2xl group-hover:text-white transition-colors duration-700">
                      Combatant demonstrates elite-level spatial reasoning and technical fluidity within high-pressure tactical environments. Currently deployed as 
                      <span className="text-yellow-500 mx-2">{player.role}</span> with superior rating for the current 
                      <span className="text-yellow-500 mx-2">Unit_Formation</span> synchronization.
                   </p>
                   
                   <div className="mt-8 pt-8 border-t border-white/5 flex gap-8 items-center">
                      <div className="flex flex-col gap-1">
                         <span className="text-[7px] text-slate-700 font-mono">ENCRYPT_KEY: XJ4-K9-822</span>
                         <span className="text-[7px] text-slate-700 font-mono">TIMESTAMP: {new Date().toISOString().split('T')[0]}</span>
                      </div>
                      <div className="glass-card px-4 py-1.5 border-green-500/20 bg-green-500/5">
                         <span className="text-[8px] text-green-500 font-black tracking-widest uppercase animate-pulse">VERIFIED_PERSONNEL</span>
                      </div>
                   </div>
                </div>

            </div>
         </div>
      </div>
    </div>
  </div>
)
}
