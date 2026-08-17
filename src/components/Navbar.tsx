'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileImage from './ProfileImage'
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  LifebuoyIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  Bars3Icon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'About',   href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'News',    href: '/news' },
  { name: 'Team',    href: '/team' },
  { name: 'Gallery', href: '/gallery' },
]

function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return dv
}

export default function Navbar() {
  const [menuOpen, setMenuOpen]           = useState(false)
  const [accountOpen, setAccountOpen]     = useState(false)
  const [search, setSearch]               = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [showDropdown, setShowDropdown]   = useState(false)
  const [scrolled, setScrolled]           = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [hoveredIndex, setHoveredIndex]   = useState<number | null>(null)

  const pathname  = usePathname()
  const router    = useRouter()
  const menuRef   = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setAccountOpen(false) }, [pathname])

  useEffect(() => {
    if (debouncedSearch.trim()) {
      fetch(`/api/search?query=${encodeURIComponent(debouncedSearch)}`)
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) { setSearchResults(data); setShowDropdown(true) } })
        .catch(() => {})
    } else {
      setSearchResults(null)
      setShowDropdown(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    if (!accountOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setAccountOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [accountOpen])

  useEffect(() => {
    if (!showDropdown) return
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showDropdown])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`)
      setSearch('')
      setShowDropdown(false)
      setSearchFocused(false)
    }
  }

  return (
    <>
      {/* ── Bar ─────────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-500 ${
          scrolled
            ? 'mx-4 mt-4 md:mx-8 rounded-2xl border border-white/10 bg-slate-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl'
            : 'border-b border-white/5 bg-slate-950/50 backdrop-blur-xl'
        }`}
      >
        {scrolled && (
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-10" />
        )}
        <div className="mx-auto max-w-[1600px] px-6 md:px-10">
          <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'h-[60px]' : 'h-[76px]'}`}>

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 group select-none font-['Outfit']"
            >
              <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-500 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.25)] ${scrolled ? 'h-9 w-9' : 'h-11 w-11'}`}>
                <Image
                  src="/images/logo.jpg"
                  alt="FC Escuela"
                  width={40}
                  height={40}
                  className="rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="flex flex-col">
                <span className={`font-black tracking-wider text-white transition-all duration-500 leading-none flex items-center gap-1.5 ${scrolled ? 'text-lg' : 'text-xl'}`}>
                  FC <span className="text-red-500 group-hover:text-red-400 transition-colors duration-300">ESCUELA</span>
                  <span className="relative flex h-1.5 w-1.5 mt-0.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                  </span>
                </span>
                <span className={`text-[8px] font-bold tracking-[0.3em] text-slate-500 transition-all duration-500 leading-none mt-1 group-hover:text-red-500/60 ${scrolled ? 'opacity-0 h-0 overflow-hidden mt-0' : 'opacity-100'}`}>
                  FOOTBALL ACADEMY
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div 
              className="hidden xl:flex items-center gap-1 bg-slate-900/40 border border-white/5 rounded-full px-1.5 py-1 backdrop-blur-md relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {navigation.map((item, idx) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    className={`relative rounded-full px-4 py-2 text-[11px] font-semibold tracking-widest uppercase font-['Outfit'] transition-all duration-300 ${
                      active
                        ? 'text-red-400'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    
                    {/* Hover indicator (sliding pill) */}
                    {hoveredIndex === idx && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.05] border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}

                    {/* Active page indicator */}
                    {active && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}
            </div>

            {/* ── Right cluster ── */}
            <div className="flex items-center gap-3">

              {/* Search */}
              <div ref={searchRef} className="relative hidden lg:block">
                <form onSubmit={handleSearch}>
                  <div className={`flex items-center gap-2 rounded-full border bg-white/[0.03] px-3.5 transition-all duration-500 ${
                    searchFocused
                      ? 'w-64 border-red-500/40 bg-white/[0.07] shadow-[0_0_20px_rgba(239,68,68,0.12)]'
                      : 'w-44 border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                  } ${scrolled ? 'h-[38px]' : 'h-[44px]'}`}>
                    <MagnifyingGlassIcon className={`h-4 w-4 shrink-0 transition-all duration-300 ${searchFocused ? 'text-red-500 scale-110' : 'text-slate-500'}`} />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search club updates..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      className="w-full bg-transparent text-xs font-semibold text-slate-200 placeholder:text-slate-600 focus:outline-none"
                    />
                    {!searchFocused && !search && (
                      <div className="hidden sm:flex items-center gap-0.5 rounded px-1.5 py-0.5 bg-white/5 border border-white/10 text-[9px] font-bold text-slate-500 font-mono select-none pointer-events-none">
                        <span>⌘</span><span>K</span>
                      </div>
                    )}
                    {search && (
                      <button type="button" onClick={() => { setSearch(''); setShowDropdown(false) }} className="hover:scale-110 transition-transform">
                        <XMarkIcon className="h-4 w-4 text-slate-500 hover:text-slate-300" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Search dropdown */}
                <AnimatePresence>
                  {showDropdown && searchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 12, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                      className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-white/10 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl z-50 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-mesh-dark opacity-40 pointer-events-none" />
                      
                      <div className="relative z-10 space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-1">
                        {searchResults.news?.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between px-2 mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-500 font-['Outfit']">Club News</span>
                              <span className="h-px flex-1 bg-gradient-to-r from-red-500/20 to-transparent ml-3" />
                            </div>
                            <div className="space-y-1">
                              {searchResults.news.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/news/${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                  <span className="line-clamp-1 group-hover:translate-x-1 transition-transform duration-300">{item.title}</span>
                                  <span className="text-[9px] text-slate-600 shrink-0 font-mono ml-2 group-hover:text-red-400 transition-colors">
                                    {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.team?.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between px-2 mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-500 font-['Outfit']">Squad & Staff</span>
                              <span className="h-px flex-1 bg-gradient-to-r from-red-500/20 to-transparent ml-3" />
                            </div>
                            <div className="space-y-1">
                              {searchResults.team.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/team#${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                    {item.image ? (
                                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-slate-500">
                                        {item.name.substring(0, 2).toUpperCase()}
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-1 text-xs font-semibold group-hover:translate-x-0.5 transition-transform">{item.name}</p>
                                    <p className="text-[9px] text-slate-500 line-clamp-1">{item.role}</p>
                                  </div>
                                  <ChevronRightIcon className="h-3 w-3 shrink-0 text-slate-600 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchResults.matches?.length > 0 && (
                          <div>
                            <div className="flex items-center justify-between px-2 mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-red-500 font-['Outfit']">Fixtures</span>
                              <span className="h-px flex-1 bg-gradient-to-r from-red-500/20 to-transparent ml-3" />
                            </div>
                            <div className="space-y-1">
                              {searchResults.matches.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/matches/${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-all group"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="line-clamp-1 group-hover:translate-x-1 transition-transform duration-300">
                                      {item.homeTeam} vs {item.awayTeam}
                                    </p>
                                    <p className="text-[9px] text-slate-500 line-clamp-1">{item.competition}</p>
                                  </div>
                                  <span className="text-[9px] text-slate-600 shrink-0 font-mono ml-2 group-hover:text-red-400 transition-colors">
                                    {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!searchResults.news?.length && !searchResults.team?.length && !searchResults.matches?.length) && (
                          <div className="py-6 text-center">
                            <p className="text-xs text-slate-500">No updates found for "{search}"</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Account / Auth */}
              <SessionControls
                scrolled={scrolled}
                accountOpen={accountOpen}
                setAccountOpen={setAccountOpen}
                menuRef={menuRef}
              />

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMenuOpen(v => !v)}
                className={`xl:hidden flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white ${scrolled ? 'h-9 w-9' : 'h-10 w-10'}`}
                aria-label="Toggle menu"
              >
                {menuOpen
                  ? <XMarkIcon className="h-4 w-4 text-red-500" />
                  : <Bars3Icon className="h-4 w-4" />
                }
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-md xl:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-[95] flex w-80 flex-col bg-slate-950/95 border-l border-white/10 shadow-2xl backdrop-blur-2xl xl:hidden"
            >
              <div className="absolute inset-0 bg-mesh-dark opacity-50 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-['Outfit']">
                    <div className="overflow-hidden rounded-xl border border-white/10">
                      <Image src="/images/logo.jpg" alt="FC Escuela" width={34} height={34} className="rounded-xl" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-white leading-none tracking-wider text-base">FC <span className="text-red-500">ESCUELA</span></span>
                      <span className="text-[7px] font-bold tracking-[0.25em] text-slate-500 leading-none mt-1">FOOTBALL ACADEMY</span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-4.5 w-4.5 text-red-500" />
                  </button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                  <nav className="space-y-2">
                    {navigation.map((item, idx) => {
                      const active = pathname === item.href || pathname.startsWith(item.href + '/')
                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className={`flex items-center justify-between rounded-xl px-4 py-3.5 text-xs font-semibold tracking-wider font-['Outfit'] uppercase transition-all duration-300 border ${
                              active
                                ? 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.08)]'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white border-transparent'
                            }`}
                          >
                            <span>{item.name}</span>
                            <ChevronRightIcon className={`h-4 w-4 transition-transform duration-300 ${active ? 'text-red-500 translate-x-0.5' : 'text-slate-600'}`} />
                          </Link>
                        </motion.div>
                      )
                    })}
                  </nav>

                  {/* Divider */}
                  <div className="divider-red opacity-50" />

                  {/* Mobile search */}
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 h-11 transition-all focus-within:border-red-500/40 focus-within:bg-white/[0.08] focus-within:shadow-[0_0_15px_rgba(239,68,68,0.12)]">
                      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search updates..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-300 placeholder:text-slate-600 focus:outline-none"
                      />
                    </div>
                  </form>
                </div>

                {/* Drawer footer */}
                <div className="border-t border-white/8 px-6 py-5 bg-black/20">
                  <MobileAuthSection onClose={() => setMenuOpen(false)} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SessionControls({ scrolled, accountOpen, setAccountOpen, menuRef }: {
  scrolled: boolean
  accountOpen: boolean
  setAccountOpen: (v: boolean) => void
  menuRef: React.RefObject<HTMLDivElement | null>
}) {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="hidden items-center gap-3 sm:flex">
        <Link
          href="/login"
          className={`flex items-center justify-center rounded-full bg-white/5 border border-white/10 font-semibold text-[11px] tracking-widest uppercase font-['Outfit'] text-slate-300 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:text-white ${
            scrolled ? 'h-[38px] px-5' : 'h-[44px] px-6'
          }`}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={`hidden items-center justify-center rounded-full bg-red-500 font-semibold text-[11px] tracking-widest uppercase font-['Outfit'] text-white transition-all duration-300 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] hover:scale-[1.02] md:flex ${
            scrolled ? 'h-[38px] px-5' : 'h-[44px] px-6'
          }`}
        >
          Register
        </Link>
      </div>
    )
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setAccountOpen(!accountOpen)}
        className={`flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 pl-1.5 pr-3.5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${scrolled ? 'h-[38px]' : 'h-[44px]'}`}
      >
        <div className="relative">
          <ProfileImage
            src={session.user?.image}
            name={session.user?.name}
            size={scrolled ? 28 : 32}
            className="rounded-full border border-white/10"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-slate-950 bg-emerald-500" />
        </div>
        <span className="hidden text-xs font-semibold tracking-wider font-['Outfit'] text-slate-200 md:block uppercase">
          {session.user?.name?.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="absolute right-0 top-full mt-3 w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-mesh-dark opacity-40 pointer-events-none" />

            <div className="relative z-10">
              {/* User header */}
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 mb-2 border border-white/5">
                <ProfileImage src={session.user?.image} name={session.user?.name} size={36} className="rounded-xl border border-white/10" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold font-['Outfit'] text-slate-100 tracking-wide">{session.user?.name}</p>
                  <p className="truncate text-[10px] text-slate-500 font-medium">{session.user?.email}</p>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-0.5">
                {[
                  { name: 'Profile',      href: '/profile',            icon: UserCircleIcon },
                  { name: 'Support',      href: '/support',            icon: LifebuoyIcon },
                ].map(item => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold font-['Outfit'] text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <item.icon className="h-4 w-4 shrink-0 text-slate-600 transition duration-300 group-hover:text-red-500 group-hover:scale-110" />
                    <span className="tracking-wider uppercase">{item.name}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-2 border-t border-white/8 pt-2">
                <button
                  onClick={() => signOut()}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold font-['Outfit'] text-rose-400 transition hover:bg-rose-500/10"
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  <span className="tracking-wider uppercase">Sign out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileAuthSection({ onClose }: { onClose: () => void }) {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/8 p-3">
          <ProfileImage src={session.user?.image} name={session.user?.name} size={36} className="rounded-xl border border-white/10" />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold font-['Outfit'] text-slate-100 tracking-wide">{session.user?.name}</p>
            <p className="truncate text-[10px] text-slate-500 font-medium">{session.user?.email}</p>
          </div>
        </div>
        <Link 
          href="/profile" 
          onClick={onClose} 
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold font-['Outfit'] text-slate-400 hover:bg-white/5 hover:text-white transition-all uppercase tracking-wider"
        >
          <UserCircleIcon className="h-4.5 w-4.5 text-slate-600" />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-xs font-semibold font-['Outfit'] text-rose-400 hover:bg-rose-500/10 transition-all uppercase tracking-wider"
        >
          <ArrowRightOnRectangleIcon className="h-4.5 w-4.5" />
          <span>Sign out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Link
        href="/login"
        onClick={onClose}
        className="flex w-full items-center justify-center rounded-full border border-white/10 bg-white/5 py-3 text-xs font-semibold font-['Outfit'] text-slate-200 transition hover:bg-white/10 hover:text-white uppercase tracking-wider"
      >
        Log in
      </Link>
      <Link
        href="/register"
        onClick={onClose}
        className="flex w-full items-center justify-center rounded-full bg-red-500 py-3 text-xs font-semibold font-['Outfit'] text-white transition hover:bg-red-600 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)] uppercase tracking-wider"
      >
        Register
      </Link>
    </div>
  )
}
