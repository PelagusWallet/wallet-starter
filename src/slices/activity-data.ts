import { createSlice } from "@reduxjs/toolkit"

import type { RPCTransactionResult } from "~background/services/network/controller"

export interface ActivityData {
  activityResults: RPCTransactionResult[]
}

const activityDataSlice = createSlice({
  name: "addressData",
  initialState: { activityResults: [] } as ActivityData,
  reducers: {
    updateActivityData: (state, newData) => {
      state.activityResults = newData.payload
    }
  }
})

export const { updateActivityData } = activityDataSlice.actions

export default activityDataSlice.reducer
