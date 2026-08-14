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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-bold animate-pulse">
      Loading...
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
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Professional Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 h-20 px-8 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/coaching" className="flex items-center gap-4 group">
            <div className="w-10 h-10 flex items-center justify-center bg-slate-900 rounded-xl transition-transform group-hover:scale-105">
              <FaUserTie className="text-xl text-amber-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black uppercase tracking-tighter text-slate-900">FC <span className="text-amber-500">Escuela</span></span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Coach Dashboard</span>
            </div>
          </Link>

          {/* Navigation Matrix */}
          <div className="hidden lg:flex items-center gap-1">
             {navItems.map((item) => {
               const isActive = pathname === item.href;
               return (
                 <Link 
                   key={item.href}
                   href={item.href}
                   className={`px-6 py-2 transition-all relative group ${
                     isActive ? 'text-amber-600 bg-amber-50 rounded-lg' : 'text-slate-500 hover:text-slate-900'
                   }`}
                 >
                   <div className="flex items-center gap-3">
                      <item.icon className={`text-[11px] ${isActive ? 'text-amber-600' : 'group-hover:text-amber-600'} transition-colors`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                   </div>
                   {isActive && (
                     <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 w-4 h-[3px] bg-amber-500 rounded-full" />
                   )}
                 </Link>
               );
             })}
          </div>
        </div>

        {/* User Status */}
        <div className="flex items-center gap-4 bg-slate-100 border border-slate-200 px-4 py-2 rounded-xl group hover:bg-white transition-all cursor-pointer">
           <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center border border-white/10">
              <FaShieldAlt className="text-amber-500 text-xs" />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tighter text-slate-900">Head Coach</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-0.5">Carlos</span>
           </div>
        </div>
      </nav>

      {/* Main Content View */}
      <main className="flex-1 relative bg-slate-50">
        <div className="relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
