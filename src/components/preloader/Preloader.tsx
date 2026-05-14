import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const FRAMES = [
  'linear-gradient(135deg, #0a0a0a 0%, #1a1510 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #1c140e 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #0d160a 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #1e1008 100%)',
  'linear-gradient(135deg, #0a0a0a 0%, #18120d 100%)',
]

export function Preloader({ onComplete }: Props) {
  const [frame, setFrame] = useState(0)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (frame < FRAMES.length - 1) {
      const t = setTimeout(() => setFrame(f => f + 1), 180)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setExiting(true), 400)
      return () => clearTimeout(t)
    }
  }, [frame])

  return (
    <AnimatePresence onExitComplete={() => {
      sessionStorage.setItem('sulcus_preloader_seen', '1')
      onComplete()
    }}>
      {!exiting && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ background: FRAMES[frame] }}
        >
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <filter id="preloader-noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#preloader-noise)" />
          </svg>

          <motion.span
            key={frame}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="relative z-10 font-sans text-[#EDE3CC] tracking-[0.6em] text-xs uppercase select-none"
          >
            SULCUS
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
