import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
