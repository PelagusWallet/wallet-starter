import { createSlice } from "@reduxjs/toolkit"

import type { TokenNetworkData } from "~storage/token"

const activeTokenSlice = createSlice({
  name: "activeToken",
  initialState: { activeToken: {} as TokenNetworkData },
  reducers: {
    updateActiveToken: (state, newData) => {
      state.activeToken = newData.payload
    }
  }
})

export const { updateActiveToken } = activeTokenSlice.actions

export default activeTokenSlice.reducer
