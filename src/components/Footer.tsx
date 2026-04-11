// Add this at the very top of the file
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-16 pb-12 overflow-hidden border-t border-slate-200/40 selection:bg-amber-500/30 selection:text-slate-900 bg-white">
      {/* ── Immersive Background Architecture ── */}
      <div className="absolute inset-0 bg-mesh-light opacity-30" />
      <div className="noise-layer opacity-[0.015]" />

      <div className="max-w-[1600px] mx-auto relative z-20 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* ── Brand Core Section ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col gap-8">
              <Link href="/" className="flex items-center gap-5 group w-fit relative">
                <div className="relative">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 bg-white p-1.5 shadow-sm group-hover:shadow-xl group-hover:border-amber-500/30 transition-all duration-500">
                    <Image
                      src="/images/logo.jpg"
                      alt="FC ESCUELA"
                      width={56}
                      height={56}
                      className="object-cover w-full h-full rounded-xl transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-2xl font-display font-black tracking-tighter text-slate-950 leading-none uppercase group-hover:tracking-wide transition-all duration-700">
                    ESCUELA 
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-display font-black text-amber-500 uppercase tracking-[0.4em]">
                      LEGACY
                    </span>
                    <div className="flex-1 h-[1px] min-w-[30px] bg-slate-100 group-hover:bg-amber-500/40 transition-all duration-700" />
                  </div>
                </div>
              </Link>
              
              <div className="space-y-6">
                <p className="text-slate-500 text-[12px] leading-relaxed max-w-[280px] font-medium opacity-80">
                  Advancing the beautiful game through elite performance intelligence and a professional legacy.
                </p>
                
                {/* Professional Registry Link */}
                <div className="flex items-center gap-3 transition-all duration-300 opacity-60 hover:opacity-100">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <FaGlobe className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tight uppercase">academy.fcescuela.intl</span>
                </div>
              </div>
            </div>

            {/* Language Architecture - Inline style */}
            <div className="relative group/lang pt-4">
              <div id="google_translate_element" className="relative z-50 p-2 bg-white border border-slate-100 rounded-xl inline-block shadow-sm" />
            </div>
          </div>

          {/* ── Navigation Hub ── */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:pt-4">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em]">Directory</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'News', href: '/news' },
                  { label: 'Team', href: '/team' },
                  { label: 'Tickets', href: '/ticketing' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-950 transition-all flex items-center gap-3 group/item font-body"
                    >
                      <div className="w-1 h-1 rounded-full bg-slate-200 group-hover/item:bg-amber-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-8">
              <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em]">Company</h4>
              <ul className="space-y-4">
                {['Profile', 'Contact', 'Privacy', 'Terms'].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-950 transition-all flex items-center gap-3 group/item font-body"
                    >
                      <div className="w-1 h-1 rounded-full bg-slate-200 group-hover/item:bg-amber-500 transition-colors" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Social Hub ── */}
          <div className="lg:col-span-3 space-y-10 lg:text-right flex flex-col items-start lg:items-end lg:pt-4">
            <div className="space-y-6 w-full">
              <h4 className="text-[10px] font-black text-slate-950 uppercase tracking-[0.3em] flex items-center gap-3 justify-start lg:justify-end">
                Remote Link
              </h4>
              <div className="flex items-center lg:justify-end gap-3">
                {[
                  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100083085867194' },
                  { icon: FaYoutube, href: 'https://www.youtube.com/@NhaTruongKhu' },
                  { icon: FaTwitter, href: '#' },
                  { icon: FaInstagram, href: '#' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:text-slate-950 hover:border-amber-500/20 hover:shadow-sm transition-all duration-300"
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Baseline ── */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="flex items-center gap-8 text-[9px] font-mono font-black text-slate-300 uppercase tracking-[0.5em]">
            <span className="hover:text-slate-900 transition-colors duration-500 cursor-default">©{currentYear}_FC_ESCUELA_ACADEMY</span>
          </div>
          
          <div className="flex items-center gap-6 text-[9px] font-mono font-bold text-slate-200">
             <span>v2.4.9</span>
             <span className="w-1 h-1 rounded-full bg-slate-100" />
             <span>STABLE_INTEL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
