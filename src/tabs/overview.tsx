import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Provider } from "react-redux"
import { Route, Router, Switch } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import Fetcher from "~pages/main/fetcher"
import Unlock from "~pages/unlock/unlock"
import type { StoredWallet } from "~storage/wallet"
import { useSetUp } from "~storage/wallet"
import { store } from "~store"
import { useHashLocation } from "~utils/router"

import "../style.css"

import Overview from "~pages/overview"

const storage = new Storage({ area: "local" })

export default function WalletOverview() {
  const [location, setLocation] = useHashLocation()

  // const [signedIn, setSignedIn] = useState<boolean>(false)
  const [renderKey, setRenderKey] = useState(0)

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: storage
  })

  const [activeWallet] = useStorage<StoredWallet>({
    key: "active_wallet",
    instance: storage
  })

  const [signedIn] = useStorage<boolean>({
    key: "signed_in",
    instance: storage
  })

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: storage
  })

  useEffect(() => {
    console.log("darkMode", darkMode)
    if (darkMode) {
      console.log("add dark")
      document.documentElement.classList.add("dark")
    } else {
      console.log("remove dark")
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Check user wallet accounts, load if first visit.
  useSetUp(darkMode)

  useEffect(() => {
    if (!activeWallet) return
  }, [activeWallet])

  return (
    <Provider store={store}>
      {signedIn && (
        <div>
          <Fetcher />

          <div className="h-screen w-screen bg-container">
            <Router hook={useHashLocation}>
              <Switch location={location}>
                <Route path="/" component={Overview} />
              </Switch>
            </Router>
          </div>
        </div>
      )}
      {!signedIn && (
        <div className="flex flex-col justify-center items-center h-full">
          <Router hook={useHashLocation}>
            <Route path="/" component={Unlock} />
          </Router>
        </div>
      )}
    </Provider>
  )
}
