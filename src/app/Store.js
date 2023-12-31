import { configureStore } from '@reduxjs/toolkit'
import { userSlice } from './Slice'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { PostApi } from '../services/Post'

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [PostApi.reducerPath]: PostApi.reducer,
    // users: userSlice,
    user: userSlice.reducer, // Change "users" to "user"
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(PostApi.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)