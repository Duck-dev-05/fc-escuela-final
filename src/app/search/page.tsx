"use client";
export const dynamic = "force-dynamic";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { 
  FaSearch, FaChevronRight, FaTerminal, FaFileAlt, 
  FaNewspaper, FaUsers, FaTrophy, FaBroadcastTower 
} from 'react-icons/fa';

const pages = [
  { name: "About Us", href: "/about", description: "Learn more about FC ESCUELA, our mission, and our story." },
  { name: "Matches", href: "/matches", description: "View upcoming and past matches, scores, and match details." },
  { name: "Tickets", href: "/tickets", description: "Purchase tickets for upcoming matches and events." },
  { name: "News", href: "/news", description: "Read the latest news and updates about FC ESCUELA." },
  { name: "Team", href: "/team", description: "Meet our players, coaches, and staff." },
  { name: "Gallery", href: "/gallery", description: "Browse photos and videos from matches and events." },
  { name: "Profile", href: "/profile", description: "View and edit your personal profile and account information." },
  { name: "Orders", href: "/orders", description: "Check your ticket and merchandise orders." },
  { name: "Settings", href: "/settings", description: "Manage your account settings and preferences." },
  { name: "Support", href: "/support", description: "Get help and support for any issues or questions." },
  { name: "Sign In", href: "/login", description: "Access your account by signing in." },
  { name: "Register", href: "/auth/register", description: "Create a new account to join FC ESCUELA." },
  { name: "Forgot Password", href: "/auth/forgot-password", description: "Reset your password if you've forgotten it." },
  { name: "Reset Password", href: "/auth/reset-password", description: "Set a new password for your account." },
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";
  const [newsResults, setNewsResults] = useState<any[]>([]);
  const [teamResults, setTeamResults] = useState<any[]>([]);
  const [matchResults, setMatchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const pageResults = query
    ? pages.filter(
        (page) =>
          page.name.toLowerCase().includes(query) ||
          page.href.toLowerCase().includes(query)
      )
    : [];

  useEffect(() => {
    if (!query) {
      setNewsResults([]);
      setTeamResults([]);
      setMatchResults([]);
      return;
    }
    setLoading(true);
    fetch(`/api/search?query=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setNewsResults(data.news || []);
        setTeamResults(data.team || []);
        setMatchResults(data.matches || []);
      })
      .finally(() => setLoading(false));
  }, [query]);

  const hasResults =
    pageResults.length > 0 ||
    newsResults.length > 0 ||
    teamResults.length > 0 ||
    matchResults.length > 0;

  return (
    <div className="min-h-screen bg-transparent py-20 px-4 relative overflow-hidden animate-scan">
      {/* Ghost Typography */}
      <div className="absolute top-10 left-10 select-none pointer-events-none opacity-5">
        <span className="text-[15vw] ghost-text leading-none uppercase">RESEARCH</span>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 animate-slide-up">
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                 <FaSearch className="text-yellow-500 text-2xl" />
              </div>
              <div>
                 <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Research <span className="text-yellow-500">Terminal</span></h1>
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Cross-Registry Query Analysis</p>
              </div>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="glass-card border-white/5 px-4 py-2 flex items-center gap-3">
                 <FaTerminal className="text-yellow-500 text-[10px]" />
                 <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest pt-0.5 whitespace-nowrap">Query: "{query || '*'}"</span>
              </div>
           </div>
        </div>

        {loading ? (
            <div className="flex flex-col items-center gap-6 py-20 animate-pulse">
               <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
               <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px]">Scanning Databases...</p>
            </div>
        ) : !hasResults ? (
            <div className="glass-card hud-border p-20 text-center animate-slide-up">
               <FaBroadcastTower className="mx-auto h-16 w-16 text-slate-800 mb-6" />
               <h3 className="text-xl font-black text-white uppercase tracking-tighter">No Correlation Found</h3>
               <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Zero registry matches for the current query string.</p>
            </div>
        ) : (
            <div className="space-y-12 animate-slide-up">
               
               {/* Page Results HUD */}
               {pageResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       <h2 className="text-[10px] font-black text-white uppercase tracking-[0.35em]">Navigation Nodes</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {pageResults.map((item, idx) => (
                          <Link key={idx} href={item.href} className="glass-card hud-border p-5 hover:bg-white/[0.03] transition-all group flex items-start gap-4">
                             <div className="w-10 h-10 glass-card border-white/5 flex items-center justify-center shrink-0">
                                <FaFileAlt className="text-slate-600 group-hover:text-yellow-500 transition-colors" />
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-yellow-500 transition-colors">{item.name}</h3>
                                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed mt-1">{item.description}</p>
                             </div>
                          </Link>
                       ))}
                    </div>
                  </section>
               )}

               {/* News Results HUD */}
               {newsResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       <h2 className="text-[10px] font-black text-white uppercase tracking-[0.35em]">Broadcast Records</h2>
                    </div>
                    <div className="space-y-4">
                       {newsResults.map((item) => (
                          <Link key={item.id} href={`/news/${item.id}`} className="glass-card hud-border p-6 hover:bg-white/[0.03] transition-all group flex items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 glass-card border-white/5 flex items-center justify-center shrink-0">
                                   <FaNewspaper className="text-yellow-500/50" />
                                </div>
                                <div className="overflow-hidden">
                                   <h3 className="text-base font-black text-white uppercase tracking-tight truncate group-hover:text-yellow-500 transition-colors">{item.title}</h3>
                                   <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">BY: {item.author} // CAT: {item.category}</p>
                                </div>
                             </div>
                             <FaChevronRight className="text-slate-700 group-hover:text-yellow-500 transition-colors shrink-0" />
                          </Link>
                       ))}
                    </div>
                  </section>
               )}

               {/* Team Results HUD */}
               {teamResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       <h2 className="text-[10px] font-black text-white uppercase tracking-[0.35em]">Personnel Registry</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {teamResults.map((item) => (
                          <Link key={item.id} href={`/team#${item.name.toLowerCase().replace(/ /g, '-')}`} className="glass-card hud-border p-5 hover:bg-white/[0.03] transition-all group flex items-center gap-5">
                             <div className="w-12 h-12 rounded-full border-2 border-white/5 overflow-hidden shrink-0 group-hover:border-yellow-500/50 transition-all">
                                {item.image ? (
                                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                   <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                      <FaUsers className="text-slate-700" />
                                   </div>
                                )}
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest group-hover:text-yellow-500 transition-colors">{item.name}</h3>
                                <p className="text-[9px] text-yellow-500/50 font-black uppercase tracking-widest">{item.role}</p>
                             </div>
                          </Link>
                       ))}
                    </div>
                  </section>
               )}

               {/* Match Results HUD */}
               {matchResults.length > 0 && (
                  <section>
                    <div className="flex items-center gap-3 mb-6">
                       <div className="w-2 h-2 rounded bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       <h2 className="text-[10px] font-black text-white uppercase tracking-[0.35em]">Deployment Logs</h2>
                    </div>
                    <div className="space-y-4">
                       {matchResults.map((item) => (
                          <Link key={item.id} href={`/matches/${item.id}`} className="glass-card hud-border p-6 hover:bg-white/[0.03] transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                             <div className="flex items-center gap-6">
                                <div className="w-12 h-12 glass-card border-white/5 flex items-center justify-center shrink-0">
                                   <FaTrophy className="text-slate-600 group-hover:text-yellow-500 transition-colors" />
                                </div>
                                <div>
                                   <h3 className="text-base font-black text-white uppercase tracking-tight group-hover:text-yellow-500 transition-colors">{item.homeTeam} VS {item.awayTeam}</h3>
                                   <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{item.date?.slice(0, 10)}</span>
                                      <span className="text-[9px] text-yellow-500 font-black uppercase tracking-widest border border-yellow-500/10 px-1.5 rounded">{item.competition}</span>
                                   </div>
                                </div>
                             </div>
                             <div className="text-[9px] text-slate-600 font-mono hidden md:block">LOG_REF: {item.id}</div>
                          </Link>
                       ))}
                    </div>
                  </section>
               )}

            </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
           <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}