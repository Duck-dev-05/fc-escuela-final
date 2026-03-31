'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { ArrowPathIcon, HomeIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an analytics service or dashboard
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden selection:bg-yellow-500 selection:text-slate-950">
      {/* Immersive Background depth */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-[600px] w-full relative z-10 px-6">
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center space-y-12"
        >
          {/* Visual Indicator */}
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
              <div className="w-24 h-24 bg-white shadow-2xl rounded-[2rem] flex items-center justify-center border border-slate-100 relative z-10">
                <ExclamationCircleIcon className="h-10 w-10 text-slate-900" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="h-[2px] w-8 bg-yellow-500/40" />
              <span className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.6em]">System Feedback</span>
              <div className="h-[2px] w-8 bg-yellow-500/40" />
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-slate-950 uppercase tracking-tighter leading-[0.85] italic">
               Page <br />
               <span className="not-italic text-slate-900/10" style={{ WebkitTextStroke: '2px #0f172a' }}>Offline</span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base font-medium max-w-sm mx-auto pt-6 leading-relaxed">
              We encountered an unexpected interruption in our editorial feed. Our team has been notified.
            </p>
          </div>

          {/* Error Details (Subtle) */}
          <div className="py-4 px-6 bg-slate-100/50 rounded-2xl border border-slate-200/50 inline-block max-w-full">
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-relaxed">
              Reference: {error.message || 'UNKNOWN_EXCEPTION'}<br />
              {error.digest && <span>ID: {error.digest}</span>}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-10 py-5 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-4 group"
            >
              <ArrowPathIcon className="h-4 w-4 group-hover:rotate-180 transition-transform duration-700" />
              Try Again
            </button>
            <Link 
              href="/" 
              className="w-full sm:w-auto px-10 py-5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4 group"
            >
              <HomeIcon className="h-4 w-4 group-hover:scale-110 transition-transform" />
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Decorative Text */}
      <div className="absolute bottom-12 left-12 hidden md:block">
        <span className="text-[12rem] font-black text-slate-950/[0.02] select-none pointer-events-none uppercase tracking-tighter italic">
          ESC_HUB
        </span>
      </div>
    </div>
  )
}
