import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchApprovedReviews } from '../store/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { products } from '../data/products'
import { Rating } from '@mui/material'

const ProductDetail = () => {
  const { productId } = useParams()
  const dispatch = useAppDispatch()
  const { items, loading, error, page, limit, total } = useAppSelector(
    (state) => state.reviews
  )
  const [currentPage, setCurrentPage] = useState(page)

  const product = useMemo(
    () => products.find((item) => item.id === productId),
    [productId]
  )

  useEffect(() => {
    dispatch(fetchApprovedReviews({ page: currentPage, limit }))
  }, [dispatch, currentPage, limit])

  const productReviews = useMemo(
    () => items.filter((review) => review.productId === productId),
    [items, productId]
  )

  const totalPages = Math.max(1, Math.ceil(total / limit))

  if (!product) {
    return (
      <div className="px-6 py-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold">Product not found</h1>
          <p className="mt-2 text-sm text-slate-600">The product you are looking for does not exist.</p>
          <Link to="/" className="mt-5 inline-flex rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-8">
      <Link to="/" className="mb-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
        ← Back to products
      </Link>
      
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-600">{product.description}</p>
            <p className="mt-4 text-sm text-slate-500">Total reviews fetched: {productReviews.length}</p>
          </div>
          <Link
            to={`/product/${product.id}/add-review`}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Add review
          </Link>
        </div>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages} • {productReviews.length} reviews for this product
        </span>
      </div>

      {loading && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-700">
          Loading reviews...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-red-700">
          Error loading reviews: {error}
        </div>
      )}

      {!loading && !error && productReviews.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-700">
          No reviews yet for this product. Be the first to add one.
        </div>
      )}

      {!loading && !error && productReviews.length > 0 && (
        <div className="space-y-4">
          {productReviews.map((review) => (
            <article key={review._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold">{review.author}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-600">Rating:</span>
                    <Rating name="read-only" value={review.rating} readOnly size="small" />
                  </div>
                </div>
              </div>
              <p className="whitespace-pre-line text-slate-700">{review.text}</p>
              <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                <span>{review.createdAt ? new Date(review.createdAt).toLocaleString() : 'No timestamp'}</span>
              </footer>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1 || loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages || loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default ProductDetail
