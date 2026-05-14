import { FragrancePyramid } from '@/components/pyramid/FragrancePyramid'
import { products } from '@/data/products'

export function App() {
  return (
    <div className="min-h-screen bg-[#162D22] p-16">
      <FragrancePyramid notes={products[0].notes} />
    </div>
  )
}
