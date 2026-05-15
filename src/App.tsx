import { useState } from 'react'
import { createBrowserRouter, RouterProvider, ScrollRestoration, Outlet } from 'react-router'
import { CartProvider } from '@/cart/CartContext'
import { CartDrawer } from '@/cart/CartDrawer'
import { LenisProvider } from '@/components/layout/LenisProvider'
import { Preloader } from '@/components/preloader/Preloader'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { Home } from '@/pages/Home'
import { Product } from '@/pages/Product'

function Root() {
  const [ready, setReady] = useState(
    sessionStorage.getItem('sulcus_preloader_seen') === '1'
  )

  return (
    <LenisProvider>
      {!ready && <Preloader onComplete={() => setReady(true)} />}
      <Navigation />
      <CartDrawer />
      <Outlet />
      <Footer />
      <ScrollRestoration />
    </LenisProvider>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: 'product/:id', element: <Product /> },
    ],
  },
])

export function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  )
}
