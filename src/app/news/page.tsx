'use client'

import { useState, useEffect } from 'react'
import { CalendarIcon, UserIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
  category: string;
}

export default function NewsPage() {
   const [articles, setArticles] = useState<NewsArticle[]>([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState<string | null>(null)
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
    const fetchNews = async () => {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setArticles(data)
      } catch (err) {
        setError('Failed to load news articles')
        console.error('Error fetching news:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-6 animate-pulse">
          <div className="w-16 h-16 border-t-2 border-l-2 border-yellow-500 hud-border rounded-full animate-spin"></div>
          <p className="text-yellow-500 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="glass-card hud-border p-10 max-w-lg text-center">
          <h3 className="text-yellow-500 font-black uppercase tracking-tighter text-2xl mb-4">Transmission Error</h3>
          <p className="text-slate-400 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Retry Sync</button>
        </div>
      </div>
    )
  }

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
          
          {/* Ghost Typography - More centered and massive */}
          <div className="absolute top-40 left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02] whitespace-nowrap z-0">
             <span className="text-[35vw] font-black ghost-text leading-none uppercase italic tracking-tighter">MEDIA</span>
          </div>
       </div>

       <div className="max-w-[1600px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Centered Header */}
          <div className="flex flex-col items-center justify-center mb-40 text-center animate-slide-up">
              <div className="flex items-center gap-8 mb-12">
                 <div className="h-px w-24 bg-gradient-to-r from-transparent to-yellow-500" />
                 <span className="text-[10px] text-yellow-600 font-black uppercase tracking-[0.8em]">Vanguard_Broadcast</span>
                 <div className="h-px w-24 bg-gradient-to-l from-transparent to-yellow-500" />
              </div>
              
              <div className="relative group/header">
                 <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-px h-12 bg-yellow-500/30" />
                 <h1 className="text-7xl md:text-[10rem] font-black text-slate-900 uppercase tracking-tighter leading-[0.8] italic group-hover:scale-[1.02] transition-transform duration-700">
                    News <br />
                    <span className="text-8xl md:text-[14rem] not-italic text-slate-200 tracking-[-0.05em] group-hover:text-slate-900 transition-colors">Hub</span>
                 </h1>
                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-px h-12 bg-yellow-500/30" />
              </div>

              <p className="mt-24 text-[11px] text-slate-400 font-black uppercase tracking-[0.5em] max-w-xl italic leading-loose opacity-60">
                 Official telemetry // Strategic intelligence // Operational updates
              </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, idx) => (
              <Link key={article.id} href={`/news/${article.id}`} passHref>
                <article className="glass-card hud-border overflow-hidden group hover:bg-white transition-all duration-700 flex flex-col h-full bg-white/70 relative shadow-[0_20px_60px_rgba(0,0,0,0.03)] border-slate-200 hover:border-yellow-500/30 hover:-translate-y-2">
                  {/* HUD Corner Decor */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-200 group-hover:border-yellow-500/40 transition-colors z-30" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-200 group-hover:border-yellow-500/40 transition-colors z-30" />
                  
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="object-cover w-full h-full transform transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="px-4 py-1.5 bg-yellow-500 h-8 flex items-center justify-center text-slate-950 text-[9px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-lg">
                        <span className="block skew-x-[15deg]">{article.category}</span>
                      </span>
                    </div>
                    {/* Scanning Line overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/10 to-transparent h-1/3 w-full animate-scan opacity-0 group-hover:opacity-100 pointer-events-none" />
                  </div>
  
                  <div className="p-10 flex flex-col flex-1 relative z-20">
                    <div className="flex items-center gap-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">
                      <span className="flex items-center gap-3">
                        <CalendarIcon className="h-4 w-4 text-yellow-600/40" />
                        {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-3">
                        <UserIcon className="h-4 w-4 text-yellow-600/40" />
                        AUTH:{article.author.split(' ')[0].toUpperCase()}
                      </span>
                    </div>
  
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6 group-hover:text-yellow-600 transition-colors duration-500 line-clamp-2 leading-[0.9] italic">
                      {article.title}
                    </h2>
                    
                    <p className="text-[13px] text-slate-400 font-mono leading-relaxed mb-10 flex-1 line-clamp-3 uppercase tracking-wider font-bold italic group-hover:text-slate-600 transition-colors">
                      {article.content}
                    </p>
  
                    <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic group-hover:text-yellow-600 transition-colors">AUTHORIZE_INTEL</span>
                      <div className="w-12 h-[2px] bg-slate-100 relative overflow-hidden">
                         <div className="absolute inset-0 bg-yellow-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                      </div>
                    </div>
                  </div>

                  {/* Neural Link Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-yellow-500 group-hover:w-full transition-all duration-1000" />
                </article>
              </Link>
            ))}
          </div>
      </div>
    </div>
  )
}