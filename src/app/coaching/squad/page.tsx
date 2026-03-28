"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaUsers, FaHeartbeat, FaSearch, FaFilter, 
  FaIdCard, FaStar, FaShieldAlt, FaLightbulb, 
  FaChartBar, FaUserEdit 
} from 'react-icons/fa';
import { useState, useEffect } from "react";
import Image from "next/image";

export default function SquadRegistryPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    async function fetchPlayers() {
      try {
        const res = await fetch('/api/team');
        const data = await res.json();
        setPlayers(Array.isArray(data) ? data : data.team || []);
      } catch (error) {
        console.error('Failed to fetch squad:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  if (status === "loading") return null;
  if (!session || (session.user as any)?.roles !== 'admin' && (session.user as any)?.roles !== 'coach') {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-yellow-500/30 font-sans overflow-hidden">
      {/* Neural_Orb 2.0 Environment */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full bg-yellow-500/[0.05] blur-[160px] transition-all duration-1000 ease-out"
          style={{ 
            left: `${mousePos.x}%`, 
            top: `${mousePos.y}%`, 
            transform: 'translate(-50%, -50%)' 
          }} 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.25] brightness-50" />
      </div>

      <div className="relative z-10 container-custom pt-32 pb-20">
        {/* Header Section */}
        <div className="mb-20 animate-slide-up">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 glass-card hud-border border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                 <FaUsers className="text-yellow-500 text-xl" />
              </div>
              <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] font-mono">Personnel_Registry // 104</span>
           </div>
           <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter italic leading-[0.8]">
              Squad <span className="text-yellow-500">Registry</span>
           </h1>
           <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.4em] mt-8 max-w-2xl leading-relaxed text-left">
              Real-time personnel telemetry. Monitor unit availability, performance ratings, and tactical synchronization status across the elite squad.
           </p>
        </div>

        {/* Global Stats HUD */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slide-up delay-100">
           {[
              { label: "Active Operatives", value: `${players.length}/12`, icon: FaUsers },
              { label: "Squad Efficiency", value: "94%", icon: FaLightbulb },
              { label: "Medical Alert", value: "01 Units", icon: FaHeartbeat, color: "text-red-500" },
              { label: "Tactical Sync", value: "Optimized", icon: FaShieldAlt, color: "text-green-500" },
           ].map((stat, i) => (
              <div key={i} className="glass-card hud-border p-6 bg-slate-950/40 group hover:bg-white/[0.04] transition-all relative overflow-hidden">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-yellow-500/10 transition-colors">
                       <stat.icon className={`text-lg ${stat.color || 'text-slate-500'}`} />
                    </div>
                    <div className="text-left">
                       <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                       <p className="text-xl font-black uppercase tracking-tight italic">{stat.value}</p>
                    </div>
                 </div>
              </div>
           ))}
        </div>

        {/* Unit Matrix (Table) */}
        <div className="glass-card hud-border bg-slate-950/40 relative overflow-hidden animate-slide-up delay-200">
           <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="border-b border-white/5 bg-slate-900/40">
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Unit_ID</th>
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Role</th>
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Status</th>
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Availability</th>
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Battle_Rating</th>
                       <th className="px-8 py-6 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/[0.03]">
                    {players.map((player, idx) => (
                       <tr key={idx} className="group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-900 border border-white/5 overflow-hidden p-0.5">
                                   <div className="w-full h-full bg-slate-950 rounded-md overflow-hidden relative">
                                      {player.image && <Image src={`/avatars/${player.image}`} alt={player.name} fill className="object-cover" />}
                                   </div>
                                </div>
                                <div className="text-left">
                                   <p className="text-[11px] font-black text-white uppercase tracking-tight italic group-hover:text-yellow-500 transition-colors leading-none">{player.name}</p>
                                   <p className="text-[8px] text-slate-600 font-mono tracking-widest mt-1">AUTH_CORE_{String(player.id).padStart(3, '0')}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-md">{player.role}</span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${player.status === 'available' ? 'bg-green-500' : 'bg-red-500'}`} />
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${player.status === 'available' ? 'text-green-500/80' : 'text-red-500/80'}`}>{player.status === 'available' ? 'MISSION_CLEAR' : player.status}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6 w-48">
                             <div className="space-y-2">
                                <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-600">
                                   <span className="group-hover:text-yellow-500 transition-colors italic">Efficiency</span>
                                   <span>{player.status === 'available' ? '100%' : '45%'}</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                   <div 
                                      className={`h-full transition-all duration-1000 ${player.status === 'available' ? 'bg-yellow-500' : 'bg-red-500'}`}
                                      style={{ width: `${player.status === 'available' ? 100 : 45}%` }} 
                                   />
                                </div>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <span className="text-2xl font-black text-white italic tracking-tighter opacity-80 group-hover:opacity-100 transition-opacity">88</span>
                                <FaStar className="text-yellow-500 text-[10px]" />
                             </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <button className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-colors border border-white/5 hover:border-white/10 px-6 py-3 rounded-lg bg-white/[0.01]">View Personnel File</button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        {/* Tactical Note Label */}
        <div className="mt-12 flex items-center justify-center">
           <div className="glass-card hud-border px-8 py-3 bg-white/[0.02] flex items-center gap-4">
              <FaFilter className="text-slate-700 text-[10px]" />
              <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.5em]">Encryption_Level 0.8 // Tactical_Layer_Active</span>
           </div>
        </div>
      </div>
    </div>
  );
}
