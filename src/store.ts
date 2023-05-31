import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { useDispatch, useSelector } from "react-redux"
import type { TypedUseSelectorHook } from "react-redux"
import { syncStorage } from "redux-persist-webextension-storage"

import activeAddresses from "~slices/active-addresses"
import activeTokenSlice from "~slices/active-token"
import activityDataSlice from "~slices/activity-data"
import addressDataSlice from "~slices/address-data"
import balanceDataSlice from "~slices/balance-data"

// Here you can add all your reducers
const combinedReducers = combineReducers({
  activeAddresses: activeAddresses,
  addressData: addressDataSlice,
  activityData: activityDataSlice,
  activeToken: activeTokenSlice,
  balanceData: balanceDataSlice
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
