import { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import type { Product } from '../data/products'

export interface CartItem {
  product: Product
  quantity: number
}

interface State {
  items: CartItem[]
  isOpen: boolean
}

type Action =
  | { type: 'ADD'; product: Product }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.product.id === action.product.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.product.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.product.id !== action.id) }
    case 'SET_QTY':
      if (action.quantity <= 0)
        return { ...state, items: state.items.filter(i => i.product.id !== action.id) }
      return {
        ...state,
        items: state.items.map(i =>
          i.product.id === action.id ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default: {
      const _exhaustive: never = action
      return _exhaustive
    }
  }
}

const KEY = 'sulcus_cart'

function isValidItem(x: unknown): x is CartItem {
  if (!x || typeof x !== 'object') return false
  const item = x as Record<string, unknown>
  const p = item.product as Record<string, unknown> | undefined
  return (
    typeof item.quantity === 'number' &&
    !!p &&
    typeof p.id === 'string' &&
    typeof p.price === 'number'
  )
}

function loadItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter(isValidItem) : []
  } catch {
    return []
  }
}

interface CartCtx {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  total: number
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const Ctx = createContext<CartCtx | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: loadItems(), isOpen: false })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state.items))
  }, [state.items])

  const addItem     = useCallback((p: Product) => dispatch({ type: 'ADD', product: p }), [])
  const removeItem  = useCallback((id: string) => dispatch({ type: 'REMOVE', id }), [])
  const setQuantity = useCallback((id: string, quantity: number) => dispatch({ type: 'SET_QTY', id, quantity }), [])
  const clearCart   = useCallback(() => dispatch({ type: 'CLEAR' }), [])
  const openCart    = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const closeCart   = useCallback(() => dispatch({ type: 'CLOSE' }), [])

  const itemCount = useMemo(
    () => state.items.reduce((s, i) => s + i.quantity, 0),
    [state.items]
  )
  const total = useMemo(
    () => state.items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [state.items]
  )

  const value = useMemo<CartCtx>(() => ({
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    total,
    addItem,
    removeItem,
    setQuantity,
    clearCart,
    openCart,
    closeCart,
  }), [state.items, state.isOpen, itemCount, total, addItem, removeItem, setQuantity, clearCart, openCart, closeCart])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useCart(): CartCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
