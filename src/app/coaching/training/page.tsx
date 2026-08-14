"use client";

import { FaRunning, FaClock, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function TrainingProtocols() {
  const sessions = [
    { title: 'Conditioning Matrix', time: '09:00', duration: '90m', load: 'HIGH', status: 'READY' },
    { title: 'Tactical Sync: Phase II', time: '11:30', duration: '60m', load: 'MED', status: 'PENDING' },
    { title: 'Set Piece Execution', time: '15:00', duration: '45m', load: 'LOW', status: 'STANDBY' },
  ];

  return (
    <div className="py-20 px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-16 animate-slide-up">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 glass-card hud-border flex items-center justify-center bg-slate-950 border-yellow-500/30">
            <FaRunning className="text-2xl text-yellow-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Training <span className="text-yellow-500">Logic</span></h1>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">Operational Readiness Protocols</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Schedule HUD */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass-card hud-border p-8 bg-slate-950/40">
             <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Session Ledger</span>
                <span className="text-[8px] text-yellow-500 font-mono">DATE: 2024.03.26</span>
             </div>

             <div className="space-y-4">
                {sessions.map((session, idx) => (
                  <div key={idx} className="p-6 glass-card border-white/5 hover:bg-white/[0.04] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 glass-card border-white/10 flex items-center justify-center bg-slate-900 text-yellow-500 font-black text-sm group-hover:border-yellow-500/30 transition-all">
                           {idx + 1}
                        </div>
                        <div>
                           <p className="text-sm font-black text-white uppercase tracking-widest mb-1">{session.title}</p>
                           <div className="flex items-center gap-4">
                              <span className="flex items-center gap-2 text-[8px] text-slate-500 font-mono">
                                 <FaClock className="text-yellow-500/50" /> {session.time} / {session.duration}
                              </span>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                 session.load === 'HIGH' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                              }`}>LOAD_{session.load}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-6">
                        <div className="text-right">
                           <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest mb-1">Response State</p>
                           <p className="text-[10px] text-green-500 font-mono font-black">{session.status}</p>
                        </div>
                        <button className="px-6 py-2 border border-white/10 text-[8px] text-slate-400 font-black uppercase tracking-widest hover:border-yellow-500 hover:text-white transition-all">
                           INITIALIZE
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Intensity Monitor */}
        <div className="lg:col-span-4 space-y-8">
           <div className="glass-card hud-border p-8 bg-slate-950/20">
              <div className="flex items-center gap-3 mb-8">
                 <FaExclamationTriangle className="text-yellow-500" />
                 <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Intensity Matrix</h3>
              </div>
              
              <div className="aspect-square relative flex items-center justify-center">
                 <div className="absolute inset-0 border-[10px] border-slate-900 rounded-full" />
                 <div className="absolute inset-0 border-[10px] border-yellow-500 border-t-transparent border-l-transparent rounded-full rotate-[15deg] animate-spin-slow" />
                 <div className="text-center">
                    <span className="text-4xl font-black text-white leading-none">88%</span>
                    <p className="text-[8px] text-yellow-500 font-black uppercase tracking-widest mt-2">Peak Readiness</p>
                 </div>
              </div>

              <div className="mt-10 space-y-4">
                 {[
                    { label: 'Sprint Volume', val: '12.4km', sub: '+0.4% VS LAST' },
                    { label: 'Work Intensity', val: '8.2/10', sub: 'OPTIMAL_ZONE' },
                 ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-end border-b border-white/5 pb-4">
                       <div>
                          <p className="text-[7px] text-slate-600 font-black uppercase tracking-widest mb-1">{item.label}</p>
                          <p className="text-lg font-black text-white">{item.val}</p>
                       </div>
                       <p className="text-[7px] text-yellow-500 font-mono">{item.sub}</p>
                    </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
