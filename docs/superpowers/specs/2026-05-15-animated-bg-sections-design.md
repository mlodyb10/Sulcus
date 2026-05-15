# Animated Background + Section Alternation — Design Spec

## Context

All sections of the Sulcus site currently share the same flat `#162D22` background, making the page feel monotonous. This spec covers two enhancements: an animated gradient background on forest sections, and a color alternation pattern that gives each section its own identity.

## Decisions Made

**Background animation:** Gradient drift — a `linear-gradient` cycling through 6 dark green shades animated with `background-size: 400%` and a slow 14s infinite loop. No grain/noise added (chosen: option A from visual exploration).

**Section alternation:** Forest sections get the animated gradient; cream sections are flat `#EDE3CC` (chosen: option A — cream static).

---

## Section Color Map

### Home page (`src/pages/Home.tsx`)

| Section | Class | Background | Text color |
|---------|-------|------------|------------|
| Hero | `.bg-forest` | animated gradient | `#EDE3CC` |
| Filozofia | `.bg-cream` | `#EDE3CC` flat | `#162D22` |
| Kolekcja | `.bg-forest` | animated gradient | `#EDE3CC` |

### Product page (`src/pages/Product.tsx`)

| Section | Class | Background | Text color |
|---------|-------|------------|------------|
| Gallery + sticky column | `.bg-forest` | animated gradient | `#EDE3CC` |
| The Pyramid | `.bg-cream` | `#EDE3CC` flat | `#162D22` |

### Layout components

| Component | Background |
|-----------|------------|
| Navigation | transparent → `rgba(22,45,34,0.92)` + `backdrop-blur-md` on scroll (replaces flat `#162D22`) |
| Footer (`src/components/layout/Footer.tsx`) | `.bg-cream` — `#EDE3CC` flat, `#162D22` text |

---

## CSS Changes (`src/index.css`)

Add the gradient animation keyframe and two utility classes:

```css
@keyframes gradientDrift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.bg-forest {
  background: linear-gradient(
    -45deg,
    #0d1f16, #162D22, #1e3a28,
    #0a1510, #162D22, #243d2e
  );
  background-size: 400% 400%;
  animation: gradientDrift 14s ease infinite;
  color: #EDE3CC;
}

.bg-cream {
  background-color: #EDE3CC;
  color: #162D22;
}
```

Remove `background-color: #162D22` from `body` in `index.css` (replaced by section-level classes). Keep `color: #EDE3CC` on body as fallback.

---

## Component-Level Color Inversions

When a section switches from forest to cream, all child elements must flip their colors. The pattern is consistent throughout:

| Element | Forest value | Cream value |
|---------|-------------|-------------|
| Primary text | `#EDE3CC` | `#162D22` |
| Muted text / opacity | `rgba(237,227,204,X)` | `rgba(22,45,34,X)` |
| Border | `rgba(237,227,204,X)` | `rgba(22,45,34,X)` |
| Button bg on hover | `#EDE3CC` text on `#162D22` bg | `#162D22` text on `#EDE3CC` bg |
| Placeholder card bg | `rgba(237,227,204,0.06)` | `rgba(22,45,34,0.06)` |

### Affected sections in detail

**Filozofia section (cream):**
- `RevealLine` text: `text-[#EDE3CC]` → `text-[#162D22]`

**Kolekcja — ProductCard (cream bg → no, ProductCard stays on forest):**
- ProductCard is inside the forest Kolekcja section — no inversion needed

**Footer (cream):**
- Brand name `text-[#EDE3CC]` → `text-[#162D22]`
- Tagline `text-[rgba(237,227,204,0.3)]` → `text-[rgba(22,45,34,0.3)]`
- Copyright `text-[rgba(237,227,204,0.2)]` → `text-[rgba(22,45,34,0.2)]`
- Border `border-[rgba(237,227,204,0.08)]` → `border-[rgba(22,45,34,0.08)]`
- Background `bg-[#0a0a0a]` → `bg-[#EDE3CC]`

**Product — Pyramid section (cream):**
- Section border: `border-[rgba(237,227,204,0.08)]` → `border-[rgba(22,45,34,0.08)]`
- Heading `text-[#EDE3CC]` → `text-[#162D22]`
- `FragrancePyramid` needs a `variant` prop: `"forest"` (default, current) | `"cream"` (inverted)
  - SVG polygon fills: `rgba(237,227,204,X)` → `rgba(22,45,34,X)`
  - Note button colors: cream text → forest text
  - Description panel text: cream → forest

---

## FragrancePyramid variant prop

The pyramid component currently hardcodes cream-on-forest colors. On the cream pyramid section it needs to display forest-on-cream. Add a `variant?: 'forest' | 'cream'` prop (default `'forest'`).

Product page passes `variant="cream"` to the pyramid in The Pyramid section.

---

## Verification

1. `npm run build` — zero TypeScript errors
2. Home page: Hero (animated dark green) → Filozofia (flat cream with dark text) → Kolekcja (animated dark green) → visible rhythm
3. Footer renders with cream background and dark text
4. Product page: gallery section is animated forest green; pyramid section below is flat cream
5. FragrancePyramid on cream background: SVG segments, note labels, and description text all use `#162D22` tones
6. Navigation stays forest-animated regardless of scroll position
7. Gradient animation plays smoothly, no flicker, no performance drop (`prefers-reduced-motion` respected: animation paused)
