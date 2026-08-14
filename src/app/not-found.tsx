'use client'

import Link from 'next/link'
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 px-4 py-24">

      {/* Ghost number */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden"
      >
        <span className="text-[30vw] font-black leading-none tracking-tighter text-slate-200">
          404
        </span>
      </div>

      {/* Soft glow blobs */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

      {/* Card */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-slate-200 bg-white/90 px-8 py-12 shadow-xl backdrop-blur-sm text-center">

        {/* Icon */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600 shadow-sm">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </div>

        {/* Badge */}
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Page not found
        </p>

        {/* Heading */}
        <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          Oops! <span className="bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 bg-clip-text text-transparent">404</span>
        </h1>

        {/* Description */}
        <p className="mt-4 text-sm leading-relaxed text-slate-500">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-amber-500 hover:text-slate-950"
          >
            <HomeIcon className="h-4 w-4" />
            Go home
          </Link>
          <button
            type="button"
            onClick={() => history.back()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Go back
          </button>
        </div>

        {/* Code hint */}
        <p className="mt-6 font-mono text-[11px] text-slate-400">
          Error code: <span className="text-slate-600">404_NOT_FOUND</span>
        </p>
      </div>
    </div>
  )
}
