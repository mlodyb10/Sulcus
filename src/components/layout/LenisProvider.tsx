import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

export let lenisInstance: Lenis | null = null

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    lenisInstance = lenis
    return () => {
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return <>{children}</>
}
