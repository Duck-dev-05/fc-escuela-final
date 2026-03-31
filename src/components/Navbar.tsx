'use client'

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
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled ? 'h-20 mt-4 mx-6 md:mx-12 rounded-2xl bg-white/90 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-slate-200/60' : 'h-24 bg-white/50 border-transparent'} backdrop-blur-md border-b`}>
      <div className="max-w-[1920px] mx-auto h-full px-8 md:px-12">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-full w-full relative">

          {/* Brand Identity */}
          <div className="flex items-center justify-start">
            <Link href="/" className="flex items-center gap-3 group select-none transition-transform hover:scale-[1.02]">
              <div className={`transition-all duration-700 flex items-center justify-center overflow-hidden bg-white shadow-xl rounded-lg border border-slate-100 group-hover:border-yellow-500 ${scrolled ? 'h-11 w-11 p-1' : 'h-12 w-12 p-1.5'}`}>
                <Image src="/images/logo.jpg" alt="FC Escuela" width={32} height={32} className="rounded-sm object-cover" />
              </div>
              <span className={`hidden sm:block font-black text-slate-900 uppercase tracking-[-0.05em] leading-none transition-all duration-700 whitespace-nowrap ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                FC <span className="text-yellow-600">ESCUELA</span>
              </span>
            </Link>
          </div>

          {/* Primary Navigation */}
          <div className="hidden xl:flex items-center justify-center h-full">
            <div className="flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-6 py-2 text-[12px] font-bold uppercase tracking-[0.25em] transition-all relative group/link whitespace-nowrap ${pathname === item.href ? 'text-yellow-600' : 'text-slate-500 hover:text-slate-950'}`}
                >
                  <span className="relative z-10 block transition-transform group-hover/link:-translate-y-0.5">{item.name}</span>
                  <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] bg-yellow-500 transition-all duration-500 ${pathname === item.href ? 'w-6 opacity-100' : 'w-0 opacity-0 group-hover/link:w-3 group-hover/link:opacity-40'}`} />
                </Link>
              ))}
            </div>
          </div>

          {/* Interaction Hub */}
          <div className="flex items-center justify-end gap-5">
            {/* Search Hub */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
              <div className={`flex items-center px-5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/50 rounded-xl transition-all duration-700 focus-within:w-72 w-14 xl:w-44 overflow-hidden group-hover:border-slate-300 ${scrolled ? 'h-11' : 'h-12'}`}>
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-900 transition-colors shrink-0" />
                <input
                  type="text"
                  placeholder="Intel..."
                  className="bg-transparent border-none focus:ring-0 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-800 placeholder:text-slate-300 w-full pl-4 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hidden xl:block"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </form>

            {/* Session Controller */}
            {session ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className={`flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-500 group ${scrolled ? 'h-11' : 'h-12'}`}
                >
                  <div className="relative shrink-0">
                    <ProfileImage src={session.user?.image} name={session.user?.name} size={scrolled ? 34 : 38} className="rounded-lg border border-slate-100 group-hover:border-yellow-500/50 transition-colors" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-500 border-2 border-white" />
                  </div>
                  <div className="hidden 2xl:flex flex-col items-start translate-y-[1px]">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">
                      {session.user?.name?.split(' ')[0]}
                    </span>
                  </div>
                </button>

                {/* Member Portfolio Dashboard */}
                {showAccountMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-slide-up z-[110]">
                    <div className="relative pb-5 mb-3 border-b border-slate-100 flex items-center gap-4 text-left">
                      <ProfileImage src={session.user?.image} name={session.user?.name} size={40} className="rounded-xl border border-slate-100" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-none">{session.user?.name}</h4>
                          {session.user?.membershipType && !['free', 'standard', 'basic'].includes((session.user?.membershipType as string).toLowerCase()) && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md shrink-0 ${(session.user?.membershipType as string).toLowerCase().includes('elite') || (session.user?.membershipType as string).toLowerCase().includes('yearly') ? 'bg-slate-900 text-amber-500' : 'bg-amber-100 text-amber-600'}`}>
                              {(session.user?.membershipType as string).replace('price_', '').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate opacity-80">{session.user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      {[
                        ...((session?.user as any)?.roles === 'coach' ? [
                          { name: 'Dashboard', href: '/coaching', icon: ShieldCheckIcon },
                          { name: 'Squad List', href: '/coaching/squad', icon: UsersIcon },
                        ] : []),
                        { name: 'Profile', href: '/profile', icon: UserCircleIcon },
                        { name: 'Membership', href: '/profile/membership', icon: IdentificationIcon },
                        { name: 'History', href: '/profile/orders', icon: TicketIcon },
                        { name: 'Settings', href: '/profile/settings', icon: AdjustmentsHorizontalIcon },
                        { name: 'Support', href: '/support', icon: LifebuoyIcon },
                      ].map(item => (
                        <Link key={item.name} href={item.href} className="flex items-center gap-3 px-3 py-2.5 text-xs font-black text-slate-500 uppercase tracking-wider hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all group">
                          <item.icon className="h-4 w-4 text-slate-400 group-hover:text-yellow-600 transition-colors" />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      ))}

                      <div className="mt-2 pt-2 border-t border-slate-100">
                        <button onClick={() => signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-black text-red-500 hover:bg-red-50 transition-all rounded-xl text-left">
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className={`px-8 h-12 bg-slate-950 flex items-center justify-center text-white rounded-xl text-[10px] font-black uppercase tracking-[0.25em] hover:bg-slate-800 transition-all shadow-lg whitespace-nowrap ${scrolled ? 'h-11 px-6' : 'h-12 px-8'}`}>
                  Login
                </Link>
                <Link href="/register" className={`hidden sm:flex px-8 h-12 border border-slate-200 hover:border-slate-900 items-center justify-center text-slate-600 hover:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap ${scrolled ? 'h-11 px-6' : 'h-12 px-8'}`}>
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="xl:hidden p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl transition-all">
              {isMenuOpen ? <XMarkIcon className="h-5 w-5 text-yellow-600" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-[-1] bg-white p-10 pt-32 flex flex-col animate-fade-in overflow-y-auto">
          <div className="flex-1 flex flex-col justify-center gap-5">
            {navigation.map((item, idx) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block text-5xl font-black uppercase tracking-tighter italic transition-all duration-500 ${pathname === item.href ? 'text-yellow-600' : 'text-slate-200 hover:text-slate-950'}`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
