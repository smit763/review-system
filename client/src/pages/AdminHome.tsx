import { useEffect, useMemo, useState } from 'react'
import { fetchReviews, approveReview, rejectReview, updateReview, type Review } from '../store/reviewsSlice'
import { useAppDispatch, useAppSelector } from '../hooks'
import { products } from '../data/products'
import { Rating } from '@mui/material'

const AdminHome = () => {
  const dispatch = useAppDispatch()
  const { items, loading, error, page, limit, total } = useAppSelector(
    (state) => state.reviews
  )
  const [actioningId, setActioningId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(0)
  const [editText, setEditText] = useState('')
  const [editError, setEditError] = useState<string | null>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectSubmitting, setRejectSubmitting] = useState(false)

  const isLoggedIn = !!localStorage.getItem('token')
  useEffect(() => {
    dispatch(fetchReviews({ page, limit }))
  }, [dispatch, page, limit])

  const getProductName = useMemo(() => {
    const productMap = Object.fromEntries(products.map((p) => [p.id, p]))
    return (productId: string) => productMap[productId]?.name ?? 'Unknown Product'
  }, [])

  const getStatusColor = (status: string) => {
    if (status === 'pending') return 'bg-amber-50 border-amber-200'
    if (status === 'approved') return 'bg-green-50 border-green-200'
    if (status === 'rejected') return 'bg-red-50 border-red-200'
    return 'bg-white border-slate-200'
  }

  const getStatusBadgeColor = (status: string) => {
    if (status === 'pending') return 'bg-amber-100 text-amber-700'
    if (status === 'approved') return 'bg-green-100 text-green-700'
    if (status === 'rejected') return 'bg-red-100 text-red-700'
    return 'bg-slate-100 text-slate-700'
  }

  const handleApprove = async (reviewId: string) => {
    setActioningId(reviewId)
    await dispatch(approveReview(reviewId))
    await dispatch(fetchReviews({ page, limit }))
    setActioningId(null)
  }

  const handleReject = (reviewId: string) => {
    setRejectingId(reviewId)
    setRejectReason('')
  }

  const handleConfirmReject = async () => {
    if (!rejectingId) return
    setRejectSubmitting(true)
    try {
      await dispatch(rejectReview({ reviewId: rejectingId, reason: rejectReason }))
      await dispatch(fetchReviews({ page, limit }))
      setRejectingId(null)
      setRejectReason('')
    } finally {
      setRejectSubmitting(false)
    }
  }

  const handleCancelReject = () => {
    setRejectingId(null)
    setRejectReason('')
  }

  const handleStartEdit = (review: Review) => {
    setEditingId(review._id)
    setEditRating(review.rating)
    setEditText(review.text)
    setEditError(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditError(null)
  }

  const handleSaveEdit = async (reviewId: string) => {
    setEditSubmitting(true)
    setEditError(null)

    try {
      await dispatch(updateReview({ reviewId, rating: editRating, text: editText })).unwrap()
      await dispatch(fetchReviews({ page, limit }))
      setEditingId(null)
    } catch (caughtError: any) {
      setEditError(caughtError || 'Unable to save changes.')
    } finally {
      setEditSubmitting(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="px-6 py-8">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">All reviews</h1>
        </div>
      </header>

      <div className="mb-4 flex items-center gap-3">
        <span className="text-sm text-gray-500">
          Page {page} of {totalPages} • {total} total reviews
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

      {!loading && !error && items.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-slate-700">
          No reviews yet. Be the first to add one!
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="space-y-4">
          {items.map((review) => (
            <article
              key={review._id}
              className={`rounded-2xl border p-5 shadow-sm transition ${
                getStatusColor(review.status)
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {getProductName(review.productId)}
                  </span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    getStatusBadgeColor(review.status)
                  }`}>
                    {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                  </span>
                  <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    review.riskScore > 50
                      ? 'bg-red-100 text-red-700'
                      : review.riskScore > 25
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                  }`}>
                    Risk: {review.riskScore.toFixed(2)}
                  </span>
                </div>
              </div>

              {editingId === review._id ? (
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Edit rating</label>
                    <Rating
                      name="edit-rating"
                      value={editRating}
                      onChange={(_, value) => setEditRating(value ?? 0)}
                      size="small"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">Edit review text</label>
                    <textarea
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      rows={4}
                      className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {editError && (
                    <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                      {editError}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(review._id)}
                      disabled={editSubmitting}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {editSubmitting ? 'Saving...' : 'Save changes'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={editSubmitting}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{review.author}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-600">Rating:</span>
                        <Rating name="read-only" value={review.rating} readOnly size="small" />
                      </div>
                    </div>
                  </div>
                  <p className="mb-4 whitespace-pre-line text-slate-700">{review.text}</p>
                  <footer className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                    <span>{review.createdAt ? new Date(review.createdAt).toLocaleString() : 'No timestamp'}</span>
                  </footer>

                  {review.status === 'rejected' && review.moderatorReason && (
                    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3">
                      <p className="text-xs font-semibold text-red-700">Rejection reason:</p>
                      <p className="mt-1 text-sm text-red-700">{review.moderatorReason}</p>
                    </div>
                  )}

                  {isLoggedIn && (
                    <div className="flex flex-wrap gap-2">
                      {review.status === 'pending' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(review._id)}
                            disabled={actioningId === review._id}
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-500 disabled:opacity-50"
                          >
                            {actioningId === review._id ? 'Approving...' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(review._id)}
                            disabled={rejectingId !== null}
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                          >
                            {rejectingId === review._id ? 'Enter reason...' : 'Reject'}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(review)}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Edit review
                      </button>
                    </div>
                  )}
                </>
              )}
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => dispatch(fetchReviews({ page: Math.max(1, page - 1), limit }))}
          disabled={page <= 1 || loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => dispatch(fetchReviews({ page: Math.min(totalPages, page + 1), limit }))}
          disabled={page >= totalPages || loading}
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sm:max-w-md">
            <h2 className="text-lg font-semibold text-slate-900">Reject review</h2>
            <p className="mt-2 text-sm text-slate-600">
              Please provide a reason for rejecting this review.
            </p>

            <textarea
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={4}
              placeholder="Enter rejection reason..."
              className="mt-4 w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={rejectSubmitting}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
              >
                {rejectSubmitting ? 'Rejecting...' : 'Confirm rejection'}
              </button>
              <button
                type="button"
                onClick={handleCancelReject}
                disabled={rejectSubmitting}
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminHome
