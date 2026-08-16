'use client'

import { useState } from 'react';
import Image from 'next/image'

interface ProfileImageProps {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
}

export default function ProfileImage({ src, name, size = 40, className = "" }: ProfileImageProps) {
  const [error, setError] = useState(false);
  
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?'

  return (
    <div 
      className={`relative flex items-center justify-center bg-slate-100 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={name || 'Profile'}
          fill
          unoptimized={true}
          sizes={`${size}px`}
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span 
          className="font-black text-slate-400 select-none"
          style={{ fontSize: size * 0.4 }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
