import React from 'react';
import {
   FaGraduationCap, FaEye, FaHeart, FaUsers,
   FaEnvelope, FaPhone, FaMapMarkerAlt, FaHistory
} from 'react-icons/fa';

export default function AboutPage() {
   return (
      <div className="min-h-screen bg-transparent py-20 px-4 relative overflow-hidden animate-scan">
         {/* Ghost Typography Background */}
         <div className="absolute top-10 left-10 select-none pointer-events-none opacity-5">
            <span className="text-[15vw] ghost-text leading-none uppercase">LEGACY</span>
         </div>

         <div className="container-custom relative z-10">
            {/* Hero Section HUD */}
            <div className="glass-card hud-border p-12 md:p-20 mb-16 relative overflow-hidden animate-slide-up">
               <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[9px] text-slate-700 font-mono">
                  EST_2015_PROTOCOL
               </div>
               <div className="flex flex-col items-center text-center">
                  <div className="relative mb-8 group">
                     <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                     <img src="/Logo.jpg" alt="FC Escuela Logo" className="h-40 w-40 rounded-full shadow-2xl border-4 border-white/10 relative z-10 object-cover" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">FC <span className="text-yellow-500">Escuela</span></h1>
                  <p className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.4em] mb-8">Unified Passion // Pursuit of Excellence</p>
                  <p className="max-w-2xl text-slate-400 text-sm font-bold uppercase tracking-widest leading-relaxed">
                     FC Escuela is more than just a football club—it's a community united by passion, teamwork, and the pursuit of elite technical performance.
                  </p>
               </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 animate-slide-up" style={{ animationDelay: '0.1s' }}>
               {[
                  {
                     title: 'Core Mission',
                     icon: FaGraduationCap,
                     desc: 'To foster a love for football, promote healthy living, and develop future leaders through sport, education, and community engagement.'
                  },
                  {
                     title: 'Global Vision',
                     icon: FaEye,
                     desc: 'To be recognized as a leading football club that nurtures talent, values diversity, and makes a positive impact in our community and beyond.'
                  },
                  {
                     title: 'Elite Values',
                     icon: FaHeart,
                     list: ['Respect', 'Teamwork', 'Integrity', 'Passion', 'Excellence', 'Community']
                  }
               ].map((item, i) => (
                  <div key={i} className="glass-card hud-border p-10 hover:bg-white/[0.03] transition-all group">
                     <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 mb-8 group-hover:scale-110 transition-transform">
                        <item.icon className="text-yellow-500 text-2xl" />
                     </div>
                     <h3 className="text-xl font-black text-white uppercase tracking-widest mb-4">{item.title}</h3>
                     {item.desc ? (
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
                     ) : (
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                           {item.list?.map(val => (
                              <div key={val} className="flex items-center gap-2">
                                 <div className="w-1 h-1 bg-yellow-500 rounded-full" />
                                 <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{val}</span>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               ))}
            </div>

            {/* Contact HUD Terminal */}
            <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                  <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Communication Nodes</h2>
               </div>

               <div className="glass-card hud-border p-12 bg-white/[0.02] flex flex-col md:flex-row gap-12 text-center md:text-left">
                  {[
                     { label: 'Transmission Unit', value: 'khunhatruongcoma7@gmail.com', icon: FaEnvelope, link: 'mailto:khunhatruongcoma7@gmail.com' },
                     { label: 'Signal Channel', value: '+84 086-581-7605', icon: FaPhone, link: 'tel:+840865817605' },
                     { label: 'Geo-Coordinates', value: 'UBND Xã Liên Ninh, Hanoi, VN', icon: FaMapMarkerAlt },
                  ].map((node, i) => (
                     <div key={i} className="flex-1 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 mx-auto md:mx-0">
                           <node.icon className="text-slate-500 text-lg" />
                        </div>
                        <div>
                           <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1">{node.label}</p>
                           {node.link ? (
                              <a href={node.link} className="text-xs text-white font-bold hover:text-yellow-500 transition-colors uppercase tracking-widest">{node.value}</a>
                           ) : (
                              <p className="text-xs text-white font-bold uppercase tracking-widest">{node.value}</p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </section>

            {/* History Accent */}
            <div className="mt-20 flex justify-center opacity-20">
               <FaHistory className="text-slate-800 text-6xl animate-spin-slow" />
            </div>
         </div>
      </div>
   );
}