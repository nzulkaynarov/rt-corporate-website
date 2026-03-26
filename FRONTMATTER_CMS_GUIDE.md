# Frontmatter CMS Complete Guide
## RailTech Content Management System

**For**: Content managers, editors, marketers
**Updated**: 2026-03-26
**Version**: 2.0 (Integrated with Blowfish Theme)

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard Overview](#dashboard-overview)
3. [Content Types & Fields](#content-types--fields)
4. [SEO Management](#seo-management)
5. [Creating Content](#creating-content)
6. [Media Management](#media-management)
7. [Publishing Workflow](#publishing-workflow)
8. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Getting Started

### Prerequisites
- VS Code installed on your computer
- Frontmatter CMS extension (installed)
- Git access to the repository
- Hugo server running locally: `hugo server -D`

### First Time Setup

1. **Open project in VS Code**
   ```bash
   cd /path/to/rt-corporate-website
   code .
   ```

2. **Start Hugo dev server**
   ```bash
   hugo server -D
   ```
   Website will be available at: `http://localhost:1313/`

3. **Frontmatter Dashboard opens automatically**
   - If not, press: `Ctrl+K` → search "Frontmatter" → click "Open dashboard"

---

## Dashboard Overview

### Left Sidebar
- **📁 Content Folders**: Browse blog, projects, services, platform, pages (per language)
- **🏷️ Tags**: Filter content by tags
- **📂 Categories**: Filter by categories
- **⚙️ Data Files**: Edit global settings (Company, Social, SEO)

### Center Panel
- **Content Cards**: List of articles, projects, services, etc.
- **Search**: Find content by title
- **Sorting**: Change sort order (newest, oldest, A-Z, by weight)
- **Filtering**: Filter by language, tags, categories, draft status

### Right Panel
- **Preview**: Live preview of the page at localhost:1313
- **Edit**: Full editor with YAML frontmatter + Markdown content
- **Metadata**: Quick SEO checks (title length, description length)

---

## Content Types & Fields

### 1️⃣ BLOG POSTS

**Location**: Blog (RU/EN/UZ)
**Purpose**: News, articles, tutorials, case studies

#### Required Fields
- **Title** — Article heading (appears in search results)
- **Date** — Publication date (auto-filled with today)
- **Description** — Meta description (appears in Google search snippet)

#### SEO Fields (Important!)
- **SEO Title** — Custom title for search results (leave empty to use main title)
- **OG Image** — Image for social media sharing (1200x630px recommended)
- **Canonical URL** — If article published elsewhere, set to original URL

#### Organization
- **Tags** — Add: railway, equipment, technology, consulting, etc.
- **Categories** — Add: Blog, News, Tutorial, Case Study
- **Article Type** — Article, News, Tutorial, Case Study, Opinion
- **Difficulty** — Beginner, Intermediate, Advanced (optional)

#### Display Options
- **Show Hero** ✓ Display hero image at top
- **Hero Style** — basic, background, or image
- **Show TOC** ✓ Show table of contents
- **Show Related** ✓ Show related articles

#### Author & Media
- **Author** — Defaults to "RailTech" (change if needed)
- **Featured Image** — Main article image

#### Status
- **Draft** — ☐ Unchecked = Published | ☑ Checked = Hidden from site

---

### 2️⃣ PROJECTS (Portfolio)

**Location**: Projects (RU/EN/UZ)
**Purpose**: Showcase completed work, case studies

#### Key Fields
- **Title** — Project name
- **Description** — Short overview (meta description)
- **Client** — Client name
- **Year** — Completion year (YYYY)
- **Scope** — What was done (equipment supplied, services provided)
- **Status** — Completed, In Progress, Planning

#### SEO
- **SEO Title** — Custom search result title
- **Featured Image** — Project photo/screenshot
- **OG Image** — Social media image

#### Organization
- **Category** — Railway Infrastructure, Consulting, Supply Chain, etc.
- **Weight** — Order of appearance (lower number = first)
- **Tags** — railway, equipment, consulting, etc.

---

### 3️⃣ SERVICES

**Location**: Services (RU/EN/UZ)
**Purpose**: Describe service offerings (Engineering, Consulting, Supplies)

#### Key Fields
- **Title** — Service name
- **Description** — Service description (meta description)
- **Features** — Bullet-point list of key features
- **Icon** — Small icon/image for service card
- **Weight** — Display order (lower = first)

#### SEO
- **SEO Title** — Custom search title
- **Featured Image** — Full-width hero image
- **OG Image** — Social sharing image

---

### 4️⃣ PLATFORM FEATURES

**Location**: Platform (RU/EN/UZ)
**Purpose**: Describe B2B platform features (Catalog, Deals, Analytics)

#### Key Fields
- **Title** — Feature name
- **Description** — Feature description
- **Tag** — Grouping tag (e.g., "Catalog", "Analytics")
- **Highlights** — Key benefits (list)
- **Image** — Feature screenshot
- **Weight** — Display order

#### SEO
- **SEO Title** — Custom search title
- **OG Image** — Social sharing image

---

### 5️⃣ PAGES (Static Content)

**Location**: Pages (RU/EN/UZ)
**Purpose**: About, Privacy, Terms, Contact (non-blog pages)

#### Key Fields
- **Title** — Page name
- **Description** — Meta description
- **Image** — Hero image
- **Show Hero** — Display hero section
- **Show Breadcrumbs** — Display breadcrumb navigation

#### SEO
- **SEO Title** — Custom search title
- **OG Image** — Social sharing image
- **Canonical URL** — If needed

---

## SEO Management

### 🔍 Global SEO Settings

**Location**: Dashboard → Data Files → "Global SEO Settings" (seo.yaml)

#### Available Settings
- **Site Title** — Default page title template
- **Site Description** — Default meta description
- **Fallback OG Image** — Default social sharing image
- **Twitter Handle** — Your Twitter account (@railtech)
- **robots.txt rules** — Which pages to index
- **Sitemap configuration** — Auto-generated sitemap.xml

**Note**: Changes here apply site-wide. Page-level SEO (in each article) overrides these defaults.

### 📄 Page-Level SEO

Every content type includes these fields:

1. **SEO Title** (optional)
   - Custom title for Google search results
   - **Recommended**: 50-60 characters
   - Leave empty to use main title

2. **Description**
   - Meta description (appears in search results)
   - **Required**: Should be 120-160 characters
   - **Pro tip**: Make it compelling — it drives clicks!

3. **Featured Image**
   - Appears in article header
   - Used as fallback for social sharing

4. **OG Image** (optional)
   - Custom image for Facebook, LinkedIn, Twitter
   - **Recommended size**: 1200×630 pixels
   - Defaults to Featured Image if not set

5. **Canonical URL** (optional)
   - If article published on multiple sites
   - Tells Google which version is "original"

### ✅ SEO Checklist Before Publishing

- [ ] Title is compelling and under 60 chars
- [ ] Description is 120-160 chars
- [ ] Featured image added (at least 1200px wide)
- [ ] Keywords naturally included in title and description
- [ ] Internal links added to related content
- [ ] External links (if any) point to authority sources

---

## Creating Content

### Step-by-Step: Write a Blog Article

1. **Open Dashboard** → Select "Blog (RU)" folder
2. **Click "+" button** → Create new file
3. **Fill in required fields**:
   - Title: "New Article About Railway Equipment"
   - Date: Auto-filled (today)
   - Description: "Meta description text here..."
   - Featured Image: Upload or select image
4. **Add SEO details**:
   - SEO Title: (leave empty if main title is good)
   - OG Image: (if different from featured image)
   - Tags: railway, equipment, technology
   - Category: Blog or News
5. **Write content** in Markdown editor below
6. **Add header 2 & 3 headings** (used for TOC and SEO)
7. **Internal links**: Link to /services/, /about/, other blog posts
8. **Review** in right panel (live preview at localhost:1313)
9. **Save** (Ctrl+S) — auto-commits to Git
10. **Publish** by unchecking "Draft"

### Using Shortcodes (Content Blocks)

Insert pre-designed blocks via **Snippets** (Ctrl+Space):

#### Button CTA
```
{{< button href="/contact/" target="_self" >}}
Contact Us Today
{{< /button >}}
```

#### Alert/Callout
```
{{< alert "check" >}}
This is an important note about the content.
{{< /alert >}}
```

#### Badge
```
{{< badge >}}New Feature{{< /badge >}}
```

#### Multi-Column Layout
```
{{< columns >}}
Left column content here...
<---->
Right column content here...
{{< /columns >}}
```

---

## Media Management

### Where to Store Images

**Blog articles**: `/static/img/blog/`
**Projects**: `/static/img/projects/`
**Services**: `/static/img/services/`
**General**: `/static/img/general/`

### Recommended Image Sizes

| Use Case | Size | Format | Quality |
|----------|------|--------|---------|
| Featured Image (article) | 800x450px | JPG | 80% quality |
| OG/Social Card | 1200x630px | JPG | 85% quality |
| Service Icon | 400x300px | PNG | 100% (transparent bg) |
| Hero Banner | 1920x1080px | JPG | 80% quality |
| Thumbnail | 400x300px | JPG | 80% quality |

### Upload via CMS

1. Click **Featured Image** or **OG Image** field
2. Click **Upload** button
3. Select file from your computer
4. Frontmatter CMS saves to `/static/img/` automatically
5. Image path auto-filled in field

---

## Publishing Workflow

### Draft → Published

1. **Write article** with `draft: true`
2. **Review** in preview panel
3. **Final check**: SEO title, description, images
4. **Uncheck "Draft"** checkbox
5. **Save** (Ctrl+S)
6. **Refresh** browser at localhost:1313
7. **Article appears** in blog list

### Scheduling (Optional)

Set `date` field to future date:
- Article won't appear until that date
- Hugo automatically publishes on that date
- Use for planned announcements

### Republishing

Change `lastmod` date to update "Last Modified" on article:
- Signals search engines that content was updated
- Improves SEO for evergreen content

---

## Data Files (Global Settings)

### 📇 Edit Company Info

**Dashboard** → Data Files → "Company Information"

Fields:
- Brand Name
- Legal Name (RU/EN/UZ)
- Founding Year
- Business Hours

**Used in**: Footer, schema.org markup, legal pages

### 🌍 Social Media Links

**Dashboard** → Data Files → "Social Media Links"

- Telegram URL
- Facebook URL
- Instagram URL
- LinkedIn URL

**Used in**: Footer icons, schema.org, share buttons

### 📊 Homepage Statistics

**Dashboard** → Data Files → "Homepage Statistics"

- Years on Market (e.g., "5+")
- Number of Partners (e.g., "120+")
- SKUs in Catalog (e.g., "500+")
- Countries Served (e.g., "3")

**Used in**: Homepage hero section, social proof

### ⚙️ Global SEO Settings

**Dashboard** → Data Files → "Global SEO Settings"

- Default page title
- Default meta description
- Fallback OG image
- Twitter handle
- robots.txt rules

**Pro tip**: Changes here apply to all pages that don't override these settings.

---

## FAQ & Troubleshooting

### Q: How do I preview my changes?
**A:** Hugo server runs at `http://localhost:1313/`. Changes auto-update. Refresh browser (F5) to see updates.

### Q: What if my image doesn't appear?
**A:**
1. Check image path in frontmatter (must match `/static/img/...`)
2. Restart Hugo server (Ctrl+C, then `hugo server -D`)
3. Clear browser cache (Ctrl+Shift+Delete)

### Q: How do I add internal links?
**A:** Use Markdown links: `[Link text](/services/)` or `[Blog post](/blog/article-slug/)`

### Q: Can I schedule posts?
**A:** Yes! Set `date` to a future date. Hugo will publish automatically on that date.

### Q: How do I translate content to EN/UZ?
**A:**
1. Create the same file structure in `/content/en/` or `/content/uz/`
2. Same filename, translated content
3. Example: `/content/ru/blog/my-article.md` → `/content/en/blog/my-article.md`

### Q: What's the difference between Description and SEO Title?
**A:**
- **Title** = Page heading (visible on site)
- **SEO Title** = What appears in Google search results (can be different)
- **Description** = Preview text in search results

### Q: How do I know if my SEO is good?
**A:** Frontmatter CMS shows SEO checks:
- ✅ Title length: 30-60 chars (green = good)
- ✅ Description: 120-160 chars (green = good)
- ✅ Content length: 300+ words recommended

### Q: Images are uploading but showing as broken links?
**A:**
1. Make sure Hugo server is running
2. Images must be in `/static/img/` folder
3. Path in frontmatter must be relative: `img/blog/my-image.jpg`

### Q: How do I change the site color scheme?
**A:** Color scheme is configured in `hugo.toml` (`colorScheme = "railtech"`). Contact developer to change.

---

## Support & Resources

- **Hugo Documentation**: https://gohugo.io/documentation/
- **Blowfish Theme Docs**: https://blowfish.page/
- **Frontmatter CMS**: https://frontmatter.codes/
- **Markdown Guide**: https://www.markdownguide.org/

---

**Last Updated**: 2026-03-26
**Version**: 2.0 (Enhanced with Blowfish SEO integration)
