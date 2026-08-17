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
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          scrolled
            ? 'border-b border-white/10 bg-slate-950/90 backdrop-blur-md'
            : 'border-b border-white/5 bg-slate-950/70 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-8">
          <div className={`flex items-center justify-between gap-6 transition-all duration-300 ${scrolled ? 'h-16' : 'h-20'}`}>

            {/* ── Logo ── */}
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3 select-none font-['Outfit']"
            >
              <div className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all duration-300 ${scrolled ? 'h-9 w-9' : 'h-10 w-10'}`}>
                <Image
                  src="/images/logo.jpg"
                  alt="FC Escuela"
                  width={40}
                  height={40}
                  className="rounded object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold tracking-wide text-white transition-all duration-300 leading-none ${scrolled ? 'text-base' : 'text-lg'}`}>
                  FC <span className="text-red-500">ESCUELA</span>
                </span>
                <span className={`text-[7px] font-semibold tracking-[0.2em] text-slate-500 transition-all duration-300 leading-none mt-0.5 ${scrolled ? 'opacity-0 h-0' : 'opacity-100'}`}>
                  FOOTBALL ACADEMY
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <div className="hidden xl:flex items-center gap-1">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 text-xs font-medium tracking-wide uppercase font-['Outfit'] transition-colors ${
                      active
                        ? 'text-red-400'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* ── Right cluster ── */}
            <div className="flex items-center gap-4">

              {/* Search */}
              <div ref={searchRef} className="relative hidden lg:block">
                <form onSubmit={handleSearch}>
                  <div className={`flex items-center gap-2 rounded-lg border bg-white/[0.03] px-3 transition-all duration-300 ${
                    searchFocused
                      ? 'w-64 border-white/20 bg-white/[0.05]'
                      : 'w-40 border-white/10 hover:border-white/15'
                  } ${scrolled ? 'h-9' : 'h-10'}`}>
                    <MagnifyingGlassIcon className={`h-4 w-4 shrink-0 transition-colors duration-200 ${searchFocused ? 'text-slate-300' : 'text-slate-500'}`} />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                      className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                    />
                    {search && (
                      <button type="button" onClick={() => { setSearch(''); setShowDropdown(false) }} className="hover:text-slate-300 transition-colors">
                        <XMarkIcon className="h-4 w-4 text-slate-500" />
                      </button>
                    )}
                  </div>
                </form>

                {/* Search dropdown */}
                <AnimatePresence>
                  {showDropdown && searchResults && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-white/10 bg-slate-950/95 p-3 shadow-lg backdrop-blur-md z-50"
                    >
                      <div className="space-y-3 max-h-[350px] overflow-y-auto">
                        {searchResults.news?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">News</p>
                            <div className="space-y-1">
                              {searchResults.news.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/news/${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="block px-2 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
                                >
                                  {item.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {searchResults.team?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Team</p>
                            <div className="space-y-1">
                              {searchResults.team.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/team#${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="flex items-center gap-2 px-2 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
                                >
                                  <span>{item.name}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {searchResults.matches?.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Matches</p>
                            <div className="space-y-1">
                              {searchResults.matches.slice(0, 3).map((item: any) => (
                                <Link
                                  key={item.id}
                                  href={`/matches/${item.id}`}
                                  onClick={() => setShowDropdown(false)}
                                  className="block px-2 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
                                >
                                  {item.homeTeam} vs {item.awayTeam}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {(!searchResults.news?.length && !searchResults.team?.length && !searchResults.matches?.length) && (
                          <div className="py-4 text-center">
                            <p className="text-xs text-slate-500">No results found</p>
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
                className={`xl:hidden flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${scrolled ? 'h-9 w-9' : 'h-10 w-10'}`}
                aria-label="Toggle menu"
              >
                {menuOpen
                  ? <XMarkIcon className="h-4 w-4" />
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
              className="fixed inset-0 z-[90] bg-slate-950/80 backdrop-blur-sm xl:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3 }}
              className="fixed right-0 top-0 bottom-0 z-[95] flex w-72 flex-col bg-slate-950 border-l border-white/10 shadow-xl xl:hidden"
            >
              <div className="relative z-10 flex flex-col h-full">
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 font-['Outfit']">
                    <div className="overflow-hidden rounded-lg border border-white/10 bg-white/5">
                      <Image src="/images/logo.jpg" alt="FC Escuela" width={32} height={32} className="rounded-lg" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white leading-none tracking-wide text-sm">FC <span className="text-red-500">ESCUELA</span></span>
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Nav links */}
                <div className="flex-1 overflow-y-auto px-4 py-5">
                  <nav className="space-y-1">
                    {navigation.map((item) => {
                      const active = pathname === item.href || pathname.startsWith(item.href + '/')
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className={`block px-3 py-2.5 text-xs font-medium tracking-wide font-['Outfit'] uppercase transition-colors rounded ${
                            active
                              ? 'text-red-400 bg-white/5'
                              : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          {item.name}
                        </Link>
                      )
                    })}
                  </nav>

                  {/* Divider */}
                  <div className="my-4 border-t border-white/10" />

                  {/* Mobile search */}
                  <form onSubmit={handleSearch}>
                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 h-9 transition-colors focus-within:border-white/20">
                      <MagnifyingGlassIcon className="h-4 w-4 shrink-0 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-transparent text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none"
                      />
                    </div>
                  </form>
                </div>

                {/* Drawer footer */}
                <div className="border-t border-white/10 px-4 py-4">
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
          className={`px-4 py-2 text-xs font-medium tracking-wide uppercase font-['Outfit'] text-slate-300 hover:text-white transition-colors rounded ${
            scrolled ? 'h-9' : 'h-10'
          }`}
        >
          Log in
        </Link>
        <Link
          href="/register"
          className={`px-4 py-2 text-xs font-medium tracking-wide uppercase font-['Outfit'] bg-red-500 text-white hover:bg-red-600 transition-colors rounded md:flex ${
            scrolled ? 'h-9' : 'h-10'
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
        className={`flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 pl-2 pr-3 transition-colors hover:bg-white/10 ${scrolled ? 'h-9' : 'h-10'}`}
      >
        <div className="relative">
          <ProfileImage
            src={session.user?.image}
            name={session.user?.name}
            size={scrolled ? 28 : 32}
            className="rounded border border-white/10"
          />
          <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full border-2 border-slate-950 bg-emerald-500" />
        </div>
        <span className="hidden text-xs font-medium tracking-wide font-['Outfit'] text-slate-200 md:block uppercase">
          {session.user?.name?.split(' ')[0]}
        </span>
      </button>

      <AnimatePresence>
        {accountOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-white/10 bg-slate-950/95 p-2 shadow-lg backdrop-blur-md z-50"
          >
            <div className="mb-2 pb-2 border-b border-white/10">
              <p className="px-2 py-1 text-xs font-medium text-slate-200 truncate">{session.user?.name}</p>
              <p className="px-2 py-1 text-[10px] text-slate-500 truncate">{session.user?.email}</p>
            </div>

            <div className="space-y-0.5">
              {[
                { name: 'Profile',      href: '/profile',            icon: UserCircleIcon },
                { name: 'Support',      href: '/support',            icon: LifebuoyIcon },
              ].map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-2 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white rounded transition-colors"
                >
                  <item.icon className="h-4 w-4 text-slate-500" />
                  <span className="tracking-wide uppercase">{item.name}</span>
                </Link>
              ))}
            </div>

            <div className="mt-2 pt-2 border-t border-white/10">
              <button
                onClick={() => signOut()}
                className="flex w-full items-center gap-2 px-2 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
                <span className="tracking-wide uppercase">Sign out</span>
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
      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 border border-white/10 p-3">
          <ProfileImage src={session.user?.image} name={session.user?.name} size={36} className="rounded border border-white/10" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-slate-200">{session.user?.name}</p>
            <p className="truncate text-[10px] text-slate-500">{session.user?.email}</p>
          </div>
        </div>
        <Link 
          href="/profile" 
          onClick={onClose} 
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/5 hover:text-white rounded transition-colors"
        >
          <UserCircleIcon className="h-4 w-4 text-slate-500" />
          <span>Profile</span>
        </Link>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          <span>Sign out</span>
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Link
        href="/login"
        onClick={onClose}
        className="block w-full text-center px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded transition-colors"
      >
        Log in
      </Link>
      <Link
        href="/register"
        onClick={onClose}
        className="block w-full text-center px-3 py-2 text-xs font-medium bg-red-500 text-white hover:bg-red-600 rounded transition-colors"
      >
        Register
      </Link>
    </div>
  )
}
