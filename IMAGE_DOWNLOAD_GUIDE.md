# Image Download Guide for RailTech Redesign

Download these free photos from Unsplash/Pexels and place them at the specified paths.
All images are free for commercial use (Unsplash License).

**Important**: Download at maximum resolution (click "Download free" on Unsplash).
Recommended: rename downloaded files to match the filenames below.

---

## 1. Homepage Hero Background
**Path**: `assets/img/hero/railway-main.jpg`
**Specs**: 2560x1440+, landscape, dramatic
**Theme**: Modern railway tracks in perspective / high-speed train / railway infrastructure

Choose ONE:
- https://unsplash.com/photos/FZskpOfuX0k — Railway with motion blur, cinematic perspective
- https://unsplash.com/s/photos/railway-track — Browse 500+ railway track photos
- https://unsplash.com/s/photos/high-speed-train — Modern high-speed trains
- https://unsplash.com/photos/wTqJM-x9plo — White ICE train on tracks (Germany)

---

## 2. Services Section Hero
**Path**: `static/img/hero/services-hero.jpg`
**Specs**: 1920x1080+, landscape
**Theme**: Industrial equipment, warehouse, machinery

Choose ONE:
- https://unsplash.com/s/photos/industrial-engineering — Industrial engineering photos
- https://unsplash.com/s/photos/manufacturing-equipment — Manufacturing equipment
- https://unsplash.com/photos/XmmL7iNeFWc — Industrial pipes and machinery
- https://unsplash.com/photos/3yh0HA9Snro — Factory interior, steel pipelines

---

## 3. Projects Section Hero
**Path**: `static/img/hero/projects-hero.jpg`
**Specs**: 1920x1080+, landscape
**Theme**: Engineering, construction, heavy industry

Choose ONE:
- https://unsplash.com/s/photos/heavy-machinery — Heavy machinery photos
- https://unsplash.com/s/photos/industrial-construction — Industrial construction
- https://unsplash.com/s/photos/machinery — Machinery collection

---

## 4. About Page Hero
**Path**: `static/img/hero/about-hero.jpg`
**Specs**: 1920x1080+, landscape
**Theme**: Corporate team, business meeting, professional office

Choose ONE:
- https://unsplash.com/s/photos/business-team — Business team photos
- https://unsplash.com/s/photos/team-meeting — Team meeting photos
- https://unsplash.com/s/photos/business-meeting — Business meeting photos

---

## 5. Blog Section Hero
**Path**: `static/img/hero/blog-hero.jpg`
**Specs**: 1920x1080+, landscape
**Theme**: Technology, digital, data visualization

Choose ONE:
- https://unsplash.com/s/photos/data-center — Data center photos (750+)
- https://unsplash.com/s/photos/server-room — Server room photos (30k+)

---

## 6. Platform Section Hero
**Path**: `static/img/hero/platform-hero.jpg`
**Specs**: 1920x1080+, landscape
**Theme**: Digital platform, dashboard, technology interface

Choose ONE:
- https://unsplash.com/s/photos/servers — Server/tech photos
- https://unsplash.com/s/photos/web-server — Web server infrastructure

---

## 7. Default Featured Image (for cards without images)
**Path**: `static/img/hero/default-featured.jpg`
**Specs**: 1200x630, landscape
**Theme**: Abstract industrial / geometric / tech pattern

Choose ONE:
- https://unsplash.com/s/photos/industrial — 500+ industrial abstract photos
- https://unsplash.com/s/photos/industrial-area — Industrial area photos

---

## 8. Carousel Images (Homepage projects showcase)
Reuse existing project images already in `static/img/projects/`:
- `static/img/projects/uty-safety-systems.jpg` (already exists)
- `static/img/projects/diagnostic-equipment.jpg` (already exists)
- `static/img/projects/b2b-platform.jpg` (already exists)

---

## Directory Structure After Download

```
assets/
  img/
    hero/
      railway-main.jpg        <-- Homepage hero (MUST be in assets/ for Hugo processing)

static/
  img/
    hero/
      services-hero.jpg
      projects-hero.jpg
      about-hero.jpg
      blog-hero.jpg
      platform-hero.jpg
      default-featured.jpg
```

## Quick Download Commands (after choosing photos)

```bash
# Create directories
mkdir -p assets/img/hero static/img/hero

# Download from Unsplash (replace PHOTO_URL with actual download URL):
# On Unsplash: click photo → Download → right-click "Download free" → copy link
curl -L -o assets/img/hero/railway-main.jpg "PHOTO_DOWNLOAD_URL"
curl -L -o static/img/hero/services-hero.jpg "PHOTO_DOWNLOAD_URL"
# ... etc
```
