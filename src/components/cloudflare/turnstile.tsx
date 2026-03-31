'use client'

import { useEffect, useRef } from 'react'

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: (error: any) => void
  onExpire?: () => void
  theme?: 'light' | 'dark' | 'auto'
}

declare global {
  interface Window {
    onloadTurnstileCallback: () => void
    turnstile: any
  }
}

export default function Turnstile({ siteKey, onVerify, onError, onExpire, theme = 'dark' }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  useEffect(() => {
    const scriptId = 'cloudflare-turnstile-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement

    const initializeTurnstile = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        if (typeof siteKey !== 'string' || !siteKey) {
          console.error('[Turnstile] Invalid siteKey provided:', siteKey);
          return;
        }

        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'error-callback': onError,
            'expired-callback': onExpire,
            theme,
          })
        } catch (err) {
          console.error('[Turnstile] Render error:', err);
        }
      }
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback&render=explicit'
      script.async = true
      script.defer = true
      document.head.appendChild(script)

      window.onloadTurnstileCallback = () => {
        initializeTurnstile();
      };
    } else if (window.turnstile) {
      initializeTurnstile()
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch (err) {
          // Ignore removal errors if container is already gone
        }
        widgetIdRef.current = null
      }
    }
  }, [siteKey, onVerify, onError, onExpire, theme])

  return <div ref={containerRef} className="cf-turnstile" />
}
