'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, UserIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { FaNewspaper } from 'react-icons/fa'
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
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
          <p className="text-sm font-medium text-slate-600">Loading news…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Something went wrong</h2>
          <p className="mt-3 text-sm text-slate-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <section className="relative isolate overflow-hidden border-b border-slate-200/80 pt-28 pb-12 md:pt-32 md:pb-16">
        <div className="absolute inset-0 -z-20">
          <Image
            src="/images/hero_final.jpg"
            alt=""
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-slate-50/95 to-slate-50" />
        </div>
        <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl -z-10" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              From the academy
            </p>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              Latest{' '}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                news
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">
              Announcements, match stories, and updates from FC Escuela—readable and easy to scan.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12 md:py-16">
        {featuredArticle && selectedCategory === 'ALL' && (
          <section className="mb-14 md:mb-16">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md md:grid md:grid-cols-2 md:gap-0">
              <Link
                href={`/news/${featuredArticle.id}`}
                className="relative block aspect-[4/3] min-h-[240px] md:aspect-auto md:min-h-[360px]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent md:bg-gradient-to-r md:from-transparent md:via-slate-950/20 md:to-slate-950/70" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <span className="inline-block rounded-full bg-amber-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950">
                    Featured
                  </span>
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                    {formatCategory(featuredArticle.category)}
                  </span>
                  <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white md:text-3xl lg:text-4xl">
                    {formatDisplayTitle(featuredArticle.title)}
                  </h2>
                  <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
                    Read story <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <div className="flex flex-col justify-center border-t border-slate-100 p-6 md:border-t-0 md:border-l md:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Spotlight</p>
                <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
                  {excerpt(featuredArticle.content, 280)}
                </p>
                <div className="mt-8 flex flex-wrap gap-8 border-t border-slate-100 pt-6 text-sm">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Author</p>
                    <p className="mt-1 font-semibold text-slate-900">{featuredArticle.author}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Published</p>
                    <p className="mt-1 font-semibold text-slate-900">
                      {new Date(featuredArticle.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/news/${featuredArticle.id}`}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950"
                >
                  Read full article <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Browse</p>
            <h2 className="text-xl font-black tracking-tight text-slate-900 md:text-2xl">All articles</h2>
          </div>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-4 py-2 text-[11px] font-bold uppercase tracking-wider transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {formatCategory(cat)}
              </button>
            ))}
          </div>
        </div>

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
                  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur-sm">
                        {formatCategory(article.category)}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarIcon className="h-4 w-4 text-amber-600" />
                          {new Date(article.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                          {article.author.split(' ')[0]}
                        </span>
                      </div>
                      <h3 className="text-lg font-black leading-snug tracking-tight text-slate-900 transition group-hover:text-amber-700 md:text-xl">
                        {formatDisplayTitle(article.title)}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {excerpt(article.content, 140)}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 transition group-hover:text-amber-600">
                        Read article <ArrowRightIcon className="h-4 w-4" />
                      </span>
                    </div>
                  </article>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        {remainingArticles.length === 0 && !loading && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FaNewspaper className="text-xl" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No articles here</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
              Try another category or check back when new posts are published.
            </p>
            {selectedCategory !== 'ALL' && (
              <button
                type="button"
                onClick={() => setSelectedCategory('ALL')}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950"
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
