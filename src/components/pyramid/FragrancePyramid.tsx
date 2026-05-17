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

// ── Pyramid geometry (SVG coordinate space) ──────────────────────────────
const APX = 140           // apex x (centre)
const APY = 60            // apex y — pushed down to leave room for top labels
const BASE_Y = 500        // base y (bottom)
const BASE_HALF = 140     // half-width of base (so full width = 280)
const PH = BASE_Y - APY   // pyramid height in SVG units = 440

function rX(y: number) { return APX + (y - APY) * BASE_HALF / PH }  // right edge at y
function lX(y: number) { return APX - (y - APY) * BASE_HALF / PH }  // left  edge at y

const T1Y = APY + PH / 3        // top/heart boundary  ≈ 207
const T2Y = APY + (2 * PH) / 3  // heart/base boundary ≈ 353

// Y-positions for 3 notes within each tier — spread evenly
const NOTE_Y = {
  top:   [APY + PH * 0.08, APY + PH * 0.16, APY + PH * 0.25] as const,
  heart: [APY + PH * 0.41, APY + PH * 0.50, APY + PH * 0.60] as const,
  base:  [APY + PH * 0.73, APY + PH * 0.83, APY + PH * 0.93] as const,
}

const LINE_END_X = 298  // where connecting line ends (before label)
const LABEL_X    = 306  // where note name text starts

// ── Color schemes ─────────────────────────────────────────────────────────
function getColors(variant: Variant) {
  if (variant === 'cream') {
    return {
      tierFills: [
        'rgba(22,45,34,0.25)',
        'rgba(22,45,34,0.50)',
        'rgba(22,45,34,0.80)',
      ] as const,
      stroke:     'rgba(22,45,34,0.15)',
      lineDim:    'rgba(22,45,34,0.18)',
      lineHot:    'rgba(22,45,34,0.6)',
      noteDim:    'rgba(22,45,34,0.4)',
      noteHot:    '#162D22',
      descOrigin: 'rgba(22,45,34,0.4)',
      descName:   '#162D22',
      descBody:   'rgba(22,45,34,0.65)',
      empty:      'rgba(22,45,34,0.3)',
    }
  }
  return {
    tierFills: [
      'rgba(237,227,204,0.40)',
      'rgba(237,227,204,0.60)',
      'rgba(237,227,204,0.90)',
    ] as const,
    stroke:     'rgba(237,227,204,0.12)',
    lineDim:    'rgba(237,227,204,0.18)',
    lineHot:    'rgba(237,227,204,0.7)',
    noteDim:    'rgba(237,227,204,0.40)',
    noteHot:    '#EDE3CC',
    descOrigin: 'rgba(237,227,204,0.40)',
    descName:   '#EDE3CC',
    descBody:   'rgba(237,227,204,0.65)',
    empty:      'rgba(237,227,204,0.25)',
  }
}

const TIERS = [
  { key: 'top'   as const },
  { key: 'heart' as const },
  { key: 'base'  as const },
]

// ── Component ─────────────────────────────────────────────────────────────
export function FragrancePyramid({ notes, variant = 'forest' }: Props) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const c = getColors(variant)

  const prevNotesRef = useRef(notes)
  useEffect(() => {
    if (prevNotesRef.current !== notes) {
      setSelectedNote(null)
      prevNotesRef.current = notes
    }
  }, [notes])

  return (
    <div className="flex flex-col lg:flex-row items-start w-full">

      {/* ── Left half: SVG pyramid + labels ────────────────────────────── */}
      <div className="w-full lg:w-1/2">
        <svg
          viewBox="0 0 540 530"
          className="w-full"
          style={{ minHeight: '400px' }}
          aria-label="Fragrance pyramid"
        >
          {/* Tier polygons — different opacities top→base */}
          {/* Top tier (triangle) */}
          <polygon
            points={`${APX},${APY} ${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y}`}
            fill={c.tierFills[0]}
            stroke={c.stroke}
            strokeWidth="0.5"
          />
          {/* Heart tier (trapezoid) */}
          <polygon
            points={`${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y} ${rX(T2Y)},${T2Y} ${lX(T2Y)},${T2Y}`}
            fill={c.tierFills[1]}
            stroke={c.stroke}
            strokeWidth="0.5"
          />
          {/* Base tier (trapezoid) */}
          <polygon
            points={`${lX(T2Y)},${T2Y} ${rX(T2Y)},${T2Y} ${APX + BASE_HALF},${BASE_Y} ${APX - BASE_HALF},${BASE_Y}`}
            fill={c.tierFills[2]}
            stroke={c.stroke}
            strokeWidth="0.5"
          />

          {/* Notes: dot + connecting line + label */}
          {TIERS.map(tier =>
            notes[tier.key].map((note, i) => {
              const y      = NOTE_Y[tier.key][i]
              const rx     = rX(y)
              const active = selectedNote?.name === note.name
              const lc     = active ? c.lineHot : c.lineDim
              const tc     = active ? c.noteHot : c.noteDim

              return (
                <g
                  key={note.name}
                  onClick={() => setSelectedNote(note)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-pressed={active}
                >
                  {/* Dot at pyramid edge */}
                  <circle cx={rx} cy={y} r="2" fill={lc} style={{ transition: 'fill 0.25s' }} />
                  {/* Horizontal connecting line */}
                  <line
                    x1={rx + 4} y1={y}
                    x2={LINE_END_X} y2={y}
                    stroke={lc} strokeWidth="0.5"
                    style={{ transition: 'stroke 0.25s' }}
                  />
                  {/* Note name */}
                  <text
                    x={LABEL_X} y={y + 4}
                    fill={tc}
                    fontSize="11"
                    fontFamily="'Space Grotesk', sans-serif"
                    letterSpacing="0.06em"
                    style={{ transition: 'fill 0.25s' }}
                  >
                    {note.name}
                  </text>
                </g>
              )
            })
          )}
        </svg>
      </div>

      {/* ── Right half: description panel ──────────────────────────────── */}
      <div className="w-full lg:w-1/2 lg:pl-12 mt-8 lg:mt-0 relative" style={{ minHeight: '220px' }}>
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.25em] mb-4"
                style={{ color: c.descOrigin }}
              >
                {selectedNote.origin}
              </p>
              <h3
                className="font-serif text-3xl lg:text-4xl mb-4 leading-tight"
                style={{ color: c.descName }}
              >
                {selectedNote.name}
              </h3>
              <p
                className="text-sm leading-relaxed max-w-sm"
                style={{ color: c.descBody }}
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
              className="flex items-start pt-4"
            >
              <p className="text-sm tracking-wide" style={{ color: c.empty }}>
                Wybierz nutę, by poznać jej historię
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
