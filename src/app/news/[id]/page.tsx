"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CalendarIcon, UserIcon, ArrowLeftIcon, 
  TagIcon, ShareIcon, ClockIcon, 
  ChartBarIcon, BoltIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';

interface MatchDetails {
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  summary?: string;
}

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  intro?: string;
  matchDetails?: MatchDetails;
}

export default function NewsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [related, setRelated] = useState<NewsArticle[]>([]);
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

  useEffect(() => {
    if (!id) return;
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        if (!res.ok) throw new Error("Registry Access Denied.");
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        setError("Telemetry Retrieval Failure.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/news`);
        if (!res.ok) return;
        const data: NewsArticle[] = await res.json();
        setRelated(data.filter(a => a.id !== id).slice(0, 4));
      } catch {}
    };
    fetchRelated();
  }, [id]);

  const readingTime = useMemo(() => {
    if (!article) return 0;
    const words = article.content.split(/\s+/).length;
    return Math.ceil(words / 200);
  }, [article]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-l-2 border-yellow-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-b-2 border-r-2 border-slate-200 rounded-full animate-reverse-spin opacity-50"></div>
          </div>
          <p className="text-yellow-600 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Intel Flow...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        <div className="max-w-md w-full glass-card hud-border p-12 text-center relative z-10">
          <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <BoltIcon className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4 italic">Protocol Violation</h2>
          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mb-12">Registry unit {id?.slice(0, 8)} not found.</p>
          <button
            onClick={() => router.push('/news')}
            className="btn-primary w-full"
          >
            Return to Core
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4 md:px-8 relative overflow-hidden bg-slate-50 selection:bg-yellow-500 selection:text-slate-950">
       {/* Background Dynamics */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
             className="absolute w-[1200px] h-[1200px] rounded-full bg-yellow-500/[0.03] blur-[150px] z-0"
             animate={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
             }}
             transition={{ type: 'spring', damping: 30, stiffness: 50 }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10" />
          <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-yellow-500/[0.04] via-transparent to-transparent z-10" />
          
          <div className="absolute top-40 left-1/2 -track-x-1/2 select-none pointer-events-none opacity-[0.015] whitespace-nowrap z-0">
             <span className="text-[25vw] font-black ghost-text leading-none uppercase italic tracking-tighter shadow-2xl">ESCUELA NEWS</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20">
          {/* Navigation & Status Command Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-24 gap-8">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Link href="/news" className="group inline-flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-slate-900 transition-all">
                 <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white/50 flex items-center justify-center group-hover:border-slate-900 group-hover:bg-slate-50 transition-all shadow-sm">
                    <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                 </div>
                 <span className="italic">Back to news hub</span>
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
             {/* Content Mainframe */}
             <div className="lg:col-span-8 space-y-16">
                <motion.header 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-10"
                >
                  <div className="flex items-center gap-6">
                    <span className="px-5 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest skew-x-[-15deg] shadow-xl">
                      <span className="block skew-x-[15deg]">{article.category}</span>
                    </span>
                    <div className="h-[2px] w-12 bg-slate-200" />
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">PUBLISHED ON {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h1 className="text-6xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85] italic transition-transform duration-700">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-3">
                       <UserIcon className="h-4 w-4 text-slate-900" />
                       BY {article.author.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-3">
                       <ClockIcon className="h-4 w-4 text-slate-900" />
                       READING TIME: {readingTime} MINS
                    </span>
                    <div className="flex gap-4">
                      <button className="p-2 border border-slate-200 rounded-lg hover:border-yellow-500/50 hover:bg-yellow-500/5 transition-colors"><ShareIcon className="h-4 w-4" /></button>
                    </div>
                  </div>
                </motion.header>

                {/* Hero Asset HUD */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 shadow-2xl group"
                >
                   <img
                     src={article.imageUrl}
                     alt={article.title}
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[20s] linear"
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-60" />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card shadow-2xl p-12 md:p-20 relative overflow-hidden bg-white/70 backdrop-blur-2xl border-slate-200/60"
                >
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none italic font-black text-9xl">INTEL</div>
                   
                   <div className="prose prose-slate max-w-none prose-yellow">
                     <div 
                       className="text-slate-600 font-medium uppercase tracking-wider leading-loose text-sm italic space-y-8"
                       dangerouslySetInnerHTML={{ __html: article.content.replace(/\n\n/g, '</div><div class="mb-10 lg:pl-12 border-l border-slate-100 italic font-bold text-slate-800">').replace(/\n/g, '<br/>') }}
                     />
                   </div>

                   {/* Footer Artifact Verification */}
                   <div className="mt-16 pt-12 border-t border-slate-100/60 flex flex-col md:flex-row justify-between items-center gap-8">
                     <div className="flex items-center gap-4">
                       <GlobeAltIcon className="h-6 w-6 text-yellow-500/50" />
                       <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em]">Broadcast_Source: Vanguard_Core</span>
                     </div>
                     <Link href="/news" className="px-10 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-yellow-500 hover:text-slate-950 transition-all group overflow-hidden relative">
                        <span className="relative z-10">End_Intel_Registry</span>
                        <div className="absolute inset-0 bg-yellow-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                     </Link>
                   </div>
                </motion.div>

                {/* Match Supplement */}
                {article.matchDetails && (
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 bg-yellow-500/[0.02] border-yellow-500/10 relative overflow-hidden"
                   >
                      <div className="absolute top-0 left-0 px-6 py-1.5 bg-yellow-500 text-[9px] font-black text-slate-950 uppercase tracking-widest skew-x-[-15deg]">
                         TACTICAL_ADVISORY
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-12 pt-8">
                        <div>
                          <h4 className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.4em] mb-4">Location_Telemetry</h4>
                          <p className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{article.matchDetails.venue}</p>
                        </div>
                        <div>
                          <h4 className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.4em] mb-4">Sync_Timeline</h4>
                          <p className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{article.matchDetails.date} // {article.matchDetails.time}</p>
                        </div>
                        <div className="md:col-span-2 pt-6 border-t border-yellow-500/5">
                          <h4 className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.4em] mb-4">Analysis_Summary</h4>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed italic">
                            {article.matchDetails.summary || "Tactical debriefing process finalized. Structural integrity optimized for sector traversal."}
                          </p>
                        </div>
                      </div>
                   </motion.div>
                )}
             </div>

             {/* Sidebar: Strategic Linkage */}
             <div className="lg:col-span-4 space-y-10">
                <section className="glass-card p-10 bg-white shadow-xl shadow-slate-200/40 border-slate-200/60 sticky top-32">
                   <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                     <ChartBarIcon className="h-5 w-5 text-yellow-500" />
                     <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Sector_Related</h3>
                   </div>

                   <div className="space-y-10">
                      {related.map((r, i) => (
                         <motion.div 
                          key={r.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                         >
                            <Link href={`/news/${r.id}`} className="group block">
                               <div className="flex gap-6">
                                  <div className="w-20 h-20 rounded-xl overflow-hidden glass-card border-slate-200 shrink-0 bg-slate-50">
                                     <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                  </div>
                                  <div className="space-y-2">
                                     <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{r.category}</span>
                                     <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors duration-300">
                                        {r.title}
                                     </h4>
                                  </div>
                               </div>
                            </Link>
                         </motion.div>
                      ))}
                   </div>

                   <div className="mt-16 pt-10 border-t border-slate-100">
                      <div className="flex items-center gap-4 mb-8">
                        <TagIcon className="h-4 w-4 text-yellow-500" />
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Access_Tags</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         {['INTEL_PRIORITY', 'TACTICAL_SYNC', 'REGISTRY_LOG', 'TECHNO_CORE'].map(tag => (
                            <span key={tag} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all hover:bg-yellow-500 hover:text-slate-950 hover:border-yellow-500 cursor-default">
                               #{tag}
                            </span>
                         ))}
                      </div>
                   </div>

                   <div className="mt-12 p-6 rounded-xl bg-slate-950 text-white flex flex-col gap-4 text-center group active:scale-95 transition-transform cursor-pointer">
                      <ShareIcon className="h-6 w-6 text-yellow-500 mx-auto" />
                      <span className="text-[9px] font-black uppercase tracking-[0.5em] group-hover:text-yellow-400 transition-colors">Broadcast_Intel</span>
                   </div>
                </section>
             </div>
          </div>
       </div>

       <style jsx global>{`
        .hud-border-thick {
          border: 2px solid rgba(226, 232, 240, 1);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
        }
       `}</style>
    </div>
  );
}