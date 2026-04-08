import { useState, type FormEvent, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks'
import { createReview, clearReviewCreateStatus } from '../store/reviewsSlice'
import { products } from '../data/products'
import { Rating } from '@mui/material'

const AddReview = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { productId: routeProductId } = useParams()
  const { createLoading, createError, createSuccess } = useAppSelector(
    (state) => state.reviews
  )

  const initialProductId = routeProductId || products[0]?.id || ''

  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [productId, setProductId] = useState(initialProductId)
  const [formError, setFormError] = useState('')

  

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? products[0],
    [productId]
  )

  useEffect(() => {
    if (createSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearReviewCreateStatus())
        navigate(`/product/${productId}`)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [createSuccess, dispatch, navigate])


  useEffect(() => {
    if (routeProductId && routeProductId !== productId) {
      setProductId(routeProductId)
    }
  }, [routeProductId, productId])

  const validateForm = () => {
    if (!email.trim() || !rating || !text.trim() || !productId) {
      return 'Email, rating, product, and review text are required.'
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return 'Please enter a valid email address.'
    }
    if (rating < 1 || rating > 5) {
      return 'Please select a rating between 1 and 5 stars.'
    }
    if (text.trim().length < 10) {
      return 'Review text must be at least 10 characters long.'
    }
    return ''
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setFormError(validationError)
      return
    }

    setFormError('')
    dispatch(
      createReview({
        email,
        rating,
        text,
        productId,
      })
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={() => navigate(`/product/${productId}`)}
        className="mb-4 inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500"
      >
        ← Back to product
      </button>
    

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {selectedProduct && (
          <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
            <p className="font-semibold text-slate-900">{selectedProduct.name}</p>
            <p className="mt-1 text-sm text-slate-600">{selectedProduct.description}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <span className="block text-sm font-medium text-slate-700">Rating</span>
          <div className="mt-3">
            <Rating
              name="product-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue ?? 0)}
              precision={1}
              size="large"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reviewText" className="block text-sm font-medium text-slate-700">
            Review Text
          </label>
          <textarea
            id="reviewText"
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="mt-2 block w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            placeholder="Write your review here..."
            required
          />
        </div>

        {(formError || createError || createSuccess) && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              createSuccess
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {createSuccess ? 'Review submitted successfully. Redirecting...' : formError || createError}
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={createLoading}
            className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createLoading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddReview
