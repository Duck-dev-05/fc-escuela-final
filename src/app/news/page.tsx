'use client'

import { useState, useEffect, useMemo } from 'react'
import { CalendarIcon, UserIcon, ArrowRightIcon, ChevronRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

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
   const [selectedCategory, setSelectedCategory] = useState('ALL')
   const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
   const { scrollYProgress } = useScroll();
   const y = useTransform(scrollYProgress, [0, 1], [0, -400]);

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

  const categories = useMemo(() => {
    const cats = ['ALL', ...new Set(articles.map(a => a.category))]
    return cats
  }, [articles])

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'ALL') return articles
    return articles.filter(a => a.category === selectedCategory)
  }, [articles, selectedCategory])

  const featuredArticle = useMemo(() => articles[0], [articles])
  const remainingArticles = useMemo(() => 
    filteredArticles.filter(a => a.id !== (selectedCategory === 'ALL' ? featuredArticle?.id : null)), 
  [filteredArticles, featuredArticle, selectedCategory])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-t-2 border-l-2 border-yellow-500 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-4 border-b-2 border-r-2 border-slate-200 rounded-full animate-reverse-spin opacity-50"></div>
          </div>
          <p className="text-slate-900 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Loading News Hub...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 relative overflow-hidden bg-slate-50 selection:bg-yellow-500 selection:text-slate-950">
       {/* Background Elements */}
       <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div 
             className="absolute w-[1000px] h-[1000px] rounded-full bg-yellow-500/[0.03] blur-[150px] z-0"
             animate={{ 
                left: `${mousePos.x}%`, 
                top: `${mousePos.y}%`, 
             }}
             transition={{ type: 'spring', damping: 30, stiffness: 50, restDelta: 0.001 }}
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-10" />
          <div className="absolute inset-x-0 top-0 h-screen bg-gradient-to-b from-yellow-500/[0.02] via-transparent to-transparent z-10" />
       </div>

       <div className="max-w-[1900px] mx-auto relative z-20 pt-20">
          {/* Unified Cinematic Hero */}
          {featuredArticle && selectedCategory === 'ALL' ? (
            <section className="relative mb-32 group/hero">
               {/* Background Ghost Parallax */}
               <motion.div 
                 className="absolute -top-20 -left-20 text-[25vw] font-black text-slate-900/[0.03] select-none pointer-events-none z-0 italic tracking-tighter hidden xl:block"
                 style={{ y }}
               >
                 NEWS
               </motion.div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
                 {/* Left: Authoritative Headline */}
                 <div className="lg:col-span-12 xl:col-span-7 relative z-20">
                    <motion.div 
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-6 mb-12"
                    >
                       <div className="h-[2px] w-16 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]" />
                       <span className="text-[12px] text-slate-950 font-black uppercase tracking-[0.8em]">EDITORIAL HUB</span>
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                      className="text-[11vw] lg:text-[14rem] font-black text-slate-950 uppercase tracking-[-0.05em] leading-[0.75] italic group-hover/hero:translate-x-4 transition-transform duration-1000 select-none drop-shadow-2xl"
                    >
                       Latest <br />
                       <span className="not-italic text-slate-900/10 block mt-4" style={{ WebkitTextStroke: '2px #0f172a' }}>News</span>
                    </motion.h1>
                 </div>

                 {/* Right: Immersive Featured Visual & Info */}
                 <div className="lg:col-span-12 xl:col-span-5 relative z-10 pt-10">
                    <Link href={`/news/${featuredArticle.id}`} className="group/card block">
                       <motion.div 
                         initial={{ opacity: 0, y: 40 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.4 }}
                         className="relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-slate-950 shadow-[0_50px_100px_rgba(0,0,0,0.15)] ring-1 ring-slate-200/50"
                       >
                          <img 
                             src={featuredArticle.imageUrl} 
                             alt={featuredArticle.title} 
                             className="object-cover w-full h-full transform transition-transform duration-[3s] group-hover/card:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-90" />
                          
                          {/* Floating Metadata Window */}
                          <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                             <div className="glass-card bg-white/10 backdrop-blur-3xl border border-white/20 p-8 rounded-3xl space-y-6 transform transition-all duration-700 group-hover/card:-translate-y-4 shadow-2xl">
                                <div className="flex items-center justify-between">
                                   <span className="px-4 py-1.5 bg-yellow-500 text-slate-950 text-[9px] font-black uppercase tracking-widest skew-x-[-12deg]">
                                      <span className="block skew-x-[12deg]">FEATURED STORY</span>
                                   </span>
                                   <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.3em]">{featuredArticle.category}</span>
                                </div>
                                
                                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight leading-tight italic group-hover/card:text-yellow-400 transition-colors">
                                   {featuredArticle.title}
                                </h2>
                                
                                <div className="flex items-center gap-4 text-yellow-500 font-black text-[10px] uppercase tracking-[0.5em] pt-4">
                                   READ FULL STORY <ArrowRightIcon className="h-4 w-4" />
                                </div>
                             </div>
                          </div>
                       </motion.div>
                    </Link>
                 </div>
               </div>
            </section>
          ) : (
             <div className="pt-20 text-center mb-40">
                <h1 className="text-8xl md:text-[12rem] font-black text-slate-950 uppercase tracking-tighter leading-[0.8] italic opacity-10">
                   Latest <br /> News
                </h1>
             </div>
          )}

          {/* Command Bar / Filters */}
          <div className="sticky top-24 z-[60] mb-20 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12 py-4 bg-slate-50/90 backdrop-blur-xl border-y border-slate-200/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="max-w-[1900px] mx-auto relative group">
              <div className="absolute left-0 inset-y-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 inset-y-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 relative whitespace-nowrap shrink-0 group/tab ${
                      selectedCategory === cat 
                        ? 'text-white' 
                        : 'text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200'
                    }`}
                  >
                    <span className="relative z-10">{cat.replace('_', ' ')}</span>
                    {selectedCategory === cat && (
                      <motion.div 
                        layoutId="active-nav-cat"
                        className="absolute inset-0 bg-slate-950 rounded-xl shadow-xl shadow-slate-900/20"
                        initial={false}
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <motion.div 
            layout
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
          >
            <AnimatePresence mode="popLayout">
              {remainingArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/news/${article.id}`} passHref>
                    <article className="glass-card shadow-sm border border-slate-100 overflow-hidden group bg-white hover:bg-white transition-all duration-700 flex flex-col h-full relative hover:border-yellow-500/30 hover:-translate-y-3">

                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="object-cover w-full h-full transform transition-transform duration-[1.5s] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition-colors duration-700" />
                        
                        <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end bg-gradient-to-t from-slate-950/60 to-transparent">
                          <span className="bg-yellow-500 text-slate-950 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-sm">
                            {article.category}
                          </span>
                        </div>
                      </div>
      
                      <div className="p-8 flex flex-col flex-1 relative z-20">
                        <div className="flex items-center gap-4 text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                           <span className="flex items-center gap-2">
                             <CalendarIcon className="h-3 w-3 text-yellow-500" />
                             {new Date(article.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                           </span>
                           <span className="flex items-center gap-2">
                             <UserIcon className="h-3 w-3 text-slate-950" />
                             By {article.author}
                           </span>
                        </div>
      
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-4 group-hover:text-yellow-600 transition-colors duration-500 line-clamp-2 leading-[0.95] italic">
                          {article.title}
                        </h2>
                        
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-8 flex-1 line-clamp-3 uppercase tracking-wider italic group-hover:text-slate-800 transition-colors duration-500">
                          {article.content}
                        </p>
      
                          <div className="flex items-center justify-between pt-6 border-t border-slate-100/60 mt-auto">
                           <div className="flex items-center gap-3">
                              <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.3em] group-hover:text-yellow-600 transition-colors">Read More</span>
                           </div>
                           <ChevronRightIcon className="h-4 w-4 text-slate-300 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all" />
                         </div>
                      </div>

                      {/* Accent Corner line */}
                      <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-yellow-500 group-hover:w-full transition-all duration-700" />
                    </article>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {remainingArticles.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-40 text-center"
            >
              <ChartBarIcon className="h-16 w-16 text-slate-200 mx-auto mb-6 animate-pulse" />
              <p className="text-slate-400 font-black uppercase tracking-[0.5em] text-xs">No articles found in this category</p>
              <button 
                onClick={() => setSelectedCategory('ALL')}
                className="mt-8 text-yellow-600 font-black uppercase tracking-widest text-[10px] hover:text-yellow-700 underline"
              >
                View All News
              </button>
            </motion.div>
          )}
      </div>

      <style jsx global>{`
        .hud-border-thick {
          border: 2px solid rgba(226, 232, 240, 0.6);
        }
      `}</style>
    </div>
  )
}