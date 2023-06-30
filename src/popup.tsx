// @material-tailwind/react
import React from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"

import MainPage from "~pages/main"
import { store } from "~store"

function IndexPopup() {
  return (
    <Provider store={store}>
      <Toaster />
      <MainPage />
    </Provider>
  )
}

export default IndexPopup
