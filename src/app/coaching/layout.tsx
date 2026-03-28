"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
  FaUserTie, FaUsers, FaChartLine, FaClipboardList, 
  FaShieldAlt, FaRunning, FaHome
} from 'react-icons/fa';

export default function CoachingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && (session.user as any).roles !== "coach" && (session.user as any).roles !== "admin") {
      router.push("/profile");
    }
  }, [status, session, router]);

  if (status === "loading") return (
    <div className="min-h-screen bg-[#020202] flex items-center justify-center text-yellow-500 font-mono tracking-[0.5em] animate-pulse">
      INITIALIZING_COMMAND_ENVIRONMENT...
    </div>
  );

  const navItems = [
    { label: 'Mission', icon: FaHome, href: '/coaching' },
    { label: 'Squad', icon: FaUsers, href: '/coaching/squad' },
    { label: 'Tactics', icon: FaClipboardList, href: '/coaching/tactics' },
    { label: 'Training', icon: FaRunning, href: '/coaching/training' },
    { label: 'Intelligence', icon: FaChartLine, href: '/coaching/analysis' },
  ];

  return (
    <div className="min-h-screen bg-[#010101] flex flex-col text-white">
      {/* Top HUD Refined Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/[0.05] h-20 px-10 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/coaching" className="flex items-center gap-4 group">
            <div className="w-10 h-10 glass-card hud-border border-yellow-500/50 flex items-center justify-center bg-slate-900 group-hover:scale-105 transition-transform">
              <FaUserTie className="text-xl text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter">FC <span className="text-yellow-500">Escuela</span></span>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                 <span className="text-[7px] text-slate-500 font-mono uppercase tracking-widest">Command_Interface</span>
              </div>
            </div>
          </Link>

          {/* Centered Navigation Matrix */}
          <div className="hidden lg:flex items-center gap-1">
             {navItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                   key={item.href}
                   href={item.href}
                   className={`px-6 py-2 transition-all relative group ${
                     isActive ? 'text-yellow-500' : 'text-slate-500 hover:text-white'
                   }`}
                 >
                   <div className="flex items-center gap-3">
                      <item.icon className={`text-[10px] ${isActive ? 'text-yellow-500' : 'group-hover:text-yellow-500'} transition-colors`} />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">{item.label}</span>
                   </div>
                   {isActive && (
                     <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                   )}
                   <div className="absolute bottom-[-24px] left-0 right-0 h-[2px] bg-white lg:opacity-0 group-hover:opacity-20 transition-opacity" />
                 </Link>
               );
             })}
          </div>
        </div>

        {/* Global HUD Indicators */}
        <div className="flex items-center gap-8">
           <div className="hidden xl:flex items-center gap-6 pr-6 border-r border-white/5">
              <div className="text-right">
                 <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">Status</p>
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Uplink_Ok</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 px-4 py-2 rounded group hover:border-yellow-500/30 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 group-hover:border-yellow-500/30">
                 <FaShieldAlt className="text-yellow-500 text-xs" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-tighter">Head</span>
                 <span className="text-[7px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-0.5">Carlos</span>
              </div>
           </div>
        </div>
      </nav>

      {/* Main Command View */}
      <main className="flex-1 relative overflow-x-hidden">
        {/* Cinematic Backdrop Overlay */}
        <div className="fixed inset-0 pointer-events-none z-0">
           <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:40px_40px]" />
           <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
           <div className="absolute top-0 left-0 w-full h-[2px] bg-white/[0.02]" />
        </div>
        
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
