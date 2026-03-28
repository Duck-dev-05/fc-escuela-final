'use client'
// HUD_PROTOCOL_32_STABLE_SYNC_ACTIVE

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  ArrowRightOnRectangleIcon, UserCircleIcon, Cog6ToothIcon,
  ShoppingBagIcon, LifebuoyIcon, MagnifyingGlassIcon,
  XMarkIcon, Bars3Icon, ShieldCheckIcon, BanknotesIcon,
  UsersIcon, HeartIcon, PencilSquareIcon, LockClosedIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'Tickets', href: '/ticketing' },
  { name: 'News', href: '/news' },
  { name: 'Team', href: '/team' },
  { name: 'Gallery', href: '/gallery' },
]

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session, status } = useSession();
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname()
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMobileProfileMenu, setShowMobileProfileMenu] = useState(false)
  const router = useRouter();

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetch(`/api/search?query=${encodeURIComponent(debouncedSearch)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data);
          setShowDropdown(true);
        });
    } else {
      setSearchResults(null);
      setShowDropdown(false);
    }
  }, [debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch("");
      setShowDropdown(false);
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
    <nav className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700">
      {/* Dynamic Layered Glassmorphism Background */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/[0.05]" />

      {/* Cinematic HUD Scanline (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] overflow-hidden">
        <div className="absolute top-0 left-0 w-48 h-full bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent animate-scan-horizontal opacity-30" />
      </div>

      <div className="container-custom relative z-10">
        <div className="flex justify-between items-center h-24 px-4">

          {/* Brand Hub: Radar Sweep Protocol */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative">
              {/* Radar Sweep Animation (Hover) */}
              <div className="absolute inset-[-6px] border border-yellow-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 scale-125 group-hover:scale-100 animate-spin-slow pointer-events-none" />

              <div className="relative p-1 glass-card hud-border rounded-xl group-hover:border-yellow-500 transition-colors duration-500 bg-slate-950/30">
                <Image src="/images/logo.jpg" alt="FC Escuela" width={40} height={40} className="rounded-lg relative z-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                FC <span className="text-yellow-500">ESCUELA</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation HUB: Surgical Compression */}
          <div className="hidden xl:flex items-center space-x-1 flex-1 justify-center px-6">
            {(session?.user as any)?.roles === 'coach' ? (
              <Link
                href="/coaching"
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${pathname === '/coaching' ? 'text-yellow-500' : 'text-slate-500 hover:text-white'
                  }`}
              >
                <span className="relative z-10 transition-transform group-hover:scale-105 inline-block">Coaching Dashboard</span>
                <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-500 transition-all duration-500 ${pathname === '/coaching' ? 'w-6 opacity-100 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-40'
                  }`} />
              </Link>
            ) : (
              navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group ${pathname === item.href ? 'text-yellow-500' : 'text-slate-500 hover:text-white'
                    }`}
                >
                  <span className="relative z-10 transition-transform group-hover:scale-105 inline-block">{item.name}</span>
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-yellow-500 transition-all duration-500 ${pathname === item.href ? 'w-6 opacity-100 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-40'
                    }`} />
                </Link>
              ))
            )}
          </div>

          {/* Interaction Cluster: Tactical Duo Auth */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Research Terminal (Search) */}
            {(session?.user as any)?.roles !== 'coach' && (
              <form onSubmit={handleSearch} className="relative group">
                <div className="glass-card border-white/5 bg-white/[0.01] flex items-center h-12 px-5 w-44 focus-within:w-64 focus-within:border-yellow-500/40 transition-all duration-500 rounded-lg relative overflow-hidden">
                  <MagnifyingGlassIcon className="h-4 w-4 text-slate-700 group-hover:text-yellow-500 transition-colors z-10" />
                  <input
                    type="text" placeholder="QUERY..."
                    className="bg-transparent border-none focus:ring-0 text-[10px] font-black uppercase tracking-[0.2em] text-white placeholder:text-slate-800 w-full pl-4 z-10"
                    value={search} onChange={e => setSearch(e.target.value)}
                    onFocus={() => { if (searchResults) setShowDropdown(true); }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                </div>
              </form>
            )}

            {/* Instant Search Results */}
            {showDropdown && (
              <div className="absolute top-14 right-0 w-80 glass-card hud-border p-5 bg-slate-950/99 shadow-[0_0_60px_rgba(0,0,0,0.6)] animate-slide-up">
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {searchResults?.pages?.map((item: any) => (
                    <Link key={item.href} href={item.href} className="block p-3 hover:bg-white/[0.03] rounded-lg transition-all border border-transparent hover:border-white/5">
                      <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-yellow-500">PAGE // {item.name}</div>
                    </Link>
                  ))}
                  {searchResults?.news?.map((item: any) => (
                    <Link key={item.id} href={`/news/${item.id}`} className="block p-3 hover:bg-white/[0.03] rounded-lg transition-all border border-transparent hover:border-white/5">
                      <div className="text-[10px] font-black text-white/80 uppercase tracking-tight truncate group-hover:text-yellow-500">INTEL // {item.title}</div>
                    </Link>
                  ))}
                  {searchResults?.team?.map((item: any) => (
                    <Link key={item.id} href={`/team#${item.name.toLowerCase().replace(/ /g, '-')}`} className="block p-3 hover:bg-white/[0.03] rounded-lg transition-all border border-transparent hover:border-white/5">
                      <div className="text-[10px] font-black text-white uppercase tracking-tight group-hover:text-yellow-500">UNIT // {item.name}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="h-6 w-[1px] bg-white/10" />

            {/* User Access Node */}
            <div className="relative" ref={menuRef}>
              {session ? (
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="flex items-center gap-4 glass-card border-white/10 hover:border-yellow-500/40 hover:bg-white/5 px-4 py-2 transition-all duration-500 group rounded-lg"
                >
                  <div className="relative w-9 h-9 rounded-lg border border-white/10 overflow-hidden group-hover:border-yellow-500 transition-all duration-500 p-0.5">
                    <div className="w-full h-full relative rounded-md overflow-hidden">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="User"
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <UserCircleIcon className="h-6 w-6 text-slate-600" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] font-black text-white uppercase tracking-tight leading-none">{session.user?.name?.split(' ')[0]}</span>
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="px-4 py-3 hover:bg-white/[0.02] transition-colors rounded-lg group">
                    <span className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-500 group-hover:text-white transition-colors">Login</span>
                  </Link>
                  <Link href="/register" className="btn-primary py-3 px-6 rounded-lg group relative overflow-hidden">
                    <span className="relative z-10 uppercase tracking-[0.2em] text-[10px] font-black">Register</span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  </Link>
                </div>
              )}

              {/* Account HUD Dropdown */}
              {showAccountMenu && session && (
                <div className="absolute right-0 mt-6 w-72 glass-card hud-border p-5 bg-slate-950/90 backdrop-blur-2xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-slide-up z-50 overflow-hidden">
                  {/* Sub-HUD Background Elements */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-[50px] rounded-full pointer-events-none" />

                  <div className="relative pb-5 mb-5 border-b border-white/5 flex items-center gap-3.5">
                    <div className="relative">
                      <div className="absolute inset-0 bg-yellow-500/15 blur-lg rounded-full animate-pulse" />
                      <div className="w-12 h-12 glass-card hud-border border-yellow-500/30 flex items-center justify-center bg-slate-950 relative overflow-hidden group">
                        {session.user?.image ? (
                          <img src={session.user.image} alt="User Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base font-black text-yellow-500 uppercase font-mono">
                            {session.user?.name?.substring(0, 1) || 'O'}
                          </span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-black text-white uppercase tracking-tighter truncate leading-none mb-1 text-left">
                        {session.user?.name || 'Operator'}
                      </h4>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.15em] truncate font-mono text-left">
                        {session.user?.email}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[6px] text-green-500 font-black uppercase tracking-widest font-mono">Status Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 relative text-left">
                    <div className="text-[7px] text-slate-700 font-mono font-black uppercase tracking-[0.2em] mb-1.5 px-3">Account Menu</div>
                    {[
                        ...((session?.user as any)?.roles === 'coach' || (session?.user as any)?.roles === 'admin' ? [
                        { name: 'Command Center', href: '/coaching', icon: ShieldCheckIcon },
                        { name: 'Squad Registry', href: '/coaching/squad', icon: UsersIcon },
                        { name: 'Medical Hub', href: '/coaching/medical', icon: HeartIcon },
                        { name: 'Tactical Board', href: '/coaching/tactics', icon: PencilSquareIcon },
                        { name: 'Security Vault', href: '/coaching/vault', icon: LockClosedIcon },
                      ] : []),
                      { name: 'Profile Hub', href: '/profile', icon: UserCircleIcon },
                      ...((session?.user as any)?.roles !== 'coach' && (session?.user as any)?.roles !== 'admin' ? [{ name: 'Registry', href: '/orders', icon: ShoppingBagIcon }] : []),
                      ...((session?.user as any)?.roles !== 'coach' && (session?.user as any)?.roles !== 'admin' ? [{ name: 'My Wallet', href: '/wallet', icon: BanknotesIcon }] : []),
                      ...((session?.user as any)?.roles !== 'coach' && (session?.user as any)?.roles !== 'admin' ? [{ name: 'Security', href: '/settings', icon: Cog6ToothIcon }] : []),
                      { name: 'Support', href: '/support', icon: LifebuoyIcon },
                    ].map(item => (
                      <Link key={item.name} href={item.href} className="flex items-center gap-3.5 px-3.5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white hover:bg-white/[0.04] rounded-lg transition-all group relative border border-transparent hover:border-white/5">
                        <item.icon className="h-4 w-4 text-slate-500 group-hover:text-yellow-500 transition-colors" />
                        <span className="flex-1">{item.name}</span>
                        <ArrowRightOnRectangleIcon className="h-3 w-3 opacity-0 group-hover:opacity-40 -translate-x-1 group-hover:translate-x-0 transition-all rotate-180" />
                      </Link>
                    ))}

                    {session?.user?.roles === 'admin' && (
                      <a href="http://localhost:3001/" target="_blank" className="flex items-center gap-3.5 px-3.5 py-3 text-[9px] font-black text-yellow-500 uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-950 rounded-lg transition-all mt-3 border border-yellow-500/30 group">
                        <ShieldCheckIcon className="h-4 w-4" />
                        <span>Admin Console</span>
                      </a>
                    )}

                    <div className="mt-6 pt-5 border-t border-white/5">
                      <button onClick={() => signOut()} className="w-full flex items-center gap-3.5 px-3.5 py-3.5 text-[9px] font-black text-red-500/80 uppercase tracking-[0.15em] hover:bg-red-500/10 hover:text-red-500 transition-all rounded-lg group border border-transparent hover:border-red-500/20 text-left">
                        <ArrowRightOnRectangleIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        <span>Logout Account</span>
                        <div className="ml-auto w-1 h-1 rounded-full bg-red-500/80 animate-pulse shadow-[0_0_6px_rgba(239,68,68,1)]" />
                      </button>
                    </div>
                  </div>

                  {/* HUD Technical Labels */}
                  <div className="mt-5 flex justify-between items-center px-3.5 opacity-15">
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-3 glass-card hud-border text-white group">
            {isMenuOpen ? <XMarkIcon className="h-7 w-7 text-yellow-500" /> : <Bars3Icon className="h-7 w-7 group-hover:text-yellow-500 transition-colors" />}
          </button>
        </div>

        {/* Mobile Navigation Interface */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-slate-950/99 backdrop-blur-3xl border-b border-white/5 py-12 px-8 animate-slide-up shadow-2xl">
            <div className="space-y-6 mb-12">
              {(session?.user as any)?.roles === 'coach' ? (
                <Link
                  href="/coaching"
                  className={`block text-4xl font-black uppercase tracking-tighter ${pathname === '/coaching' ? 'text-yellow-500' : 'text-white/60'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                navigation.map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block text-4xl font-black uppercase tracking-tighter ${pathname === item.href ? 'text-yellow-500' : 'text-white/60'}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))
              )}
            </div>

            {session ? (
              <div className="pt-10 border-t border-white/10 space-y-6">
                <Link href="/profile" className="flex items-center gap-6 py-4" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-16 h-16 rounded-xl border border-yellow-500/30 overflow-hidden relative p-1 bg-yellow-500/5">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt="User"
                        fill
                        sizes="64px"
                        className="object-cover rounded-lg"
                      />
                    ) : <UserCircleIcon className="w-full h-full text-slate-800" />}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{session.user?.name}</p>
                  </div>
                </Link>
                <button onClick={() => signOut()} className="w-full py-5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-red-500 border border-red-500/20 bg-red-500/5">Logout Account</button>
              </div>
            ) : (
              <div className="pt-10 border-t border-white/10 space-y-4">
                <Link href="/register" className="btn-primary w-full py-6 flex items-center justify-center text-xl font-black uppercase tracking-widest" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
                <Link href="/login" className="w-full py-5 flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/10 rounded-xl bg-white/[0.01]" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}