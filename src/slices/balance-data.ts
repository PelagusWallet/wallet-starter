import { createSlice } from "@reduxjs/toolkit"

import type { TokenNetworkAddressData } from "~background/services/network/controller"

const balanceDataSlice = createSlice({
  name: "balanceData",
  initialState: { balanceData: [] as TokenNetworkAddressData[] },
  reducers: {
    updateBalanceData: (state, newData) => {
      state.balanceData = newData.payload
    }
  }
})

export const { updateBalanceData } = balanceDataSlice.actions

export default balanceDataSlice.reducer
