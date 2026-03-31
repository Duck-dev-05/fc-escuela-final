"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
   FaEnvelope, FaPhone, FaComments, FaCheckCircle,
   FaShieldAlt, FaQuestionCircle, FaPaperPlane
} from 'react-icons/fa';
import { motion } from "framer-motion";

export default function SupportPage() {
   const { data: session } = useSession();
   const [form, setForm] = useState({ name: '', email: '', message: '' });
   const [submitting, setSubmitting] = useState(false);
   const [success, setSuccess] = useState(false);

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
         setTimeout(() => setSuccess(false), 5000);
      }, 1500);
   };

   return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24 relative selection:bg-slate-200 selection:text-slate-900">
       <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          {/* Minimalist Editorial Header */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 border-b border-slate-200 pb-12 mb-12"
          >
             <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Help <span className="text-slate-400 font-light">Center</span>
             </h1>
             <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                <span>We're here to help with your tickets, memberships, and account inquiries.</span>
             </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
             {/* Sidebar Info */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="lg:col-span-4 space-y-6"
             >
                <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                   <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                      <FaShieldAlt className="text-slate-400" /> Support Channels
                   </h3>
                   <div className="space-y-6">
                      {[
                         { label: 'Email Support', value: 'support@fcescuela.com', icon: FaEnvelope },
                         { label: 'Phone Desk', value: '+1 (800) 555-0199', icon: FaPhone },
                         { label: 'Business Hours', value: 'Mon-Fri 08:30 - 17:30', icon: FaComments },
                      ].map((node, i) => (
                         <div key={i} className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                               <node.icon className="text-slate-400 text-sm" />
                            </div>
                            <div className="overflow-hidden pt-1">
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1.5">{node.label}</p>
                               <p className="text-sm text-slate-900 font-bold truncate">{node.value}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl">
                   <div className="flex items-center gap-3 mb-4">
                      <FaQuestionCircle className="text-amber-500 text-lg" />
                      <span className="text-sm font-black text-amber-900 uppercase tracking-tight">Knowledge Base</span>
                   </div>
                   <p className="text-xs text-amber-800/80 font-medium leading-relaxed mb-6">
                      Browse our frequently asked questions for quick answers to common ticketing and account issues.
                   </p>
                   <button className="w-full py-3 bg-white border border-amber-200 text-amber-700 text-xs font-bold rounded-xl shadow-sm hover:bg-amber-100 transition-colors">
                      Browse FAQs
                   </button>
                </div>
             </motion.div>

             {/* Support Form */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="lg:col-span-8"
             >
                <div className="bg-white border border-slate-200 p-8 md:p-12 rounded-[2rem] shadow-sm relative overflow-hidden">
                   <div className="flex items-center gap-3 mb-10 pb-6 border-b border-slate-100">
                      <FaPaperPlane className="text-slate-400 text-lg" />
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Send a Message</h3>
                   </div>

                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 block">Full Name</label>
                            <input
                               type="text" name="name" value={form.name} onChange={handleChange} required
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm hover:border-slate-300" 
                               placeholder="Enter your name"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 block">Email Address</label>
                            <input
                               type="email" name="email" value={form.email} onChange={handleChange} required
                               className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm hover:border-slate-300" 
                               placeholder="you@example.com"
                            />
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1 block">How can we help?</label>
                         <textarea
                            name="message" value={form.message} onChange={handleChange} required rows={6}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all shadow-sm hover:border-slate-300 resize-none" 
                            placeholder="Describe your issue or inquiry in detail..."
                         />
                      </div>

                      <div className="pt-4">
                         <button
                            type="submit"
                            disabled={submitting}
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-3 shadow-md"
                         >
                            {submitting ? (
                               <>
                                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                  Sending Message...
                               </>
                            ) : (
                               <>
                                  <FaPaperPlane />
                                  Send Message
                               </>
                            )}
                         </button>

                         {success && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center gap-3"
                            >
                               <FaCheckCircle className="text-emerald-500 text-lg" />
                               <span className="text-sm font-bold text-emerald-800">Your message has been sent successfully. We'll be in touch soon!</span>
                            </motion.div>
                         )}
                      </div>
                   </form>
                </div>
             </motion.div>
          </div>
       </div>
    </div>
   );
}