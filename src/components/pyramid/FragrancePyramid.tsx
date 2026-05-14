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

const TIERS = [
  { key: 'top' as const, label: 'Nuty głowy' },
  { key: 'heart' as const, label: 'Nuty serca' },
  { key: 'base' as const, label: 'Nuty bazy' },
]

function PyramidSVG({ activeKey }: { activeKey: 'top' | 'heart' | 'base' | null }) {
  const fill = (tier: 'top' | 'heart' | 'base') =>
    activeKey === tier ? 'rgba(237,227,204,0.18)' : 'rgba(237,227,204,0.06)'

  return (
    <svg viewBox="0 0 120 252" className="w-20 shrink-0 select-none" aria-hidden>
      {/* Top tier — triangle */}
      <polygon
        points="60,8 76,82 44,82"
        fill={fill('top')}
        stroke="rgba(237,227,204,0.2)"
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
      {/* Heart tier — trapezoid */}
      <polygon
        points="44,86 76,86 92,158 28,158"
        fill={fill('heart')}
        stroke="rgba(237,227,204,0.2)"
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
      {/* Base tier — trapezoid */}
      <polygon
        points="28,162 92,162 112,244 8,244"
        fill={fill('base')}
        stroke="rgba(237,227,204,0.2)"
        strokeWidth="0.5"
        style={{ transition: 'fill 0.4s' }}
      />
    </svg>
  )
}

export function FragrancePyramid({ notes }: Props) {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const activeKey = selectedNote
    ? notes.top.some(n => n.name === selectedNote.name)
      ? 'top'
      : notes.heart.some(n => n.name === selectedNote.name)
      ? 'heart'
      : 'base'
    : null

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

      {/* Left block: SVG + tier labels */}
      <div className="flex gap-8 items-stretch shrink-0">
        <PyramidSVG activeKey={activeKey} />

        {/* Tier labels column */}
        <div className="flex flex-col justify-between py-1 gap-6">
          {TIERS.map(tier => (
            <div key={tier.key}>
              <p className="text-[rgba(237,227,204,0.35)] text-[10px] uppercase tracking-[0.2em] mb-2">
                {tier.label}
              </p>
              <div className="space-y-1">
                {notes[tier.key].map(note => (
                  <motion.button
                    key={note.name}
                    onClick={() => setSelectedNote(note)}
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                    className={`block text-left text-sm tracking-wide transition-colors duration-200 ${
                      selectedNote?.name === note.name
                        ? 'text-[#EDE3CC]'
                        : 'text-[rgba(237,227,204,0.5)] hover:text-[rgba(237,227,204,0.8)]'
                    }`}
                  >
                    {note.name}
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right block: description panel — fixed height, no layout shift */}
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
              <p className="text-[rgba(237,227,204,0.4)] text-[10px] uppercase tracking-[0.25em] mb-3">
                {selectedNote.origin}
              </p>
              <h3 className="font-serif text-[#EDE3CC] text-3xl lg:text-4xl mb-4 leading-tight">
                {selectedNote.name}
              </h3>
              <p className="text-[rgba(237,227,204,0.65)] text-sm leading-relaxed max-w-sm">
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
              <p className="text-[rgba(237,227,204,0.25)] text-sm tracking-wide">
                Wybierz nutę, by poznać jej historię
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}
