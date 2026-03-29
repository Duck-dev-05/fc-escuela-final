"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaLock, FaUserCircle, FaCheckCircle, FaExclamationCircle, 
  FaShieldAlt, FaTrashAlt, FaTerminal, FaBroadcastTower, FaCog
} from 'react-icons/fa';
import ProfileImage from "@/components/ProfileImage";
import NeuralBackdrop from "@/components/NeuralBackdrop";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
   const [profile, setProfile] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
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
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data.user);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchProfile();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') router.push('/login');

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
        <NeuralBackdrop ghostText="SECURITY_OP" />

       <div className="max-w-[1400px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Security_Access: Level_Alpha
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {session?.user?.id?.substring(0,8).toUpperCase() || 'UNA-000'}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Security <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Protocol</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>UNIT_PROTECTION</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       {new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">SHIELD_STATUS: ACTIVE</span>
                 </div>
              </div>
          </div>

        <div className="grid grid-cols-1 gap-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Profile Overview HUD */}
          <section className="glass-card hud-border p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[9px] text-slate-700 font-mono">
                SYS_METRIC_01
             </div>
             <div className="flex flex-col md:flex-row gap-10 items-center">
                 <div className="relative group">
                    <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
                    <ProfileImage 
                       src={profile?.image} 
                       name={profile?.name} 
                       size={112} 
                       className="rounded-2xl" 
                    />
                 </div>
                
                <div className="flex-1 text-center md:text-left space-y-4">
                   <div>
                      <h3 className="text-2xl font-black text-white uppercase tracking-widest">{profile?.name || 'Operator'}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{profile?.email}</p>
                   </div>
                   <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 glass-card border-white/5 text-[9px] font-black uppercase tracking-widest">
                         {profile?.emailVerified ? (
                           <> <FaCheckCircle className="text-green-500" /> <span className="text-green-500">Verified</span> </>
                         ) : (
                           <> <FaExclamationCircle className="text-red-500" /> <span className="text-red-500">Unverified</span> </>
                         )}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 glass-card border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                         <FaBroadcastTower /> Origin: {profile?.nationality || 'Internal'}
                      </div>
                   </div>
                </div>
                
                <button 
                  onClick={() => router.push('/profile/edit')}
                  className="btn-primary py-3 px-8 text-[10px]"
                >
                  Edit Registry
                </button>
             </div>
          </section>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Account Details HUD */}
             <div className="glass-card hud-border p-8 bg-white/[0.02]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                   <FaTerminal className="text-yellow-500 text-xs" />
                   Registry Metadata
                </h3>
                <div className="space-y-4">
                   {[
                     { label: 'Transmission Code', value: profile?.username },
                     { label: 'Bio Metric Status', value: profile?.bio ? 'Configured' : 'Empty' },
                     { label: 'Liaison Unit', value: profile?.favoriteTeam },
                     { label: 'Protocol Class', value: profile?.membershipType || 'Standard' }
                   ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                         <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.label}</span>
                         <span className="text-xs text-white font-bold">{item.value || '-'}</span>
                      </div>
                   ))}
                </div>
             </div>

             {/* Security Overview HUD */}
             <div className="glass-card hud-border p-8 bg-white/[0.02]">
                <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                   <FaShieldAlt className="text-yellow-500 text-xs" />
                   Security Status
                </h3>
                <div className="space-y-4">
                   <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-[10px] text-green-500 font-black uppercase animate-pulse">Active</span>
                    </div>
                   </div>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                      Registry protection is active. All terminal sessions are encrypted via TLS 1.3 protocol.
                   </p>
                   <button 
                     onClick={() => router.push('/auth/change-password')}
                     className="w-full py-3 glass-card hud-border bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-950 transition-all mt-4"
                   >
                     Update Access Key
                   </button>
                </div>
             </div>
          </div>

          {/* Danger Zone HUD */}
          <section className="glass-card border-red-500/50 bg-red-500/5 p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 border-l border-b border-red-500/20 text-[9px] text-red-500/50 font-mono italic">
                CAUTION: DESTRUCTIVE_PROTOCOL
             </div>
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/50">
                   <FaTrashAlt className="text-red-500 text-2xl group-hover:scale-125 transition-transform" />
                </div>
                <div className="flex-1 text-center md:text-left">
                   <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Protocol Termination</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest max-w-lg">
                      Initialize account deletion. All registry data, including tickets and memberships, will be permanently purged. This action cannot be reversed.
                   </p>
                </div>
                <button 
                  onClick={async () => {
                    if (window.confirm('CRITICAL: Permanent registry deletion requested. Continue?')) {
                      try {
                        const response = await fetch('/api/users/delete', { method: 'DELETE' });
                        if (response.ok) {
                          await signOut({ redirect: false });
                          router.push('/');
                        } else {
                          const data = await response.json();
                          alert(data.error || 'Termination Failed');
                        }
                      } catch (error) {
                        alert('System Error during termination sequence.');
                      }
                    }
                  }}
                  className="px-10 py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-lg hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all"
                >
                  Confirm Termination
                </button>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}