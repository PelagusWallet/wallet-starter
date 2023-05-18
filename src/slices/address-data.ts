import { createSlice } from "@reduxjs/toolkit"

import type { AddressWithData } from "~background/services/network/controller"

export interface AllAddressData {
  addressesWithData: AddressWithData[]
}

const addressDataSlice = createSlice({
  name: "addressData",
  initialState: { addressesWithData: [] } as AllAddressData,
  reducers: {
    updateAddressData: (state, newData) => {
      state.addressesWithData = newData.payload
    }
  }
})

export const { updateAddressData } = addressDataSlice.actions

export default addressDataSlice.reducer
