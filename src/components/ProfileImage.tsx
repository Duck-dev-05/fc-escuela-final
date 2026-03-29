"use client";

import { useState, useEffect } from 'react';

interface ProfileImageProps {
  src?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function ProfileImage({ 
  src, 
  name, 
  size = 40, 
  className = "", 
  glow = true 
}: ProfileImageProps) {
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string | null>(src || null);

  useEffect(() => {
    // Force reset on src change
    setImgSrc(src || null);
    setError(false);
  }, [src]);

  const fallbackChar = name ? name.charAt(0).toUpperCase() : '?';

  return (
    <div 
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-200 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div className="absolute inset-0 bg-yellow-500/5 blur-xl rounded-xl -z-10 animate-pulse" />
      )}
      
      {/* 
        Using native <img> for better cross-domain reliability.
        Added strict URL validation to prevent 400 Bad Request on relative paths like "/image".
      */}
      {imgSrc && typeof imgSrc === 'string' && imgSrc.startsWith('http') && !error ? (
        <img
          src={imgSrc}
          alt={name || "User Profile"}
          width={size}
          height={size}
          className="w-full h-full object-cover relative z-10 transition-transform duration-700 hover:scale-110"
          onError={() => {
            console.warn("Profile image failed to load, switching to fallback.");
            setError(true);
          }}
          loading="eager"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-white relative z-10 overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-slate-100/40" />
          
          {/* Tactical Silhouette SVG Fallback - Positioned behind the letter if available */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity">
            <svg viewBox="0 0 24 24" fill="none" className="w-2/3 h-2/3 text-yellow-500/40">
              <path d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z" fill="currentColor" />
            </svg>
          </div>

          {/* Centered Large Letter Fallback */}
          <span className="relative z-20 text-yellow-500 font-black italic tracking-tighter leading-none" style={{ fontSize: size * 0.5 }}>
            {fallbackChar}
          </span>

          {/* Subtle Scanline on Fallback */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(234,179,8,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-pulse-slow pointer-events-none" />
        </div>
      )}
      
      {/* HUD-style border ring */}
      <div className="absolute inset-0 border border-yellow-500/0 group-hover:border-yellow-500/20 transition-colors pointer-events-none rounded-xl z-20" />
    </div>
  );
}
