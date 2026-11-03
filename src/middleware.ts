import { defineMiddleware } from 'astro:middleware';
import { getLangFromPath } from './i18n';

/** Resolves the page language from the URL (/uz/…, /en/…, default ru) for every page at build time. */
export const onRequest = defineMiddleware((context, next) => {
  context.locals.lang = getLangFromPath(context.url.pathname);
  return next();
});
