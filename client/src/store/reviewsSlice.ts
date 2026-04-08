import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import Axios from '../Axios/Axios'

export interface Review {
  _id: string
  productId: string
  author: string
  rating: number
  text: string
  status: string
  riskScore: number
  createdAt?: string
  updatedAt?: string
  moderatorReason?: string
}

interface ReviewsState {
  items: Review[]
  loading: boolean
  error: string | null
  page: number
  limit: number
  total: number
  createLoading: boolean
  createError: string | null
  createSuccess: boolean
  updateLoading: boolean
  updateError: string | null
}

const initialState: ReviewsState = {
  items: [],
  loading: false,
  error: null,
  page: 1,
  limit: 10,
  total: 0,
  createLoading: false,
  createError: null,
  createSuccess: false,
  updateLoading: false,
  updateError: null,
}

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await Axios.get('/reviews', {
      params: { page, limit },
    })
    return response.data
  }
)

export const fetchApprovedReviews = createAsyncThunk(
  'reviews/fetchApprovedReviews',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
    const response = await Axios.get('/reviews/approved', {
      params: { page, limit },
    })
    return response.data
  }
)

export const createReview = createAsyncThunk<
  Review,
  {
    email: string
    rating: number
    text: string
    productId?: string
  },
  {
    rejectValue: string
  }
>('reviews/createReview', async ({ email, rating, text, productId }, { rejectWithValue }) => {
  try {
    const response = await Axios.post('/reviews', {
      productId: productId ?? 'default-product',
      author: email,
      rating,
      text,
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'Unable to create review.'
    )
  }
})

export const updateReview = createAsyncThunk<
  Review,
  {
    reviewId: string
    rating: number
    text: string
  },
  {
    rejectValue: string
  }
>('reviews/updateReview', async ({ reviewId, rating, text }, { rejectWithValue }) => {
  try {
    const response = await Axios.put(`/reviews/${reviewId}`, {
      rating,
      text,
    })
    return response.data.data || response.data
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'Unable to update review.'
    )
  }
})

export const approveReview = createAsyncThunk<
  Review,
  string,
  { rejectValue: string }
>('reviews/approveReview', async (reviewId, { rejectWithValue }) => {
  try {
    const response = await Axios.put(`/reviews/${reviewId}/approve`)
    return response.data
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'Unable to approve review.'
    )
  }
})

export const rejectReview = createAsyncThunk<
  Review,
  { reviewId: string; reason?: string },
  { rejectValue: string }
>('reviews/rejectReview', async ({ reviewId, reason }, { rejectWithValue }) => {
  try {
    const response = await Axios.put(`/reviews/${reviewId}/reject`, {
      reason: reason || ''
    })
    return response.data
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || error?.message || 'Unable to reject review.'
    )
  }
})

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = action.payload
    },
    clearError(state) {
      state.error = null
    },
    clearReviewCreateStatus(state) {
      state.createLoading = false
      state.createError = null
      state.createSuccess = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || []
        state.page = action.payload.pagination?.page ?? state.page
        state.limit = action.payload.pagination?.limit ?? state.limit
        state.total = action.payload.pagination?.total ?? state.total
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Unable to load reviews.'
      })
      .addCase(fetchApprovedReviews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchApprovedReviews.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.data || []
        state.page = action.payload.pagination?.page ?? state.page
        state.limit = action.payload.pagination?.limit ?? state.limit
        state.total = action.payload.pagination?.total ?? state.total
      })
      .addCase(fetchApprovedReviews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Unable to load approved reviews.'
      })
      .addCase(createReview.pending, (state) => {
        state.createLoading = true
        state.createError = null
        state.createSuccess = false
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.createLoading = false
        state.createSuccess = true
        state.items.unshift(action.payload)
        state.total += 1
      })
      .addCase(createReview.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload || 'Unable to create review.'
      })
      .addCase(updateReview.pending, (state) => {
        state.updateLoading = true
        state.updateError = null
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.updateLoading = false
        const index = state.items.findIndex((r) => r._id === action.payload._id)
        if (index > -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.updateLoading = false
        state.updateError = action.payload || 'Unable to update review.'
      })
      .addCase(approveReview.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r._id === action.payload._id)
        if (index > -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(rejectReview.fulfilled, (state, action) => {
        const index = state.items.findIndex((r) => r._id === action.payload._id)
        if (index > -1) {
          state.items[index] = action.payload
        }
      })
  },
})

export const { setPage, setLimit, clearError, clearReviewCreateStatus } = reviewsSlice.actions
export default reviewsSlice.reducer
