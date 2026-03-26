# SEO Implementation Guide
## RailTech Hugo + Blowfish SEO Optimization

**For**: Developers, SEO specialists, content team
**Version**: 2.0 (Phase 3 Complete)
**Updated**: 2026-03-26

---

## 📋 Overview

This guide documents all SEO features implemented in the RailTech website. All features are **natively built into Hugo and Blowfish** — no custom hacks or third-party dependencies.

---

## ✅ Implemented SEO Features

### 1. **Open Graph (OG) Meta Tags**

OG tags enable rich previews when content is shared on social media (Facebook, LinkedIn, Twitter, etc.).

**Files**: `layouts/sitemap.xml`, `themes/blowfish/layouts/partials/head.html` (built-in)

**Generated Tags** (auto-filled from page frontmatter):
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Page description...">
<meta property="og:image" content="https://railtech.uz/img/featured-image.jpg">
<meta property="og:url" content="https://railtech.uz/blog/article/">
<meta property="og:type" content="article">
<meta property="og:site_name" content="RailTech">
```

**How It Works**:
- **og:title** = `seoTitle` field in frontmatter (or `title` if not set)
- **og:description** = `description` field in frontmatter
- **og:image** = `ogImage` field (or `image` as fallback)
- **og:type** = "article" for blog/pages, "website" for homepage

**What to Configure**:
- When creating content, fill in `ogImage` field for custom social media image
- Recommended size: **1200×630 pixels** (optimal for all platforms)

---

### 2. **Twitter Card Tags**

Twitter cards display rich previews when links are shared on Twitter/X.

**Generated Tags**:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@railtech">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://railtech.uz/img/featured-image.jpg">
```

**Configuration**:
- **Twitter handle** set in `hugo.toml` → `[params.seo]` → `twitterHandle = "@railtech"`
- Card type: `summary_large_image` (best for blog articles)
- Images auto-pulled from OG image settings

**Testing**:
- Twitter Card Validator: https://cards-dev.twitter.com/validator

---

### 3. **Canonical URLs**

Canonical tags tell search engines which version is the "original" when content appears on multiple URLs.

**Use Cases**:
- Syndicated articles (published on multiple sites)
- Duplicate content prevention
- Consolidating domain variations

**Implementation**:
```yaml
# In article frontmatter:
canonicalUrl: "https://original-site.com/article/"
```

**Default Behavior**: If `canonicalUrl` is not set, Hugo uses the page's own URL as canonical.

**When to Use**:
- Usually NOT needed for RailTech (we control all content)
- Use only if republishing content from other sources

---

### 4. **robots.txt Configuration**

`robots.txt` tells search engines which pages to crawl and index.

**Location**: `/public/robots.txt` (auto-generated from `layouts/robots.txt`)

**Current Rules**:
```
User-agent: *           # All crawlers
Allow: /                # Index everything
Disallow: /admin        # Don't crawl admin pages
Disallow: /private      # Don't crawl private pages
Disallow: /*.pdf$       # Don't crawl PDFs (optional)
Disallow: *?utm_*       # Don't crawl campaign URLs
```

**Special Rules**:
```
User-agent: GPTBot      # Block ChatGPT crawler
User-agent: CCBot       # Block Common Crawl
User-agent: Googlebot   # Allow Google (optional)
```

**Editing**:
- Edit `layouts/robots.txt`
- Rebuild site: `hugo`
- Check generated: `public/robots.txt`

**Testing**:
- Google Search Console: Settings → Crawl → robots.txt
- Bing Webmaster Tools: Crawl Control → Disallow

---

### 5. **Sitemap.xml**

Sitemaps list all pages on the website for search engines to discover and index.

**Location**: `/public/sitemap.xml` (auto-generated)

**Structure**:
- Main index: `sitemap.xml` (lists all language sitemaps)
- Language sitemaps: `ru/sitemap.xml`, `en/sitemap.xml`, `uz/sitemap.xml`

**Included Information** (per page):
- **URL**: Page canonical URL
- **Last Modified**: Date page was last updated
- **Change Frequency**: `weekly` (homepage), `monthly` (articles), `monthly` (services)
- **Priority**: `1.0` (homepage), `0.8` (articles/services), `0.7` (pages)
- **hreflang**: Language alternates (multilingual SEO)
- **Images**: Featured image metadata (for image search)

**Submission**:
- Google Search Console: Settings → Sitemaps → Add new sitemap
  - URL: `https://railtech.uz/sitemap.xml`
- Bing Webmaster Tools: Sitemaps → Submit sitemap
- Update automatically when content is published

**Customization** (if needed):
- Edit `layouts/sitemap.xml`
- Adjust priorities, change frequency per content type
- Modify excluded page types

---

### 6. **Hreflang Tags** (Multilingual SEO)

Hreflang tags tell Google which page is the "correct version" for each language.

**Generated Tags** (in `<head>`):
```html
<link rel="alternate" hreflang="ru" href="https://railtech.uz/">
<link rel="alternate" hreflang="en" href="https://railtech.uz/en/">
<link rel="alternate" hreflang="uz" href="https://railtech.uz/uz/">
<link rel="alternate" hreflang="x-default" href="https://railtech.uz/">
```

**How It Works**:
- Hugo automatically generates for all `AllTranslations`
- Google uses this to serve correct language to users
- Prevents duplicate content penalties

**What It Does**:
- ✅ User in Russia sees Russian version
- ✅ User in UK sees English version
- ✅ User in Uzbekistan sees Uzbek version

**Status**: ✅ Automatically implemented, no action needed

---

### 7. **Schema.org Structured Data** (JSON-LD)

Structured data helps Google understand page content and generate rich results (knowledge panels, featured snippets, etc.).

**Files**: `layouts/partials/schema-org.html`

**Implemented Schemas**:

#### **Organization Schema**
```json
{
  "@type": "Organization",
  "name": "RailTech LLC",
  "url": "https://railtech.uz",
  "logo": "https://railtech.uz/img/brand/railtech-logo.svg",
  "contactPoint": {
    "telephone": "+998 90 118-90-00",
    "email": "info@railtech.uz"
  },
  "address": "Tashkent, Uzbekistan"
}
```
**Used On**: All pages (in `<head>`)

#### **BlogPosting Schema** (for articles)
```json
{
  "@type": "BlogPosting",
  "headline": "Article Title",
  "description": "...",
  "image": "https://railtech.uz/img/...",
  "datePublished": "2026-03-26",
  "author": { "@type": "Person", "name": "RailTech" }
}
```
**Used On**: All blog posts

#### **LocalBusiness Schema** (for services)
```json
{
  "@type": "LocalBusiness",
  "name": "RailTech",
  "telephone": "+998 90 118-90-00",
  "address": "Tashkent",
  "areaServed": ["UZ", "RU", "KZ", "TJ", "TM"]
}
```
**Used On**: Services & contact pages

#### **BreadcrumbList Schema**
```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "position": 1, "name": "Home", "item": "https://railtech.uz/" },
    { "position": 2, "name": "Blog", "item": "https://railtech.uz/blog/" },
    { "position": 3, "name": "Article", "item": "https://railtech.uz/blog/article/" }
  ]
}
```
**Used On**: All non-home pages

**Testing**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/
- Paste URL → Check for errors/warnings

**Best Practices**:
- ✅ Keep data accurate (especially dates, contact info)
- ✅ Update schema if page information changes
- ✅ Use most recent schema.org version

---

## 🛠️ Managing SEO Settings

### Global SEO Configuration

**File**: `data/seo.yaml` (edited via Frontmatter CMS)

**Editable Fields**:
- `site.name` — Site name (used in schema.org)
- `site.title` — Default page title
- `site.description` — Default meta description
- `site.ogImage` — Fallback OG image
- `seo.defaultRobots` — Default robots directive
- `openGraph.enabled` — Enable/disable OG tags
- `twitter.handle` — Twitter account
- `verification.googleSiteVerification` — Google Search Console token
- `robots.rules` — Custom crawl rules

### Per-Page SEO Settings

Every content type includes:

| Field | Purpose | Example |
|-------|---------|---------|
| **seoTitle** | Custom search result title | "Best Railway Equipment 2026" |
| **description** | Meta description (160 chars) | "Leading supplier of..." |
| **ogImage** | Social sharing image | `img/og-custom.jpg` |
| **canonicalUrl** | Original URL (if syndicated) | `https://original-site.com/...` |
| **keywords** | Search keywords (optional) | "railway, equipment, supplies" |

---

## 📊 Monitoring SEO Performance

### Google Search Console

**Setup**:
1. Go to https://search.google.com/search-console
2. Add property: `https://railtech.uz`
3. Verify via DNS or HTML file
4. Submit sitemap: `https://railtech.uz/sitemap.xml`

**Monitor**:
- **Performance**: Search queries, CTR, average position
- **Coverage**: Indexed vs. excluded pages
- **Enhancements**: Rich results, AMP, mobile usability
- **Security**: Malware, hacking issues

### Bing Webmaster Tools

**Setup**:
1. Go to https://www.bing.com/webmaster
2. Add site
3. Verify ownership
4. Submit sitemap

**Monitor**:
- Crawl stats
- Keyword research
- Inbound links

### Local Testing

**Tools**:
- Google Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/
- Lighthouse: Chrome DevTools → Lighthouse
- SEMrush, Ahrefs, Moz (optional)

**Test Checklist**:
- [ ] All pages have meta descriptions
- [ ] Images have alt text
- [ ] Mobile viewport configured
- [ ] Site loads in <3 seconds
- [ ] No broken links (404 errors)
- [ ] Schema.org validation passes
- [ ] robots.txt allows crawling
- [ ] Sitemap submitted

---

## 🔍 SEO Best Practices

### Content Optimization

1. **Titles & Descriptions**
   - Title: 50-60 characters (custom via `seoTitle`)
   - Description: 120-160 characters (via `description`)
   - Include primary keyword in title and description

2. **Headings**
   - Use H2/H3 hierarchically (not H4 after H2)
   - Include keywords naturally
   - Don't keyword stuff

3. **Images**
   - Use descriptive filenames: `railway-equipment-catalog.jpg` (not `image1.jpg`)
   - Add alt text (in Frontmatter CMS)
   - Compress: <200KB for web (< 50KB ideal)
   - Recommended sizes:
     - Featured image: 800×450px
     - OG image: 1200×630px
     - Hero image: 1920×1080px

4. **Internal Linking**
   - Link to 2-3 related articles
   - Use descriptive anchor text (not "click here")
   - Link to service pages from articles

5. **Content Length**
   - Blog posts: 300+ words (1500+ recommended)
   - Service pages: 200+ words
   - Pillar pages: 2000+ words

### Technical SEO

1. **Mobile-Friendly**
   - ✅ Responsive design (Blowfish built-in)
   - ✅ Fast load time (<3s)
   - ✅ Readable font sizes

2. **Page Speed**
   - Optimize images (use WebP format)
   - Enable gzip compression
   - Minimize CSS/JS
   - Use CDN for static assets

3. **SSL/HTTPS**
   - ✅ All pages use HTTPS
   - ✅ Redirect HTTP to HTTPS

4. **Sitemap & robots.txt**
   - ✅ robots.txt configured
   - ✅ Sitemap submitted to Google/Bing
   - ✅ No blocking of important pages

5. **Structured Data**
   - ✅ Schema.org implemented
   - ✅ Validation passes
   - ✅ Rich results enabled

---

## 🚀 Future Enhancements

**Optional** (nice-to-have):

1. **Rich Snippets**
   - FAQSchema for FAQ pages
   - ProductSchema for product listings
   - ReviewSchema for testimonials

2. **AMP Pages**
   - Accelerated Mobile Pages (if needed)

3. **Core Web Vitals**
   - Monitor LCP, FID, CLS
   - Optimize for "Good" rating

4. **International SEO**
   - Already implemented via hreflang
   - Consider geo-targeting in GSC

5. **Link Building**
   - Create valuable content
   - Reach out to industry sites
   - Guest posting opportunities

---

## 📞 Support & References

**Documentation**:
- Hugo Docs: https://gohugo.io/content-management/
- Blowfish Theme: https://blowfish.page/
- Schema.org: https://schema.org/

**Tools**:
- Google Search Console: https://search.google.com/search-console
- Bing Webmaster: https://www.bing.com/webmaster
- Rich Results Test: https://search.google.com/test/rich-results
- PageSpeed Insights: https://pagespeed.web.dev/

**Questions**:
- Frontmatter CMS: See FRONTMATTER_CMS_GUIDE.md
- Content structure: See TECHNICAL_AUDIT.md
- Hugo issues: See CLAUDE.md

---

**Version**: 2.0
**Last Updated**: 2026-03-26
**Status**: ✅ Production Ready
