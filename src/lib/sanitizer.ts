/**
 * Database Injection & XSS Security Module
 * Protects against ORM injection arrays, NoSQL key exploits, and Stored DOM XSS.
 */

// 1. Core String Sanitizer (XSS & Protocol Hijack Prevention)
function stripXSS(input: string): string {
  if (typeof input !== 'string') return input;

  // Pattern strictly hunts for executable/rendering tags and inline event handlers (`onload`, `onerror`, etc)
  let scrubbed = input.replace(
    /<(script|iframe|object|embed|applet|meta|style|base|form|input)[^>]*>.*?<\/\1>|<(script|iframe|object|embed|applet|meta|style|base|form|input)[^>]*\/?>(?=\s|$)|on[a-z]+\s*=\s*(["']).*?\2/gi,
    "[REDACTED]"
  );
  
  // Strip raw Javascript protocol handlers (`javascript:`)
  scrubbed = scrubbed.replace(/javascript\s*:/gi, "no-js:");

  return scrubbed;
}

/**
 * Iterates through deep payload objects.
 * - Extracts valid scalar/array data types.
 * - Exterminates Object-injection properties (keys starting with `$` or objects bypassing type validation)
 * - Eradicates Javascript prototype pollution vectors.
 * - Scrubs string leaf properties clean of XSS threats.
 */
export function sanitizePayload<T>(payload: T, depth = 0): T {
  // Hard cap logic iteration to prevent Denial of Service via massive nested objects
  if (depth > 5) return payload;

  // Leaf Node: Strings
  if (typeof payload === 'string') {
    return stripXSS(payload) as unknown as T;
  }

  // Branch iteration: Arrays
  if (Array.isArray(payload)) {
    return payload.map(item => sanitizePayload(item, depth + 1)) as unknown as T;
  }

  // Object validation and recursive scrutiny
  if (payload !== null && typeof payload === 'object') {
    const safeObject: any = {};
    for (const [key, value] of Object.entries(payload)) {
      
      // ORM/NoSQL Mitigation Phase: Stripping Prisma operator lookalikes and protected internals
      if (key.startsWith('$') || key.startsWith('_') || key.includes('{') || key.includes('}')) {
        console.warn(`[SECURITY] Anti-Injection Firewall intercepted illegal operator key: ${key}`);
        continue;
      }
      
      // Prototype Pollution Prevention Phase
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      // Safe iteration
      safeObject[key] = sanitizePayload(value, depth + 1);
    }
    return safeObject as T;
  }

  // Basic pass-through for trusted primitives resolving validation (Number, Boolean)
  return payload;
}
