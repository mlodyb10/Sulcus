import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import { FragrancePyramid } from '@/components/pyramid/FragrancePyramid'
import { useCart } from '@/cart/CartContext'

const THUMB_COUNT = 4

export function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const pyramidRef = useRef<HTMLElement>(null)
  const [activeThumb, setActiveThumb] = useState(0)
  const [added, setAdded] = useState(false)

  const product = products.find(p => p.id === id)

  useEffect(() => {
    if (!product) navigate('/', { replace: true })
  }, [product, navigate])

  if (!product) return null

  function handleAdd() {
    addItem(product!)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/', { state: { scrollTo: 'collection' } })
    }
  }

  return (
    <main className="section-forest min-h-screen">

      {/* Top section — gallery + details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* Left: gallery */}
        <div className="flex gap-4 p-8 lg:p-12 lg:pt-24">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2 pt-1">
            {Array.from({ length: THUMB_COUNT }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveThumb(i)}
                className={`w-12 h-16 border transition-colors duration-200 flex items-center justify-center ${
                  activeThumb === i
                    ? 'border-[rgba(237,227,204,0.5)]'
                    : 'border-[rgba(237,227,204,0.12)] hover:border-[rgba(237,227,204,0.3)]'
                }`}
                style={{ background: 'linear-gradient(160deg, #0a1810, #162D22)' }}
              >
                <span className="font-serif text-[rgba(237,227,204,0.12)] text-sm">{product.name[0]}</span>
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 relative overflow-hidden border border-[rgba(237,227,204,0.08)]"
            style={{ minHeight: '70vh' }}>
            <motion.div
              key={activeThumb}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'linear-gradient(160deg, #0a1810 0%, #162D22 100%)' }}
            >
              <span className="font-serif text-[rgba(237,227,204,0.05)] select-none"
                style={{ fontSize: 'clamp(6rem, 18vw, 14rem)', lineHeight: 1 }}>
                {product.name[0]}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right: details — sticky */}
        <div
          className="px-8 lg:px-12 py-8 lg:py-24 flex flex-col"
          style={{
            position: 'sticky',
            top: '2rem',
            maxHeight: '100vh',
            overflowY: 'auto',
            alignSelf: 'start',
          }}
        >
          <button
            type="button"
            onClick={handleBack}
            className="font-sans text-[rgba(237,227,204,0.35)] hover:text-[rgba(237,227,204,0.7)] text-[10px] tracking-[0.3em] uppercase transition-colors mb-16 self-start"
          >
            ← Back
          </button>

          <h1
            className="font-serif text-[#EDE3CC] leading-none mb-6"
            style={{ fontSize: 'clamp(4rem, 8vw, 7rem)' }}
          >
            {product.name}
          </h1>

          <p className="text-[rgba(237,227,204,0.6)] text-base leading-relaxed mb-8 max-w-xs">
            {product.description}
          </p>

          <p className="font-serif text-[#EDE3CC] text-3xl mb-10">{product.price} PLN</p>

          <button
            type="button"
            onClick={handleAdd}
            className="py-4 border border-[rgba(237,227,204,0.5)] text-[#EDE3CC] text-[10px] tracking-[0.4em] uppercase hover:bg-[#EDE3CC] hover:text-[#162D22] transition-all duration-200 mb-8"
          >
            {added ? 'Added ✓' : 'Add to Bag'}
          </button>

          <motion.button
            type="button"
            onClick={() => pyramidRef.current?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="font-sans text-[rgba(237,227,204,0.4)] hover:text-[rgba(237,227,204,0.75)] text-[10px] tracking-[0.35em] uppercase transition-colors self-start"
          >
            ↓ discover the pyramid
          </motion.button>
        </div>
      </div>

      {/* Pyramid section */}
      <section ref={pyramidRef} className="section-cream py-24 px-8 lg:px-16 border-t border-[rgba(22,45,34,0.08)]">
        <h2
          className="font-serif text-[#162D22] leading-none mb-16"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
        >
          The Pyramid
        </h2>
        <FragrancePyramid notes={product.notes} variant="cream" />
      </section>

    </main>
  )
}
