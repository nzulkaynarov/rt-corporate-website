---
name: railtech-content
description: "Manage RailTech website content — create blog posts, projects, services, and platform pages in all 3 languages (ru/en/uz). Use this skill whenever the user asks to add, edit, or translate content for the RailTech Hugo website. Triggers: new blog post, add project, create service page, translate content, update FAQ, edit about page, modify homepage, write article."
---

# RailTech Content Management Skill

## Overview
This skill handles all content creation, editing, and translation for the RailTech Hugo website. The project supports three languages: Russian (default), English, and Uzbek.

## Content Types

### 1. Blog Posts

**Location**: `content/{lang}/blog/post-slug.md`

**Frontmatter Template**:
```yaml
---
title: "Post Title"
description: "SEO meta description (155-160 chars recommended)"
date: 2024-11-20
author: "RailTech"
image: /img/blog/post-slug.jpg
tags: ["Tag1", "Tag2", "Tag3"]
categories: ["Category Name"]
draft: false
---
```

**Guidelines**:
- Slugs must be lowercase with hyphens (e.g., `automation-benefits`)
- Description is critical for SEO
- Image should be 1200x600px (landscape aspect ratio)
- Tags and categories help with navigation and filtering
- Post content written in Markdown below frontmatter
- Publish date determines order (newest first)

**Workflow**:
1. Create post in Russian: `content/blog/post-slug.md`
2. Translate to English: `content/en/blog/post-slug.md`
3. Translate to Uzbek: `content/uz/blog/post-slug.md`
4. Use identical filenames and date
5. Adjust title/description/content for each language
6. Place image in `static/img/blog/post-slug.jpg`

---

### 2. Projects

**Location**: `content/{lang}/projects/project-slug.md`

**Frontmatter Template**:
```yaml
---
title: "Project Name"
description: "Brief project description for listing"
image: /img/projects/project-slug.jpg
client: "Client Organization Name"
year: "2024"
scope: "Key scope points: Equipment supplied, Installation, Training"
status: "completed" # or "in_progress"
category: "Equipment Supply" # or "Installation", "Consultation", etc.
weight: 1
---
```

**Guidelines**:
- Image should be 800x600px minimum
- Scope should highlight key deliverables
- Status affects visibility/styling on projects page
- Weight determines ordering (lower = higher priority)
- Client name should match actual customer
- Category enables filtering on project listing

**Workflow**:
1. Create in all three languages with identical structure
2. Use same filename and image
3. Customize title, description, scope, and content per language
4. Ensure client name is consistent across languages

---

### 3. Services

**Location**: `content/{lang}/services/service-slug.md`

**Frontmatter Template**:
```yaml
---
title: "Service Name"
description: "Service description for listing"
weight: 1
icon: "svg-icon-name"
features:
  - "Feature 1"
  - "Feature 2"
  - "Feature 3"
draft: false
---
```

**Guidelines**:
- Weight determines display order (1, 2, 3...)
- Icon name should match an SVG icon available in templates
- Features array lists key service benefits
- Services appear on services listing page and sometimes on homepage
- Keep description concise (80-160 chars)

**Available Icons**: Check `layouts/partials/service-card.html` for available icon mappings
- Common icons: `equipment`, `installation`, `training`, `support`, `consultation`, `logistics`

**Workflow**:
1. Create service skeleton with identical structure
2. Customize features and content per language
3. Set consistent weight across all language versions

---

### 4. Platform Features

**Location**: `content/{lang}/platform/feature-slug.md`

**Frontmatter Template**:
```yaml
---
title: "Feature Name"
description: "Feature description"
weight: 1
tag: "Category" # e.g., "Inventory", "Analytics", "Integration"
image: /img/platform/feature-slug.jpg
highlights:
  - "Key benefit 1"
  - "Key benefit 2"
  - "Key benefit 3"
draft: false
---
```

**Guidelines**:
- Images should be 600x400px (or 16:9 aspect ratio)
- Tag groups features by category
- Highlights are key selling points
- Weight controls display order
- Used for platform/product feature showcase

---

## Translation Workflow

**Golden Rule**: Same filename, different language folder, translated content

**Step-by-Step**:

1. **Create Russian version first**
   ```
   content/blog/my-post.md
   ```

2. **Copy to English**
   ```
   content/en/blog/my-post.md
   ```
   - Keep frontmatter structure identical
   - Translate all text fields: title, description, tags, content
   - Keep date and image paths identical

3. **Copy to Uzbek**
   ```
   content/uz/blog/my-post.md
   ```
   - Same structure as English version
   - Full Uzbek translation of all text

**Example**:
```
Russian:   content/blog/equipment-selection.md
English:   content/en/blog/equipment-selection.md
Uzbek:     content/uz/blog/equipment-selection.md
Image:     static/img/blog/equipment-selection.jpg (shared)
```

---

## Image Handling

### Image Paths
- Always use absolute paths starting with `/img/`
- Example: `/img/blog/post-name.jpg`
- All images in `static/img/` directory

### Directory Organization
```
static/img/
  blog/              — Blog post featured images
  projects/          — Project showcase images
  platform/          — Platform feature screenshots
  partners/          — Partner logos
  hero/              — Homepage hero section images
  icons/             — SVG icons (referenced in markup)
```

### Image Sizes & Formats
- **Blog images**: 1200x600px (landscape), JPEG, max 300KB
- **Project images**: 800x600px, JPEG, max 250KB
- **Platform/Feature**: 600x400px or 1200x800px, JPEG, max 250KB
- **Partner logos**: 200x100px, PNG with transparency, max 100KB
- **Hero images**: 1920x1080px, JPEG/WebP, max 400KB

### Naming Conventions
- Use kebab-case: `equipment-catalog-2024.jpg`
- Keep filenames descriptive and unique
- No spaces or special characters

### Optimization Checklist
- Compress images before uploading
- Use JPEG for photos, PNG for graphics with transparency
- Set alt text in markdown if displaying directly

---

## FAQ Management

FAQ content lives in the homepage frontmatter at `content/{lang}/_index.md`

**Frontmatter Structure**:
```yaml
---
title: "Home"
faqs:
  - question: "What products do you supply?"
    answer: "RailTech supplies industrial railway equipment including..."
  - question: "Do you offer installation services?"
    answer: "Yes, we provide full installation and commissioning..."
  - question: "What is your warranty policy?"
    answer: "All equipment comes with a 2-year parts warranty..."
---
```

**Workflow**:
1. Edit `content/{lang}/_index.md` (for each language)
2. Add/modify questions and answers in the `faqs:` array
3. Keep questions concise, answers detailed but readable
4. Maintain same structure across all language versions
5. Questions appear in FAQ section on homepage

---

## i18n String Management

### Translation Files
- Location: `i18n/{ru,en,uz}.yaml`
- Format: YAML key-value pairs
- Usage in templates: `{{ i18n "key_name" }}`

### Common Keys
```yaml
# Navigation
nav_home: "Home"
nav_about: "About"
nav_services: "Services"
nav_projects: "Projects"
nav_blog: "Blog"
nav_contact: "Contact"

# Buttons
btn_learn_more: "Learn More"
btn_contact: "Get in Touch"
btn_read_more: "Read More"
btn_send: "Send"

# Sections
section_services: "Services"
section_projects: "Projects"
section_blog: "Latest News"
section_contact: "Contact Us"
```

### Known Missing Keys
These currently fallback to Russian defaults and should be added:
- `hero_chip_*` (hero section feature chips)
- `tw_*` (testimonial/social proof keys)

**To add a new i18n key**:
1. Edit `i18n/ru.yaml` — add Russian translation
2. Edit `i18n/en.yaml` — add English translation
3. Edit `i18n/uz.yaml` — add Uzbek translation
4. Use in template: `{{ i18n "new_key_name" }}`

---

## SEO Checklist for New Content

Before publishing any content, verify:

- [ ] **Title**: Concise, keyword-focused (50-60 chars)
- [ ] **Description**: Compelling, 155-160 characters, includes target keyword
- [ ] **Image**: Optimized, correct size, descriptive filename
- [ ] **URL Slug**: Lowercase, hyphens, descriptive, SEO-friendly
- [ ] **Content**: Well-structured with headings (H2, H3), 500+ words ideal
- [ ] **Links**: Internal links to related content where relevant
- [ ] **Tags/Categories**: Appropriate and consistent with other content
- [ ] **Language Versions**: All three languages have equivalent content
- [ ] **Date**: Correct publication date set
- [ ] **Draft Flag**: `draft: false` for published content, `draft: true` for WIP

---

## Hugo Preview & Build Commands

### Development
```bash
npm run dev
```
- Starts Hugo dev server with live reload
- Shows draft content
- Accessible at `http://localhost:1313`
- Press Ctrl+C to stop

### Production Build
```bash
npm run build
```
- Minifies CSS and JavaScript
- Adds cache-busting fingerprints
- Optimizes for deployment
- Output in `public/` directory

### Preview Build
```bash
npm run build:preview
```
- Production build with root baseURL (/)
- Used for local preview of production output

---

## Common Content Workflows

### Add New Blog Post (All Languages)

1. Create Russian post:
   ```
   content/blog/my-new-post.md
   ```
   - Write frontmatter with title, description, date, etc.
   - Add featured image to `static/img/blog/my-new-post.jpg`
   - Write content in Markdown

2. Duplicate to English:
   ```
   content/en/blog/my-new-post.md
   ```
   - Translate all fields
   - Keep same date and image path

3. Duplicate to Uzbek:
   ```
   content/uz/blog/my-new-post.md
   ```
   - Full Uzbek translation

4. Preview:
   ```bash
   npm run dev
   ```
   - Visit `http://localhost:1313` (Russian version)
   - Visit `http://localhost:1313/en/blog/my-new-post/` (English)
   - Visit `http://localhost:1313/uz/blog/my-new-post/` (Uzbek)

5. Publish via Git push (CI/CD handles deployment)

### Update Service Description

1. Edit `content/services/service-slug.md`
2. Update title, description, features frontmatter
3. Update content body if needed
4. Repeat for `content/en/services/service-slug.md` and Uzbek
5. Preview with `npm run dev`
6. Git commit and push

### Add Project & Showcase It

1. Create project in all three languages
2. Ensure image is in `static/img/projects/`
3. Set appropriate weight and status
4. Homepage automatically pulls latest completed projects
5. Projects with weight=1 appear first on projects page

---

## Tips & Best Practices

- **Consistency**: Use same titles/descriptions format across languages
- **Images**: Always optimize before adding to repo
- **Dates**: Use YAML format `2024-11-20`
- **Drafts**: Use `draft: true` while working; set to `false` when ready
- **Translations**: Never copy-paste machine translations; ensure quality
- **Links**: Use relative links for internal navigation: `/blog/` or `/en/projects/`
- **Frontmatter**: Validate YAML syntax (colons, quotes, indentation)
- **Content Length**: Blog posts 500-1500 words, project descriptions 100-300 words

---

## File Structure Reference

```
content/
  blog/
    post-1.md
    post-2.md
  projects/
    project-1.md
  services/
    service-1.md
  platform/
    feature-1.md
  _index.md (homepage with FAQ data)
  en/
    blog/post-1.md
    projects/project-1.md
    services/service-1.md
    platform/feature-1.md
    _index.md
  uz/
    blog/post-1.md
    projects/project-1.md
    services/service-1.md
    platform/feature-1.md
    _index.md

static/
  img/
    blog/
    projects/
    platform/
    partners/
    hero/
    icons/
```
