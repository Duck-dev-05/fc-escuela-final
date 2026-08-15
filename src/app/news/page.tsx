'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { FaNewspaper, FaTag } from 'react-icons/fa'
import { adminService } from '@/services/local-api'
import { formatDisplayTitle, formatCategory } from '@/lib/utils'

interface NewsArticle {
  id: string
  title: string
  content: string
  imageUrl: string
  author: string
  createdAt: string
  category: string
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await adminService.getArticles()
        const mappedArticles: NewsArticle[] = data.map((a) => ({
          id: a.id.toString(),
          title: a.title,
          content: a.content,
          imageUrl: a.imageUrl,
          author: a.author,
          createdAt: a.createdAt,
          category: a.category,
        }))
        setArticles(mappedArticles)
      } catch (err) {
        setError('We could not load news. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [])

  const categories = useMemo(() => {
    return ['ALL', ...new Set(articles.map((a) => a.category))]
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'ALL') return articles
    return articles.filter((a) => a.category === selectedCategory)
  }, [articles, selectedCategory])

  const featuredArticle = useMemo(() => articles[0], [articles])

  const remainingArticles = useMemo(() => {
    if (selectedCategory === 'ALL' && featuredArticle) {
      return filteredArticles.filter((a) => a.id !== featuredArticle.id)
    }
    return filteredArticles
  }, [filteredArticles, featuredArticle, selectedCategory])

  const excerpt = (text: string, max: number) => {
    const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    if (plain.length <= max) return plain
    return `${plain.slice(0, max).trim()}…`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-red-500" />
          <p className="text-sm font-medium text-slate-500">Loading news…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4">
        <div className="max-w-md w-full glass-card p-10 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <FaNewspaper className="text-xl" />
          </div>
          <h2 className="font-display text-2xl uppercase tracking-wide text-white">Something went wrong</h2>
          <p className="mt-3 text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808] text-slate-200">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden border-b border-white/5 pt-36 pb-16 md:pt-40 md:pb-20">
        {/* Background */}
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-12"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Red glows */}
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-700/10 blur-[80px] -z-10" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-red-900/6 blur-[80px] -z-10" />

        {/* Top club stripe */}
        <div className="club-top-stripe" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-red-400">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              From the Academy
            </p>
            <h1 className="font-display text-7xl sm:text-8xl md:text-9xl uppercase tracking-wide text-white">
              Latest{' '}
              <span className="text-gradient-red">News</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-slate-400 md:text-base">
              Announcements, match stories, and updates from FC Escuela — readable and easy to scan.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ───────────────────────────────────────────────────────── */}
      <div className="container-custom py-14 md:py-20">

        {/* Featured article */}
        {featuredArticle && selectedCategory === 'ALL' && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-16"
          >
            <div className="mb-6 flex items-center gap-3">
              <span className="label-eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                Featured Story
              </span>
              <div className="flex-1 section-stripe-red" />
            </div>

            <Link href={`/news/${featuredArticle.id}`} className="group block">
              <div className="match-card overflow-hidden md:grid md:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-[4/3] min-h-[240px] overflow-hidden md:aspect-auto md:min-h-[380px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      <FaTag className="text-[8px]" /> Featured
                    </span>
                    <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                      {formatCategory(featuredArticle.category)}
                    </span>
                    <h2 className="mt-4 font-display text-3xl md:text-4xl lg:text-5xl uppercase tracking-wide text-white">
                      {formatDisplayTitle(featuredArticle.title)}
                    </h2>
                    <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-red-400">
                      Read story <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Text side */}
                <div className="flex flex-col justify-center border-t border-white/5 p-7 md:border-t-0 md:border-l md:border-l-white/5 md:p-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500 mb-4">Spotlight</p>
                  <p className="text-base leading-relaxed text-slate-400 md:text-lg">
                    {excerpt(featuredArticle.content, 280)}
                  </p>
                  <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Author</p>
                      <p className="font-semibold text-slate-300 text-sm">{featuredArticle.author}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">Published</p>
                      <p className="font-semibold text-slate-300 text-sm">
                        {new Date(featuredArticle.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8">
                    <span className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition group-hover:bg-red-500">
                      Read Full Article <ArrowRightIcon className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.section>
        )}

        {/* Category filters + All articles */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="label-eyebrow mb-1">Browse</p>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white md:text-3xl">All Articles</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-red-600 text-white shadow-sm shadow-red-900/30'
                    : 'glass-card text-slate-500 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        {/* Red divider */}
        <div className="divider-red mb-10" />

        {/* Articles grid */}
        <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {remainingArticles.map((article, idx) => (
              <motion.li
                key={article.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: idx * 0.04 }}
              >
                <Link href={`/news/${article.id}`} className="group block h-full">
                  <article className="fc-card flex h-full flex-col overflow-hidden">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#05080f]/70 to-transparent opacity-60" />
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#080808]/80 border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-300 backdrop-blur-sm">
                        <FaTag className="text-[8px] text-red-500" />
                        {formatCategory(article.category)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarIcon className="h-3.5 w-3.5 text-red-500/70" />
                          {new Date(article.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <UserIcon className="h-3.5 w-3.5 text-slate-600" />
                          {article.author.split(' ')[0]}
                        </span>
                      </div>
                      <h3 className="font-display text-xl uppercase tracking-wide text-white transition group-hover:text-red-400 md:text-2xl">
                        {formatDisplayTitle(article.title)}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
                        {excerpt(article.content, 140)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 transition group-hover:text-red-400">
                        Read article <ArrowRightIcon className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {remainingArticles.length === 0 && !loading && (
          <div className="glass-card px-8 py-20 text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-600">
              <FaNewspaper className="text-xl" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white">No articles here</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm text-slate-500">
              Try another category or check back when new posts are published.
            </p>
            {selectedCategory !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className="mt-6 rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-500"
              >
                Show all
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
