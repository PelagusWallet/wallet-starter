import { createSlice } from "@reduxjs/toolkit"

import type { TokenNetworkAddressData } from "~background/services/network/controller"

const tokenBalanceDataSlice = createSlice({
  name: "tokenData",
  initialState: { tokenBalances: [] as TokenNetworkAddressData[] },
  reducers: {
    updateTokenBalanceData: (state, newData) => {
      state.tokenBalances = newData.payload
    }
  }
})

export const { updateTokenBalanceData } = tokenBalanceDataSlice.actions

export default tokenBalanceDataSlice.reducer
