'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { FaLock, FaTicketAlt, FaArrowRight } from 'react-icons/fa'
import { SiStripe } from 'react-icons/si'

export interface TicketRow {
  id: string
  match: string
  date: string
  time: string
  venue: string
  price: number
  status: string
  matchId: string
  availableSeats: number | null
}

export type TicketShopVariant = 'ticketing' | 'tickets'

interface TicketShopProps {
  variant: TicketShopVariant
}

const variantCopy: Record<
  TicketShopVariant,
  { badge: string; title: string; titleAccent: string; description: string; listTitle: string }
> = {
  ticketing: {
    badge: 'Official ticketing',
    title: 'Matchday',
    titleAccent: 'tickets',
    description: 'Pick a fixture, choose a category and quantity, then pay securely with Stripe.',
    listTitle: 'Available fixtures',
  },
  tickets: {
    badge: 'Passes',
    title: 'Book',
    titleAccent: 'seats',
    description: 'Reserve seats for upcoming academy matches. Sign in required to checkout.',
    listTitle: 'Upcoming matches',
  },
}

function routePrefix(v: TicketShopVariant) {
  return v === 'ticketing' ? '/ticketing' : '/tickets'
}

export function TicketShopSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
        <p className="text-sm font-medium text-slate-600">Loading tickets…</p>
      </div>
    </div>
  )
}

export default function TicketShop({ variant }: TicketShopProps) {
  const router = useRouter()
  const { data: session, status: authStatus } = useSession()
  const searchParams = useSearchParams()
  const matchId = searchParams.get('ref')
  const prefix = routePrefix(variant)
  const copy = variantCopy[variant]

  const [tickets, setTickets] = useState<TicketRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTicket, setSelectedTicket] = useState<TicketRow | null>(null)
  const [processing, setProcessing] = useState(false)
  const [formData, setFormData] = useState({
    quantity: 1,
    category: 'standard',
  })

  useEffect(() => {
    const fetchTickets = async () => {
      if (!session) return
      try {
        const response = await fetch('/api/tickets')
        const data = await response.json()
        const list: TicketRow[] = Array.isArray(data) ? data : []
        setTickets(list)
        if (matchId) {
          const selected = list.find((t) => (t.matchId || t.id) === matchId)
          if (selected) {
            setSelectedTicket(selected)
            setTimeout(() => {
              document.getElementById('order-summary')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }, 400)
          }
        }
      } catch (err) {
        setError('Could not load tickets. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTickets()
  }, [matchId, session])

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      const currentPath = window.location.pathname + window.location.search
      router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`)
    }
  }, [authStatus, router])

  const handleTicketSelect = (ticket: TicketRow) => {
    setSelectedTicket(ticket)
    setFormData((f) => ({ ...f, quantity: 1 }))
    router.push(`${prefix}?ref=${ticket.matchId}`)
  }

  const calculatePrice = () => {
    const basePrice = selectedTicket?.price || 0
    const multiplier =
      {
        standard: 1,
        premium: 1.5,
        vip: 2,
      }[formData.category] || 1
    return basePrice * formData.quantity * multiplier
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error('Please sign in to purchase tickets')
      return
    }
    const t = selectedTicket
    if (!t?.id) {
      toast.error('Select a match first.')
      return
    }

    try {
      setProcessing(true)
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId: t.id,
          category: formData.category,
          quantity: formData.quantity,
        }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Could not start checkout')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setProcessing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value, 10) || 1 : value,
    }))
  }

  if (authStatus === 'loading' || loading) {
    return <TicketShopSkeleton />
  }

  if (!session) return null

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

  const catLabel = (c: string) => c.charAt(0).toUpperCase() + c.slice(1)

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
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl -z-10" />

        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-white/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-800">
              <FaTicketAlt className="text-amber-600" />
              {copy.badge}
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              {copy.title}{' '}
              <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">
                {copy.titleAccent}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm text-slate-600 md:text-base">{copy.description}</p>
          </motion.div>
        </div>
      </section>

      <div className="container-custom py-12 md:py-16">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-6 flex flex-col gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Fixtures</p>
                <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                  {copy.listTitle}
                </h2>
              </div>
              <p className="text-sm text-slate-500">
                {tickets.length} {tickets.length === 1 ? 'match' : 'matches'}
              </p>
            </div>

            {tickets.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <FaTicketAlt className="text-xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No tickets on sale</h3>
                <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">
                  When fixtures are published for ticketing, they will appear here.
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {tickets.map((ticket, idx) => {
                  const selected = selectedTicket?.id === ticket.id
                  const available = ticket.status === 'Available'
                  return (
                    <li key={ticket.id}>
                      <motion.button
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => available && handleTicketSelect(ticket)}
                        disabled={!available}
                        className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition md:p-6 ${
                          !available
                            ? 'cursor-not-allowed opacity-60'
                            : selected
                              ? 'border-amber-400 ring-2 ring-amber-400/30'
                              : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                  available
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                                    : 'border-red-200 bg-red-50 text-red-800'
                                }`}
                              >
                                {available ? 'Available' : 'Sold out'}
                              </span>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 md:text-2xl">
                              {ticket.match || 'Match TBC'}
                            </h3>
                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                  <CalendarIcon className="h-4 w-4" />
                                </span>
                                <span className="font-semibold">{ticket.date}</span>
                              </div>
                              <div className="flex min-w-0 items-center gap-2 text-sm text-slate-700">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                  <MapPinIcon className="h-4 w-4" />
                                </span>
                                <span className="truncate font-medium">{ticket.venue}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-700">
                                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                  <UserGroupIcon className="h-4 w-4" />
                                </span>
                                <span className="font-medium">
                                  {ticket.availableSeats != null
                                    ? `${ticket.availableSeats} left`
                                    : 'Limited'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex shrink-0 flex-col items-stretch gap-2 border-t border-slate-100 pt-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 lg:text-right">
                              From
                            </p>
                            <p className="text-3xl font-black tabular-nums text-slate-900 lg:text-right">
                              <span className="text-lg text-slate-400">$</span>
                              {ticket.price}
                            </p>
                            {available && (
                              <span className="text-xs font-semibold text-amber-700 lg:text-right">
                                Tap to select
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-28">
              <div id="order-summary" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md md:p-8">
                <h2 className="border-b border-slate-100 pb-4 text-lg font-black uppercase tracking-tight text-slate-900">
                  Order summary
                </h2>

                {!selectedTicket || processing ? (
                  <div className="py-12 text-center">
                    {processing ? (
                      <div className="mx-auto mb-6 h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
                    ) : (
                      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                        <FaTicketAlt className="text-xl" />
                      </div>
                    )}
                    <p className="font-bold text-slate-900">
                      {processing ? 'Redirecting to checkout…' : 'Select a match'}
                    </p>
                    <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">
                      {processing
                        ? 'You will leave this site to complete payment with Stripe.'
                        : 'Choose a fixture on the left to set category and quantity.'}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-8">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700">Selected</p>
                      <p className="mt-2 text-lg font-black uppercase tracking-tight text-slate-900">
                        {selectedTicket.match}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {selectedTicket.venue} · {selectedTicket.time}
                      </p>
                    </div>

                    <div>
                      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Category
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {(['standard', 'premium', 'vip'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFormData((f) => ({ ...f, category: cat }))}
                            className={`rounded-xl border py-3 text-center text-[11px] font-bold uppercase tracking-wider transition ${
                              formData.category === cat
                                ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {catLabel(cat)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="mb-3 block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Quantity
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        min={1}
                        max={selectedTicket.availableSeats || 10}
                        value={formData.quantity}
                        onChange={handleChange}
                        className="input-field w-full rounded-xl border-slate-200 py-3 font-bold tabular-nums"
                      />
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                        <span>
                          {formData.quantity} ticket{formData.quantity !== 1 ? 's' : ''}
                        </span>
                        <SiStripe className="text-lg text-slate-300" aria-hidden />
                      </div>
                      <div className="mb-6 flex items-end justify-between gap-4">
                        <span className="text-sm font-semibold text-slate-500">Total</span>
                        <span className="text-4xl font-black tabular-nums text-slate-900 md:text-5xl">
                          ${calculatePrice()}
                        </span>
                      </div>

                      <button
                        type="submit"
                        disabled={selectedTicket.status === 'Sold Out' || processing}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] text-white transition hover:bg-amber-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {processing ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Processing
                          </>
                        ) : selectedTicket.status === 'Sold Out' ? (
                          'Sold out'
                        ) : (
                          <>
                            <FaLock className="text-[10px]" />
                            Continue to checkout
                            <FaArrowRight className="text-[10px]" />
                          </>
                        )}
                      </button>
                      <p className="mt-4 text-center text-[11px] text-slate-500">
                        Secure payment via Stripe. Cards accepted.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
