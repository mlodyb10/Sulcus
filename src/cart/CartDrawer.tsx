import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from './CartContext'

export function CartDrawer() {
  const { items, isOpen, itemCount, total, removeItem, setQuantity, closeCart } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-[#162D22] border-l border-[rgba(237,227,204,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-[rgba(237,227,204,0.1)]">
              <h2 className="font-serif text-[#EDE3CC] text-lg tracking-[0.3em] uppercase">
                Bag ({itemCount})
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close cart"
                className="text-[rgba(237,227,204,0.5)] hover:text-[#EDE3CC] transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
              {items.length === 0 ? (
                <p className="text-[rgba(237,227,204,0.3)] text-sm text-center mt-16 tracking-wide">
                  Your bag is empty.
                </p>
              ) : (
                items.map(item => (
                  <div key={item.product.id} className="flex gap-5">
                    <div className="w-16 h-20 shrink-0 overflow-hidden border border-[rgba(237,227,204,0.1)]">
                      <img
                        src={`/${item.product.id}_1.jpeg`}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[#EDE3CC] text-lg leading-tight">{item.product.name}</p>
                      <p className="text-[rgba(237,227,204,0.5)] text-xs tracking-widest mt-0.5">
                        {item.product.price} PLN
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center border border-[rgba(237,227,204,0.25)] text-[rgba(237,227,204,0.6)] hover:text-[#EDE3CC] hover:border-[rgba(237,227,204,0.5)] transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          −
                        </button>
                        <span className="text-[#EDE3CC] text-sm w-4 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center border border-[rgba(237,227,204,0.25)] text-[rgba(237,227,204,0.6)] hover:text-[#EDE3CC] hover:border-[rgba(237,227,204,0.5)] transition-colors text-sm"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product.id)}
                          className="ml-auto text-[rgba(237,227,204,0.3)] hover:text-[rgba(237,227,204,0.6)] text-[10px] tracking-[0.2em] uppercase transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-8 py-6 border-t border-[rgba(237,227,204,0.1)] space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-[rgba(237,227,204,0.5)] text-[10px] tracking-[0.3em] uppercase">Total</span>
                  <span className="font-serif text-[#EDE3CC] text-2xl">{total} PLN</span>
                </div>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="w-full py-4 border border-[rgba(237,227,204,0.15)] text-[rgba(237,227,204,0.3)] text-[10px] tracking-[0.4em] uppercase cursor-not-allowed"
                >
                  Checkout — Coming Soon
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
