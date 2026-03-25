---
name: railtech-deploy
description: "Deploy and maintain the RailTech Hugo website on GitHub Pages. Use this skill for deployment tasks, CI/CD setup, domain configuration, build issues, performance optimization, and GitHub Actions workflow management. Triggers: deploy site, fix build, update workflow, configure domain, GitHub Pages setup, CI/CD, performance audit."
---

# RailTech Deployment & CI/CD Skill

## Overview
RailTech website is deployed to GitHub Pages via GitHub Actions. This skill covers deployment setup, troubleshooting, domain configuration, performance optimization, and CI/CD workflow management.

## Deployment Architecture

### Current Setup
- **Host**: GitHub Pages
- **Repository**: `railtech-website` (or similar)
- **Branch**: `main` (source code)
- **CI/CD**: GitHub Actions workflow
- **Build Process**: Hugo static site generation with minification
- **Cache Busting**: Hugo Pipes fingerprinting

### Domain Configuration
- **Primary Domain**: railtech.uz (or configured domain)
- **DNS**: CNAME points to GitHub Pages
- **HTTPS**: Automatic via GitHub Pages

---

## GitHub Actions Workflow

### Workflow File Location
`/.github/workflows/hugo-deploy.yml` (or similar)

### Typical Workflow Structure

```yaml
name: Hugo Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.120.0' # Match local version

      - name: Build
        run: |
          hugo --minify \
            --baseURL "https://railtech.uz/" \
            --environment production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
          publish_branch: gh-pages
          cname: railtech.uz
```

### Environment Variables
- `HUGO_VERSION`: Must match local version (check with `hugo version`)
- `BASE_URL`: Set during build to production domain
- `ENVIRONMENT`: Set to `production` for minification

### Secrets Required
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions
- `WEB3FORMS_ACCESS_KEY`: (if using Web3Forms API for forms)

---

## Build Troubleshooting

### Common Build Errors

#### 1. "Hugo command not found"
**Cause**: Hugo not installed or PATH issue
**Fix**:
```bash
# Check Hugo installation
hugo version

# Install Hugo (macOS with Homebrew)
brew install hugo

# Install Hugo (Ubuntu/Debian)
sudo apt install hugo

# Install Hugo (Windows with Chocolatey)
choco install hugo-extended
```
Ensure `hugo-extended` is used (needed for SCSS support if added later).

#### 2. "baseURL not set correctly"
**Cause**: GitHub Actions workflow using wrong baseURL
**Fix**:
- Verify workflow file sets `--baseURL "https://railtech.uz/"`
- Or add to `hugo.toml`: `baseURL = "https://railtech.uz/"`
- Check domain doesn't have trailing slash inconsistencies

#### 3. "CSS/JS fingerprinting issues"
**Cause**: Hugo Pipes cache not cleared
**Fix**:
```bash
# Remove Hugo cache
rm -rf resources/_gen/

# Clean and rebuild
npm run build
```

#### 4. "Content not appearing after deploy"
**Cause**: Content marked as `draft: true` in frontmatter
**Fix**:
1. Check all posts/pages: `draft: false`
2. Check dates aren't in future (Hugo won't publish future-dated content)
3. Rebuild: `npm run build`
4. Git push to trigger workflow

#### 5. "Search page not found (404)"
**Cause**: Schema.org SearchAction references non-existent `/search/` page
**Fix** (short-term):
- Update schema.org in `layouts/partials/head.html` to remove SearchAction, OR
- Remove SearchAction from structured data until search page is implemented

**Fix** (proper):
- Create `content/search/_index.md` with search implementation
- Add to `hugo.toml` menus if needed
- Build static search index or use client-side JavaScript search

#### 6. "Images not loading in production"
**Cause**: Image paths incorrect in Markdown
**Fix**:
- Verify image paths start with `/` (absolute): `/img/blog/post.jpg`
- Don't use relative paths like `img/blog/post.jpg`
- Check images exist in `static/img/`
- Clear browser cache (Ctrl+Shift+Del)

---

## baseURL Configuration

### Environment-Specific baseURL

**Development**:
```toml
# hugo.toml (default for local dev)
baseURL = "http://localhost:1313/"
```

**Production** (via GitHub Actions):
```bash
hugo --baseURL "https://railtech.uz/"
```

**Preview Build** (local production test):
```bash
npm run build:preview
# Uses baseURL = "/"
```

### Why baseURL Matters
- Affects all absolute URLs (CSS, JS, images, links)
- Wrong baseURL = broken resources in production
- Set ONLY via GitHub Actions build command (not in hugo.toml for production)

### Checking baseURL
1. Inspect page source in production
2. Look for `<base href="...">`
3. Check CSS/JS paths in `<head>`
4. Verify all image paths are correct

---

## Custom Domain Setup

### Using Custom Domain (railtech.uz)

#### 1. Update GitHub Pages Settings
- Go to repository **Settings → Pages**
- Under "Custom domain", enter: `railtech.uz`
- Ensure "Enforce HTTPS" is checked

#### 2. Configure DNS Records
Contact domain registrar (GoDaddy, Namecheap, etc.)

**Option A**: CNAME Record (for subdomain)
```
Type: CNAME
Name: www
Value: railtech.github.io
TTL: 3600
```

**Option B**: A Records (for root domain)
```
Type: A
Name: @ (or leave blank)
Value: 185.199.108.153
        185.199.109.153
        185.199.110.153
        185.199.111.153
TTL: 3600
```

Add AAAA records for IPv6 (optional but recommended):
```
Type: AAAA
Value: 2606:50c0:8000::153
       2606:50c0:8001::153
       2606:50c0:8002::153
       2606:50c0:8003::153
```

#### 3. Update Workflow CNAME
In `.github/workflows/hugo-deploy.yml`:
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./public
    publish_branch: gh-pages
    cname: railtech.uz  # Must match your domain
```

#### 4. Verify DNS Propagation
```bash
# Check DNS resolution
nslookup railtech.uz

# Check GitHub Pages IP
dig railtech.uz

# Test HTTPS certificate
curl -I https://railtech.uz
```
DNS changes can take 24-48 hours to propagate.

---

## Performance Optimization

### CSS & JavaScript Optimization

**Hugo Pipes Configuration** (in `hugo.toml`):
```toml
[outputs]
home = ["HTML", "JSON"]

[outputFormats]
JSON = {baseName = "index", isPlainText = true, protocol = ""}
```

**CSS Minification** (in layouts):
```go-html-template
{{ $css := resources.Get "css/main.css" | minify | fingerprint }}
<link rel="stylesheet" href="{{ $css.RelPermalink }}">
```

**JS Minification**:
```go-html-template
{{ $js := resources.Get "js/main.js" | minify | fingerprint }}
<script src="{{ $js.RelPermalink }}"></script>
```

### Image Optimization Checklist

- [ ] Blog images: 1200x600px, JPEG, <300KB
- [ ] Project images: 800x600px, JPEG, <250KB
- [ ] Use JPEG for photos, PNG for graphics
- [ ] Lazy load images: `loading="lazy"` attribute
- [ ] Compress before adding to repo (use ImageOptim, TinyPNG, etc.)
- [ ] Use descriptive filenames (helps SEO)
- [ ] Add alt text to all images

### Web Fonts Optimization

**Current Issue**: Google Fonts loaded from CDN (GDPR/performance concern)

**Optimization Option 1**: Self-host fonts
```bash
# Download Inter font files from Google Fonts
# Place in static/fonts/
# Update CSS @import paths
```

In `assets/css/main.css`:
```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-400.woff2') format('woff2');
  font-weight: 400;
}
```

**Optimization Option 2**: Use system fonts
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

### Caching Strategy

**Static Assets**:
- Hugo Pipes fingerprinting handles cache busting
- Files like `main-a1b2c3d4.css` won't be cached if content changes

**Cache Headers** (GitHub Pages default):
- HTML: No cache (always fresh)
- CSS/JS/Images: Cached by browser + CDN

**To clear cache**:
```bash
# GitHub Pages automatically refreshes on deploy
# Manual cache clear on client side: Ctrl+Shift+Del (hard refresh)
```

### Performance Metrics Monitoring

**Tools**:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [GTmetrix](https://gtmetrix.com/)

**Key Metrics to Monitor**:
- First Contentful Paint (FCP): <1.8s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Total page size: <1.5MB
- Number of requests: <30

---

## GitHub Pages Deployment Checklist

Before each deployment:

- [ ] **Hugo Version**: Workflow uses correct Hugo version
- [ ] **Build Test**: `npm run build` succeeds locally
- [ ] **No Draft Content**: All frontmatter has `draft: false`
- [ ] **baseURL Correct**: Production domain set in workflow
- [ ] **Images Optimized**: No oversized images in commit
- [ ] **Dependencies Updated**: `npm install` reflects current packages
- [ ] **Broken Links**: Test all links in preview
- [ ] **CSS/JS Loading**: Check in browser DevTools
- [ ] **Mobile Responsive**: Test on mobile devices
- [ ] **Accessibility**: Run accessibility checker (WAVE)

---

## Secrets & Environment Variables

### GitHub Actions Secrets Setup

1. Go to repository **Settings → Secrets and variables → Actions**

2. Add secrets:
   - `HUGO_VERSION`: The Hugo version used
   - `WEB3FORMS_ACCESS_KEY`: Web3Forms API key (if not in hugo.toml)

3. Reference in workflow:
```yaml
env:
  WEB3FORMS_ACCESS_KEY: ${{ secrets.WEB3FORMS_ACCESS_KEY }}
```

### Web3Forms Integration

If using Web3Forms for contact form:

1. Get API key from [Web3Forms](https://web3forms.com/)
2. Add to `hugo.toml`:
```toml
[params.web3forms]
accessKey = "your-key-here"
```
3. Or set as GitHub secret and reference in workflow
4. Test form submission in development

---

## Troubleshooting Deployment Issues

### Workflow Fails to Run

**Check**:
1. GitHub Actions enabled in Settings
2. Workflow file syntax correct (YAML validation)
3. Branch is `main` (or configured branch)

**View logs**:
- Go to **Actions** tab → Click failed workflow → View logs
- Look for error messages in "Build" step

### Deploy Succeeds but Site Shows Old Content

**Cause**: Browser cache
**Fix**:
- Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
- Clear all cache: Ctrl+Shift+Del
- Check `gh-pages` branch has new content

**Cause**: DNS propagation delay
**Fix**:
- Wait 24 hours after DNS changes
- Verify DNS with `nslookup railtech.uz`

### 404 Errors in Production

**Check**:
1. Is file in `public/` after local build?
2. Are paths using correct baseURL?
3. Check GitHub Pages is set to deploy from `gh-pages` branch

### HTTPS Certificate Issues

**Cause**: Domain mismatch in CNAME
**Fix**:
1. Check `CNAME` file contains correct domain
2. Verify workflow sets correct `cname` value
3. Wait 24-48 hours after changing domain
4. Re-check in Settings → Pages

---

## Common Deployment Commands

```bash
# Local development with drafts visible
npm run dev

# Production build (minified, fingerprinted)
npm run build

# Preview production build locally
npm run build:preview

# Check Hugo version
hugo version

# Verify site structure (no output = no errors)
hugo check content

# Validate config
hugo config
```

---

## Rollback Procedure

If deployed content needs to be reverted:

1. **Revert Last Commit**:
```bash
git log --oneline -5
git revert <commit-hash>
git push origin main
```
GitHub Actions automatically rebuilds from `main` branch.

2. **Manual Rollback**:
```bash
git reset --soft HEAD~1  # Undo last commit, keep changes staged
git reset HEAD <files>   # Unstage unwanted changes
git checkout -- <files>  # Discard unwanted changes
git commit               # Create new commit
git push origin main
```

3. **Monitor Workflow**:
- Go to Actions tab
- Watch workflow run
- Verify site updates in 2-5 minutes

---

## Future Improvements

Potential optimizations not yet implemented:

- [ ] Self-host Google Fonts for GDPR compliance
- [ ] Implement search functionality (currently broken)
- [ ] Add staging environment for testing
- [ ] Set up performance monitoring alerts
- [ ] Implement preview deploys for pull requests
- [ ] Add automated accessibility testing
- [ ] Set up error tracking/logging
- [ ] Create deployment notifications (Slack, email)
- [ ] Implement A/B testing infrastructure
- [ ] Add analytics dashboard

---

## Support & Resources

- **Hugo Docs**: https://gohugo.io/documentation/
- **GitHub Pages Docs**: https://docs.github.com/en/pages
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Web3Forms Docs**: https://web3forms.com/
- **Repository**: Check GitHub Issues for known problems
