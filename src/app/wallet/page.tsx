"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  FaWallet, FaHistory, FaPlusCircle, FaArrowUp, 
  FaArrowDown, FaCreditCard, FaShieldAlt 
} from 'react-icons/fa';

export default function WalletPage() {
   const { data: session } = useSession();
   const balance = (session?.user as any)?.walletBalance || 0;
   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

   useEffect(() => {
     const handleMouseMove = (e: MouseEvent) => {
       setMousePos({
         x: (e.clientX / window.innerWidth) * 100,
         y: (e.clientY / window.innerHeight) * 100,
       });
     };
     window.addEventListener('mousemove', handleMouseMove);
     return () => window.removeEventListener('mousemove', handleMouseMove);
   }, []);

  const mockTransactions = [
    { id: 1, type: 'credit', amount: 50, date: '2026-03-25', description: 'Monthly Premium Bonus' },
    { id: 2, type: 'debit', amount: 15, date: '2026-03-24', description: 'Match Ticket: FC Escuela vs. Hanoi' },
    { id: 3, type: 'credit', amount: 100, date: '2026-03-20', description: 'Top Up - Visa **** 4242' },
  ];

  return (
    <div className="min-h-screen py-20 px-8 relative overflow-hidden bg-[#020202] selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.03] blur-[120px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] brightness-50 z-10" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.03] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-20 left-10 select-none pointer-events-none opacity-[0.03] whitespace-nowrap z-0">
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">FINANCIAL_ASSETS</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Asset_Access: Level_04
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {session?.user?.id?.substring(0,8).toUpperCase() || 'UNA-000'}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Financial <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Wallet</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>UNIT_LIQUIDITY</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       {new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">CREDIT_SYNC_OK</span>
                 </div>
              </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          
          {/* Main Balance HUD: RADAR SWEEP PROTOCOL */}
          <div className="lg:col-span-7 space-y-10">
            <div className="glass-card hud-border p-12 bg-slate-950/40 relative overflow-hidden group min-h-[500px] flex flex-col justify-between">
              {/* Radar Sweep Animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/5 via-transparent to-transparent opacity-30 animate-pulse" />
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              {/* HUD Technical Borders */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-yellow-500/30" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-yellow-500/30" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-yellow-500/30" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-yellow-500/30" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-16">
                   <div>
                      <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.5em] mb-2 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                         Balance Protocol
                      </h3>
                      <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">System // ID: {session?.user?.id?.substring(0, 8)}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Status: Nominal</p>
                      <p className="text-[7px] text-green-500 font-mono uppercase tracking-[0.2em] mt-1">Registry Synchronized</p>
                   </div>
                </div>

                <div className="flex flex-col items-start gap-4 mb-20">
                   <div className="flex items-end gap-4">
                      <span className="text-4xl text-yellow-500/30 font-mono mb-6">$</span>
                      <span className="text-8xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                        {balance.toLocaleString('en-US')}
                      </span>
                      <div className="flex flex-col items-start mb-6">
                         <span className="text-xl text-yellow-500 font-black uppercase tracking-widest">Credits</span>
                         <span className="text-[8px] text-slate-500 font-mono uppercase tracking-[0.2em]">Verified Assets</span>
                      </div>
                   </div>
                   
                   <div className="glass-card border-white/5 bg-white/[0.01] px-8 py-5 flex flex-col items-start">
                      <span className="text-[8px] text-slate-700 font-black uppercase tracking-[0.2em] mb-1">Estimated Asset Value</span>
                      <span className="text-2xl font-black text-white">${balance.toLocaleString('en-US')}.00</span>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 border-t border-white/5 pt-1">
                  {[
                    { label: 'Available Assets', val: balance.toLocaleString('en-US'), color: 'text-white' },
                    { label: 'Rewards Hub', val: '842', color: 'text-yellow-500/50' },
                  ].map((node, i) => (
                    <div key={i} className="p-8 hover:bg-white/[0.02] transition-all relative group/node overflow-hidden">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] mb-3 group-hover/node:text-yellow-500 transition-colors uppercase">{node.label}</p>
                      <p className={`text-4xl font-black ${node.color}`}>{node.val}</p>
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-yellow-500 scale-x-0 group-hover/node:scale-x-50 transition-transform duration-500 origin-left" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Ledger: SEQUENTIAL PROTOCOL */}
          <div className="lg:col-span-5">
            <div className="glass-card hud-border p-10 bg-slate-950/20 backdrop-blur-md min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg glass-card border-yellow-500/20 flex items-center justify-center">
                    <FaHistory className="text-yellow-500 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.5em]">Ledger</h3>
                    <p className="text-[7px] text-slate-600 font-mono uppercase tracking-widest mt-1">HIST-SYNC-OK</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.4)]" />
                   <span className="text-[8px] text-slate-500 font-mono uppercase tracking-widest leading-none">FEED_LIVE</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                {mockTransactions.map((tx, i) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-6 glass-card border-white/5 hover:bg-white/[0.04] transition-all group/tx relative overflow-hidden"
                    style={{ animationDelay: `${0.1 * i}s` }}
                  >
                     {/* HUD Hover Effect */}
                    <div className="absolute inset-y-0 left-0 w-1 bg-yellow-500 scale-y-0 group-hover/tx:scale-y-100 transition-transform duration-500" />
                    
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-500 ${
                        tx.type === 'credit' ? 'border-green-500/10 bg-green-500/5 group-hover/tx:border-green-500/40' : 'border-red-500/10 bg-red-500/5 group-hover/tx:border-red-500/40'
                      }`}>
                        {tx.type === 'credit' ? <FaArrowUp className="text-[10px] text-green-500" /> : <FaArrowDown className="text-[10px] text-red-500" />}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1 group-hover/tx:text-yellow-500 transition-colors uppercase leading-tight">{tx.description}</p>
                        <p className="text-[7px] text-slate-500 font-mono uppercase tracking-widest">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right relative z-10">
                      <p className={`text-lg font-black tracking-tighter ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                      </p>
                      <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.2em]">TRX</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                 <p className="text-[7px] text-slate-700 font-black uppercase tracking-[0.4em] mb-1">Registry Context</p>
                 <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest">End of History Stream // NODE_672</p>
              </div>
            </div>
          </div>

        </div>
       </div>
    </div>
)
}
