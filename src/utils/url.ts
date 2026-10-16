/**
 * Helper to safely resolve static and CMS asset paths with import.meta.env.BASE_URL.
 * Supports both GitHub Pages subpaths (/rt-corporate-website) and root domain (railtech.uz).
 */
export function withBase(path?: string): string {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('//') ||
    path.startsWith('#') ||
    path.startsWith('tel:') ||
    path.startsWith('mailto:')
  ) {
    return path;
  }
  const rawBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL)
    ? import.meta.env.BASE_URL
    : '/';
  const base = rawBase.replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (base && (cleanPath === base || cleanPath.startsWith(`${base}/`))) {
    return cleanPath;
  }
  return `${base}${cleanPath}`;
}
