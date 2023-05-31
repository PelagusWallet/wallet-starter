import { createSlice } from "@reduxjs/toolkit"

import type { Address } from "~storage/wallet"

const activeAddressesSlice = createSlice({
  name: "activeAddresses",
  initialState: { activeAddresses: {} as Address[] },
  reducers: {
    updateActiveAddresses: (state, newData) => {
      state.activeAddresses = newData.payload
    }
  }
})

export const { updateActiveAddresses } = activeAddressesSlice.actions

export default activeAddressesSlice.reducer
