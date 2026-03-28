'use client'

import { useEffect, useState } from 'react'
import MatchList from '@/components/matches/MatchList'
import { Match } from '@/types/match'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaBroadcastTower, FaLock, FaTrophy } from 'react-icons/fa'

export default function MatchesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/matches')
        .then(res => res.json())
        .then(data => {
          setMatches(data);
        })
        .finally(() => setLoading(false))
    }
  }, [status])

  if (status === 'loading' || (status === 'authenticated' && loading)) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
           <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-xs">Syncing Match Telemetry...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 overflow-hidden animate-scan">
        <div className="max-w-md w-full glass-card hud-border p-10 text-center animate-slide-up relative z-10">
          <FaLock className="mx-auto h-12 w-12 text-yellow-500/50 mb-6" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Restricted Access</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Authentication protocol required for live telemetry</p>
          <button
            onClick={() => router.push('/login')}
            className="btn-primary w-full"
          >
            Authenticate
          </button>
        </div>
      </div>
    )
  }

  const scheduled = matches.filter(m => m.status === 'Scheduled');
  const finished = matches.filter(m => m.status === 'Finished');

  return (
    <div className="min-h-screen bg-transparent py-20 px-4 relative overflow-hidden animate-scan">
      {/* Ghost Typography Background */}
      <div className="absolute top-10 left-10 select-none pointer-events-none opacity-5">
        <span className="text-[15vw] ghost-text leading-none uppercase">FIXTURES</span>
      </div>

      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-slide-up">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <FaBroadcastTower className="text-yellow-500 text-2xl animate-pulse" />
              </div>
              <div>
                 <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Match <span className="text-yellow-500">Center</span></h1>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Live Feed & Deployment Records</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="glass-card border-white/5 px-4 py-2 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest pt-0.5">Stream Active</span>
              </div>
           </div>
        </div>

        {/* Upcoming Matches */}
        {(scheduled.length > 0 || matches.length === 0) && (
          <div className="mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
               <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Next Operations</h2>
            </div>
            <MatchList matches={scheduled.length > 0 ? scheduled : matches} />
          </div>
        )}

        {/* Finished Matches */}
        {finished.length > 0 && (
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-3 mb-8">
               <div className="w-2 h-2 rounded-full bg-slate-700 shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
               <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Archive Transmissions</h2>
            </div>
            <MatchList matches={finished} />
          </div>
        )}

        {matches.length === 0 && !loading && (
           <div className="glass-card hud-border p-20 text-center animate-slide-up">
              <FaTrophy className="mx-auto h-16 w-16 text-slate-800 mb-6" />
              <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Units Deployed</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Zero match data found in the current transmission cycle.</p>
           </div>
        )}
      </div>

       {/* Floating UI Elements */}
       <div className="fixed bottom-10 right-10 flex flex-col items-end gap-2 pointer-events-none opacity-20">
          <div className="text-[8px] text-slate-500 font-mono">LATENCY: 12ms</div>
          <div className="text-[8px] text-slate-500 font-mono">ENCRYPTION: AES-256</div>
          <div className="text-[8px] text-slate-500 font-mono">FREQ: 5.4GHz</div>
       </div>
    </div>
  )
}