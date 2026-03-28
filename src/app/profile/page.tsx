"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  FaLock, FaUserCircle, FaStar, FaPhone, FaEnvelope, 
  FaUser, FaIdCard, FaMapMarkerAlt, FaCalendarAlt, 
  FaCheckCircle, FaUsers, FaThLarge, FaEdit, FaShieldAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useState, useEffect } from "react";
import { formatDistanceToNow, format } from 'date-fns';
import { Tab } from '@headlessui/react';
import Image from "next/image";
import { FaTrophy, FaMedal, FaChartPie, FaLightbulb, FaQuoteLeft } from 'react-icons/fa';

interface Profile {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
  dob?: string;
  address?: string;
  gender?: string;
  nationality?: string;
  language?: string;
  bio?: string;
  website?: string;
  occupation?: string;
  favoriteTeam?: string;
  username?: string;
  emailVerified?: boolean;
  memberSince?: string;
  role?: string;
  accounts?: any[];
  isMember?: boolean;
  membershipType?: string;
  roles?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
   const [profile, setProfile] = useState<Profile | null>(null);
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

   const tabs = profile?.roles === 'admin' 
     ? ['Tactical Overview', 'Personnel Registry', 'Security Protocols'] 
     : ['Account', 'Membership', 'Security'];

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
  }

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
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Command Center...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full glass-card hud-border p-10 text-center animate-slide-up">
          <FaLock className="mx-auto h-12 w-12 text-yellow-500/50 mb-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Access Restricted</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Authentication Protocol Required</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary w-full"
          >
            Authenticate
          </button>
        </div>
      </div>
    );
  }

  const profileCompletionFallback = profile ? Math.round([
    profile.name, profile.username, profile.email, profile.phone,
    profile.dob, profile.address, profile.gender, profile.nationality,
    profile.language, profile.bio, profile.website, profile.occupation,
    profile.favoriteTeam,
  ].filter(Boolean).length / 13 * 100) : 0;
 
  const now = new Date();

  const displayName = session?.user?.name || profile?.name || 'Operator';
  const displayEmail = session?.user?.email || profile?.email || '';
  const displayImage = session?.user?.image || profile?.image || null;
  const displayId = profile?.id || 'UNA-000';

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[1000px] h-[1000px] rounded-full bg-yellow-500/[0.04] blur-[150px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.2] brightness-50 z-10" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.04] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-20 left-10 select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0">
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">OPERATOR_INTEL</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Command_Access: Level_01
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {displayId.toUpperCase()}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Profile <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Hub</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>SECTOR_ACCOUNT</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       {now.toISOString().split('T')[0]} // {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">{profile?.roles === 'admin' ? 'Head_Coach' : 'Operator'}</span>
                 </div>
              </div>
          </div>
        <div className="flex flex-col gap-8">
          
          {/* Elite Profile Header Node */}
          <div className="glass-card hud-border p-10 md:p-16 bg-slate-950/40 border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)] animate-slide-up relative overflow-hidden group mb-16">
             {/* Technical Corner Accents */}
             <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-yellow-500/10 group-hover:border-yellow-500 transition-colors" />
             <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-yellow-500/10 group-hover:border-yellow-500 transition-colors" />
             
             <div className="flex flex-col md:flex-row items-center md:items-end gap-12 relative z-10">
                <div className="relative shrink-0">
                   <div className="absolute inset-0 bg-yellow-500/10 blur-[80px] rounded-full animate-pulse" />
                   <div className="w-40 h-40 md:w-56 md:h-56 glass-card hud-border border-white/10 p-2 bg-slate-950/80 relative overflow-hidden group/avatar shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                      {displayImage ? (
                         <img src={displayImage} alt="O" className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-[2s] ease-out opacity-70 group-hover/avatar:opacity-100" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                            <FaUserCircle className="text-8xl text-slate-800" />
                         </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-yellow-500/10 to-transparent pointer-events-none" />
                      {/* Scanning Line */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent h-1/4 w-full animate-scan opacity-0 group-hover/avatar:opacity-100" />
                   </div>
                </div>

                <div className="flex-1 text-center md:text-left min-w-0">
                   <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]" />
                      <span className="text-[10px] text-green-500 font-black uppercase tracking-[0.4em]">Unit_Synchronized</span>
                   </div>
                   <h1 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter leading-[0.8] mb-8 italic group-hover:text-yellow-50 transition-colors">
                      {displayName}
                   </h1>
                   <div className="flex flex-wrap items-center justify-center md:justify-start gap-12">
                      <div className="flex flex-col gap-2">
                         <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Communication_Link</span>
                         <span className="text-sm text-yellow-500/80 font-bold tracking-widest italic">{displayEmail}</span>
                      </div>
                      <div className="w-px h-10 bg-white/5 hidden sm:block" />
                      <div className="flex flex-col gap-2">
                         <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em]">Clearance_Role</span>
                         <span className="text-sm text-white font-black uppercase tracking-[0.2em]">{profile?.roles === 'admin' ? 'Head // Coach' : 'Personnel'}</span>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Neural Link Line */}
             <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-500 group-hover:w-full transition-all duration-[2s]" />
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
             {/* Side Metrics HUD */}
             <div className="w-full lg:w-72 shrink-0 space-y-6">
                <div className="glass-card hud-border p-6 bg-slate-950/60 backdrop-blur-xl">
                   <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center justify-between">
                      <span>Profile Integrity</span>
                      <span className="text-yellow-500 font-mono">{profileCompletionFallback}%</span>
                   </div>
                   <div className="relative h-40 flex items-center justify-center">
                      <svg className="w-32 h-32 transform -rotate-90">
                         <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                         <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="351.85" strokeDashoffset={351.85 * (1 - profileCompletionFallback / 100)} className="text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] transition-all duration-1000" />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                         <span className="text-2xl font-black text-white italic">{profileCompletionFallback}</span>
                         <span className="text-[7px] text-slate-500 font-black uppercase tracking-[0.2em]">Completion</span>
                      </div>
                   </div>
                </div>

                <div className="glass-card hud-border p-4 bg-yellow-500/5 group hover:bg-yellow-500 transition-all duration-500 cursor-pointer overflow-hidden relative">
                   <div className="relative z-10 flex items-center justify-between" onClick={() => router.push('/profile/edit')}>
                      <div className="flex items-center gap-3">
                         <FaEdit className="text-yellow-500 group-hover:text-slate-950 transition-colors" />
                         <span className="text-[10px] font-black text-yellow-500 group-hover:text-slate-950 uppercase tracking-widest transition-colors">Edit Profile</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center group-hover:bg-slate-950/20 transition-colors">
                         <FaStar className="text-[10px] text-yellow-500 group-hover:text-slate-950 transition-colors" />
                      </div>
                   </div>
                   <div className="absolute top-0 right-0 w-24 h-full bg-white/5 translate-x-32 group-hover:translate-x-0 transition-transform duration-700 skew-x-[30deg]" />
                </div>
             </div>

             {/* Main Command Panes */}
             <div className="flex-1 min-w-0">
                <Tab.Group>
                   <Tab.List className="flex gap-4 p-1 glass-card hud-border border-white/5 rounded-xl mb-8 bg-slate-950/40">
                      {tabs.map((tab) => (
                         <Tab
                           key={tab}
                           className={({ selected }) =>
                             classNames(
                               'flex-1 py-4 text-[11px] font-black uppercase tracking-[0.3em] rounded-lg transition-all relative overflow-hidden group/tab',
                               selected
                                 ? 'bg-yellow-500 text-slate-950 shadow-[0_10px_30px_rgba(234,179,8,0.2)]'
                                 : 'text-slate-500 hover:text-white hover:bg-white/[0.04]'
                             )
                           }
                         >
                            <span className="relative z-10">{tab}</span>
                         </Tab>
                      ))}
                   </Tab.List>
                   
                   <Tab.Panels className="focus:outline-none">
                      <Tab.Panel className="space-y-12 outline-none animate-slide-up">
                         {profile?.roles === 'admin' && (
                            <div className="space-y-12 mb-12">
                               {/* Battle_IQ & Win Rate Node */}
                               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  <div className="glass-card hud-border p-8 bg-slate-950/60 relative overflow-hidden group/iq flex flex-col items-center justify-center min-h-[300px]">
                                     <div className="absolute top-4 left-4 flex items-center gap-2">
                                        <FaChartPie className="text-yellow-500 text-[10px]" />
                                        <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em]">Battle_IQ Analytics</span>
                                     </div>
                                     <div className="relative w-40 h-40 flex items-center justify-center mb-4">
                                        <svg className="w-full h-full transform -rotate-90">
                                           <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-white/5" />
                                           <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="439.8" strokeDashoffset="87.96" className="text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.5)] transition-all duration-[2s] ease-out" />
                                        </svg>
                                        <div className="absolute flex flex-col items-center">
                                           <span className="text-5xl font-black text-white italic tracking-tighter leading-none">82%</span>
                                           <span className="text-[8px] text-yellow-500/50 font-black uppercase tracking-[0.2em] mt-1">Win_Rate</span>
                                        </div>
                                     </div>
                                     <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em] italic text-center">Elite Strategic Quotient</p>
                                  </div>

                                  <div className="md:col-span-2 glass-card hud-border p-10 bg-slate-950/40 relative overflow-hidden group/philosophy flex flex-col justify-between">
                                     <div className="absolute top-0 right-0 p-6 opacity-5">
                                        <FaQuoteLeft className="text-8xl text-white" />
                                     </div>
                                     <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-8">
                                           <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_10px_orange]" />
                                           <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em]">Tactical Philosophy</h3>
                                        </div>
                                        <p className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-[0.9] mb-10 max-w-xl group-hover:text-yellow-50 transition-colors">
                                           "Aggression is the primary directive. We dominate the grid through high-frequency transitions and relentless spatial control."
                                        </p>
                                     </div>
                                     <div className="flex items-center gap-8 border-t border-white/5 pt-8">
                                        {[
                                           { label: 'System', val: '2-3-1 Matrix' },
                                           { label: 'Tempo', val: 'Overdrive' },
                                           { label: 'Focus', val: 'Verticality' }
                                        ].map((p, i) => (
                                           <div key={i} className="flex flex-col gap-1">
                                              <span className="text-[8px] text-slate-700 font-black uppercase tracking-widest">{p.label}</span>
                                              <span className="text-[11px] text-yellow-500/80 font-mono font-bold uppercase">{p.val}</span>
                                           </div>
                                        ))}
                                     </div>
                                  </div>
                               </div>

                               {/* Trophy Cabinet: Cinematic Medal Display */}
                               <div className="glass-card hud-border p-10 bg-slate-950/60 relative overflow-hidden group/cabinet">
                                  <div className="flex items-center justify-between mb-12">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 glass-card hud-border border-yellow-500/30 flex items-center justify-center bg-yellow-500/5">
                                           <FaTrophy className="text-yellow-500" />
                                        </div>
                                        <div>
                                           <h3 className="text-[11px] font-black text-white uppercase tracking-[0.6em]">Championship Registry</h3>
                                           <p className="text-[7px] text-slate-700 font-mono tracking-widest uppercase mt-1">Authenticated Honors // Level_01</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <span className="text-4xl font-black text-slate-800 tracking-tighter italic group-hover/cabinet:text-yellow-500 transition-colors">04_Units</span>
                                     </div>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                     {[
                                        { title: 'Divisional Shield', year: '2025', icon: FaMedal, color: 'text-yellow-500' },
                                        { title: 'Operational Cup', year: '2024', icon: FaTrophy, color: 'text-slate-400' },
                                        { title: 'Vanguard Series', year: '2024', icon: FaStar, color: 'text-yellow-600' },
                                        { title: 'Regional Master', year: '2023', icon: FaShieldAlt, color: 'text-blue-500' }
                                     ].map((medal, i) => (
                                        <div key={i} className="p-8 glass-card border-white/5 bg-slate-900/40 hover:bg-yellow-500/5 hover:border-yellow-500/20 transition-all group/medal relative overflow-hidden text-center">
                                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent h-1/2 w-full -translate-y-full group-hover/medal:translate-y-full transition-transform duration-[1.5s]" />
                                           <medal.icon className={`text-4xl mx-auto mb-6 ${medal.color} group-hover:scale-110 transition-transform duration-500`} />
                                           <h4 className="text-[10px] font-black text-white uppercase tracking-tighter mb-1.5">{medal.title}</h4>
                                           <span className="text-[8px] text-slate-600 font-mono font-bold tracking-widest">{medal.year}</span>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                            </div>
                         )}

                         {/* Personal Data Nodes */}
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                              { label: 'Full Name', value: profile?.name, icon: FaUser },
                              { label: 'Username', value: profile?.username, icon: FaIdCard },
                              { label: 'Phone Number', value: profile?.phone, icon: FaPhone },
                              { label: 'Date of Birth', value: profile?.dob, icon: FaCalendarAlt },
                              { label: 'Address', value: profile?.address, icon: FaMapMarkerAlt },
                              { label: 'Gender', value: profile?.gender, icon: FaUsers },
                              { label: 'Nationality', value: profile?.nationality, icon: FaIdCard },
                              { label: 'Preferred Language', value: profile?.language, icon: FaEnvelope },
                            ].map((item, idx) => (
                               <div key={idx} className="glass-card hud-border p-5 bg-slate-950/40 group hover:bg-white/[0.04] transition-all hover:-translate-y-1">
                                  <div className="flex items-center gap-3 mb-3">
                                     <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all">
                                        <item.icon className="text-[12px]" />
                                     </div>
                                     <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">{item.label}</span>
                                  </div>
                                  <div className="text-[13px] text-white font-bold ml-11 overflow-hidden truncate opacity-90">
                                     {item.value || <span className="text-slate-700 italic text-[10px]">Not Specified</span>}
                                  </div>
                               </div>
                            ))}
                         </div>
                         
                         <div className="glass-card hud-border p-6 bg-slate-950/40">
                            <div className="flex items-center gap-3 mb-4">
                               <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                                  <FaEdit className="text-[12px] text-yellow-500" />
                               </div>
                               <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Bio / Summary</span>
                            </div>
                            <div className="text-xs text-slate-300 font-medium leading-relaxed ml-11 opacity-80 italic">
                               {profile?.bio || 'No biographical data available.'}
                            </div>
                         </div>
                      </Tab.Panel>

                      <Tab.Panel className="outline-none animate-slide-up">
                         {profile?.roles === 'admin' ? (
                            <div className="glass-card hud-border p-12 overflow-hidden relative bg-slate-950/40">
                               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                               <div className="flex flex-col items-center text-center relative z-10">
                                  <div className="w-24 h-24 mb-10 text-yellow-500 transition-all duration-700 flex items-center justify-center glass-card border-yellow-500/20 bg-yellow-500/5 relative">
                                     <FaUsers className="text-4xl shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
                                     <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-yellow-500/40" />
                                     <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-yellow-500/40" />
                                  </div>
                                  <h3 className="text-5xl font-black text-white uppercase tracking-tighter mb-4 italic">Personnel <span className="text-yellow-500">Sync</span></h3>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-12 max-w-lg">
                                     Operational clearance confirmed. All personnel assets are synchronized with your tactical directive.
                                  </p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                                     <div className="p-8 glass-card hud-border bg-white/[0.02] text-left group hover:bg-yellow-500/5 transition-all">
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest mb-2 group-hover:text-yellow-500">Active Operatives</p>
                                        <p className="text-2xl font-black text-white italic">12 / 12 ASSETS</p>
                                     </div>
                                     <div className="p-8 glass-card hud-border border-yellow-500/10 bg-yellow-500/5 text-left">
                                        <p className="text-[8px] text-yellow-500/60 font-black uppercase tracking-widest mb-2 font-mono">Registry_Status</p>
                                        <p className="text-2xl text-yellow-500 font-black italic tracking-tighter">FULLY_VETTED</p>
                                     </div>
                                  </div>
                                  <button onClick={() => router.push('/coaching/squad')} className="mt-12 btn-primary px-12 py-5 text-[10px]">
                                     Manage Registry
                                  </button>
                               </div>
                            </div>
                         ) : (
                            <div className="glass-card hud-border p-12 overflow-hidden relative bg-slate-950/40">
                               {/* Decorative Grid */}
                               <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                               
                               <div className="flex flex-col items-center text-center relative z-10">
                                  {profile?.isMember ? (() => {
                                     const latestMembership = (profile as any).memberships?.[0];
                                     const isExpired = latestMembership?.endDate && new Date(latestMembership.endDate) < now;
                                     return (
                                       <div className="w-full">
                                          <div className="relative inline-block mb-10">
                                             <div className={`absolute inset-0 blur-[40px] rounded-2xl animate-pulse ${isExpired ? 'bg-red-500/40' : 'bg-yellow-500/40'}`} />
                                             <div className={`w-24 h-24 text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl relative border border-white/20 transform hover:rotate-6 transition-transform ${isExpired ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-yellow-400 to-yellow-600'}`}>
                                                {isExpired ? <FaExclamationTriangle className="text-5xl" /> : <FaStar className="text-5xl" />}
                                             </div>
                                          </div>
                                          <h3 className={`text-5xl font-black uppercase tracking-tighter mb-4 ${isExpired ? 'text-red-500' : 'text-white'}`}>
                                             {isExpired ? 'Membership Expired' : 'Elite Member'}
                                          </h3>
                                          <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-12 ${isExpired ? 'text-red-500/60' : 'text-yellow-500/60'}`}>
                                             {isExpired ? 'Protocol Validity Concluded' : 'Authenticated Club Membership'}
                                          </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
                                           <div className="p-6 glass-card hud-border bg-white/[0.02] text-left">
                                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Member Since</p>
                                              <p className="text-sm text-white font-bold">{profile.memberSince ? format(new Date(profile.memberSince), 'PPP') : 'N/A'}</p>
                                           </div>
                                           <div className="p-6 glass-card hud-border bg-white/[0.02] text-left border-yellow-500/20">
                                              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2 text-yellow-500/60">Membership Type</p>
                                              <p className="text-sm text-yellow-500 font-black italic">{profile.membershipType || 'Premium Vanguard'}</p>
                                           </div>
                                        </div>
                                     </div>
                                    );
                                  })() : (
                                     <div className="py-10">
                                        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center border border-white/10 mb-8 mx-auto grayscale opacity-40">
                                           <FaUserCircle className="text-5xl text-slate-500" />
                                        </div>
                                        <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 opacity-50">Standard Guest</h3>
                                        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-10 max-w-sm mx-auto">Upgrade to a club membership to unlock exclusive benefits and priority access.</p>
                                        <button
                                          onClick={() => router.push('/membership')}
                                          className="btn-primary px-12 py-5 text-[11px]"
                                        >
                                          Upgrade Now
                                        </button>
                                     </div>
                                  )}
                               </div>
                            </div>
                         )}
                      </Tab.Panel>

                      <Tab.Panel className="space-y-6 outline-none animate-slide-up">
                         <div className="glass-card hud-border p-10 bg-slate-950/40 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] rounded-full pointer-events-none" />
                            
                            <div className="flex items-center gap-6 mb-12">
                               <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.15)] group-hover:scale-110 transition-transform">
                                  <FaShieldAlt className="text-yellow-500 text-3xl" />
                               </div>
                               <div>
                                  <div className="flex items-center gap-2 mb-1.5">
                                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                     <span className="text-[11px] text-green-500 font-black uppercase tracking-widest">{profile?.roles === 'admin' ? 'Neural_Link Active' : 'Security Secure'}</span>
                                  </div>
                                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em]">{profile?.roles === 'admin' ? 'Command Protection Active' : 'Protection Protocol Active'}</p>
                               </div>
                            </div>
                            
                            <div className="space-y-4">
                               {[
                                 { label: profile?.roles === 'admin' ? 'Neural Linking Protocol' : 'Two-Factor Authentication', status: 'Deactivated', action: 'Initialize', danger: true, icon: FaLock },
                                 { label: 'Active Command Sessions', status: '1 Active Instance', action: 'Terminate Others', danger: false, icon: FaUsers },
                                 { label: 'Uplink Location', status: 'HCM City, Southeast Asia', action: 'Refresh Scan', danger: false, icon: FaMapMarkerAlt },
                               ].map((sec, i) => (
                                  <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/[0.02] hover:bg-white/[0.04] rounded-xl border border-white/5 gap-6 transition-all group/sec">
                                     <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover/sec:bg-yellow-500/10 transition-colors">
                                           <sec.icon className={`text-lg ${sec.danger ? 'text-red-500/50' : 'text-slate-600'}`} />
                                        </div>
                                        <div>
                                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{sec.label}</p>
                                           <p className={`text-xs font-black uppercase tracking-tighter ${sec.danger ? 'text-red-500/80' : 'text-white opacity-80'}`}>{sec.status}</p>
                                        </div>
                                     </div>
                                     <button className={`px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${sec.danger ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white'}`}>
                                        {sec.action}
                                     </button>
                                  </div>
                               ))}
                            </div>
                         </div>
                         
                         <div className="flex flex-col sm:flex-row gap-4">
                            <button
                              onClick={() => router.push('/auth/change-password')}
                              className="flex-1 py-5 glass-card hud-border bg-white/[0.02] text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-yellow-500 hover:text-slate-950 transition-all text-center relative overflow-hidden group/btn"
                            >
                              <span className="relative z-10">Change Password</span>
                              <div className="absolute inset-y-0 left-0 w-[1px] bg-yellow-400/50 group-hover/btn:w-full transition-all duration-500 opacity-20" />
                            </button>
                            <button
                              className="flex-1 py-5 glass-card hud-border bg-red-500/5 text-red-500/80 border-red-500/30 text-[11px] font-black uppercase tracking-[0.3em] hover:bg-red-500 hover:text-white transition-all text-center group/terminate"
                            >
                              Delete Account
                            </button>
                         </div>
                      </Tab.Panel>
                   </Tab.Panels>
                </Tab.Group>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}