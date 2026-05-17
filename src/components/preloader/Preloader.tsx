import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onComplete: () => void
}

const FRAMES = [
  '/smoke.jpeg',
  '/skin.jpeg',
  '/fabric.jpeg',
  '/flame.jpeg',
  '/amber.jpeg',
]

export function Preloader({ onComplete }: Props) {
  const [frame, setFrame] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [ready, setReady] = useState(false)

  // Preload all images before starting the animation
  useEffect(() => {
    let loaded = 0
    const imgs = FRAMES.map(src => {
      const img = new Image()
      img.onload = () => {
        loaded++
        if (loaded === FRAMES.length) setReady(true)
      }
      img.onerror = () => {
        loaded++
        if (loaded === FRAMES.length) setReady(true)
      }
      img.src = src
      return img
    })
    return () => { imgs.forEach(img => { img.onload = null; img.onerror = null }) }
  }, [])

  useEffect(() => {
    if (!ready) return
    if (frame < FRAMES.length - 1) {
      const t = setTimeout(() => setFrame(f => f + 1), 180)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setExiting(true), 400)
      return () => clearTimeout(t)
    }
  }, [frame, ready])

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
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: ready ? `url('${FRAMES[frame]}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <motion.span
            key={`label-${frame}`}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.12 }}
            className="relative z-10 font-sans text-[#EDE3CC] tracking-[0.6em] text-xs uppercase select-none"
            style={{ mixBlendMode: 'screen' }}
          >
            SULCUS
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
