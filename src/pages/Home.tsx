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
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })

  return (
    <motion.p
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
      className="font-serif text-[#EDE3CC] text-3xl lg:text-[2.8rem] leading-snug tracking-wide"
    >
      {text}
    </motion.p>
  )
}

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="cursor-pointer group"
    >
      <div className="aspect-[3/4] relative overflow-hidden mb-5 border border-[rgba(237,227,204,0.08)]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1810] to-[#162D22]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-[rgba(237,227,204,0.06)] text-[8rem] leading-none select-none">
            {product.name[0]}
          </span>
        </div>
        <div className="absolute inset-0 bg-[rgba(237,227,204,0.04)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full py-3.5 bg-[#162D22]/90 backdrop-blur-sm border border-[rgba(237,227,204,0.4)] text-[#EDE3CC] text-[10px] tracking-[0.35em] uppercase hover:bg-[#EDE3CC] hover:text-[#162D22] transition-colors duration-200"
          >
            {added ? 'Added ✓' : 'Add to Bag'}
          </button>
        </div>
      </div>

      <h3 className="font-serif text-[#EDE3CC] text-2xl leading-none mb-1">{product.name}</h3>
      <p className="text-[rgba(237,227,204,0.45)] text-xs tracking-[0.25em]">{product.price} PLN</p>
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
      <section className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0d1f16 0%, #162D22 100%)' }}>
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
          className="font-serif text-[#EDE3CC] text-[7vw] lg:text-[5.5vw] leading-none tracking-tight text-center px-8 mb-12"
        >
          Ślad który zostawiasz.
        </motion.h1>

        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.55 }}
          onClick={() => collectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="font-sans text-[rgba(237,227,204,0.5)] text-[10px] tracking-[0.45em] uppercase hover:text-[rgba(237,227,204,0.85)] transition-colors border-b border-[rgba(237,227,204,0.2)] pb-1"
        >
          Odkryj kolekcję
        </motion.button>
      </section>

      {/* Filozofia */}
      <section className="bg-[#162D22] py-40 px-8 lg:px-24">
        <div className="max-w-3xl space-y-20">
          {FILOSOFIA.map((line, i) => (
            <RevealLine key={i} text={line} />
          ))}
        </div>
      </section>

      {/* Kolekcja */}
      <section ref={collectionRef} className="bg-[#162D22] py-24 px-8 lg:px-12">
        <h2 className="font-serif text-[#EDE3CC] text-4xl mb-14 tracking-wide">Kolekcja</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-4xl">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </main>
  )
}
