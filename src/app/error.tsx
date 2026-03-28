'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { FaExclamationTriangle, FaSyncAlt, FaHome } from 'react-icons/fa'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Application Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent relative overflow-hidden animate-scan pt-32 pb-16">
      {/* Ghost Typography */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-10 whitespace-nowrap">
        <span className="text-[20vw] ghost-text leading-none uppercase text-red-500">SYS_ERR_HALT</span>
      </div>

      <div className="max-w-md w-full glass-card hud-border p-10 animate-slide-up relative z-10 mx-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <div className="w-20 h-20 glass-card hud-border border-red-500/50 flex items-center justify-center relative">
               <FaExclamationTriangle className="text-red-500 text-3xl animate-pulse" />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold italic">Runtime Breach Detected</span>
          </div>
          <h2 className="text-5xl font-black text-white uppercase tracking-tighter text-center">System <span className="text-red-500">Crash</span></h2>
        </div>

        <div className="space-y-6 text-center">
          <p className="text-xs text-slate-400 font-medium leading-relaxed px-4">An unhandled exception has interrupted the FC ESCUELA telemetry stream. Protocol synchronization failed.</p>
          
          <div className="text-[10px] text-red-500/80 font-mono uppercase tracking-widest bg-red-500/5 py-3 px-4 rounded border border-red-500/20 break-all max-h-24 overflow-y-auto">
             Vector: {error.message || 'RUNTIME_ERROR_NULL'}
             {error.digest && <div className="mt-1 text-slate-600">ID: {error.digest}</div>}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <button
              onClick={() => reset()}
              className="glass-card hud-border border-white/10 flex items-center justify-center gap-3 h-14 hover:bg-white/5 transition-all group"
            >
              <FaSyncAlt className="text-sm group-hover:rotate-180 transition-transform duration-500" />
              <span className="uppercase tracking-[0.2em] text-[9px] font-black">Reboot</span>
            </button>
            <Link href="/" className="btn-primary flex items-center justify-center gap-3 h-14 group">
              <FaHome className="text-sm group-hover:scale-110 transition-transform" />
              <span className="uppercase tracking-[0.2em] text-[9px] font-black">HQ Home</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* HUD Telemetry Elements */}
      <div className="absolute bottom-10 right-10 flex flex-col items-end gap-2">
         <div className="text-[8px] font-mono text-slate-700 tracking-[0.5em] uppercase text-right leading-relaxed">
            RECOVERY_PROTOCOL_INITIALIZED<br />
            WAITING_FOR_OPERATOR_INPUT...
         </div>
      </div>
    </div>
  )
}
