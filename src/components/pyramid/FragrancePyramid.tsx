import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Note } from '../../data/products'

interface PyramidNotes {
  top: Note[]
  heart: Note[]
  base: Note[]
}

interface Props {
  notes: PyramidNotes
}

// ── Geometry ──────────────────────────────────────────────────────────────
const APX = 140, APY = 40, BASE_Y = 580, BASE_HALF = 140
const PH = BASE_Y - APY  // 540

function rX(y: number) { return APX + (y - APY) * BASE_HALF / PH }
function lX(y: number) { return APX - (y - APY) * BASE_HALF / PH }

const T1Y = APY + PH / 3   // 220
const T2Y = APY + 2 * PH / 3  // 400

const SVG_H = 620

const TIERS = [
  {
    key:    'top'   as const,
    label:  'Nuty głowy',
    points: `${APX},${APY} ${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y}`,
    opacity: 0.40,
    midY:   Math.round((APY + T1Y) / 2),   // 130
  },
  {
    key:    'heart' as const,
    label:  'Nuty serca',
    points: `${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y} ${rX(T2Y)},${T2Y} ${lX(T2Y)},${T2Y}`,
    opacity: 0.60,
    midY:   Math.round((T1Y + T2Y) / 2),   // 310
  },
  {
    key:    'base'  as const,
    label:  'Nuty bazy',
    points: `${lX(T2Y)},${T2Y} ${rX(T2Y)},${T2Y} ${APX + BASE_HALF},${BASE_Y} ${APX - BASE_HALF},${BASE_Y}`,
    opacity: 0.90,
    midY:   Math.round((T2Y + BASE_Y) / 2), // 490
  },
]

const FG = '237,227,204'
const SVG_STYLE = { height: 'clamp(600px, 65vh, 720px)', width: 'auto', flexShrink: 0 as const }

// ── Component ─────────────────────────────────────────────────────────────
export function FragrancePyramid({ notes }: Props) {
  const [selected, setSelected] = useState<'top' | 'heart' | 'base' | null>(null)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  function handleTier(key: 'top' | 'heart' | 'base') {
    if (selected === key) {
      setSelected(null)
      setSelectedNote(null)
    } else {
      setSelected(key)
      setSelectedNote(null)
    }
  }

  function handleNote(e: React.MouseEvent, note: Note) {
    e.stopPropagation()
    setSelectedNote(prev => prev?.name === note.name ? null : note)
  }

  return (
    <div className="w-full flex flex-col items-center gap-12">

      {/* ── Row: pyramid + labels ── */}
      <div className="flex items-start">

        {/* SVG — pyramid + connecting line stubs */}
        <svg viewBox={`0 0 320 ${SVG_H}`} style={SVG_STYLE}>
          {TIERS.map(tier => {
            const isActive = selected === tier.key
            const isDimmed = selected !== null && !isActive
            const fill     = `rgba(${FG},${isDimmed ? tier.opacity * 0.28 : tier.opacity})`
            const rx       = rX(tier.midY)

            return (
              <g
                key={tier.key}
                onClick={() => handleTier(tier.key)}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points={tier.points}
                  fill={fill}
                  stroke={`rgba(${FG},0.12)`}
                  strokeWidth="0.5"
                  style={{ transition: 'fill 0.35s ease' }}
                />
                {/* Connecting line stub */}
                <line
                  x1={rx + 4} y1={tier.midY}
                  x2={312}    y2={tier.midY}
                  stroke={`rgba(${FG},${isActive ? 0.35 : 0.15})`}
                  strokeWidth="0.5"
                  style={{ transition: 'stroke 0.35s ease' }}
                />
              </g>
            )
          })}
        </svg>

        {/* HTML labels — absolutely positioned to match tier midY percentages */}
        <div
          className="relative pl-5 select-none"
          style={{ height: 'clamp(600px, 65vh, 720px)', width: 200 }}
        >
          {TIERS.map(tier => {
            const topPct    = (tier.midY / SVG_H) * 100
            const isActive  = selected === tier.key

            return (
              <div
                key={tier.key}
                className="absolute"
                style={{ top: `${topPct}%`, transform: 'translateY(-50%)', left: 0, right: 0 }}
              >
                {/* Tier label button */}
                <button
                  type="button"
                  onClick={() => handleTier(tier.key)}
                  className="text-left w-full"
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] transition-colors duration-300"
                    style={{ color: isActive ? `rgba(${FG},0.8)` : `rgba(${FG},0.35)` }}
                  >
                    {tier.label}
                  </span>
                </button>

                {/* Expandable note list */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2 space-y-1">
                        {notes[tier.key].map(note => {
                          const isNoteActive = selectedNote?.name === note.name
                          return (
                            <button
                              key={note.name}
                              type="button"
                              onClick={(e) => handleNote(e, note)}
                              className="block text-left text-sm tracking-wide transition-colors duration-200"
                              style={{ color: isNoteActive ? `rgba(${FG},0.95)` : `rgba(${FG},0.5)` }}
                            >
                              {note.name}
                            </button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Description panel — below pyramid ── */}
      <div className="w-full max-w-lg" style={{ minHeight: '120px' }}>
        <AnimatePresence mode="wait">
          {selectedNote ? (
            <motion.div
              key={selectedNote.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h4
                className="font-serif text-3xl leading-tight mb-2"
                style={{ color: `rgba(${FG},0.95)` }}
              >
                {selectedNote.name}
              </h4>
              <p
                className="text-[10px] tracking-[0.25em] mb-4"
                style={{ color: `rgba(${FG},0.3)` }}
              >
                {selectedNote.origin}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: `rgba(${FG},0.6)` }}
              >
                {selectedNote.description}
              </p>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm"
              style={{ color: `rgba(${FG},0.2)` }}
            >
              {selected
                ? 'Wybierz nutę aby poznać jej historię'
                : 'Kliknij poziom piramidy aby odkryć nuty'}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
