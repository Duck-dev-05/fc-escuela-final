'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheckIcon, LockClosedIcon, FingerPrintIcon, EyeIcon, DocumentTextIcon, VideoCameraIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline'

export default function SecurityVault() {
  const [authState, setAuthState] = useState<'locked' | 'scanning' | 'authorized'>('locked')
  const [activeDossier, setActiveDossier] = useState<string | null>(null)

  const dossiers = [
    { id: 'tactical-shadow', title: 'Tactical_Shadow', icon: VideoCameraIcon, count: 12, type: 'ULTRA_SECRET' },
    { id: 'personnel', title: 'Personnel_Dossiers', icon: DocumentTextIcon, count: 24, type: 'RESTRICTED' },
    { id: 'board-directives', title: 'Board_Directives', icon: ArchiveBoxIcon, count: 5, type: 'L3_CLEARANCE' }
  ]

  const handleScanTrigger = () => {
    if (authState === 'locked') {
      setAuthState('scanning')
      // Simulate Decryption Logic
      setTimeout(() => {
        setAuthState('authorized')
      }, 3500)
    }
  }

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-yellow-500 selection:text-black py-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header HUD */}
        <div className="flex items-center justify-between mb-20 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2 flex items-center gap-4">
              <ShieldCheckIcon className="w-10 h-10 text-yellow-500" />
              Security_Vault <span className="text-yellow-500/50 text-xl font-mono not-italic tracking-normal">v.9.4.2</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-[0.3em] uppercase">Deep_Layer // Encrypted_Repository</p>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-yellow-500/50 font-mono uppercase mb-1">Signal Status</div>
            <div className="text-xs font-black uppercase tracking-widest text-[#00ffc3] animate-pulse">ENCRYPTED // STABLE</div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {authState !== 'authorized' ? (
            <motion.div 
              key="auth-gate"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative group cursor-pointer" onClick={handleScanTrigger}>
                {/* Biometric Scan Area */}
                <div className="absolute -inset-20 bg-yellow-500/10 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-64 h-64 rounded-full border-2 border-white/5 flex items-center justify-center relative overflow-hidden bg-slate-900/40 backdrop-blur-3xl transition-all duration-700 group-hover:border-yellow-500/50">
                  
                  {/* Scanline Animation */}
                  {authState === 'scanning' && (
                    <motion.div 
                      initial={{ top: '-10%' }}
                      animate={{ top: '110%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-x-0 h-1 bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,1)] z-20"
                    />
                  )}

                  <div className="relative z-10 text-center">
                    {authState === 'locked' ? (
                      <>
                        <FingerPrintIcon className="w-20 h-20 text-yellow-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-yellow-500">Initialize_Scan</span>
                      </>
                    ) : (
                      <>
                        <EyeIcon className="w-20 h-20 text-yellow-500 mb-4 mx-auto animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-yellow-500 animate-pulse italic">Decrypting_Node...</span>
                      </>
                    )}
                  </div>
                </div>

                {/* HUD Brackets */}
                <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-yellow-500/30" />
                <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-500/30" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-yellow-500/30" />
                <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-yellow-500/30" />
              </div>

            </motion.div>
          ) : (
            <motion.div 
               key="vault-content"
               initial={{ opacity: 0, y: 40 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
               {dossiers.map((dossier) => (
                  <div 
                     key={dossier.id}
                     onClick={() => setActiveDossier(dossier.id)}
                     className="glass-card hud-border p-8 border-white/5 hover:border-yellow-500/40 transition-all cursor-pointer group"
                  >
                     <div className="flex items-start justify-between mb-12">
                        <dossier.icon className="w-12 h-12 text-yellow-500 transition-transform group-hover:scale-110" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-500 border border-white/5 px-2 py-1">{dossier.type}</span>
                     </div>
                     <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">{dossier.title}</h3>
                     <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500">
                        <span>Items: {dossier.count}</span>
                        <span className="group-hover:text-yellow-500 transition-colors">Open_Dossier →</span>
                     </div>
                  </div>
               ))}

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
