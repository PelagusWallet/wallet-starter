import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import { syncStorage } from "redux-persist-webextension-storage"

import activeTokenSlice from "~slices/active-token"
import activityDataSlice from "~slices/activity-data"
import addressDataSlice from "~slices/address-data"
import tokenDataSlice from "~slices/token-balance-data"

// Here you can add all your reducers
const combinedReducers = combineReducers({
  addressData: addressDataSlice,
  activityData: activityDataSlice,
  activeToken: activeTokenSlice,
  tokenData: tokenDataSlice
})

const persistConfig = {
  key: "root",
  version: 1,
  storage: syncStorage
}

// Until persistReducer is fixed, we need to use this mock store to get the types
const mockStore = configureStore({
  reducer: combinedReducers
})

// @ts-ignore
export const store = configureStore({
  reducer: combinedReducers
}) as typeof mockStore

// Get the types from the mock store
export type RootState = ReturnType<typeof mockStore.getState>
export type AppDispatch = typeof mockStore.dispatch

// Export the hooks with the types from the mock store
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
