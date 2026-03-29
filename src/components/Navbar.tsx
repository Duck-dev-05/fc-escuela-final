'use client'
// HUD_STABLE_V4.3_ROYAL_KINETIC

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  ArrowRightOnRectangleIcon, UserCircleIcon, LifebuoyIcon, 
  MagnifyingGlassIcon, XMarkIcon, Bars3Icon, ShieldCheckIcon, UsersIcon,
  TicketIcon, AdjustmentsHorizontalIcon, IdentificationIcon
} from '@heroicons/react/24/outline'
import ProfileImage from "@/components/ProfileImage";

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'News', href: '/news' },
  { name: 'Team', href: '/team' },
  { name: 'Tickets', href: '/ticketing' },
  { name: 'Gallery', href: '/gallery' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession();
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [search, setSearch] = useState("");
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  useEffect(() => {
    if (!showAccountMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'h-16 bg-white/95 shadow-[0_10px_40px_rgba(0,0,0,0.05)]' : 'h-24 bg-transparent'} backdrop-blur-md border-b border-slate-200`}>
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full w-full relative">
          
          {/* NODE 01: BRAND_IDENTITY (Left-Align) */}
          <div className="flex items-center justify-start min-w-0 pr-4">
            <Link href="/" className="flex items-center gap-3 group select-none transition-transform hover:scale-[1.02]">
            <div className="p-1 glass-card hud-border rounded-lg group-hover:border-yellow-500 transition-all duration-500 bg-white/50 flex items-center justify-center h-9 w-9 overflow-hidden shadow-[0_0_20px_rgba(234,179,8,0.05)]">
                <Image src="/images/logo.jpg" alt="FC Escuela" width={24} height={24} className="rounded-sm object-cover" />
              </div>
              <span className="hidden sm:block text-xl font-black text-slate-900 uppercase tracking-[-0.05em] leading-none group-hover:tracking-normal transition-all duration-700 whitespace-nowrap">
                FC <span className="text-yellow-600">ESCUELA</span>
              </span>
            </Link>
          </div>

          {/* NODE 02: FLOATING_TACTICAL_PLATE (Intrinsically Centered) */}
          <div className="hidden xl:flex items-center justify-center h-full relative z-50 px-4">
            <div className="flex items-center px-1.5 py-1.5 glass-card bg-white/50 border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] backdrop-blur-md relative overflow-hidden group/plate">
              {/* Subtle Scanline Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/[0.03] to-transparent -translate-x-full animate-scan-horizontal pointer-events-none" />
              
              <div className="flex items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 2xl:px-5 py-2 text-[9px] 2xl:text-[10px] font-black uppercase tracking-[0.25em] 2xl:tracking-[0.3em] transition-all relative group/link whitespace-nowrap ${pathname === item.href ? 'text-yellow-600' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    <span className="relative z-10 transition-transform group-hover/link:-translate-y-0.5 block">{item.name}</span>
                    <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-500 transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.5)] ${pathname === item.href ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover/link:w-3 group-hover/link:opacity-40'}`} />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* NODE 03: INTERACTION_HUB (Right-Align) */}
          <div className="flex items-center justify-end gap-3 sm:gap-6 min-w-0 pl-4">
            {/* Search Hub with Adaptive Collapse */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
              <div className="flex items-center h-10 px-4 glass-card border-slate-200 bg-white/50 rounded-xl transition-all duration-700 focus-within:w-64 w-12 xl:w-40 2xl:w-48 group-hover:border-yellow-500/30 overflow-hidden relative">
                <MagnifyingGlassIcon className="h-4 w-4 text-slate-400 group-hover:text-yellow-600 transition-colors shrink-0" />
                <input
                  type="text"
                  placeholder="SIGNAL SCAN..."
                  className="bg-transparent border-none focus:ring-0 text-[9px] font-black uppercase tracking-[0.15em] text-slate-800 placeholder:text-slate-300 w-full pl-3 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden xl:block"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </form>

            {/* User Access Node */}
            {session ? (
              <div className="relative flex-none" ref={menuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-3 glass-card border-slate-200 hover:border-yellow-500/30 hover:bg-white/80 px-3 h-10 transition-all duration-500 group rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.03)]"
                >
                  <div className="relative shrink-0">
                    <ProfileImage src={session.user?.image} name={session.user?.name} size={28} className="rounded-lg border border-slate-200 group-hover:border-yellow-500/50 transition-colors" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-white animate-pulse" />
                  </div>
                  <div className="hidden 2xl:flex flex-col items-start translate-y-[1px]">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight leading-none truncate max-w-[80px]">
                      {session.user?.name?.split(' ')[0]}
                    </span>
                  </div>
                </button>

                {/* Account Dropdown Hub */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-4 w-72 glass-card hud-border p-6 bg-white/95 backdrop-blur-md shadow-[0_40px_120px_rgba(0,0,0,0.1)] animate-slide-up z-[110] border-yellow-500/10">
                    <div className="relative pb-5 mb-5 border-b border-slate-100 flex items-center gap-4 text-left">
                      <ProfileImage src={session.user?.image} name={session.user?.name} size={44} className="rounded-xl border border-yellow-500/20 shadow-xl" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tighter truncate leading-none mb-1">{session.user?.name}</h4>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.1em] truncate font-mono opacity-60">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 relative text-left">
                      {[
                        ...((session?.user as any)?.roles === 'coach' ? [
                          { name: 'Control Center', href: '/coaching', icon: ShieldCheckIcon },
                          { name: 'Squad Registry', href: '/coaching/squad', icon: UsersIcon },
                        ] : []),
                        { name: 'Profile Intel', href: '/profile', icon: UserCircleIcon },
                        { name: 'Membership Hub', href: '/profile/membership', icon: IdentificationIcon },
                        { name: 'Order History', href: '/profile/orders', icon: TicketIcon },
                        { name: 'Tactical Settings', href: '/profile/settings', icon: AdjustmentsHorizontalIcon },
                        { name: 'Support Help', href: '/support', icon: LifebuoyIcon },
                      ].map(item => (
                        <Link key={item.name} href={item.href} className="flex items-center gap-3.5 px-3.5 py-2.5 text-[9px] font-black text-slate-500 uppercase tracking-widest hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all group border border-transparent hover:border-slate-100">
                          <item.icon className="h-3.5 w-3.5 text-slate-400 group-hover:text-yellow-600 transition-colors" />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      ))}
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <button onClick={() => signOut()} className="w-full flex items-center gap-3.5 px-3.5 py-3 text-[9px] font-black text-red-500/80 uppercase tracking-[0.15em] hover:bg-red-50 transition-all rounded-lg text-left">
                          <ArrowRightOnRectangleIcon className="h-3.5 w-3.5" />
                          <span>Terminate session</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="px-6 h-10 bg-yellow-500 flex items-center justify-center text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                Login
              </Link>
            )}

            {/* MOBILE TOGGLE TRIGGER */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-2.5 glass-card border-slate-200 text-slate-900 group rounded-xl">
              {isMenuOpen ? <XMarkIcon className="h-6 w-6 text-yellow-600 animate-pulse" /> : <Bars3Icon className="h-6 w-6 group-hover:text-yellow-600 transition-colors" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE INTERFACE OVERLAY: Cinematic Tactical Terminal */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[-1] bg-white/99 backdrop-blur-3xl p-8 pt-32 flex flex-col animate-fade-in">
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="h-[1px] w-12 bg-yellow-500/40 mb-4" />
            {navigation.map((item, idx) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`block text-6xl font-black uppercase tracking-tighter italic transition-all duration-500 hover:tracking-normal ${pathname === item.href ? 'text-yellow-600' : 'text-slate-300 hover:text-slate-900'}`} 
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
            <div className="h-[1px] w-full bg-slate-100 mt-8" />
            <div className="flex gap-4 mt-8 opacity-40">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-900">System_Scan</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-600">Live_Stream</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}