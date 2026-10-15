/**
 * Helper to safely resolve static and CMS asset paths with import.meta.env.BASE_URL.
 * Supports both GitHub Pages subpaths (/rt-corporate-website) and root domain (railtech.uz).
 */
export function withBase(path?: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (base && cleanPath.startsWith(`${base}/`)) return cleanPath;
  return `${base}${cleanPath}`;
}
