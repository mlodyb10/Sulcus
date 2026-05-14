import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useCart } from '@/cart/CartContext'

export function Navigation() {
  const { itemCount, openCart } = useCart()
  const [scrolled, setScrolled] = useState(false)
  const [prev, setPrev] = useState(itemCount)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (itemCount > prev) {
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
    }
    setPrev(itemCount)
  }, [itemCount, prev])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 px-8 lg:px-12 py-5 flex items-center justify-between transition-colors duration-500"
      style={{ backgroundColor: scrolled ? '#162D22' : 'transparent' }}
    >
      <Link
        to="/"
        className="font-sans text-[#EDE3CC] tracking-[0.45em] text-xs uppercase hover:text-[rgba(237,227,204,0.7)] transition-colors"
      >
        Sulcus
      </Link>

      <button
        type="button"
        onClick={openCart}
        aria-label="Open cart"
        className="relative text-[#EDE3CC] hover:text-[rgba(237,227,204,0.7)] transition-colors"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>

        {itemCount > 0 && (
          <motion.span
            animate={pulse ? { scale: [1, 1.45, 1] } : { scale: 1 }}
            transition={{ duration: 0.35 }}
            className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[#EDE3CC] text-[#162D22] text-[9px] font-bold flex items-center justify-center font-sans"
          >
            {itemCount > 9 ? '9+' : itemCount}
          </motion.span>
        )}
      </button>
    </nav>
  )
}
