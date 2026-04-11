'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { CalendarIcon, UserIcon, ArrowLeftIcon, ClockIcon, ShareIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaExclamationTriangle } from 'react-icons/fa'
import { formatDisplayTitle, formatCategory } from '@/lib/utils'

interface MatchDetails {
  homeTeam: string
  awayTeam: string
  date: string
  time: string
  venue: string
  competition: string
  summary?: string
}

interface NewsArticle {
  id: string
  title: string
  content: string
  imageUrl: string
  author: string
  createdAt: string
  updatedAt: string
  category: string
  intro?: string
  matchDetails?: MatchDetails
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [related, setRelated] = useState<NewsArticle[]>([])

  useEffect(() => {
    if (!id) return
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}`)
        if (!res.ok) {
          setError('This article could not be found.')
          setArticle(null)
          return
        }
        const data = await res.json()
        setArticle(data)
        setError(null)
      } catch {
        setError('Something went wrong loading this page.')
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/news`)
        if (!res.ok) return
        const data: NewsArticle[] = await res.json()
        setRelated(data.filter((a) => a.id !== id).slice(0, 4))
      } catch {
        /* ignore */
      }
    }
    fetchRelated()
  }, [id])

  const readingTime = useMemo(() => {
    if (!article) return 0
    const words = article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / 200))
  }, [article])

  const bodyHtml = useMemo(() => {
    if (!article) return ''
    const c = article.content
    if (/<\/?[a-z][\s\S]*>/i.test(c)) return c
    return `<p>${c.replace(/\n\n/g, '</p><p class="mt-6">').replace(/\n/g, '<br/>')}</p>`
  }, [article])

  const handleShare = async () => {
    if (typeof window === 'undefined' || !article) return
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url })
      } else {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      /* user cancelled or clipboard denied */
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading article…</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-700">
            <FaExclamationTriangle className="text-xl" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">Article unavailable</h1>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <Link
            href="/news"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All news
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 text-slate-900">
      <article className="container-custom px-4 pt-28 md:pt-32">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-slate-600 transition hover:text-amber-700"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            All news
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-950">
                  {formatCategory(article.category)}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-500">
                  <CalendarIcon className="h-4 w-4 text-amber-600" />
                  {new Date(article.createdAt).toLocaleDateString(undefined, {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
                {formatDisplayTitle(article.title)}
              </h1>

              <div className="flex flex-wrap items-center gap-6 border-b border-slate-200 pb-6 text-sm text-slate-600">
                <span className="flex items-center gap-2 font-medium">
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  {article.author}
                </span>
                <span className="flex items-center gap-2 font-medium">
                  <ClockIcon className="h-4 w-4 text-slate-400" />
                  {readingTime} min read
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition hover:border-amber-300 hover:bg-amber-50"
                >
                  <ShareIcon className="h-4 w-4" />
                  Share
                </button>
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="relative mt-8 aspect-[21/9] min-h-[200px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-sm sm:min-h-[280px]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10 lg:p-12"
            >
              <div
                className="prose prose-slate max-w-none prose-headings:font-bold prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-amber-700"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />

              <div className="mt-10 flex flex-col gap-4 border-t border-slate-100 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">Official FC Escuela communication.</p>
                <Link
                  href="/news"
                  className="inline-flex w-fit items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950"
                >
                  Back to news
                </Link>
              </div>
            </motion.div>

            {article.matchDetails && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-10 rounded-3xl border border-slate-200 bg-slate-100/80 p-6 md:p-8"
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-800">Match context</p>
                <div className="mt-6 grid gap-8 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fixture</p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {article.matchDetails.homeTeam}{' '}
                      <span className="font-bold text-slate-400">vs</span> {article.matchDetails.awayTeam}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{article.matchDetails.competition}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">When & where</p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{article.matchDetails.venue}</p>
                    <p className="mt-1 text-sm text-slate-600">
                      {article.matchDetails.date} · {article.matchDetails.time}
                    </p>
                  </div>
                  {(article.matchDetails.summary || '').trim() !== '' && (
                    <div className="md:col-span-2 border-t border-slate-200 pt-6">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Summary</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-700">{article.matchDetails.summary}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                <h2 className="border-b border-slate-100 pb-4 text-sm font-black tracking-tight text-slate-900">
                  More stories
                </h2>
                <ul className="mt-6 space-y-6">
                  {related.map((r, i) => (
                    <motion.li
                      key={r.id}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Link href={`/news/${r.id}`} className="group flex gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.imageUrl} alt={r.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                            {formatCategory(r.category)}
                          </p>
                          <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-amber-700">
                            {formatDisplayTitle(r.title)}
                          </p>
                        </div>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {related.length === 0 && <p className="text-sm text-slate-500">No other articles yet.</p>}

                <button
                  type="button"
                  onClick={handleShare}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-800 transition hover:bg-slate-50"
                >
                  <ShareIcon className="h-4 w-4" />
                  Share this article
                </button>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  )
}
