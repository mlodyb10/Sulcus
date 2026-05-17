import { useRef, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { motion, useInView } from 'framer-motion'
import { products } from '@/data/products'
import { useCart } from '@/cart/CartContext'
import type { Product } from '@/data/products'

const FILOSOFIA = [
  'Każdy ślad jest podwójny.',
  'Ten który zostawiasz — i ten który zostawia na tobie świat.',
  'Sulcus nie jest zapachem.',
  'Jest tym co zostaje, gdy wszystko inne odejdzie.',
]

function RevealLine({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
      className="font-serif text-[#EDE3CC] leading-none"
      style={{ fontSize: 'clamp(2.5rem, 7vw, 8rem)' }}
    >
      {text}
    </motion.p>
  )
}

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleMouseEnter() {
    videoRef.current?.play()
  }

  function handleMouseLeave() {
    const v = videoRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer group relative overflow-hidden"
      style={{ aspectRatio: '3/4' }}
    >
      {/* Static image */}
      <img
        src={`/${product.id}.jpeg`}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
      />

      {/* Video — plays on hover */}
      <video
        ref={videoRef}
        src={`/${product.id}_video.mp4`}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />

      {/* Bottom info — always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
        <h3 className="font-serif text-[#EDE3CC] leading-none mb-2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}>
          {product.name}
        </h3>
        <p className="text-[rgba(237,227,204,0.45)] text-xs tracking-[0.25em] mb-5">
          {product.price} PLN
        </p>

        {/* Add to Bag — appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleAdd}
            className="py-3 px-8 border border-[rgba(237,227,204,0.4)] text-[#EDE3CC] text-[10px] tracking-[0.35em] uppercase hover:bg-[#EDE3CC] hover:text-[#162D22] transition-colors duration-200"
          >
            {added ? 'Added ✓' : 'Add to Bag'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Home() {
  const collectionRef = useRef<HTMLElement>(null)
  const location = useLocation()

  useEffect(() => {
    if (location.state?.scrollTo === 'collection') {
      setTimeout(() => collectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 80)
    }
  }, [location.state])

  return (
    <main>
      {/* Hero */}
      <section className="h-screen flex flex-col justify-center relative overflow-hidden bg-[#0a0a0a]">
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src="/Hero.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-[#162D22]/40" />

        <div className="relative z-10 flex flex-col items-start" style={{ paddingLeft: '6vw' }}>
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="font-serif text-[#EDE3CC] leading-none tracking-tight mb-10"
            style={{ fontSize: 'clamp(5rem, 12vw, 14rem)' }}
          >
            Ślad który<br />zostawiasz.
          </motion.h1>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
            onClick={() => collectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="font-sans text-[rgba(237,227,204,0.5)] text-[10px] tracking-[0.45em] uppercase hover:text-[rgba(237,227,204,0.85)] transition-colors border-b border-[rgba(237,227,204,0.2)] pb-1"
          >
            Odkryj kolekcję
          </motion.button>
        </div>
      </section>

      {/* Filozofia */}
      <section className="section-forest py-[15vh]" style={{ paddingLeft: '6vw', paddingRight: '6vw' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20vh' }}>
          {FILOSOFIA.map((line, i) => (
            <RevealLine key={i} text={line} />
          ))}
        </div>
      </section>

      {/* Kolekcja — full width, no heading, no padding */}
      <section ref={collectionRef} className="section-forest">
        <div className="grid grid-cols-2">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  )
}
