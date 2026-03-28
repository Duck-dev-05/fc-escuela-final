// Add this at the very top of the file
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaShieldAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#020202] pt-32 pb-16 overflow-hidden border-t border-white/5">
      {/* Decorative HUD background elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-yellow-500/[0.02] to-transparent pointer-events-none" />
      
      <div className="max-w-[1600px] mx-auto relative z-10 px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-24">
          {/* Brand Engine Section */}
          <div className="lg:col-span-5 space-y-12">
            <div className="flex flex-col gap-8 group">
              <div className="flex items-center gap-6">
                <div className="relative w-16 h-16 glass-card border-white/10 p-1 bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                  <Image 
                    src="/images/logo.jpg" 
                    alt="FC ESCUELA" 
                    width={64} 
                    height={64} 
                    className="object-cover w-full h-full relative border border-white/5 opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                   <div className="flex items-center gap-3 text-[9px] text-yellow-500 font-black uppercase tracking-[0.5em]">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                      Protocol: ACTIVE_LEGACY
                   </div>
                   <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none group-hover:tracking-widest transition-all duration-700">
                      ESCUELA <br />
                      <span className="text-5xl not-italic text-slate-800 transition-colors group-hover:text-white">LEGACY</span>
                   </h2>
                </div>
              </div>
              <p className="text-[13px] text-slate-500 leading-loose font-mono font-bold uppercase tracking-wider max-w-sm italic">
                Direct updates from the heart of the club. Elite performance, legendary legacy. Direct telemetry synchronisation active.
              </p>
            </div>
            
            <div id="google_translate_element" className="relative z-50 glass-card border-white/5 p-4 inline-block bg-slate-950/40" />
          </div>
 
           {/* Quick Links Section */}
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.6em] border-b border-white/5 pb-4">Registry</h3>
            <div className="flex flex-col gap-6">
              {['Home', 'News Hub', 'Squad Registry', 'Ticket Hub'].map((link) => (
                <Link 
                  key={link} 
                  href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                  className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-4 group/link italic"
                >
                  <div className="w-4 h-[1px] bg-yellow-500/0 group-hover/link:w-8 group-hover/link:bg-yellow-500 transition-all duration-500" />
                  {link}
                </Link>
              ))}
            </div>
          </div>
 
          <div className="lg:col-span-2 space-y-10">
            <h3 className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.6em] border-b border-white/5 pb-4">Protocol</h3>
            <div className="flex flex-col gap-6">
              {['About', 'Contact', 'Privacy Policy'].map((link) => (
                <Link 
                  key={link} 
                  href="#"
                  className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-white transition-all flex items-center gap-4 group/link italic"
                >
                  <div className="w-4 h-[1px] bg-yellow-500/0 group-hover/link:w-8 group-hover/link:bg-yellow-500 transition-all duration-500" />
                  {link}
                </Link>
              ))}
            </div>
          </div>
 
           {/* Social Section */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
               <h3 className="text-[10px] text-yellow-500 font-black uppercase tracking-[0.6em] border-b border-white/5 pb-4 text-right">Connect_Sync</h3>
               <div className="flex items-center justify-end gap-6">
                 <a href="https://www.facebook.com/profile.php?id=100083085867194" target="_blank" className="w-14 h-14 glass-card hud-border flex items-center justify-center text-slate-700 hover:text-yellow-500 transition-all hover:bg-yellow-500/5 group">
                   <FaFacebookF className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 </a>
                 <a href="https://www.youtube.com/@NhaTruongKhu" target="_blank" className="w-14 h-14 glass-card hud-border flex items-center justify-center text-slate-700 hover:text-yellow-500 transition-all hover:bg-yellow-500/5 group">
                   <FaYoutube className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 </a>
               </div>
            </div>
            
            <div className="p-8 glass-card border-yellow-500/10 bg-yellow-500/[0.02] relative overflow-hidden group/secure">
               <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500/30 group-hover/secure:bg-yellow-500 transition-colors" />
               <div className="flex items-center gap-4 mb-4">
                 <FaShieldAlt className="text-yellow-500 text-sm animate-pulse" />
                 <span className="text-[9px] text-white font-black uppercase tracking-[0.4em]">Secure_Ops_Locked</span>
               </div>
               <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest leading-relaxed italic">Encryption: AES-256 Synchronous Registry Active.</p>
            </div>
          </div>
        </div>
 
        {/* HUD Bottom Bar */}
        <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-[9px] text-slate-700 font-black uppercase tracking-[0.5em] flex items-center gap-4 italic hover:text-slate-500 transition-colors">
            <span className="w-12 h-[1px] bg-white/5" />
            © {new Date().getFullYear()} FC ESCUELA // DIGITAL ARCHIVE
          </div>
          
          <div className="flex items-center gap-8 group cursor-default">
             <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,1)] animate-ping" />
             <span className="text-[8px] text-yellow-500/50 font-black uppercase tracking-[0.6em]">OVERWATCH_ACTIVE</span>
          </div>
        </div>
      </div>
 
      {/* Ghost Typography Background */}
      <div className="absolute -bottom-20 right-0 select-none pointer-events-none opacity-[0.02] rotate-[-5deg]">
        <span className="text-[25vw] font-black text-white uppercase leading-none italic tracking-tighter">LEGACY_ENGINE</span>
      </div>
    </footer>
  );
}

