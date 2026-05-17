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
const APX = 140, APY = 40, BASE_Y = 520, BASE_HALF = 140
const PH = BASE_Y - APY

function rX(y: number) { return APX + (y - APY) * BASE_HALF / PH }
function lX(y: number) { return APX - (y - APY) * BASE_HALF / PH }

const T1Y = APY + PH / 3
const T2Y = APY + 2 * PH / 3

const TIERS = [
  {
    key:     'top'   as const,
    label:   'Nuty głowy',
    points:  `${APX},${APY} ${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y}`,
    opacity: 0.40,
  },
  {
    key:     'heart' as const,
    label:   'Nuty serca',
    points:  `${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y} ${rX(T2Y)},${T2Y} ${lX(T2Y)},${T2Y}`,
    opacity: 0.60,
  },
  {
    key:     'base'  as const,
    label:   'Nuty bazy',
    points:  `${lX(T2Y)},${T2Y} ${rX(T2Y)},${T2Y} ${APX + BASE_HALF},${BASE_Y} ${APX - BASE_HALF},${BASE_Y}`,
    opacity: 0.90,
  },
]

const FG = '237,227,204'

// ── Component ─────────────────────────────────────────────────────────────
export function FragrancePyramid({ notes }: Props) {
  const [selected, setSelected] = useState<'top' | 'heart' | 'base' | null>(null)

  function handleTier(key: 'top' | 'heart' | 'base') {
    setSelected(prev => prev === key ? null : key)
  }

  const selectedTier = TIERS.find(t => t.key === selected)

  return (
    <div className="flex flex-col lg:flex-row items-start gap-16 w-full">

      {/* ── Pyramid — centered, minimum 500px tall ── */}
      <div className="flex-shrink-0 w-full lg:w-1/2 flex items-center justify-center">
        <svg
          viewBox="0 0 280 560"
          style={{ height: 'clamp(500px, 60vh, 700px)', width: 'auto' }}
        >
          {TIERS.map(tier => {
            const isSelected = selected === tier.key
            const isDimmed   = selected !== null && !isSelected
            const fill = `rgba(${FG},${isDimmed ? tier.opacity * 0.3 : tier.opacity})`

            return (
              <polygon
                key={tier.key}
                points={tier.points}
                fill={fill}
                stroke={`rgba(${FG},0.12)`}
                strokeWidth="0.5"
                onClick={() => handleTier(tier.key)}
                style={{ cursor: 'pointer', transition: 'fill 0.4s ease' }}
              />
            )
          })}
        </svg>
      </div>

      {/* ── Panel — animates in/out ── */}
      <div className="flex-1 min-h-[400px] flex items-start pt-4">
        <AnimatePresence mode="wait">
          {selected && selectedTier ? (
            <motion.div
              key={selected}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full"
            >
              <p
                className="text-[10px] uppercase tracking-[0.35em] mb-10"
                style={{ color: `rgba(${FG},0.35)` }}
              >
                {selectedTier.label}
              </p>

              <div className="space-y-10">
                {notes[selected].map((note: Note) => (
                  <div key={note.name}>
                    <h4
                      className="font-serif text-2xl leading-tight mb-1"
                      style={{ color: `rgba(${FG},0.95)` }}
                    >
                      {note.name}
                    </h4>
                    <p
                      className="text-[10px] tracking-[0.2em] mb-2"
                      style={{ color: `rgba(${FG},0.3)` }}
                    >
                      {note.origin}
                    </p>
                    <p
                      className="text-sm leading-relaxed max-w-sm"
                      style={{ color: `rgba(${FG},0.6)` }}
                    >
                      {note.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm tracking-wide self-center"
              style={{ color: `rgba(${FG},0.2)` }}
            >
              Kliknij sekcję piramidy aby odkryć nuty
            </motion.p>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
