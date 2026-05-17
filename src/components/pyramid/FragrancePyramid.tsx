import { useState, useRef, useEffect } from 'react'
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
const APX = 160, APY = 30, BASE_Y = 550, BASE_HALF = 160
const PH = BASE_Y - APY  // 520

function rX(y: number) { return APX + (y - APY) * BASE_HALF / PH }
function lX(y: number) { return APX - (y - APY) * BASE_HALF / PH }

const T1Y = APY + PH / 3   // ≈ 203
const T2Y = APY + 2 * PH / 3  // ≈ 377

// Y-positions for 3 notes within each tier
const NOTE_Y = {
  top:   [APY + PH * 0.09, APY + PH * 0.17, APY + PH * 0.25] as const,
  heart: [APY + PH * 0.41, APY + PH * 0.50, APY + PH * 0.60] as const,
  base:  [APY + PH * 0.73, APY + PH * 0.83, APY + PH * 0.93] as const,
}

const LINE_END_X = 350
const LABEL_X    = 358
const FG = '237,227,204'

const TIERS = [
  { key: 'top'   as const, fill: `rgba(${FG},0.40)` },
  { key: 'heart' as const, fill: `rgba(${FG},0.60)` },
  { key: 'base'  as const, fill: `rgba(${FG},0.90)` },
]

const TIER_POINTS = {
  top:   `${APX},${APY} ${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y}`,
  heart: `${lX(T1Y)},${T1Y} ${rX(T1Y)},${T1Y} ${rX(T2Y)},${T2Y} ${lX(T2Y)},${T2Y}`,
  base:  `${lX(T2Y)},${T2Y} ${rX(T2Y)},${T2Y} ${APX+BASE_HALF},${BASE_Y} ${APX-BASE_HALF},${BASE_Y}`,
}

// ── Component ─────────────────────────────────────────────────────────────
export function FragrancePyramid({ notes }: Props) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const prevNotesRef = useRef(notes)
  useEffect(() => {
    if (prevNotesRef.current !== notes) {
      setSelectedNote(null)
      prevNotesRef.current = notes
    }
  }, [notes])

  const activeTier = selectedNote
    ? notes.top.some(n => n.name === selectedNote.name) ? 'top'
      : notes.heart.some(n => n.name === selectedNote.name) ? 'heart'
      : 'base'
    : null

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col lg:flex-row items-center gap-16">

        {/* ── SVG: pyramid + connecting lines + note labels ── */}
        <div className="flex justify-center flex-shrink-0">
          <svg
            viewBox="0 0 620 590"
            style={{ height: '450px', width: 'auto' }}
          >
            {/* Tier polygons */}
            {TIERS.map(tier => {
              const isDimmed = activeTier !== null && activeTier !== tier.key
              const opacity  = isDimmed ? 0.2 : 1
              return (
                <polygon
                  key={tier.key}
                  points={TIER_POINTS[tier.key]}
                  fill={tier.fill}
                  stroke={`rgba(${FG},0.1)`}
                  strokeWidth="0.5"
                  style={{ opacity, transition: 'opacity 0.35s' }}
                />
              )
            })}

            {/* Note labels + connecting lines */}
            {(['top', 'heart', 'base'] as const).map(tierKey =>
              notes[tierKey].map((note, i) => {
                const y       = NOTE_Y[tierKey][i]
                const rx      = rX(y)
                const isActive = selectedNote?.name === note.name
                const tc      = isActive ? `rgba(${FG},0.95)` : `rgba(${FG},0.40)`
                const lc      = isActive ? `rgba(${FG},0.50)` : `rgba(${FG},0.15)`

                return (
                  <g
                    key={note.name}
                    onClick={() => setSelectedNote(prev => prev?.name === note.name ? null : note)}
                    style={{ cursor: 'pointer' }}
                    role="button"
                    aria-pressed={isActive}
                  >
                    {/* Dot */}
                    <circle cx={rx} cy={y} r="2.5" fill={lc} style={{ transition: 'fill 0.25s' }} />
                    {/* Line */}
                    <line
                      x1={rx + 5} y1={y} x2={LINE_END_X} y2={y}
                      stroke={lc} strokeWidth="0.5"
                      style={{ transition: 'stroke 0.25s' }}
                    />
                    {/* Label */}
                    <text
                      x={LABEL_X} y={y + 4}
                      fill={tc}
                      fontSize="13"
                      fontFamily="'Space Grotesk', sans-serif"
                      letterSpacing="0.04em"
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

        {/* ── Description panel ── */}
        <div className="w-full lg:w-1/2 flex items-center lg:min-h-[500px]">
          <AnimatePresence mode="wait">
            {selectedNote ? (
              <motion.div
                key={selectedNote.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <p className="text-[10px] uppercase tracking-[0.3em] mb-4"
                   style={{ color: `rgba(${FG},0.35)` }}>
                  {selectedNote.origin}
                </p>
                <h3 className="font-serif text-4xl lg:text-5xl leading-tight mb-5"
                    style={{ color: `rgba(${FG},0.95)` }}>
                  {selectedNote.name}
                </h3>
                <p className="text-base leading-relaxed max-w-sm"
                   style={{ color: `rgba(${FG},0.6)` }}>
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
                Wybierz nutę aby poznać jej historię
              </motion.p>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}
