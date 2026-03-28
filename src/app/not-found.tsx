'use client'

import Link from 'next/link'
import { FaHome, FaQuestionCircle, FaChevronLeft } from 'react-icons/fa'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent relative overflow-hidden animate-scan pt-32 pb-16">
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-10 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase text-yellow-500">404_NULL_VAL</span>
      </div>

      <div className="max-w-md w-full glass-card hud-border p-10 animate-slide-up relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 blur-2xl rounded-full" />
            <div className="w-20 h-20 glass-card hud-border border-yellow-500/50 flex items-center justify-center relative">
               <FaQuestionCircle className="text-yellow-500 text-3xl" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-yellow-500 font-bold text-center italic">Sector Uncharted</span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter text-center">Path <span className="text-yellow-500">Missing</span></h2>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">The telemetry protocol you followed returned a null value. This sector of the FC ESCUELA portal is currently offline or under reconstruction.</p>
          
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest bg-black/20 py-2 rounded border border-white/5">
             Status: OBJECT_NOT_FOUND_404
          </div>

          <div className="grid grid-cols-1 gap-4 pt-6">
            <Link href="/" className="btn-primary flex items-center justify-center gap-3 h-14 group">
              <FaHome className="text-sm group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-[0.3em] text-[10px] font-black">Return to HQ</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* HUD Telemetry Elements */}
      <div className="absolute bottom-10 left-10 flex flex-col gap-2">
         <div className="text-[8px] font-mono text-slate-700 tracking-[0.5em] uppercase">SYSTEM_FAILURE_DETECTED</div>
         <div className="h-[1px] w-24 bg-red-500/20" />
      </div>
      
      <div className="absolute top-1/2 right-0 -translate-y-1/2 flex flex-col items-center gap-8 opacity-20 rotate-180">
         <div className="w-[1px] h-32 bg-gradient-to-t from-transparent via-yellow-500 to-transparent" />
         <span className="text-[10px] font-black uppercase tracking-[1em] [writing-mode:vertical-lr]">RECALIBRATING</span>
         <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-yellow-500 to-transparent" />
      </div>
    </div>
  )
}
