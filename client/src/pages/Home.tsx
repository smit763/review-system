import { useNavigate } from 'react-router-dom'
import { products } from '../data/products'

const Home = () => {
  const navigate = useNavigate()



  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`)
  }

  return (
    <div className="px-6 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold">Products</h1>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-indigo-300"
          >
            <div className="text-left">
              <h2 className="text-lg font-semibold text-slate-900">{product.name}</h2>
              <p className="mt-2 text-sm text-slate-600">{product.description}</p>
            </div>
            <div className="mt-auto pt-4">
              <span className="inline-flex items-center justify-center rounded-lg bg-indigo-100 px-3 py-2 text-sm font-semibold text-indigo-700">
                View product
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default Home
