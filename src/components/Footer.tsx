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
    <footer className="relative pt-16 pb-10 overflow-hidden border-t border-white/5 bg-slate-950">
      {/* Mesh glow */}
      <div className="absolute inset-0 bg-mesh-dark opacity-60 pointer-events-none" />
      <div className="noise-layer opacity-[0.02]" />

      {/* Red top line accent */}
      <div className="absolute top-0 left-0 right-0 h-px">
        <div className="h-full w-full" style={{
          background: 'linear-gradient(to right, transparent, rgba(239,68,68,0.5), transparent)'
        }} />
      </div>

      <div className="max-w-[1600px] mx-auto relative z-20 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-14">

          {/* ── Brand Core ── */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex flex-col gap-8">
              <Link href="/" className="flex items-center gap-4 group w-fit">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-1.5 transition-all duration-500 group-hover:border-red-500/40 group-hover:shadow-[0_0_24px_rgba(239,68,68,0.2)]">
                  <Image
                    src="/images/logo.jpg"
                    alt="FC ESCUELA"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full rounded-xl transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-xl font-black tracking-tighter text-white leading-none uppercase group-hover:text-red-400 transition-colors duration-500">
                    ESCUELA
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.4em]">
                      LEGACY
                    </span>
                    <div className="flex-1 h-px min-w-[30px] bg-white/10 group-hover:bg-red-500/40 transition-all duration-700" />
                  </div>
                </div>
              </Link>

              <div className="space-y-5">
                <p className="text-slate-500 text-[12px] leading-relaxed max-w-[280px] font-medium">
                  Advancing the beautiful game through elite performance intelligence and a professional legacy.
                </p>
                <div className="flex items-center gap-3 opacity-40 hover:opacity-80 transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                    <FaGlobe className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-tight uppercase">academy.fcescuela.intl</span>
                </div>
              </div>
            </div>

            {/* Language Selector */}
            <div className="relative pt-2">
              <div id="google_translate_element" className="relative z-50 p-2 bg-white/5 border border-white/10 rounded-xl inline-block" />
            </div>
          </div>

          {/* ── Nav Hub ── */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8 lg:pt-4">
            <div className="space-y-7">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Directory</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'News', href: '/news' },
                  { label: 'Team', href: '/team' },
                  { label: 'Gallery', href: '/gallery' }
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-all flex items-center gap-3 group/item"
                    >
                      <div className="w-1 h-1 rounded-full bg-white/20 group-hover/item:bg-red-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-7">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Company</h4>
              <ul className="space-y-4">
                {['Profile', 'Contact', 'Privacy', 'Terms'].map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hover:text-red-400 transition-all flex items-center gap-3 group/item"
                    >
                      <div className="w-1 h-1 rounded-full bg-white/20 group-hover/item:bg-red-500 transition-colors" />
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Social Hub ── */}
          <div className="lg:col-span-3 space-y-8 flex flex-col items-start lg:items-end lg:pt-4">
            <div className="space-y-5 w-full">
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3 justify-start lg:justify-end">
                Social
              </h4>
              <div className="flex items-center lg:justify-end gap-3">
                {[
                  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100083085867194' },
                  { icon: FaYoutube,  href: 'https://www.youtube.com/@NhaTruongKhu' },
                  { icon: FaTwitter,  href: '#' },
                  { icon: FaInstagram, href: '#' }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300"
                  >
                    <social.icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Membership CTA */}
            <div className="w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-5 lg:text-right">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-2">Elite Access</p>
              <p className="text-xs text-slate-400 mb-4">Unlock premium features and club benefits.</p>
              <Link
                href="/profile/membership"
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-red-600"
                style={{ boxShadow: '0 0 12px rgba(239,68,68,0.3)' }}
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom Baseline ── */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          <div className="absolute top-0 left-0 right-0 h-px" style={{
            background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)'
          }} />
          <div className="flex items-center gap-6 text-[9px] font-mono font-black text-slate-600 uppercase tracking-[0.5em]">
            <span className="hover:text-slate-400 transition-colors duration-500 cursor-default">
              ©{currentYear}_FC_ESCUELA_ACADEMY
            </span>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono font-bold text-slate-700">
            <span>v2.4.9</span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span>STABLE_INTEL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
