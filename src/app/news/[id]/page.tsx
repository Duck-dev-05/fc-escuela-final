"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  FaCalendarAlt, FaUser, FaTag, FaChevronLeft, 
  FaHistory, FaInfoCircle, FaTrophy, FaMapMarkerAlt, 
  FaClock, FaChartLine 
} from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";

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
        if (!res.ok) throw new Error("Registry access denied.");
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
        setRelated(data.filter(a => a.id !== id).slice(0, 3));
      } catch {}
    };
    fetchRelated();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
           <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px]">Downloading Editorial Intel...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden animate-scan">
        <div className="max-w-md w-full glass-card hud-border p-10 text-center animate-slide-up relative z-10">
          <FaInfoCircle className="mx-auto h-12 w-12 text-yellow-500/50 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Protocol Error</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8">Target unit not found in active registry</p>
          <button
            onClick={() => router.push('/news')}
            className="btn-primary w-full"
          >
            Return to Feed
          </button>
        </div>
      </div>
    );
  }

  const createdDate = new Date(article.createdAt).toLocaleDateString();
  const showUpdated = article.updatedAt && article.updatedAt !== article.createdAt;
  const intro = article.intro || article.content.split('\n')[0];

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 relative overflow-hidden bg-slate-50 selection:bg-yellow-500 selection:text-slate-950">
       {/* Neural_Orb & Cinematic Background */}
       <div className="absolute inset-0 pointer-events-none">
          <div 
             className="absolute w-[800px] h-[800px] rounded-full bg-yellow-500/[0.05] blur-[120px] transition-all duration-1000 ease-out z-0"
             style={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
                transform: 'translate(-50%, -50%)' 
             }} 
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10" />
          <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-yellow-500/[0.04] to-transparent z-10" />
          
          {/* Ghost Typography */}
          <div className="absolute top-40 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap z-0">
             <span className="text-[25vw] font-black ghost-text leading-none uppercase italic tracking-tighter">INTEL</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20">
          {/* Back Link HUD - Centered for consistency */}
          <div className="flex justify-center mb-20 animate-slide-up">
            <Link href="/news" className="inline-flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 hover:text-yellow-600 transition-all group">
               <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white/50 flex items-center justify-center group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 transition-all shadow-sm">
                  <FaChevronLeft className="group-hover:-translate-x-2 transition-transform" />
               </div>
               <span className="group-hover:translate-x-2 transition-transform italic">Return to Registry</span>
            </Link>
          </div>

          {/* Centered Maximum Impact Header */}
          <div className="flex flex-col items-center justify-center mb-28 text-center animate-slide-up">
              <div className="flex items-center gap-6 mb-12">
                 <div className="h-px w-16 bg-yellow-500/30" />
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-lg">
                    <span className="block skew-x-[15deg]">{article.category}</span>
                 </div>
                 <div className="h-px w-16 bg-yellow-500/30" />
              </div>
              
              <div className="relative group/header">
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
                 <h1 className="text-6xl md:text-9xl font-black text-slate-900 uppercase tracking-tighter leading-[0.8] italic group-hover:scale-[1.02] transition-transform duration-700">
                    News <br />
                    <span className="text-7xl md:text-[10rem] not-italic text-slate-200 tracking-[-0.05em] group-hover:text-slate-900 transition-colors">Intel</span>
                 </h1>
                 <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
              </div>

              <div className="mt-20 flex items-center gap-8 text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">
                 <span>REPORT_ID: {article.id.substring(0,8).toUpperCase()}</span>
                 <div className="w-1 h-1 rounded-full bg-yellow-500/30" />
                 <span>SYNC_STATUS: ACTIVE</span>
              </div>
          </div>

        {/* Hero Banner HUD */}
        <div className="relative aspect-[21/9] w-full overflow-hidden glass-card hud-border mb-20 group border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.03)] bg-white/50 animate-slide-up">
           <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 opacity-60" />
           <img
             src={article.imageUrl}
             alt={article.title}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[30s] linear opacity-90 group-hover:opacity-100"
           />
           {/* HUD Ornamentation */}
           <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-yellow-500/20 group-hover:border-yellow-500 transition-colors z-20" />
           <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-yellow-500/20 group-hover:border-yellow-500 transition-colors z-20" />
           
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/[0.02] to-transparent h-1/2 w-full animate-scan pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
           {/* Main Content Hub */}
           <div className="lg:col-span-8 space-y-12 animate-slide-up">
              <div className="space-y-10">
                 <div className="flex flex-wrap items-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] border-l-2 border-yellow-500/30 pl-6">
                    <span className="flex items-center gap-3">
                       <FaCalendarAlt className="text-yellow-600 text-xs" />
                       {createdDate}
                    </span>
                    <span className="flex items-center gap-3">
                       <FaUser className="text-yellow-600 text-xs" />
                       AUTH: {article.author.toUpperCase()}
                    </span>
                 </div>
                 <h1 className="text-5xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85] italic">
                    {article.title}
                 </h1>
                 <p className="text-xl text-yellow-600/70 font-bold uppercase tracking-[0.2em] italic max-w-2xl leading-relaxed">
                    "{intro}"
                 </p>
              </div>

              <div className="glass-card hud-border p-10 md:p-16 relative overflow-hidden bg-white/80 border-slate-200 shadow-[0_30px_70px_rgba(0,0,0,0.02)]">
                 <div className="absolute top-0 right-0 p-8 opacity-5"><FaChartLine className="text-slate-900 text-6xl" /></div>
                 <div className="absolute inset-0 bg-grid-slate-900/[0.01] bg-[size:20px_20px] pointer-events-none" />
                 
                 <div 
                   className="prose prose-slate prose-yellow max-w-none text-slate-500 font-bold uppercase tracking-wider leading-loose text-sm italic"
                   dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
                 />
              </div>

              {/* Match Details Enrichment */}
              {article.matchDetails && (
                 <div className="glass-card hud-border p-10 bg-yellow-500/[0.03] group relative overflow-hidden border-yellow-500/10">
                    <div className="absolute top-0 right-0 p-4 border-l border-b border-yellow-500/20 text-[9px] text-yellow-600/50 font-mono italic uppercase">
                       SUPPLEMENTAL_TELEMETRY
                    </div>
                    <div className="flex flex-col md:flex-row gap-10 items-center">
                       <div className="w-20 h-20 glass-card border-yellow-500/30 flex items-center justify-center bg-white/50 shrink-0 shadow-sm shadow-yellow-500/10">
                          <FaTrophy className="text-yellow-600 text-3xl" />
                       </div>
                       <div className="flex-1 space-y-4">
                          <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest leading-none">{article.matchDetails.competition} Summary</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             <div className="flex items-center gap-3">
                                <FaMapMarkerAlt className="text-yellow-600/50 text-[10px]" />
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{article.matchDetails.venue}</span>
                             </div>
                             <div className="flex items-center gap-3">
                                <FaClock className="text-yellow-600/50 text-[10px]" />
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{article.matchDetails.date} // {article.matchDetails.time}</span>
                             </div>
                          </div>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed pt-2 border-t border-slate-100 italic">
                             {article.matchDetails.summary || 'Overview protocol not initialized.'}
                          </p>
                       </div>
                    </div>
                 </div>
              )}
           </div>

           {/* Sidebar: Related & Metadata */}
           <div className="lg:col-span-4 space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <section className="glass-card hud-border p-8 bg-white/50 border-slate-200 shadow-sm">
                 <h3 className="text-[10px] font-black text-yellow-600 uppercase tracking-[0.4em] mb-8">Related Transmissions</h3>
                 <div className="space-y-6">
                    {related.map(r => (
                       <Link key={r.id} href={`/news/${r.id}`} className="flex gap-4 group">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden glass-card border-slate-200 shrink-0 shadow-sm bg-white/50">
                             <img src={r.imageUrl} alt={r.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
                          </div>
                          <div className="space-y-1 py-1">
                             <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                                {new Date(r.createdAt).toLocaleDateString()}
                             </span>
                             <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight line-clamp-2 leading-tight group-hover:text-yellow-600 transition-colors">
                                {r.title}
                             </h4>
                          </div>
                       </Link>
                    ))}
                 </div>
              </section>

              <section className="glass-card hud-border p-8 bg-white/50 border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-6">
                    <FaTag className="text-yellow-600/50 text-xs" />
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Metadata Tags</h3>
                 </div>
                 <div className="flex flex-wrap gap-2">
                    {['Club Info', 'Tactical', 'First Team', 'Registry'].map(tag => (
                       <span key={tag} className="px-3 py-1.5 bg-slate-100/50 border border-slate-200 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:border-yellow-500/30 hover:text-yellow-600 cursor-default transition-all shadow-sm">
                          {tag}
                       </span>
                    ))}
                 </div>
              </section>

              <div className="p-8 glass-card border-yellow-500/10 bg-yellow-500/[0.03] text-center shadow-sm">
                 <FaInfoCircle className="mx-auto text-yellow-600/30 text-2xl mb-4" />
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-relaxed">
                    Access to high-fidelity media is restricted to authenticated Vanguard members.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}