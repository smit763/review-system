import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counterSlice'
import reviewsReducer from './reviewsSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    reviews: reviewsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
