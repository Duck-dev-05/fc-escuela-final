"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  FaWallet, FaHistory, FaPlusCircle, FaArrowUp, 
  FaArrowDown, FaCreditCard, FaShieldAlt 
} from 'react-icons/fa';

export default function WalletPage() {
   const { data: session } = useSession();
   const balance = (session?.user as any)?.walletBalance || 0;

  const mockTransactions = [
    { id: 1, type: 'credit', amount: 50, date: '2026-03-25', description: 'Monthly Premium Bonus' },
    { id: 2, type: 'debit', amount: 15, date: '2026-03-24', description: 'Match Ticket: FC Escuela vs. Hanoi' },
    { id: 3, type: 'credit', amount: 100, date: '2026-03-20', description: 'Top Up - Visa **** 4242' },
  ];

  return (
    <div className="min-h-screen py-16 px-6 lg:px-12 bg-slate-50 selection:bg-amber-500/30">
       <div className="max-w-[1400px] mx-auto pt-10">
          
          {/* Professional Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between mb-20 gap-8 animate-slide-up">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-[10px] text-amber-600 font-bold uppercase tracking-widest">
                    <FaWallet className="text-xs" />
                    Account Overview
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                    Financial <span className="text-amber-500">Wallet</span>
                 </h1>
                 <p className="text-slate-500 text-sm max-w-md font-medium">
                    Manage your credits, review transaction history, and access exclusive club rewards.
                 </p>
              </div>

              <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
                 <div className="flex flex-col text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                    <span className="text-sm font-bold text-slate-900">Account Active</span>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <FaShieldAlt />
                 </div>
              </div>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Balance Card */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[460px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              
              <div className="relative z-10">
                <div className="mb-12">
                   <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Available Balance</h3>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl text-amber-500 font-bold">$</span>
                      <span className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter">
                        {balance.toLocaleString('en-US')}
                      </span>
                      <span className="text-lg text-slate-400 font-bold uppercase">Credits</span>
                   </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-16">
                   <button className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10">
                      <FaPlusCircle /> Add Funds
                   </button>
                   <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all">
                      <FaCreditCard /> Manage Cards
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-8">
                  {[
                    { label: 'Primary Assets', val: balance.toLocaleString('en-US'), color: 'text-slate-900' },
                    { label: 'Rewards Points', val: '842', color: 'text-amber-600' },
                  ].map((node, i) => (
                    <div key={i} className="space-y-1 group cursor-default">
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{node.label}</p>
                      <p className={`text-3xl font-black ${node.color}`}>{node.val}</p>
                      <div className="w-8 h-1 bg-amber-500/20 group-hover:w-16 transition-all duration-500 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col min-h-[460px]">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-amber-600">
                    <FaHistory />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Transaction History</h3>
                </div>
              </div>

              <div className="space-y-4 flex-grow">
                {mockTransactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    className="flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {tx.type === 'credit' ? <FaArrowUp className="text-xs" /> : <FaArrowDown className="text-xs" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 uppercase tracking-tight">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-black tracking-tighter ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{tx.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-4 text-center">
                 <p className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">End of Transcript</p>
              </div>
            </div>
          </div>

        </div>
       </div>
    </div>
  );
}
