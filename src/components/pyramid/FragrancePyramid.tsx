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
