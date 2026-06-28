import DOMPurify from 'dompurify';

/**
 * Sanitizes user-generated inputs to prevent Cross-Site Scripting (XSS).
 * Escapes characters during SSR, and runs DOMPurify client-side.
 */
export function sanitizeHTML(dirty: string): string {
  if (typeof window === 'undefined') {
    // Server-side: escape basic HTML syntax characters to prevent rendering execution
    return dirty
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  // Client-side: use DOMPurify to strip malicious scripts and payloads
  return DOMPurify.sanitize(dirty);
}
