"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
   FaEnvelope, FaPhone, FaComments, FaCheckCircle,
   FaShieldAlt, FaTerminal, FaQuestionCircle, FaPaperPlane
} from 'react-icons/fa';

export default function SupportPage() {
   const { data: session } = useSession();
   const [form, setForm] = useState({ name: '', email: '', message: '' });
   const [submitting, setSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);
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
      if (session?.user) {
         setForm(prev => ({
            ...prev,
            name: session.user?.name || prev.name,
            email: session.user?.email || prev.email
         }));
      }
   }, [session]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      // Simulation of transmission delay
      setTimeout(() => {
         setSubmitting(false);
         setSuccess(true);
         setForm(prev => ({ ...prev, message: '' }));
      }, 1500);
   };

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
             <span className="text-[20vw] font-black ghost-text leading-none uppercase italic tracking-tighter">TACTICAL_SUPPORT</span>
          </div>
       </div>

       <div className="max-w-[1400px] mx-auto relative z-20 pt-20">
          {/* Maximum Impact Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between mb-28 gap-16 animate-slide-up">
              <div className="flex flex-col gap-10">
                 <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.6em]">
                       <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                       Liaison_Access: Secure_05
                    </div>
                    <div className="w-px h-3 bg-white/10" />
                    <span className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">REGISTRY: {session?.user?.id?.substring(0,8).toUpperCase() || 'UNA-000'}</span>
                 </div>
                 
                 <div className="relative group/header">
                    <div className="absolute -top-6 -left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-500/20 group-hover/header:border-yellow-500 transition-colors" />
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-[0.85] italic group-hover:scale-[1.02] transition-transform duration-700">
                       Tactical <br />
                       <span className="text-7xl md:text-9xl not-italic text-slate-800 tracking-[-0.05em] group-hover:text-white transition-colors">Support</span>
                    </h1>
                 </div>
              </div>

              <div className="flex flex-col items-end gap-10 w-full lg:w-auto">
                 <div className="flex items-center gap-12 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase border-b border-white/5 pb-4 w-full justify-end">
                    <span>UNIT_LIAISON</span>
                    <span>//</span>
                    <span className="text-yellow-500/50 flex items-center gap-3 font-mono">
                       {new Date().toISOString().split('T')[0]} // {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                 </div>
                 <div className="px-6 py-2 bg-yellow-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-sm skew-x-[-15deg] shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                    <span className="block skew-x-[15deg]">RESOLUTION_STATUS: NOMINAL</span>
                 </div>
              </div>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>

               {/* Sidebar Info */}
               <div className="lg:col-span-4 space-y-6">
                  <div className="glass-card hud-border p-8 bg-white/[0.02]">
                     <h3 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.4em] mb-8">Access Points</h3>
                     <div className="space-y-6">
                        {[
                           { label: 'Transmission', value: 'khunhatruongcoma7@gmail.com', icon: FaEnvelope },
                           { label: 'Signal Link', value: '+84 086-581-7605', icon: FaPhone },
                           { label: 'Live Protocol', value: 'Mon-Fri 08:30 - 17:30', icon: FaComments },
                        ].map((node, i) => (
                           <div key={i} className="flex gap-4">
                              <div className="w-10 h-10 rounded-lg glass-card border-white/5 flex items-center justify-center shrink-0">
                                 <node.icon className="text-slate-500 text-sm" />
                              </div>
                              <div className="overflow-hidden">
                                 <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1.5">{node.label}</p>
                                 <p className="text-[10px] text-white font-bold uppercase tracking-widest truncate">{node.value}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="glass-card hud-border p-6 bg-yellow-500/5">
                     <div className="flex items-center gap-3 mb-4">
                        <FaQuestionCircle className="text-yellow-500 text-xs" />
                        <span className="text-[9px] text-white font-black uppercase tracking-widest">Self-Service Terminal</span>
                     </div>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mb-6">
                        Consult the Knowledge Base for rapid resolution protocols.
                     </p>
                     <button className="w-full py-3 glass-card border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-950 transition-all">
                        Access Wiki
                     </button>
                  </div>
               </div>

               {/* Support Form HUD */}
               <div className="lg:col-span-8">
                  <div className="glass-card hud-border p-10 bg-white/[0.02] relative overflow-hidden">
                     <div className="absolute top-0 right-0 p-4 border-l border-b border-white/5 text-[9px] text-slate-700 font-mono">
                        MSG_INTAKE_v1.0
                     </div>

                     <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                        <FaTerminal className="text-yellow-500 text-xs" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Submission Interface</h3>
                     </div>

                     <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="relative group">
                              <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1 block">Entity Name</label>
                              <input
                                 type="text" name="name" value={form.name} onChange={handleChange} required
                                 className="input-field w-full" placeholder="Operator Name..."
                              />
                           </div>
                           <div className="relative group">
                              <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1 block">Registry Email</label>
                              <input
                                 type="email" name="email" value={form.email} onChange={handleChange} required
                                 className="input-field w-full" placeholder="you@network.com"
                              />
                           </div>
                        </div>

                        <div className="relative group">
                           <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-1.5 px-1 block">Operational Log / Request</label>
                           <textarea
                              name="message" value={form.message} onChange={handleChange} required rows={6}
                              className="input-field w-full" placeholder="Detailed support brief..."
                           />
                        </div>

                        <div className="pt-6">
                           <button
                              type="submit"
                              disabled={submitting}
                              className="btn-primary w-full h-14 text-[10px] flex items-center justify-center gap-4"
                           >
                              {submitting ? (
                                 <>
                                    <div className="w-4 h-4 border-t-2 border-slate-950 rounded-full animate-spin" />
                                    Transmitting Signal...
                                 </>
                              ) : (
                                 <>
                                    <FaPaperPlane />
                                    Transmit Protocol
                                 </>
                              )}
                           </button>

                           {success && (
                              <div className="mt-8 p-4 glass-card border-green-500/50 bg-green-500/10 flex items-center justify-center gap-3 animate-slide-up">
                                 <FaCheckCircle className="text-green-500" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-white">Transmission Successful. Sequence Resolved.</span>
                              </div>
                           )}
                        </div>
                     </form>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}