// Add this at the very top of the file
declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 pt-24 pb-12 overflow-hidden selection:bg-slate-800 selection:text-white">
      <div className="max-w-[1600px] mx-auto px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
          
          {/* Brand Engine Section */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div className="space-y-8">
              <Link href="/" className="inline-block group">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white flex items-center justify-center p-1">
                    <Image 
                      src="/images/logo.jpg" 
                      alt="FC ESCUELA" 
                      width={64} 
                      height={64} 
                      className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" 
                    />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight leading-none group-hover:text-slate-300 transition-colors">
                     FC <br />
                     <span className="text-slate-500 font-light">ESCUELA</span>
                  </h2>
                </div>
              </Link>
              <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
                Elevating the beautiful game through elite analytics, comprehensive editorial coverage, and premier club experiences.
              </p>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="md:col-span-2 md:col-start-7 space-y-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Explore</h3>
            <div className="flex flex-col gap-5">
              {[
                { label: 'Home', href: '/' },
                { label: 'News Hub', href: '/news' },
                { label: 'The Squad', href: '/team' },
                { label: 'Ticketing', href: '/ticketing' }
              ].map((link) => (
                <Link 
                   key={link.label} 
                   href={link.href}
                   className="text-sm font-bold text-slate-500 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Protocol Section */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Legal</h3>
            <div className="flex flex-col gap-5">
              {['About', 'Contact', 'Privacy Policy'].map((link) => (
                <Link 
                   key={link} 
                   href="#"
                   className="text-sm font-bold text-slate-500 hover:text-white transition-colors"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>

          {/* Action / Social Section */}
          <div className="md:col-span-2 space-y-8">
             <h3 className="text-xs font-bold text-white uppercase tracking-widest">Connect</h3>
             <div className="flex items-center gap-4">
               <a href="https://www.facebook.com/profile.php?id=100083085867194" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-slate-500 hover:text-white transition-all hover:bg-slate-800 group">
                 <FaFacebookF className="w-4 h-4 group-hover:scale-110 transition-transform" />
               </a>
               <a href="https://www.youtube.com/@NhaTruongKhu" target="_blank" className="w-12 h-12 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:border-slate-500 hover:text-white transition-all hover:bg-slate-800 group">
                 <FaYoutube className="w-4 h-4 group-hover:scale-110 transition-transform" />
               </a>
             </div>
             <div className="pt-4">
                <div id="google_translate_element" className="inline-block bg-slate-900 border border-slate-800 rounded-lg p-2 overflow-hidden" />
             </div>
          </div>

        </div>

        {/* Global Bottom Bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-widest">
            © {new Date().getFullYear()} FC ESCUELA. All Rights Reserved.
          </div>
          <div className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
             Deployed via Technical Hub
          </div>
        </div>

      </div>
    </footer>
  );
}
