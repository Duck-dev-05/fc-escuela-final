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
  ShieldCheckIcon,
  IdentificationIcon,
  ChevronRightIcon,
  CalendarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'About', href: '/about' },
  { name: 'Matches', href: '/matches' },
  { name: 'News', href: '/news' },
  { name: 'Team', href: '/team' },
  { name: 'Gallery', href: '/gallery' },
]

const tickerItems = [
  '⚽ FC Escuela — Building Champions Since 2023',
  '🏆 Next Match: Check the Fixtures Page',
  '📰 Latest News & Academy Updates',
  '🎯 Enrollment Now Open — Register Today',
  '💪 Train. Compete. Excel. FC Escuela Academy',
  '🔴 Follow Us on Social Media for Live Updates',
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
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

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
        .catch(() => { })
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
      {/* ── Club Red Top Stripe ─────────────────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-[102] h-[3px]"
        style={{ background: 'linear-gradient(to right, #991b1b, #ef4444, #ffffff, #ef4444, #991b1b)' }}
      />

      {/* ── News Ticker ─────────────────────────────────────────────────────── */}
      <div className="fixed top-[3px] left-0 right-0 z-[101] ticker-bar h-[26px] flex items-center">
        {/* FC Badge label */}
        <div className="shrink-0 flex items-center gap-2 px-4 bg-[#991b1b] h-full border-r border-red-900/50">
          <span className="text-[9px] font-black tracking-[0.3em] text-white/90 uppercase">FC News</span>
        </div>
        {/* Scrolling text */}
        <div className="flex-1 overflow-hidden relative">
          <div className="ticker-scroll">
            {/* Doubled for seamless loop */}
            {[...tickerItems, ...tickerItems].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-6 px-8 text-[11px] tracking-wide text-white/90">
                {item}
                <span className="w-1 h-1 rounded-full bg-white/40" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Nav Bar ─────────────────────────────────────────────────────────── */}
      <nav
        className={`fixed left-0 right-0 top-[29px] z-[100] transition-all duration-500 ${scrolled
            ? 'mx-3 mt-2 md:mx-6 rounded-2xl border border-white/10 bg-[#080808]/97 shadow-[0_8px_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl'
            : 'border-b border-white/5 bg-[#080808]/88 backdrop-blur-xl'
          }`}
      >
        <div className="mx-auto max-w-[1600px] px-4 md:px-8">
          <div className={`flex items-center justify-between gap-4 transition-all duration-500 ${scrolled ? 'h-[56px]' : 'h-[68px]'}`}>

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 group select-none"
            >
              <div className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)] ${scrolled ? 'h-9 w-9' : 'h-10 w-10'}`}>
                <Image
                  src="/images/logo.jpg"
                  alt="FC Escuela"
                  width={36}
                  height={36}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className={`font-display font-black tracking-widest text-white transition-all duration-300 group-hover:text-red-400 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                  FC ESCUELA
                </span>
                <span className="text-[8px] font-bold tracking-[0.4em] text-red-500/80 uppercase">Academy</span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden xl:flex items-center gap-0.5">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group relative px-5 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${active
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-100'
                      }`}
                  >
                    <span className="relative">
                      {item.name}
                      {active && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-1.5 left-0 right-0 h-[2px] rounded-full bg-red-500"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                      {/* Hover underline */}
                      {!active && (
                        <span className="absolute -bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-red-500/50 transition-all duration-300 group-hover:w-full" />
                      )}
                    </span>
                  </Link>
                )
              })}
            </div>

            {/* ── Right cluster ── */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <div ref={searchRef} className="relative hidden lg:block">
                <form onSubmit={handleSearch}>
                  <div className={`flex items-center gap-2 rounded-xl border bg-white/5 px-3 transition-all duration-300 ${searchFocused
                      ? 'w-56 border-red-500/50 bg-white/10 shadow-[0_0_0_1px_rgba(239,68,68,0.15)]'
                      : 'w-36 border-white/10 hover:border-white/20'
                    } ${scrolled ? 'h-9' : 'h-10'}`}>
                    <MagnifyingGlassIcon className={`h-4 w-4 shrink-0 transition-colors ${searchFocused ? 'text-red-500' : 'text-slate-500'}`} />
                    <input
                      type="text"
                      placeholder="Search…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      className="w-full bg-transparent text-xs font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none"
                    />
                    {search && (
                      <button type="button" onClick={() => { setSearch(''); setShowDropdown(false) }}>
                        <XMarkIcon className="h-3.5 w-3.5 text-slate-500 hover:text-slate-300" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Search dropdown */}
                <AnimatePresence>
                  {showDropdown && searchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-white/10 bg-[#0e0e0e]/98 p-2 shadow-[0_16px_40px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                    >
                      {searchResults.news?.length > 0 && (
                        <div className="mb-1">
                          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">News</p>
                          {searchResults.news.slice(0, 3).map((item: any) => (
                            <Link
                              key={item.id}
                              href={`/news/${item.id}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                            >
                              <span className="line-clamp-1">{item.title}</span>
                              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                            </Link>
                          ))}
                        </div>
                      )}
                      {searchResults.matches?.length > 0 && (
                        <div>
                          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">Matches</p>
                          {searchResults.matches.slice(0, 3).map((item: any) => (
                            <Link
                              key={item.id}
                              href={`/matches/${item.id}`}
                              onClick={() => setShowDropdown(false)}
                              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-red-400 transition-colors"
                            >
                              <span className="line-clamp-1">{item.homeTeam} vs {item.awayTeam}</span>
                              <ChevronRightIcon className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                            </Link>
                          ))}
                        </div>
                      )}
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
                className={`xl:hidden flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white hover:border-red-500/30 ${scrolled ? 'h-9 w-9' : 'h-10 w-10'}`}
                aria-label="Toggle menu"
              >
                {menuOpen
                  ? <XMarkIcon className="h-4 w-4 text-red-400" />
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
              className="fixed inset-0 z-[90] bg-[#080808]/75 backdrop-blur-md xl:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-[95] flex w-72 flex-col bg-[#0a0a0a] border-l border-white/10 shadow-2xl xl:hidden"
            >
              {/* Red accent line on left edge */}
              <div className="absolute left-0 top-0 bottom-0 w-[3px]"
                style={{ background: 'linear-gradient(to bottom, #ef4444, #b91c1c, rgba(185,28,28,0.2), transparent)' }}
              />

              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                  <div className="overflow-hidden rounded-lg border border-white/10">
                    <Image src="/images/logo.jpg" alt="FC Escuela" width={32} height={32} className="rounded-lg" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="font-display font-black text-white tracking-widest text-xl">FC ESCUELA</span>
                    <span className="text-[8px] font-bold tracking-[0.35em] text-red-500/80 uppercase">Academy</span>
                  </div>
                </Link>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>

              {/* Nav links */}
              <div className="flex-1 overflow-y-auto px-4 py-5">
                <nav className="space-y-1">
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
                          className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold tracking-wider uppercase transition ${active
                              ? 'bg-red-600/15 text-red-400 border border-red-500/25'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                          {item.name}
                          <ChevronRightIcon className={`h-4 w-4 ${active ? 'text-red-500' : 'text-slate-600'}`} />
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>

                {/* Divider */}
                <div className="my-4 divider-red" />

                {/* Mobile search */}
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 h-10">
                    <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-slate-300 placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </form>
              </div>

              {/* Drawer footer */}
              <div className="border-t border-white/10 px-4 py-4">
                <MobileAuthSection onClose={() => setMenuOpen(false)} />
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
      <div className="hidden items-center gap-2 sm:flex">
        <Link
          href="/login"
          className={`flex items-center justify-center rounded-xl bg-white/5 border border-white/10 font-bold text-xs tracking-widest uppercase text-slate-300 transition hover:bg-white/10 hover:text-white hover:border-white/20 ${scrolled ? 'h-9 px-4' : 'h-10 px-5'}`}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={`hidden items-center justify-center rounded-xl bg-red-600 font-bold text-xs tracking-widest uppercase text-white transition hover:bg-red-500 md:flex ${scrolled ? 'h-9 px-4' : 'h-10 px-5'}`}
          style={{ boxShadow: '0 0 20px rgba(220,38,38,0.30)' }}
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
        className={`flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 pl-1.5 pr-3 transition hover:bg-white/10 hover:border-red-500/30 ${scrolled ? 'h-9' : 'h-10'}`}
      >
        <div className="relative">
          <ProfileImage
            src={session.user?.image}
            name={session.user?.name}
            size={scrolled ? 28 : 32}
            className="rounded-lg"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-2 border-[#080808] bg-red-500" />
        </div>
        <span className="hidden text-xs font-bold text-slate-200 md:block">
          {session.user?.name?.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-white/10 bg-[#0e0e0e]/98 p-2 shadow-[0_16px_48px_rgba(0,0,0,0.7)] backdrop-blur-xl"
          >
            {/* User header */}
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 mb-2">
              <ProfileImage src={session.user?.image} name={session.user?.name} size={36} className="rounded-xl" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-100">{session.user?.name}</p>
                <p className="truncate text-[11px] text-slate-500">{session.user?.email}</p>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-0.5">
              {[
                { name: 'Profile', href: '/profile', icon: UserCircleIcon },
                { name: 'Matches', href: '/matches', icon: CalendarIcon },
                { name: 'About', href: '/about', icon: InformationCircleIcon },
                { name: 'Support', href: '/support', icon: LifebuoyIcon },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-slate-100"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-slate-600 transition group-hover:text-red-500" />
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-2 border-t border-white/10 pt-2">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                Sign out
              </button>
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
      <div className="space-y-2">
        <div className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 p-3">
          <ProfileImage src={session.user?.image} name={session.user?.name} size={32} className="rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-100">{session.user?.name}</p>
            <p className="truncate text-[11px] text-slate-500">{session.user?.email}</p>
          </div>
        </div>
        <Link href="/profile" onClick={onClose} className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-slate-100 transition-colors">
          <UserCircleIcon className="h-4 w-4 text-slate-600" /> Profile
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Sign out
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Link
        href="/login"
        onClick={onClose}
        className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold uppercase tracking-widest text-slate-200 transition hover:bg-white/10 hover:text-white"
      >
        Log in
      </Link>
      <Link
        href="/register"
        onClick={onClose}
        className="flex w-full items-center justify-center rounded-xl bg-red-600 py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-red-500"
        style={{ boxShadow: '0 0 20px rgba(220,38,38,0.25)' }}
      >
        Register
      </Link>
    </div>
  )
}
