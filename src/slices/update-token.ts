import { createSlice } from "@reduxjs/toolkit"

import type { TokenNetworkData } from "~storage/token"

const updateTokenSlice = createSlice({
  name: "updateToken",
  initialState: { customToken: {} as TokenNetworkData },
  reducers: {
    updateCustomToken: (state, newData) => {
      state.customToken = newData.payload
    }
  }
})

export const { updateCustomToken } = updateTokenSlice.actions

export default updateTokenSlice.reducer
