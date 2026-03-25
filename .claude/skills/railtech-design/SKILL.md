---
name: railtech-design
description: "Modify the RailTech website design — CSS, layouts, components, responsive styles, and accessibility. Use this skill when the user wants to change colors, layouts, add new sections, fix responsive issues, improve accessibility, or modify the dark theme. Triggers: change design, fix mobile, add section, update styles, accessibility, responsive, CSS, theme, layout, component."
---

# RailTech Design & Styling Skill

## Overview
This skill covers all aspects of RailTech website design: CSS architecture, component creation, responsive design, theming, accessibility, and layout modifications.

## CSS Architecture

### File Location
`assets/css/main.css` (single file, 1266 lines)

### CSS Processing Pipeline
1. **Source**: `assets/css/main.css` (SCSS-like features via CSS)
2. **Processing**: Hugo Pipes
3. **Transformations**: minify + fingerprint
4. **Output**: `public/css/main-[hash].css`
5. **Link in HTML**: `href="{{ $css.RelPermalink }}"` (automatic hash)

### Architecture Layers

```
CSS Structure:
├── Root (CSS Custom Properties)
├── Reset & Normalize
├── Base Elements (body, headings, etc.)
├── Components (.button, .card, etc.)
├── Sections (.hero-*, .blog-*, .stats-*, etc.)
├── Layout (grid, flexbox utilities)
├── Responsive (mobile-first breakpoints)
└── Print Styles
```

---

## CSS Custom Properties (Variables)

### Color System

**Primary Colors**:
```css
:root {
  --color-primary: #f97316;        /* Orange accent */
  --color-primary-dark: #ea580c;   /* Darker orange (hover) */
  --color-primary-light: #fed7aa;  /* Light orange (background) */

  --color-bg: #0a0a0a;             /* Pure black background */
  --color-bg-secondary: #1a1a1a;   /* Slightly lighter bg */
  --color-bg-tertiary: #2d2d2d;    /* Card/section backgrounds */

  --color-text-primary: #ffffff;   /* White text */
  --color-text-secondary: #a0a0a0; /* Gray text (muted) */
  --color-text-tertiary: #666666;  /* Darker gray (less important) */

  --color-border: #333333;         /* Border color */
  --color-border-light: #404040;   /* Lighter borders */

  --color-success: #10b981;        /* Green */
  --color-warning: #f59e0b;        /* Amber */
  --color-error: #ef4444;          /* Red */
}
```

### Typography

```css
:root {
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-family-mono: 'Courier New', monospace;

  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  --font-size-5xl: 3rem;      /* 48px */

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### Spacing

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
  --spacing-20: 5rem;     /* 80px */
  --spacing-24: 6rem;     /* 96px */
  --spacing-32: 8rem;     /* 128px */
}
```

### Transitions & Effects

```css
:root {
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 300ms ease-in-out;
  --transition-slow: 500ms ease-in-out;

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.7);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.8);

  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.5rem;    /* 8px */
  --radius-lg: 1rem;      /* 16px */
}
```

### Usage Examples

```css
/* Using color variables */
.button {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

/* Using typography */
h1 {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
}

/* Using spacing */
.section {
  padding: var(--spacing-16) var(--spacing-8);
  margin-bottom: var(--spacing-12);
  gap: var(--spacing-4);
}

/* Using transitions */
a {
  transition: color var(--transition-normal);
}

a:hover {
  color: var(--color-primary);
}
```

---

## Responsive Breakpoints

### Mobile-First Approach
Styles for mobile are base; breakpoints add larger screen rules.

**Breakpoint Map**:
```css
/* Mobile: 0px - 480px (no breakpoint needed, base styles) */

/* Tablet: 480px+ */
@media (min-width: 480px) {
  /* Tablet styles */
}

/* Small Desktop: 768px+ */
@media (min-width: 768px) {
  /* Desktop styles */
}

/* Large Desktop: 1024px+ */
@media (min-width: 1024px) {
  /* Large desktop styles */
}
```

### Common Breakpoint Usage

```css
/* Example: Hero section responsive */
.hero {
  padding: var(--spacing-8);  /* Mobile: 32px */
  font-size: var(--font-size-2xl);  /* Mobile: 24px */
}

@media (min-width: 768px) {
  .hero {
    padding: var(--spacing-16);  /* Tablet+: 64px */
    font-size: var(--font-size-4xl);  /* Tablet+: 36px */
  }
}

@media (min-width: 1024px) {
  .hero {
    padding: var(--spacing-24);  /* Desktop+: 96px */
    font-size: var(--font-size-5xl);  /* Desktop+: 48px */
  }
}
```

### Container Queries (Modern Approach)
Some components use container queries for internal responsiveness:
```css
@supports (container-type: inline-size) {
  .card {
    container-type: inline-size;
  }

  @container (min-width: 400px) {
    .card-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
  }
}
```

---

## BEM Naming Convention

**BEM = Block Element Modifier**

### Examples in RailTech

```css
/* Block: Independent component */
.hero { }

/* Element: Part of block (double underscore) */
.hero__title { }
.hero__subtitle { }
.hero__button { }

/* Modifier: Variation of block/element (double dash) */
.button { }
.button--primary { }
.button--secondary { }
.button--small { }
.button--disabled { }
```

### Real Examples from CSS

```css
/* Hero Section */
.hero { }
.hero-title { }
.hero-subtitle { }
.hero-buttons { }
.hero-button { }

/* Blog Section */
.blog { }
.blog-grid { }
.blog-card { }
.blog-card-image { }
.blog-card-content { }
.blog-card-title { }
.blog-card-excerpt { }
.blog-card-meta { }

/* Stats Section */
.stats { }
.stats-grid { }
.stats-item { }
.stats-number { }
.stats-label { }

/* Modifiers */
.button--primary { }
.button--secondary { }
.button--ghost { }
.card--featured { }
.card--hover { }
```

---

## Common Components

### Buttons

**HTML**:
```html
<button class="button button--primary">Primary Button</button>
<button class="button button--secondary">Secondary Button</button>
<button class="button button--ghost">Ghost Button</button>
<button class="button button--small">Small Button</button>
```

**CSS** (simplified):
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: var(--font-weight-semibold);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.button--primary {
  background-color: var(--color-primary);
  color: var(--color-bg);
}

.button--primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button--secondary {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.button--secondary:hover {
  background-color: var(--color-primary);
  color: var(--color-bg);
}
```

### Cards

```css
.card {
  background-color: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-6);
  transition: all var(--transition-normal);
}

.card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
```

### Forms

```css
input, textarea {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-3) var(--spacing-4);
  color: var(--color-text-primary);
  font-family: var(--font-family-primary);
  transition: border-color var(--transition-normal);
}

input:focus, textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.1);
}
```

---

## Adding New Sections

### Step 1: Create HTML Template

**File**: `layouts/partials/my-section.html`

```html
<section class="my-section">
  <div class="container">
    <h2 class="my-section-title">{{ .Title }}</h2>
    <p class="my-section-subtitle">{{ .Subtitle }}</p>

    <div class="my-section-grid">
      {{ range .Items }}
        <div class="my-section-item">
          <h3>{{ .Title }}</h3>
          <p>{{ .Description }}</p>
        </div>
      {{ end }}
    </div>
  </div>
</section>
```

### Step 2: Add CSS for Section

**In**: `assets/css/main.css` (add at appropriate section)

```css
/* My Section */
.my-section {
  padding: var(--spacing-16) var(--spacing-8);
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.my-section-title {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-4);
  color: var(--color-text-primary);
}

.my-section-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-12);
}

.my-section-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .my-section-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .my-section-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.my-section-item {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-6);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: all var(--transition-normal);
}

.my-section-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
}
```

### Step 3: Include in Layout

**File**: `layouts/index.html` (for homepage)

```html
{{ partial "my-section" . }}
```

Or in specific section layout:

**File**: `layouts/my-section/list.html`

```html
{{ define "main" }}
  {{ partial "my-section" . }}
{{ end }}
```

---

## Accessibility Standards (WCAG AA)

### Color Contrast
- **Minimum**: 4.5:1 for text / background
- **Large text** (18px+): 3:1 minimum
- **Test**: Use WAVE, Lighthouse, or axe DevTools

**Verify current colors**:
```
Primary text (#fff) on Primary color (#f97316) = ~10:1 ✓
Secondary text (#a0a0a0) on Dark bg (#0a0a0a) = ~4.8:1 ✓
```

### Semantic HTML
Always use semantic elements:
```html
<!-- Good -->
<button>Click Me</button>
<nav>...</nav>
<article>...</article>
<h1>Main Heading</h1>

<!-- Bad -->
<div class="button">Click Me</div>
<div class="nav">...</div>
<span class="heading">Main Heading</span>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order should be logical
- Links and buttons must have visible focus states

```css
/* Visible focus indicator */
button:focus,
a:focus,
input:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### ARIA Labels
For interactive elements without visible text:
```html
<!-- Button with icon only -->
<button aria-label="Close menu">
  <svg>...</svg>
</button>

<!-- Skip to main content link -->
<a href="#main" class="skip-link">Skip to main content</a>

<!-- Mobile menu toggle -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
```

### Images & Alt Text
```html
<!-- Decorative image (empty alt) -->
<img src="decoration.png" alt="" aria-hidden="true">

<!-- Meaningful image -->
<img src="equipment.jpg" alt="Industrial railway equipment being installed">
```

### Language & Readability
- Use simple language (8th grade reading level)
- Break content into short paragraphs
- Use headings to structure content logically
- Avoid auto-playing videos/audio

---

## Animation Patterns

### Scroll Animations

**Usage**: Fade-in and slide effects on scroll

**HTML**:
```html
<div class="fade-in-up" data-animate="fade-in-up">
  Content appears on scroll
</div>
```

**CSS**:
```css
[data-animate="fade-in-up"] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity var(--transition-normal),
              transform var(--transition-normal);
}

[data-animate="fade-in-up"].visible {
  opacity: 1;
  transform: translateY(0);
}
```

**JavaScript** (IntersectionObserver):
```javascript
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});
```

### Hover Effects

```css
/* Lift on hover */
.card {
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

/* Color transition */
a {
  transition: color var(--transition-normal);
}

a:hover {
  color: var(--color-primary);
}

/* Icon rotation */
.button svg {
  transition: transform var(--transition-normal);
}

.button:hover svg {
  transform: rotate(90deg);
}
```

### Smooth Scroll

```css
html {
  scroll-behavior: smooth;
}
```

---

## Theme Modification Guide

### Dark Theme (Current)

**Main Variables** (already set):
```css
--color-bg: #0a0a0a;
--color-text-primary: #ffffff;
--color-text-secondary: #a0a0a0;
--color-primary: #f97316;
```

### Light Theme (Future)

To implement light theme, create a secondary theme class:

```css
.light-theme {
  --color-bg: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;

  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;

  --color-border: #e5e7eb;
  --color-border-light: #f3f4f6;

  --color-primary: #f97316;  /* Keep orange */
}
```

Apply with JavaScript:
```javascript
document.documentElement.classList.toggle('light-theme');
```

---

## Component Creation Guide

### Creating a New Component

**1. Define Purpose**
- What does it do?
- Where will it be used?
- How many variations?

**2. Create HTML Template**
```html
<!-- layouts/partials/component-name.html -->
<div class="component-name">
  <h3 class="component-name-title">{{ .Title }}</h3>
  <p class="component-name-body">{{ .Body }}</p>
</div>
```

**3. Write CSS (BEM)**
```css
.component-name {
  /* Base styles */
}

.component-name-title {
  /* Title styles */
}

.component-name-body {
  /* Body styles */
}

.component-name--variant {
  /* Variation modifier */
}
```

**4. Make It Reusable**
- Accept data from frontmatter or partials context
- Support multiple variations via modifiers
- Include responsive styles
- Document required fields

**5. Document Usage**
```html
<!-- Usage in templates -->
{{ partial "component-name" (dict "Title" "..." "Body" "...") }}
```

---

## Print Styles

**For printing website content**:

```css
@media print {
  /* Hide navigation, footers, etc. */
  header, footer, nav {
    display: none;
  }

  /* Optimize for print */
  body {
    background: white;
    color: black;
  }

  a {
    text-decoration: underline;
  }

  /* Avoid page breaks in content */
  .card, .article {
    page-break-inside: avoid;
  }
}
```

---

## CSS Best Practices

### DOs
- Use CSS custom properties for consistent theming
- Mobile-first responsive approach
- Semantic HTML with minimal class overrides
- Reusable component classes
- Clear BEM naming conventions
- Group related styles together
- Document complex selectors

### DON'Ts
- Don't use !important (except for utilities)
- Don't hardcode colors (use variables)
- Don't use complex nested selectors
- Don't duplicate styles across sections
- Don't add inline styles in HTML
- Don't use floats (use flexbox/grid)

---

## Common Design Tasks

### Change Primary Color
```css
:root {
  --color-primary: #3b82f6;  /* Blue instead of orange */
  --color-primary-dark: #1e40af;
  --color-primary-light: #dbeafe;
}
```
All components automatically update.

### Adjust Spacing
```css
:root {
  --spacing-4: 1.25rem;  /* Increase from 1rem */
  /* All components using var(--spacing-4) update */
}
```

### Add New Font Size
```css
:root {
  --font-size-3xl: 1.875rem;  /* Add new size */
}

h2 {
  font-size: var(--font-size-3xl);
}
```

### Fix Mobile Layout
1. Inspect in DevTools (F12)
2. Check which breakpoint causing issue
3. Add/modify `@media (min-width: XXX)` rule
4. Test on actual device
5. Preview with `npm run dev`

---

## Performance Optimization

### CSS Best Practices
- Avoid overly specific selectors
- Use direct class selectors for components
- Minimize use of :nth-child and :last-child
- Combine selectors when possible

```css
/* Good - specific and efficient */
.button-primary { }

/* Bad - overly complex */
div > .container > p:nth-child(2) > .button { }
```

### Critical CSS
Currently no critical CSS inlining. Files are small enough.
```bash
# Check CSS file size
wc -c assets/css/main.css
# Currently: 1266 lines, ~35KB minified
```

### Avoid Layout Thrashing
Group DOM reads and writes:
```javascript
// Bad - causes reflows
element.style.width = '100px';
console.log(element.offsetWidth);
element.style.height = '100px';

// Good - batched
element.style.width = '100px';
element.style.height = '100px';
console.log(element.offsetWidth);
```

---

## Testing Your Changes

### Visual Testing
1. Run `npm run dev`
2. Test on multiple devices:
   - Desktop (1920px+)
   - Tablet (768px)
   - Mobile (480px)
3. Test all browsers (Chrome, Firefox, Safari, Edge)

### Accessibility Testing
1. Open DevTools (F12)
2. Install WAVE extension
3. Run accessibility scan
4. Fix any errors (red), review warnings (yellow)

### Performance Testing
1. Build site: `npm run build`
2. Use PageSpeed Insights
3. Check Lighthouse audit
4. Monitor Core Web Vitals

### Responsive Testing
```bash
# Check responsive breakpoints
grep "@media (min-width:" assets/css/main.css
# Should show: 480px, 768px, 1024px
```

