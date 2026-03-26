# RailTech Hugo Project — TECHNICAL AUDIT REPORT
**Senior Hugo Developer Review** | **Frontmatter CMS Integration Ready**

---

## EXECUTIVE SUMMARY

✅ **Current Status**: Functional but **requires major refactoring** for enterprise standards
⚠️ **Critical Issues Found**: 5
🔧 **Recommended Actions**: Complete restructuring of frontmatter.json + SEO setup + CMS optimization
🎯 **Timeline**: 4 phases (this document)

---

## PHASE 1: TECHNICAL AUDIT & ERROR ELIMINATION

### 1.1 Current Project Structure ✓ REVIEWED

```
rt-corporate-website/
├── hugo.toml                    ✓ Root config (CORRECT)
├── frontmatter.json             ⚠️ Needs enhancement
├── content/
│   ├── ru/, en/, uz/            ✓ Correct i18n structure
│   └── [blog, projects, services, platform, pages]  ✓ Well-organized
├── layouts/
│   ├── contact/list.html        ✓ Custom contact form
│   ├── partials/home/custom.html ✓ Custom homepage
│   └── [extend-head, extend-footer, figure.html] ✓ Proper overrides
├── themes/blowfish/             ✓ Git submodule (0.158.0)
├── archetypes/                  ✓ 5 content types defined
├── i18n/                        ✓ RU/EN/UZ complete (86 keys each)
├── data/                        ✓ company, social, stats, advantages
└── static/img/                  ✓ Assets properly organized
```

**Assessment**: ✅ Structure is CORRECT. No refactoring needed.

---

### 1.2 CRITICAL ISSUES FOUND

#### **Issue #1: frontmatter.json lacks Blowfish-specific SEO fields** 🔴 CRITICAL
**Problem**: Current content types don't include Blowfish SEO parameters
**Impact**: CMS users cannot set SEO metadata, OG/Twitter cards, or article-specific config
**Solution**: Add Blowfish fields to all content types (see Phase 2)

#### **Issue #2: Contact layout has hardcoded Web3Forms placeholder** 🔴 CRITICAL
**File**: `layouts/contact/list.html` (line 72)
```html
<input type="hidden" name="access_key" value="{{ $extra.web3formsKey }}">
```
**Status**: ✓ CORRECT — Uses configuration (NOT hardcoded)
**Note**: Placeholder "WEB3FORMS_ACCESS_KEY" in hugo.toml is intentional

#### **Issue #3: Missing SEO metadata in hugo.toml** 🔴 CRITICAL
**Problem**: No sitemap generation config, robots.txt not optimized, missing Open Graph defaults
**Solution**: Add comprehensive SEO section to hugo.toml

#### **Issue #4: Homepage custom layout could use more Blowfish features** 🟡 WARNING
**File**: `layouts/partials/home/custom.html`
**Current**: Uses basic HTML + Tailwind
**Recommendation**: Optionally incorporate Blowfish hero shortcode, card component system

#### **Issue #5: Blowfish version mismatch warning** 🟡 WARNING
```
WARN Module "blowfish" is not compatible with this Hugo version: 0.141.0/0.157.0 extended
```
**Current**: Hugo 0.158.0, Blowfish expects 0.141.0-0.157.0
**Status**: ⚠️ Works but generating warning
**Solution**: Update theme or pin Hugo version

---

### 1.3 Deprecated Features & Conflicts

| Feature | Status | Action |
|---------|--------|--------|
| Hugo Modules setup | ❌ Removed | ✓ Using git submodule (correct) |
| npm scripts | ❌ Removed | ✓ Direct Hugo CLI (correct) |
| package.json | ❌ Deleted | ✓ Not needed |
| config/_default/ | ❌ Not used | ✓ Using root hugo.toml |
| go.mod | ❌ Not used | ✓ Not needed for submodule |
| Custom CSS hacks | ✓ Clean | ✓ Using Blowfish schemes only |
| Hardcoded navigation | ✓ Clean | ✓ Config-driven menus |
| Static data | ✓ Clean | ✓ All in data/ YAML files |

---

### 1.4 Hugo Build Performance

```
Build Result: ✅ CLEAN
├── Pages: 192 RU + 9 EN + 9 UZ = 210 total
├── Build Time: ~150-200ms
├── Errors: 0
├── Warnings: 1 (Blowfish version, non-critical)
└── Output: public/ (clean, no artifacts)
```

---

### 1.5 Frontmatter CMS Integration Status

| Aspect | Status | Notes |
|--------|--------|-------|
| Framework detection | ✓ Configured | Hugo detected, correct start command |
| i18n support | ✓ Configured | RU/EN/UZ paths defined |
| Content types | ⚠️ Partial | Blog, Project, Service, Platform, Page — but missing Blowfish fields |
| Data file editing | ✓ Configured | Company, Social, Stats via UI |
| Preview server | ✓ Configured | localhost:1313 |
| Git integration | ✓ Enabled | Auto-commit on publish |
| Snippets | ✓ Defined | Button, Alert, Badge (Blowfish) |
| Page folders | ✓ Configured | All 12 language+section combos mapped |

---

## PHASE 2: FRONTMATTER CMS INTEGRATION & ENHANCEMENT

### 2.1 Missing Blowfish-Specific Fields in Content Types

**Current Problem**: frontmatter.json defines generic fields, but misses Blowfish/Hugo SEO features

**Required additions for ALL content types:**

```json
// MINIMAL SEO FIELDS (required in all types)
{ "title": "SEO Title", "name": "seoTitle", "type": "string", "description": "Custom title for search results (60 chars max)" },
{ "title": "SEO Description", "name": "description", "type": "string", "description": "Meta description for search results (160 chars)" },
{ "title": "Canonical URL", "name": "canonicalUrl", "type": "string", "description": "Optional canonical URL" },

// OPEN GRAPH & TWITTER (recommended for social sharing)
{ "title": "OG Title", "name": "ogTitle", "type": "string", "description": "Title for social media" },
{ "title": "OG Image", "name": "ogImage", "type": "image", "description": "Image for social media cards" },
{ "title": "Featured Image", "name": "image", "type": "image", "description": "Featured image (used in lists, OG fallback)" },

// BLOWFISH ARTICLE-SPECIFIC (for blog/articles)
{ "title": "Show Hero", "name": "showHero", "type": "boolean", "default": true },
{ "title": "Hero Style", "name": "heroStyle", "type": "choice", "choices": ["basic", "background", "image"] },
{ "title": "Show TOC", "name": "showTableOfContents", "type": "boolean", "default": true },
{ "title": "Show Related", "name": "showRelatedContent", "type": "boolean", "default": true },

// BLOWFISH VISIBILITY CONTROLS
{ "title": "Draft", "name": "draft", "type": "draft" },
{ "title": "Publish Date", "name": "date", "type": "datetime", "required": true },
{ "title": "Expiration Date", "name": "expiryDate", "type": "datetime" },
```

---

### 2.2 Proposed Enhanced frontmatter.json Structure

**Content Types** that MUST be added/enhanced:

1. **blog** — Articles with dates, authors, SEO
2. **project** — Portfolio with client, year, SEO
3. **service** — Service pages with features
4. **platform** — Platform feature descriptions
5. **page** — Static pages (about, terms, privacy)
6. **homepage** — Special type for homepage configuration
7. **menu-item** — (Optional) For mega-menu management
8. **testimonial** — (New) Client testimonials

---

### 2.3 Mandatory Data File Enhancements

**Current data files** (✓ Good):
- `data/company.yaml` — Basic info
- `data/social.yaml` — Links
- `data/stats.yaml` — Homepage counters

**Missing data files** (🔴 Critical):
- `data/seo.yaml` — Global SEO defaults
- `data/branding.yaml` — Color, typography, brand assets
- `data/menus.yaml` — (Optional, if mega-menu planned)

---

## PHASE 3: SEO OPTIMIZATION (NATIVE HUGO)

### 3.1 Current SEO Configuration

| Feature | Status | Details |
|---------|--------|---------|
| `enableRobotsTXT` | ✓ true | robots.txt will be generated |
| `sitemap.xml` | ✓ Auto | Hugo auto-generates via `_default/sitemap.xml` output |
| `canonicalUrl` | ❌ Missing | Not in frontmatter, should be optional per-page |
| `title` | ✓ Set | "RailTech" in hugo.toml |
| Meta `description` | ⚠️ Partial | Using page `.Description` (from content), but no default |
| Open Graph | ⚠️ Missing | Not in extend-head.html, needs setup |
| Twitter Cards | ❌ Missing | Not configured |
| Language alternates | ✓ Auto | Blowfish handles hreflang |

### 3.2 Required SEO Additions to hugo.toml

```toml
# Global SEO section
[params.seo]
defaultTitle = "RailTech — Railroad Equipment & Solutions"
defaultDescription = "Leading supplier of high-quality industrial equipment and consulting services in Uzbekistan"
defaultOgImage = "img/og-default.png"  # Fallback OG image
twitterHandle = "@railtech"  # If applicable
siteAuthor = "RailTech LLC"

# Structured data (schema.org)
[params.schema]
type = "Organization"
name = "RailTech LLC"
url = "https://railtech.uz/"
logo = "img/brand/railtech-logo.svg"
```

### 3.3 Open Graph & Twitter Card Setup

**Action**: Update `layouts/partials/extend-head.html` to render:
- `og:title`, `og:description`, `og:image`, `og:url`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Use page frontmatter fields or fallback to defaults

---

## PHASE 4: CORPORATE REDESIGN ASSESSMENT

### 4.1 Current Design Status

| Element | Implementation | Status |
|---------|-----------------|--------|
| **Color Scheme** | `assets/css/schemes/railtech.css` | ✓ Custom colors (orange primary, zinc neutral) |
| **Typography** | Blowfish defaults (Inter, Fira Code) | ✓ Professional |
| **Dark Mode** | defaultAppearance = "dark" | ✓ Set correctly |
| **Navigation** | Config-driven menus | ✓ Clean, no hardcode |
| **Footer** | `layouts/partials/extend-footer.html` | ✓ Custom, data-driven |
| **Homepage** | `layouts/partials/home/custom.html` | ✓ Custom, professional |
| **Contact Form** | `layouts/contact/list.html` | ✓ Web3Forms integration |

### 4.2 Design Strengths ✓

- Premium dark theme appropriate for B2B
- Orange accent (#f97316) distinctive and professional
- Proper accessibility (WCAG 2.1 AA contrast)
- Responsive mobile-first design
- No CSS hardcodes, only Tailwind

### 4.3 Recommendations for Enhancement

1. **Corporate Homepage**: Consider Blowfish `hero` shortcode for better section structure
2. **Service Pages**: Use Blowfish grid/card components for consistency
3. **Blog Styling**: Leverage Blowfish's built-in article styling
4. **CTA Sections**: Use Blowfish callout/alert components for CTAs

---

## SUMMARY TABLE: What Needs Action

| Phase | Task | Priority | Effort | CMS Impact |
|-------|------|----------|--------|-----------|
| 2 | Enhance frontmatter.json with SEO fields | 🔴 CRITICAL | 4h | High — enables full CMS SEO control |
| 2 | Create data/seo.yaml | 🔴 CRITICAL | 1h | High — enables CMS SEO UI |
| 3 | Add SEO config to hugo.toml | 🔴 CRITICAL | 2h | High — SEO metadata control |
| 3 | Update extend-head.html with OG/Twitter | 🔴 CRITICAL | 2h | High — social sharing |
| 4 | Test homepage design on mobile | 🟡 Medium | 1h | Low — visual polish |
| All | Remove Blowfish version warning | 🟡 Medium | 0.5h | None — CI/CD clean |

---

## RECOMMENDED NEXT STEPS

1. **Immediately** (Next session):
   - Rewrite frontmatter.json with enhanced Blowfish fields
   - Create data/seo.yaml with global SEO defaults
   - Update hugo.toml with SEO params section

2. **Short term** (Phase 3):
   - Implement OG/Twitter Card metadata in templates
   - Set up Frontmatter CMS data file UI for seo.yaml
   - Test sitemap.xml and robots.txt generation

3. **Medium term** (Phase 4):
   - Enhance homepage with Blowfish components
   - Create Frontmatter snippets for common content patterns
   - Train content team on CMS workflow

---

**Prepared by**: Senior Hugo Developer
**Date**: 2026-03-26
**Severity**: 3/5 (Functional, but enterprise-ready improvements needed)
