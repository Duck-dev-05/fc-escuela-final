'use client'

import { useState, useEffect } from 'react'
import {
   FaChartLine, FaChartPie, FaChartBar, FaBullseye,
   FaHistory, FaArrowRight, FaCogs, FaProjectDiagram,
   FaShieldAlt, FaBolt, FaCrosshairs
} from 'react-icons/fa'

export default function MatchAnalysis() {
   const [matches, setMatches] = useState<any[]>([])
   const [selectedMatch, setSelectedMatch] = useState<any>(null)
   const [loading, setLoading] = useState(true)

   useEffect(() => {
      async function fetchMatches() {
         try {
            const res = await fetch('/api/matches')
            const data = await res.json()
            const matchArray = Array.isArray(data) ? data : []
            setMatches(matchArray)
            if (matchArray.length > 0) {
               setSelectedMatch(matchArray[0])
            }
         } catch (e) {
            console.error(e)
         } finally {
            setLoading(false)
         }
      }
      fetchMatches()
   }, [])

   const analysisStats = [
      { label: 'Possession', val: '58%', icon: FaChartPie, color: 'yellow-500' },
      { label: 'Pass Accuracy', val: '86%', icon: FaBullseye, color: 'blue-500' },
      { label: 'Expected Goals (xG)', val: '2.4', icon: FaChartBar, color: 'green-500' },
      { label: 'Tactical Discipline', val: '92%', icon: FaShieldAlt, color: 'yellow-500' },
   ]

   const [aiReport, setAiReport] = useState<any>(null)
   const [analyzing, setAnalyzing] = useState(false)

   const runAiAnalysis = async () => {
      if (!selectedMatch) return;
      setAnalyzing(true);
      try {
         const res = await fetch('/api/ai/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ matchData: selectedMatch })
         })
         const data = await res.json()
         if (data.error) {
            // Check for specific quota error
            if (data.error.includes('AI_QUOTA_EXHAUSTED')) {
               alert('AI QUOTA EXHAUSTED: Please switch to Groq (Free Tier) in your .env or check your DeepSeek balance.');
            }
            throw new Error(data.error);
         }
         setAiReport(data);
         
         const reportElem = document.getElementById('ai-report');
         if (reportElem) {
            reportElem.style.opacity = '1';
            reportElem.style.maxHeight = '2000px';
         }
      } catch (e) {
         console.error('AI Error:', e)
      } finally {
         setAnalyzing(false);
      }
   }

   if (loading) {
      return (
         <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-20 h-20 border-2 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
         </div>
      )
   }

   return (
    <div className="min-h-screen bg-slate-950 text-slate-400 font-sans selection:bg-yellow-500 selection:text-slate-950 relative overflow-hidden">
      {/* Immersive Background Vantage */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(234,179,8,0.05),transparent_70%)]" />
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
      </div>

      <div className="py-24 px-8 max-w-7xl mx-auto relative z-10">
        {/* Header HUD */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-24 gap-12 animate-slide-up">
            <div className="flex flex-col gap-8">
               <div className="flex items-center gap-6">
                  <div className="px-4 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-sm skew-x-[-20deg]">
                     <span className="text-[9px] font-black text-yellow-500 uppercase tracking-[0.4em] block skew-x-[20deg]">Network: Tactical_Intelligence</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse" />
                     <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">Encryption_Link // RSA-4096</span>
                  </div>
               </div>
               
               <div className="relative">
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-4 italic">
                     Match <br />
                     <span className="text-yellow-500 not-italic">Analysis</span>
                  </h1>
               </div>
            </div>

            <div className="flex flex-col items-end gap-8 w-full lg:w-auto">
               <div className="flex items-center gap-12 text-[9px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                  <span>OPS_RESOLVED: {matches.length}</span>
                  <span>//</span>
                  <span className="text-yellow-500/50">INTEL_DECOMPRESSION_ACTIVE</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="px-6 py-2 bg-yellow-500 border border-yellow-500 text-slate-950 text-[9px] font-black uppercase tracking-[0.3em] italic">
                     Live_Update: Active
                  </div>
                  <div className="w-12 h-[1px] bg-white/10" />
               </div>
            </div>
        </div>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>

            {/* Match Registry Sidebar */}
            <div className="lg:col-span-4 space-y-6">
               <div className="glass-card hud-border p-10 bg-slate-950/60 border-white/5 h-full relative overflow-hidden group/sidebar">
                  <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="w-1 h-1 rounded-full bg-yellow-500 animate-pulse" />
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Signals_Matrix</h3>
                     </div>
                     <span className="text-[7px] text-slate-700 font-mono tracking-widest uppercase">RC_LINK: ACTIVE</span>
                  </div>

                  <div className="space-y-6 max-h-[720px] overflow-y-auto pr-4 custom-scrollbar relative z-10">
                     {matches.map((match, idx) => (
                        <button
                           key={idx}
                           onClick={() => setSelectedMatch(match)}
                           className={`w-full p-8 glass-card border transition-all text-left group/btn relative overflow-hidden ${selectedMatch?.id === match.id
                                 ? 'bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_30px_rgba(234,179,8,0.1)]'
                                 : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                              }`}
                        >
                           <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/[0.03] to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                           <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500/0 group-hover/btn:bg-yellow-500 transition-all duration-500" />
                           
                           <div className="flex justify-between items-start mb-4 relative z-10">
                              <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.3em] group-hover/btn:text-yellow-500/60 transition-colors">{match.competition}</span>
                              <div className="px-2 py-0.5 border border-white/5 rounded-sm">
                                 <span className="text-[7px] font-black text-slate-700 uppercase font-mono">{match.date.split('T')[0]}</span>
                              </div>
                           </div>
                           
                           <div className="flex justify-between items-end relative z-10">
                              <div>
                                 <h4 className="text-xl font-black text-white uppercase tracking-tighter group-hover/btn:italic transition-all duration-500 mb-2">{match.homeTeam} <span className="text-yellow-500/30">VS</span> {match.awayTeam}</h4>
                                 <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-white font-mono">{match.score || 'PENDING'}</span>
                                    <div className="w-1 h-1 rounded-full bg-slate-800" />
                                    <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{selectedMatch?.id === match.id ? 'ACTIVE_LINK' : 'SIGNAL_IDLE'}</span>
                                 </div>
                              </div>
                              <FaArrowRight className={`text-sm transition-all duration-500 group-hover/btn:translate-x-2 ${selectedMatch?.id === match.id ? 'text-yellow-500' : 'text-slate-800'}`} />
                           </div>
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            {/* Intelligence Deep-Dive Area */}
            <div className="lg:col-span-8 space-y-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
               {selectedMatch ? (
                  <>
                     {/* AI Tactical Analyst HUD Section */}
                     <div className="glass-card hud-border p-12 bg-slate-900 border-yellow-500/20 relative overflow-hidden group/ai shadow-[0_0_50px_rgba(234,179,8,0.05)]">
                        <div className="absolute inset-0 bg-yellow-500/[0.01] bg-[url('/grid.svg')] opacity-20 pointer-events-none" />
                         <div className="absolute top-0 left-0 w-full h-[1px] bg-yellow-500/30 animate-vantage-scan-y" />
                         
                         <div className="relative z-10">
                            <div className="flex flex-col md:flex-row items-center justify-between mb-16 pb-12 border-b border-white/5 gap-8">
                               <div className="flex items-center gap-8">
                                  <div className="w-20 h-20 glass-card hud-border border-yellow-500/40 flex items-center justify-center bg-slate-950 shadow-[0_0_40px_rgba(234,179,8,0.3)] relative group/logo">
                                     <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" />
                                     <FaBolt className={`text-3xl text-yellow-500 relative z-10 ${analyzing ? 'animate-bounce' : 'animate-pulse'}`} />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                     <h3 className="text-[12px] font-black text-white uppercase tracking-[0.6em] italic">Mission_Oracle_v3</h3>
                                     <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
                                           <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase">Signal_Locked</span>
                                        </div>
                                        <div className="w-[1px] h-3 bg-white/10" />
                                        <span className="text-[8px] text-slate-700 font-mono">ENCRYPT: VANGUARD_DEEP</span>
                                     </div>
                                  </div>
                               </div>
                               <button 
                                 onClick={runAiAnalysis}
                                 disabled={analyzing}
                                 className={`px-12 py-5 text-slate-950 text-[10px] font-black uppercase tracking-[0.5em] transition-all shadow-[0_0_50px_rgba(234,179,8,0.4)] disabled:opacity-50 relative overflow-hidden group/gen skew-x-[-15deg] ${analyzing ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-white'}`}
                               >
                                  <span className="relative z-10 block skew-x-[15deg]">{analyzing ? 'DECRYPTING...' : 'AUTHORIZE_SCAN'}</span>
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/gen:translate-x-full transition-transform duration-1000" />
                               </button>
                            </div>

                           <div 
                             id="ai-report" 
                             className={`${aiReport ? 'opacity-100 max-h-[2000px]' : 'opacity-0 max-h-0'} overflow-hidden transition-all duration-1000 space-y-12`}
                           >
                              {aiReport && (
                                 <>
                                    <div className="p-10 border-l-2 border-yellow-500/30 bg-slate-950/60 font-mono text-[12px] leading-relaxed text-slate-300 relative mb-12">
                                       <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                                          <FaBolt size={120} />
                                       </div>
                                        <p className="mb-6 text-yellow-500 font-extrabold tracking-[0.3em] italic uppercase">[INTEL_STREAM_ACTIVE] // SECTOR: {selectedMatch.venue.toUpperCase()}</p>
                                        <p className="mb-14 text-justify text-slate-400 first-letter:text-5xl first-letter:font-black first-letter:text-white first-letter:mr-3 first-letter:float-left leading-relaxed">{aiReport.summary}</p>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-16 pb-16 border-b border-white/5">
                                           <div className="space-y-8">
                                              <div className="flex items-center gap-4">
                                                 <div className="w-3 h-3 glass-card border-blue-500 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                                 <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.4em]">Tactical_Efficiency</p>
                                              </div>
                                              <ul className="space-y-6 opacity-80 border-l border-white/5 pl-8">
                                                 {aiReport.efficiency?.map((point: string, i: number) => (
                                                    <li key={i} className="flex gap-4 group/point relative">
                                                       <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-blue-500 scale-0 group-hover/point:scale-100 transition-transform" />
                                                       <span className="text-yellow-500/40 text-[10px] pt-0.5">{'>'}</span>
                                                       <span className="text-[12px] leading-relaxed italic group-hover:text-white transition-colors">{point}</span>
                                                    </li>
                                                 ))}
                                              </ul>
                                           </div>
                                           <div className="space-y-8">
                                              <div className="flex items-center gap-4">
                                                 <div className="w-3 h-3 glass-card border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
                                                 <p className="text-[11px] text-red-400 font-black uppercase tracking-[0.4em]">Strategic_Vulnerability</p>
                                              </div>
                                              <ul className="space-y-6 opacity-80 border-l border-white/5 pl-8">
                                                 {aiReport.vulnerability?.map((point: string, i: number) => (
                                                    <li key={i} className="flex gap-4 group/v relative">
                                                       <div className="absolute -left-[33px] top-1.5 w-2 h-2 rounded-full bg-red-500 scale-0 group-hover/v:scale-100 transition-transform" />
                                                       <span className="text-red-500/40 text-[10px] pt-0.5">{'!'}</span>
                                                       <span className="text-[12px] leading-relaxed italic group-hover:text-white transition-colors">{point}</span>
                                                    </li>
                                                 ))}
                                              </ul>
                                           </div>
                                        </div>

                                       {/* Tactical Advisory Area */}
                                       <div className="mt-12 pt-12">
                                          <div className="flex items-center gap-6 mb-10">
                                             <div className="w-10 h-10 glass-card border-yellow-500/20 flex items-center justify-center bg-slate-900 group-hover:border-yellow-500/50 transition-all">
                                                <FaProjectDiagram className="text-yellow-500" />
                                             </div>
                                             <div className="flex flex-col">
                                                <p className="text-[11px] text-white font-black uppercase tracking-[0.5em]">Protocol_Ajustments</p>
                                                <span className="text-[7px] text-slate-700 font-mono tracking-widest uppercase">VANGUARD_RECOMMENDATIONS_STREAM</span>
                                             </div>
                                          </div>
                                          <div className="grid grid-cols-1 gap-6">
                                             {aiReport.next_match_adjustments?.map((adj: string, i: number) => (
                                                <div key={i} className="p-8 glass-card border-white/5 bg-slate-900/40 hover:border-yellow-500/20 hover:bg-slate-900 transition-all group/adj flex items-start gap-8 relative overflow-hidden">
                                                   <div className="absolute left-0 top-0 w-1 h-full bg-yellow-500/0 group-hover/adj:bg-yellow-500 transition-all" />
                                                   <div className="shrink-0 w-12 h-12 glass-card border-white/10 flex items-center justify-center text-xl font-black text-slate-800 group-hover/adj:text-yellow-500 transition-colors italic">0{i+1}</div>
                                                   <p className="text-[12px] text-slate-400 font-mono leading-relaxed group-hover/adj:text-white transition-colors">{adj}</p>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-8">
                                       {[
                                          { label: 'Tactical_Intensity', val: aiReport.metrics?.intensity, color: 'text-white' },
                                          { label: 'Success_Probability', val: aiReport.metrics?.success_rate, color: 'text-green-500' },
                                          { label: 'Neural_Sync', val: aiReport.metrics?.sync_link, color: 'text-blue-500 italic' },
                                       ].map((m, idx) => (
                                          <div key={idx} className="p-6 glass-card border-white/5 bg-slate-950/60 text-center hover:border-white/20 transition-all">
                                             <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-3">{m.label}</p>
                                             <p className={`text-xl font-black tracking-tighter ${m.color}`}>{m.val || 'N/A'}</p>
                                          </div>
                                       ))}
                                    </div>
                                 </>
                              )}
                           </div>
                        </div>
                     </div>

                     {/* Strategic_Evaluation Report Card */}
                     <div className="glass-card hud-border p-12 bg-slate-900/60 border-yellow-500/10 relative overflow-hidden group/strat">
                        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover/strat:opacity-[0.08] transition-opacity grayscale group-hover/strat:rotate-12 duration-700 pointer-events-none">
                           <FaProjectDiagram size={400} />
                        </div>
                        
                        <div className="relative z-10">
                           <div className="flex items-center gap-6 mb-12">
                              <div className="px-5 py-1.5 bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-black uppercase tracking-[0.3em] rounded-sm skew-x-[-15deg]">
                                 <span className="block skew-x-[15deg]">Data: Validated</span>
                              </div>
                              <span className="text-[8px] text-slate-700 font-mono tracking-widest pt-1 px-4 border-l border-white/5 uppercase">Encryption_ID: RC-INTEL-X9</span>
                           </div>

                           <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 italic">
                              {selectedMatch.homeTeam} <span className="text-yellow-500/40 not-italic mx-4 text-3xl">VS</span> {selectedMatch.awayTeam}
                           </h2>
                           
                           <div className="flex items-end gap-16">
                              <div className="flex flex-col gap-2">
                                 <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Final_Outcome</span>
                                 <div className="flex items-baseline gap-4">
                                    <span className="text-6xl font-black text-white font-mono tracking-tighter">{selectedMatch.score || '0-0'}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,1)]" />
                                 </div>
                              </div>
                              <div className="w-[1px] h-20 bg-white/5" />
                              <div className="flex flex-col gap-2 mb-2">
                                 <span className="text-[9px] text-slate-500 font-black uppercase tracking-[0.4em]">Operational_Venue</span>
                                 <span className="text-lg font-black text-yellow-500 uppercase tracking-widest italic">{selectedMatch.venue}</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Vital Statistics Matrix */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {analysisStats.map((stat, idx) => (
                           <div key={idx} className="glass-card hud-border p-10 bg-slate-950/60 border-white/5 flex items-center justify-between group hover:border-yellow-500/30 transition-all duration-500">
                              <div className="flex items-center gap-8">
                                 <div className="w-16 h-16 rounded-sm glass-card border-white/5 bg-slate-900 flex items-center justify-center group-hover:bg-yellow-500 group-hover:text-slate-950 transition-all duration-500 relative overflow-hidden">
                                    <stat.icon className="text-2xl relative z-10" />
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                 </div>
                                 <div className="flex flex-col">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-2">{stat.label}</p>
                                    <p className="text-4xl font-black text-white font-mono tracking-tighter group-hover:text-yellow-500 transition-colors">{stat.val}</p>
                                 </div>
                              </div>
                              <div className="w-10 h-10 glass-card border-white/5 flex items-center justify-center text-[10px] font-black text-slate-800 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                 <FaBolt className="text-yellow-500/20" />
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Strategic_Evaluation Report HUD */}
                     <div className="glass-card hud-border p-12 bg-slate-950/40 border-white/5 relative group/perf overflow-hidden">
                        <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
                        <div className="flex items-center gap-6 mb-16 pb-10 border-b border-white/5 relative z-10">
                           <FaCogs className="text-yellow-500 text-xl" />
                           <div className="flex flex-col gap-1">
                              <h3 className="text-[12px] font-black text-white uppercase tracking-[0.6em]">Sector_Evaluation</h3>
                              <span className="text-[7px] text-slate-700 font-mono tracking-widest uppercase ml-1">MULTIDIMENSIONAL_METRICS_ACTIVE</span>
                           </div>
                        </div>
                        <div className="space-y-12 relative z-10">
                           {[
                              { label: 'Attacking_Fluidity', val: 88, desc: 'High-velocity conversion in final third' },
                              { label: 'Defensive_Elasticity', val: 74, desc: 'Coordinated structural re-alignment' },
                              { label: 'Midfield_Command', val: 91, desc: 'Total spatial dominance // Core occupancy' }
                           ].map((item, idx) => (
                              <div key={idx} className="group/bar">
                                 <div className="flex justify-between items-end mb-4">
                                    <div className="flex flex-col gap-1">
                                       <p className="text-[11px] text-white font-black uppercase tracking-[0.2em] group-hover/bar:text-yellow-500 transition-colors">{item.label}</p>
                                       <p className="text-[9px] text-slate-600 font-bold uppercase italic opacity-60">"Protocol: {item.desc}"</p>
                                    </div>
                                    <span className="text-2xl font-black text-yellow-500/80 font-mono tracking-tighter italic">{item.val}%</span>
                                 </div>
                                 <div className="h-[4px] bg-slate-900 rounded-full relative overflow-hidden border border-white/5">
                                    <div 
                                       className="absolute inset-y-0 left-0 bg-yellow-500/40 group-hover/bar:bg-yellow-500 transition-all duration-[1.5s] ease-out shadow-[0_0_20px_rgba(234,179,8,0.4)]" 
                                       style={{ width: `${item.val}%` }} 
                                    />
                                    <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none" />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     {/* Technical Telemetry Final Area */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                           { icon: FaBolt, label: 'Intensity_Index', val: '8.4', color: 'yellow-500', bg: 'bg-yellow-500/[0.03]' },
                           { icon: FaShieldAlt, label: 'Clean_Sheet_Prob', val: '62%', color: 'blue-500', bg: 'bg-blue-500/[0.03]' },
                           { icon: FaCrosshairs, label: 'Precision_Strike', val: '0.92', color: 'red-500', bg: 'bg-red-500/[0.03]' },
                        ].map((t, idx) => (
                           <div key={idx} className={`glass-card hud-border p-10 ${t.bg} border-white/5 flex flex-col items-center justify-center text-center group hover:border-${t.color}/30 transition-all duration-500`}>
                              <t.icon className={`text-2xl text-${t.color} opacity-30 group-hover:opacity-100 transition-opacity mb-6`} />
                              <span className="text-[8px] text-slate-600 font-black uppercase tracking-[0.4em] mb-2">{t.label}</span>
                              <span className="text-3xl font-black text-white font-mono tracking-tighter italic">{t.val}</span>
                           </div>
                        ))}
                     </div>
                  </>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full min-h-[800px] glass-card hud-border border-white/5 bg-slate-950/40 p-20 relative group/empty">
                     <div className="absolute inset-0 bg-grid-white/[0.01] pointer-events-none" />
                     <FaChartLine className="text-8xl mb-12 text-slate-900 group-hover/empty:text-yellow-500/20 transition-colors duration-1000" />
                     <div className="flex flex-col items-center gap-4 text-center">
                        <p className="text-[12px] font-black uppercase tracking-[0.8em] text-slate-600 group-hover/empty:text-white transition-colors">Standby_Mode</p>
                        <span className="text-[9px] text-slate-800 font-mono tracking-widest uppercase">Select Operation Registry Link For Extraction</span>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
   )
}
