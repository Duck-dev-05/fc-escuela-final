'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaTicketAlt } from 'react-icons/fa'
import { toast } from 'react-hot-toast'

export type ConfirmationVariant = 'ticketing' | 'tickets'

function ticketsHref(v: ConfirmationVariant) {
  return v === 'ticketing' ? '/ticketing' : '/tickets'
}

export function TicketConfirmationSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
        <p className="text-sm font-medium text-slate-600">Loading…</p>
      </div>
    </div>
  )
}

interface TicketConfirmationProps {
  variant: ConfirmationVariant
}

export default function TicketConfirmation({ variant }: TicketConfirmationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'success' | 'failure' | 'processing'>('processing')
  const [refId] = useState(() => Math.random().toString(36).substring(2, 12).toUpperCase())
  const backHref = ticketsHref(variant)

  useEffect(() => {
    const redirect_status = searchParams.get('redirect_status')
    let timeoutId: ReturnType<typeof setTimeout>

    if (redirect_status === 'succeeded') {
      setStatus('success')
      toast.success('Order confirmed', {
        duration: 4000,
        position: 'top-center',
        icon: '🎟️',
      })
      setTimeout(() => router.push('/profile'), 3000)
    } else if (redirect_status === 'failed') {
      setStatus('failure')
      toast.error('Payment failed', {
        duration: 4000,
        position: 'top-center',
      })
    } else {
      timeoutId = setTimeout(() => {
        toast('If you completed payment, check your profile for tickets.', {
          duration: 5000,
          position: 'top-center',
          icon: '⏳',
        })
        router.push('/profile')
      }, 15000)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [searchParams, router])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50">
      <div className="absolute inset-0 -z-10">
        <Image src="/images/hero_final.jpg" alt="" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-slate-50/95 to-slate-50" />
      </div>

      <div className="flex min-h-screen items-center justify-center px-4 py-24 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-lg"
        >
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
            <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-400" aria-hidden />

            {status === 'success' ? (
              <div className="px-8 py-10 text-center md:px-10 md:py-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                  <FaCheckCircle className="text-3xl" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                  Payment successful
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
                  Your tickets are linked to your account. We&apos;re sending you to your profile—your order should appear
                  there shortly.
                </p>

                <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Reference</p>
                  <p className="mt-2 font-mono text-sm font-bold text-slate-900">ORDER-{refId}</p>
                  <p className="mt-3 text-xs text-slate-500">Use this if you contact support about this purchase.</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => router.push(backHref)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-800 transition hover:bg-slate-50"
                  >
                    <FaTicketAlt className="text-sm text-amber-600" />
                    More tickets
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/profile')}
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-amber-500 hover:text-slate-950"
                  >
                    Go to profile
                  </button>
                </div>
              </div>
            ) : status === 'failure' ? (
              <div className="px-8 py-10 text-center md:px-10 md:py-12">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
                  <FaExclamationTriangle className="text-3xl" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 md:text-3xl">
                  Payment didn&apos;t go through
                </h1>
                <p className="mx-auto mt-3 max-w-sm text-sm text-slate-600">
                  No charge was completed. You can try again or use a different card.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-xl bg-red-600 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-red-700"
                  >
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(backHref)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50"
                  >
                    <FaArrowLeft className="text-[10px]" />
                    Back to tickets
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-8 py-16 text-center md:py-20">
                <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
                <h2 className="text-lg font-black uppercase tracking-tight text-slate-900">Processing…</h2>
                <p className="mx-auto mt-2 max-w-xs text-sm text-slate-600">
                  Confirming your order. You may be redirected to your profile automatically.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
