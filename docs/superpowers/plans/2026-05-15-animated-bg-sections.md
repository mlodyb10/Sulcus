# Animated Background + Section Alternation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a slow animated gradient to forest sections and alternate section backgrounds (forest animated ↔ cream flat), with full color inversion in cream sections.

**Architecture:** Two CSS component classes (`section-forest` animated, `section-cream` flat) in `@layer components` drive everything. Names deliberately avoid `bg-forest` / `bg-cream` which Tailwind v4 auto-generates as utilities from `@theme` tokens. `FragrancePyramid` gets a `variant` prop to invert its hardcoded cream-on-forest palette. No new state, no new components.

**Tech Stack:** Tailwind CSS v4, Framer Motion 12, React 19 — existing stack only.

---

## File Map

| File | Change |
|------|--------|
| `src/index.css` | Add `@keyframes gradientDrift`; add `.section-forest` and `.section-cream` in `@layer components`; remove `background-color` from `body` |
| `src/components/pyramid/FragrancePyramid.tsx` | Add `variant?: 'forest' \| 'cream'` prop; derive all colors from `getColors(variant)` |
| `src/components/layout/Footer.tsx` | `section-cream` bg + forest text throughout |
| `src/components/layout/Navigation.tsx` | `rgba(22,45,34,0.92)` + `backdrop-blur` on scroll instead of flat `#162D22` |
| `src/pages/Home.tsx` | Hero/Kolekcja → `section-forest`; Filozofia → `section-cream`; drop explicit text color from `RevealLine` |
| `src/pages/Product.tsx` | Main wrapper → `section-forest`; Pyramid section → `section-cream` + `variant="cream"` |

---

## Task 1: CSS utility classes

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace `src/index.css`**

```css
@import "tailwindcss";

@theme {
  --color-forest: #162D22;
  --color-cream: #EDE3CC;
  --color-dark: #0a0a0a;
  --font-serif: 'Cormorant Garamond', serif;
  --font-sans: 'Space Grotesk', sans-serif;
}

@keyframes gradientDrift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@layer components {
  .section-forest {
    background: linear-gradient(
      -45deg,
      #0d1f16, #162D22, #1e3a28,
      #0a1510, #162D22, #243d2e
    );
    background-size: 400% 400%;
    animation: gradientDrift 14s ease infinite;
  }

  .section-cream {
    background-color: #EDE3CC;
    color: #162D22;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-forest {
    animation: none;
    background: #162D22;
  }
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  color: #EDE3CC;
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

::-webkit-scrollbar { display: none; }
* { scrollbar-width: none; }
```

Key changes from original: `background-color` removed from `body` (sections now manage their own backgrounds); `@keyframes gradientDrift` added; `.section-forest` (animated) and `.section-cream` (flat + color inversion) added in `@layer components`.

- [ ] **Step 2: Verify build**

```bash
cd e:\projects\sulcus && npm run build
```

Expected: zero TypeScript errors, clean Vite output.

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "feat: add section-forest animated gradient and section-cream utility classes"
```

---

## Task 2: FragrancePyramid variant prop

**Files:**
- Modify: `src/components/pyramid/FragrancePyramid.tsx`

The pyramid currently hardcodes cream-on-forest colors everywhere. A `variant` prop lets the Product page render it on a cream background with fully inverted colors.

- [ ] **Step 1: Replace `src/components/pyramid/FragrancePyramid.tsx`**

```tsx
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Note } from '../../data/products'

interface PyramidNotes {
  top: Note[]
  heart: Note[]
  base: Note[]
}

type Variant = 'forest' | 'cream'

interface Props {
  notes: PyramidNotes
  variant?: Variant
}

const TIERS = [
  { key: 'top' as const, label: 'Nuty głowy' },
  { key: 'heart' as const, label: 'Nuty serca' },
  { key: 'base' as const, label: 'Nuty bazy' },
]

function getColors(variant: Variant) {
  if (variant === 'cream') {
    return {
      fillActive:   'rgba(22,45,34,0.18)',
      fillInactive: 'rgba(22,45,34,0.07)',
      stroke:       'rgba(22,45,34,0.2)',
      tierLabel:    'rgba(22,45,34,0.4)',
      noteActive:   '#162D22',
      noteInactive: 'rgba(22,45,34,0.5)',
      descOrigin:   'rgba(22,45,34,0.45)',
      descName:     '#162D22',
      descBody:     'rgba(22,45,34,0.65)',
      empty:        'rgba(22,45,34,0.3)',
    }
  }
  return {
    fillActive:   'rgba(237,227,204,0.18)',
    fillInactive: 'rgba(237,227,204,0.06)',
    stroke:       'rgba(237,227,204,0.2)',
    tierLabel:    'rgba(237,227,204,0.35)',
    noteActive:   '#EDE3CC',
    noteInactive: 'rgba(237,227,204,0.5)',
    descOrigin:   'rgba(237,227,204,0.4)',
    descName:     '#EDE3CC',
    descBody:     'rgba(237,227,204,0.65)',
    empty:        'rgba(237,227,204,0.25)',
  }
}

function PyramidSVG({
  activeKey,
  colors,
}: {
  activeKey: 'top' | 'heart' | 'base' | null
  colors: ReturnType<typeof getColors>
}) {
  const fill = (tier: 'top' | 'heart' | 'base') =>
    activeKey === tier ? colors.fillActive : colors.fillInactive

  return (
    <svg viewBox="0 0 120 252" className="w-20 shrink-0 select-none" aria-hidden>
      <polygon
        points="60,8 76,82 44,82"
        fill={fill('top')}
        stroke={colors.stroke}
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
      <polygon
        points="44,86 76,86 92,158 28,158"
        fill={fill('heart')}
        stroke={colors.stroke}
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
      <polygon
        points="28,162 92,162 112,244 8,244"
        fill={fill('base')}
        stroke={colors.stroke}
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
    </svg>
  )
}

export function FragrancePyramid({ notes, variant = 'forest' }: Props) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const colors = getColors(variant)

  const prevNotesRef = useRef(notes)
  useEffect(() => {
    if (prevNotesRef.current !== notes) {
      setSelectedNote(null)
      prevNotesRef.current = notes
    }
  }, [notes])

  const activeKey = selectedNote
    ? notes.top.some(n => n.name === selectedNote.name)
      ? 'top'
      : notes.heart.some(n => n.name === selectedNote.name)
      ? 'heart'
      : 'base'
    : null

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

      <div className="flex gap-8 items-stretch shrink-0">
        <PyramidSVG activeKey={activeKey} colors={colors} />

        <div className="flex flex-col justify-between py-1 gap-6">
          {TIERS.map(tier => (
            <div key={tier.key}>
              <p
                className="text-[10px] uppercase tracking-[0.2em] mb-2"
                style={{ color: colors.tierLabel }}
              >
                {tier.label}
              </p>
              <div className="space-y-1">
                {notes[tier.key].map(note => (
                  <motion.button
                    type="button"
                    key={note.name}
                    onClick={() => setSelectedNote(note)}
                    whileHover={{ x: 2, transition: { duration: 0.15 } }}
                    aria-pressed={selectedNote?.name === note.name}
                    className="block text-left text-sm tracking-wide transition-colors duration-200"
                    style={{
                      color: selectedNote?.name === note.name
                        ? colors.noteActive
                        : colors.noteInactive,
                    }}
                  >
                    {note.name}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 h-52 lg:h-56 relative">
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <p
                className="text-[10px] uppercase tracking-[0.25em] mb-3"
                style={{ color: colors.descOrigin }}
              >
                {selectedNote.origin}
              </p>
              <h3
                className="font-serif text-3xl lg:text-4xl mb-4 leading-tight"
                style={{ color: colors.descName }}
              >
                {selectedNote.name}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ color: colors.descBody }}
              >
                {selectedNote.description}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center"
            >
              <p className="text-sm tracking-wide" style={{ color: colors.empty }}>
                Wybierz nutę, by poznać jej historię
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/pyramid/FragrancePyramid.tsx
git commit -m "feat: add variant prop to FragrancePyramid for cream/forest color schemes"
```

---

## Task 3: Footer — cream background

**Files:**
- Modify: `src/components/layout/Footer.tsx`

- [ ] **Step 1: Replace `src/components/layout/Footer.tsx`**

```tsx
export function Footer() {
  return (
    <footer className="section-cream border-t border-[rgba(22,45,34,0.08)] py-16 px-8 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
        <div>
          <p className="font-serif text-[#162D22] text-3xl mb-2">Sulcus</p>
          <p className="text-[rgba(22,45,34,0.4)] text-[11px] tracking-[0.25em]">
            Ślad który zostawiasz. Ślad który zostawia świat.
          </p>
        </div>
        <p className="text-[rgba(22,45,34,0.3)] text-[11px] tracking-widest">© 2026 Sulcus</p>
      </div>
    </footer>
  )
}
```

Changes from original: `bg-[#0a0a0a]` → `section-cream`, border opacity inverted, all text colors switched to forest.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Footer.tsx
git commit -m "feat: footer uses cream background"
```

---

## Task 4: Navigation — glass blur on scroll

**Files:**
- Modify: `src/components/layout/Navigation.tsx`

- [ ] **Step 1: Update scrolled background style in `<nav>`**

Find in `Navigation.tsx` (around line 28):
```tsx
style={{ backgroundColor: scrolled ? '#162D22' : 'transparent' }}
```

Replace with:
```tsx
style={{
  backgroundColor: scrolled ? 'rgba(22,45,34,0.92)' : 'transparent',
  backdropFilter: scrolled ? 'blur(12px)' : 'none',
  WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
}}
```

Everything else in `Navigation.tsx` stays exactly the same.

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/Navigation.tsx
git commit -m "feat: navigation uses glass blur on scroll"
```

---

## Task 5: Home page — section alternation

**Files:**
- Modify: `src/pages/Home.tsx`

Four targeted edits:

- [ ] **Step 1: Remove hardcoded text color from `RevealLine`**

`RevealLine` only renders inside the Filozofia section which becomes `.section-cream { color: #162D22 }`. Removing the explicit `text-[#EDE3CC]` class lets it inherit the correct color automatically.

Find (line 25):
```tsx
className="font-serif text-[#EDE3CC] text-3xl lg:text-[2.8rem] leading-snug tracking-wide"
```

Replace with:
```tsx
className="font-serif text-3xl lg:text-[2.8rem] leading-snug tracking-wide"
```

- [ ] **Step 2: Hero section — replace inline gradient with `section-forest` class**

Find (lines 87–88):
```tsx
<section className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
  style={{ background: 'linear-gradient(180deg, #0d1f16 0%, #162D22 100%)' }}>
```

Replace with:
```tsx
<section className="section-forest h-screen flex flex-col items-center justify-center relative overflow-hidden">
```

- [ ] **Step 3: Filozofia section → `section-cream`**

Find (line 111):
```tsx
<section className="bg-[#162D22] py-40 px-8 lg:px-24">
```

Replace with:
```tsx
<section className="section-cream py-40 px-8 lg:px-24">
```

- [ ] **Step 4: Kolekcja section → `section-forest`**

Find (line 120):
```tsx
<section ref={collectionRef} className="bg-[#162D22] py-24 px-8 lg:px-12">
```

Replace with:
```tsx
<section ref={collectionRef} className="section-forest py-24 px-8 lg:px-12">
```

Find (line 121):
```tsx
<h2 className="font-serif text-[#EDE3CC] text-4xl mb-14 tracking-wide">Kolekcja</h2>
```

Replace with:
```tsx
<h2 className="font-serif text-4xl mb-14 tracking-wide">Kolekcja</h2>
```

(Heading inherits cream color from `body { color: #EDE3CC }` — no explicit class needed.)

- [ ] **Step 5: Verify build**

```bash
npm run build
```

Expected: zero errors.

- [ ] **Step 6: Commit**

```bash
git add src/pages/Home.tsx
git commit -m "feat: alternate home page section backgrounds forest/cream"
```

---

## Task 6: Product page — pyramid section on cream

**Files:**
- Modify: `src/pages/Product.tsx`

- [ ] **Step 1: Main wrapper — add `section-forest` class**

Find (line 41):
```tsx
<main className="bg-[#162D22] min-h-screen">
```

Replace with:
```tsx
<main className="section-forest min-h-screen">
```

- [ ] **Step 2: Pyramid section — `section-cream`, inverted colors, `variant="cream"`**

Find (lines 139–147):
```tsx
<section ref={pyramidRef} className="py-24 px-8 lg:px-16 border-t border-[rgba(237,227,204,0.08)]">
  <h2
    className="font-serif text-[#EDE3CC] leading-none mb-16"
    style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
  >
    The Pyramid
  </h2>
  <FragrancePyramid notes={product.notes} />
</section>
```

Replace with:
```tsx
<section ref={pyramidRef} className="section-cream py-24 px-8 lg:px-16 border-t border-[rgba(22,45,34,0.08)]">
  <h2
    className="font-serif text-[#162D22] leading-none mb-16"
    style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
  >
    The Pyramid
  </h2>
  <FragrancePyramid notes={product.notes} variant="cream" />
</section>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Product.tsx
git commit -m "feat: product pyramid section on cream background"
```

---

## Verification Checklist

| Check | How |
|-------|-----|
| Gradient animates | Open `http://localhost:5173`, watch Hero for 10s — green shifts subtly through dark shades |
| `prefers-reduced-motion` | DevTools → Rendering → Emulate: reduce → Hero is flat `#162D22`, no animation |
| Hero → forest animated | Hero background moves |
| Filozofia → cream | Scroll past hero: cream `#EDE3CC` bg, dark text on all 4 reveal lines |
| Kolekcja → forest animated | Scroll further: animated gradient returns, product cards visible |
| Footer → cream | Bottom of page: cream bg, dark text |
| Nav blur | Scroll down: nav becomes semi-transparent dark with visible blur over content |
| Product gallery → forest | Navigate to `/product/morse`: top section animated gradient |
| Product pyramid → cream | Scroll to pyramid: cream bg with dark heading |
| Pyramid on cream | Click notes: SVG segments, labels, and description all use forest-dark tones |
| Build clean | `npm run build` — zero TypeScript errors |
