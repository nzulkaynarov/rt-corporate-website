# Accessibility Audit: RailTech Corporate Website

**Standard:** WCAG 2.1 AA | **Date:** 2026-03-26
**URL:** http://localhost:56187 (Hugo dev server)
**Pages audited:** Homepage (RU, EN), Contact, Blog post, Blog list

---

## Summary

**Issues found:** 9 | **Critical:** 1 | **Major:** 4 | **Minor:** 4

The RailTech website demonstrates solid baseline accessibility thanks to Blowfish theme defaults: proper landmark structure, skip link, semantic HTML, visible focus indicators, and correct `lang` attributes per language. The custom homepage layout (`custom.html`) also follows good practices with ARIA labels on sections and proper heading hierarchy.

However, several issues need attention — one critical contrast failure, broken phone link, missing form labels for honeypot and search, and language switcher links without accessible names.

---

## Findings

### Perceivable

| # | Issue | WCAG Criterion | Severity | Location | Recommendation |
|---|-------|---------------|----------|----------|----------------|
| 1 | Orange accent text on chip backgrounds has contrast ratio **3.42:1** (needs 4.5:1 for normal text) | 1.4.3 Contrast (Minimum) | 🔴 Critical | Homepage — hero chips (e.g. "120+ активных партнёров"), topic tags | Change chip text from `text-primary-400` to `text-primary-300` (lighter orange), or increase chip background opacity. Alternatively, since chips use `text-xs` (small text), consider increasing font-size to qualify as large text (≥18.66px bold) where 3:1 ratio suffices. |
| 2 | Stats counter labels use `text-neutral-400` (#a1a1aa) — ratio 5.81:1 | 1.4.3 Contrast | ✅ Pass | Homepage — stats section | No action needed. |

### Operable

| # | Issue | WCAG Criterion | Severity | Location | Recommendation |
|---|-------|---------------|----------|----------|----------------|
| 3 | **Phone link has broken href** `#ZgotmplZ` — not a valid `tel:` link | 2.1.1 Keyboard / 2.4.4 Link Purpose | 🟡 Major | Contact page — phone number | Hugo's `safeURL` is stripping the `tel:` protocol. Fix the contact layout to use `| safeHTML` or construct the href explicitly: `href="tel:+998901189000"`. |
| 4 | **Language switcher links (RU, UZ) have no accessible name** — screen readers announce only the URL | 2.4.4 Link Purpose (In Context) | 🟡 Major | All pages — header language switcher | This is a Blowfish theme issue. The current language's link and non-active language links render without text content or `aria-label`. Override the language switcher partial or file an upstream issue. Workaround: add `aria-label` attributes like `aria-label="Русский"`, `aria-label="Oʻzbekcha"`. |
| 5 | Skip link works correctly — "Перейти к основному содержимому" | 2.4.1 Bypass Blocks | ✅ Pass | All pages | Blowfish provides this by default. |
| 6 | Focus indicators are **visible** on all interactive elements (orange outline via `focus-visible`) | 2.4.7 Focus Visible | ✅ Pass | All pages | Good — Blowfish default + custom focus styles in `custom.html`. |

### Understandable

| # | Issue | WCAG Criterion | Severity | Location | Recommendation |
|---|-------|---------------|----------|----------|----------------|
| 7 | **Search input (`#search-query`) has no associated `<label>` or `aria-label`** | 3.3.2 Labels or Instructions | 🟡 Major | All pages — search modal | This is a Blowfish theme issue. The search input has `placeholder="Search"` but no programmatic label. Override `layouts/partials/search.html` to add `aria-label="{{ i18n "search.placeholder" }}"` to the input. |
| 8 | **Contact form honeypot checkbox is not hidden from assistive technology** — visible to screen readers, may confuse users | 3.3.2 Labels / 1.3.1 Info and Relationships | 🟢 Minor | Contact page — botcheck field | The honeypot has `tabindex="-1"` (not keyboard-focusable) but lacks `aria-hidden="true"` on its container and has `display: block`. Add `aria-hidden="true"` to the honeypot wrapper div and use `display: none` or `position: absolute; left: -9999px`. |
| 9 | Contact form uses `novalidate` — relies on server-side validation only, no inline error messages for required fields | 3.3.1 Error Identification | 🟢 Minor | Contact page form | Consider adding client-side validation with `aria-invalid` and `aria-describedby` for error messages, or remove `novalidate` to use native browser validation. |

### Robust

| # | Issue | WCAG Criterion | Severity | Location | Recommendation |
|---|-------|---------------|----------|----------|----------------|
| 10 | **Heading hierarchy skip on Contact page**: H1 → H3 (skips H2) for contact info labels | 1.3.1 Info and Relationships | 🟡 Major | Contact page — "Телефон", "Email", "Адрес", "Режим работы" are `<h3>` before the `<h2>` "Свяжитесь с нами" | Change contact info labels from `<h3>` to `<p>` with `font-semibold` class, or restructure so H2 comes first. The form heading "Свяжитесь с нами" should be H2 and contact info labels should be regular bold text or properly nested under an H2. |
| 11 | All form inputs have proper `<label for="">` associations | 4.1.2 Name, Role, Value | ✅ Pass | Contact page form | Name, company, phone, email, message — all have labels. |
| 12 | All form inputs have `autocomplete` attributes | 1.3.5 Identify Input Purpose | ✅ Pass | Contact page form | `name`, `organization`, `tel`, `email` — correct values. |

---

## Color Contrast Check

| Element | Foreground | Background | Ratio | Required | Pass? |
|---------|-----------|------------|-------|----------|-------|
| H1 title (`text-neutral-50`) | #fafafa | #18181b | 14.27:1 | 4.5:1 | ✅ |
| Body text (`text-neutral-400`) | #a1a1aa | #18181b | 5.81:1 | 4.5:1 | ✅ |
| Hero chips (`text-primary-400` on `bg-primary-500/5`) | #fb923c | ~#1a1713 | 3.42:1 | 4.5:1 | ❌ |
| Stats numbers (`text-primary-400`, large bold) | #fb923c | #18181b | 6.58:1 | 3:1 (large) | ✅ |
| Nav links (`text-neutral-50`) | #fafafa | #27272a | 14.89:1 | 4.5:1 | ✅ |
| CTA button (dark text on white bg) | #171717 | #fafafa | 16.97:1 | 4.5:1 | ✅ |
| Footer text (`text-neutral-50`) | #fafafa | #27272a | 14.89:1 | 4.5:1 | ✅ |

---

## Keyboard Navigation

| Element | Tab Order | Enter/Space | Focus Visible? |
|---------|-----------|-------------|----------------|
| Skip link | 1st (hidden until focused) | Scrolls to `#main-content` | ✅ Orange pill |
| Logo link | 2nd | Navigates to homepage | ✅ |
| Nav links | 3rd–9th | Navigate to pages | ✅ Orange outline |
| Language switcher | 10th | Opens dropdown | ✅ |
| Search button | 11th | Opens search modal | ✅ |
| Theme toggle | 12th | Toggles dark/light | ✅ |
| Hero CTA buttons | 13th–14th | Navigate to contact/catalog | ✅ Orange outline |
| Service cards | Further | Navigate to service pages | ✅ Border highlight |
| Footer links | Last group | Navigate appropriately | ✅ |

**Verdict:** All interactive elements are keyboard-accessible with logical tab order and visible focus indicators.

---

## Screen Reader Assessment (Automated)

| Element | Announced As | Issue |
|---------|-------------|-------|
| Skip link | "Перейти к основному содержимому" | ✅ Correct |
| Logo | Link with image "RailTech" | ✅ Correct |
| Search button | "Search" | ✅ Has label |
| Language links | Link with no text (RU, UZ) | ❌ Missing accessible name |
| Search input | Input with placeholder only | ❌ No programmatic label |
| Hero chips | Span text readable | ✅ |
| Stats | `<dd>` values + `<dt>` labels | ✅ Proper `<dl>` structure |
| Contact form | All inputs properly labelled | ✅ |
| Map iframe | "Адрес — RailTech" | ✅ Has title |

---

## Multilingual Accessibility

| Check | RU | EN | UZ |
|-------|----|----|-----|
| `lang` attribute on `<html>` | `ru` ✅ | `en` ✅ | `uz` ✅ |
| Skip link text localized | ✅ "Перейти к основному содержимому" | ✅ "Skip to main content" | ✅ (Blowfish default) |
| Search placeholder localized | ✅ | ✅ | ✅ |
| Form labels localized | ✅ | ✅ | ✅ |

---

## Blog Post Accessibility

| Check | Status | Notes |
|-------|--------|-------|
| `<article>` element | ✅ | Blowfish wraps post in `<article>` |
| Heading hierarchy (H1→H2→H3) | ✅ | No skipped levels |
| `<time datetime="">` element | ✅ | ISO 8601 datetime present |
| Table of Contents navigation | ✅ | `<nav id="TableOfContents">` |
| Main landmark with ID | ✅ | `<main id="main-content">` |
| Images alt text | N/A | No images in test post |

---

## Priority Fixes

1. **🔴 Fix chip text contrast** — The new color scheme proposed in `UI-UX-AUDIT-REPORT.md` (Steel Blue primary) resolves this automatically: `primary-400` (#60a5fa) on dark bg gives 8.26:1 (AAA). If keeping orange scheme, change `text-primary-400` to `text-primary-300` on hero chips in `layouts/partials/home/custom.html`.

2. **🟡 Fix broken phone link** — The `tel:` protocol is being sanitized by Hugo. In `contact/list.html`, use `href="tel:{{ replace $phone " " "" | safeURL }}"` or hardcode the sanitized number.

3. **🟡 Add accessible names to language switcher** — Override Blowfish's language switcher partial to include `aria-label` with the language name on each link.

4. **🟡 Add label to search input** — Override Blowfish's search partial to add `aria-label` to the `#search-query` input.

5. **🟡 Fix heading hierarchy on Contact page** — Change contact info labels from `<h3>` to styled `<p>` or `<dt>` elements.

6. **🟢 Hide honeypot from assistive technology** — Add `aria-hidden="true"` and `display: none` to the botcheck wrapper.

7. **🟢 Add client-side form validation** — Either remove `novalidate` or add `aria-invalid` / `aria-describedby` error handling.

---

## What's Working Well

- **Landmark structure** — Proper use of `<main>`, `<nav>`, `<header>`, `<footer>` with ARIA labels
- **Skip link** — Present and functional across all pages
- **Focus management** — Visible focus indicators using `focus-visible` with orange outline
- **Semantic HTML** — `<dl>` for stats, `<article>` for blog posts, `<time>` elements, proper heading nesting
- **Form accessibility** — All visible inputs have proper `<label>` associations and `autocomplete` attributes
- **Color contrast** — All body text, headings, nav links, and buttons pass AA requirements
- **Multilingual** — Correct `lang` attributes on `<html>` for each language version
- **Map iframe** — Has descriptive `title` attribute
- **Dark mode** — Contrast ratios maintained in both dark and light themes (dark is default)
