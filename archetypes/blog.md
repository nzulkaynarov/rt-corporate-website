---
# Blog Post Archetype — All fields managed via Frontmatter CMS
# ZERO HARDCODE PRINCIPLE: All metadata from this frontmatter only

# Core Content Metadata
title: "{{ replace .Name "-" " " | title }}"
seoTitle: ""  # Custom title for search results (60 chars max, leave empty to use title)
description: ""  # Meta description (160 chars max) — appears in search results
date: {{ .Date }}
lastmod: {{ .Date }}
draft: true

# Content Classification
author: "RailTech"
tags: []  # Add tags: ["railway", "equipment", etc]
categories: []  # Add categories: ["Blog", "News", etc]
articleType: "Article"  # Options: Article, News, Tutorial, Case Study, Opinion
difficulty: ""  # Optional: Beginner, Intermediate, Advanced

# Images
image: ""  # Featured image path (appears in article header and preview cards)
ogImage: ""  # Open Graph image for social sharing (falls back to featured image)

# SEO Configuration
canonicalUrl: ""  # Set if article published on multiple sites (optional)

# Blowfish Display Settings (Theme-specific)
showHero: true  # Display hero section at top of article
heroStyle: "basic"  # Options: basic, background, image
showBreadcrumbs: true  # Show navigation breadcrumb trail
showTableOfContents: true  # Auto-generated TOC from headings
showRelatedContent: true  # Show related articles at bottom
showDate: true  # Show publication date
showAuthor: true  # Show author name
---

