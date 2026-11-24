/**
 * The one site menu (docs/ARCHITECTURE.md §2). Header, mobile menu and footer are built from it —
 * never add a second navigation. Labels are UI keys in src/data/cms/ui/layout.json.
 */
export interface NavItem {
  key: string;
  path: string;
}

export const MAIN_NAV: NavItem[] = [
  { key: 'nav.services', path: '/services/' },
  { key: 'nav.partners', path: '/partners/' },
  { key: 'nav.news', path: '/news/' },
  { key: 'nav.contacts', path: '/contacts/' },
];

export const LEGAL_NAV: NavItem[] = [
  { key: 'footer.privacy', path: '/privacy/' },
  { key: 'footer.terms', path: '/terms/' },
  { key: 'footer.cookies', path: '/cookies/' },
];

/** Where «Отправить заявку» leads: the request form on the contacts page. */
export const START_PATH = '/contacts/#request';

/** Partner articles live at /news/partner-<id>/ but belong to «Производители» in the menu and breadcrumbs. */
export const isPartnerArticle = (route: string) => route.startsWith('/news/partner-');

/** True when `route` (language-neutral, e.g. '/services/supply/') belongs to the menu item. */
export function isActive(item: NavItem, route: string): boolean {
  if (item.path === '/') return route === '/';
  if (isPartnerArticle(route)) return item.path === '/partners/';
  return route.startsWith(item.path);
}
