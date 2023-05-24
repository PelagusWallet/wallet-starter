// @material-tailwind/react
import React from "react"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"
import { Route, Router } from "wouter"

import { Storage } from "@plasmohq/storage"

import MenuBar from "~components/navigation/MenuBar"
import AccountData from "~pages/accounts/accountData"
import Accounts from "~pages/accounts/accounts"
import Collectibles from "~pages/main/collectibles"
import Contacts from "~pages/main/contacts"
import Home from "~pages/main/home"
import Swap from "~pages/main/swap"
import Unlock from "~pages/unlock/unlock"
import { useSetUp } from "~storage/wallet"
import { store } from "~store"
import { useHashLocation } from "~utils/router"

import "./style.css"

import { useEffect, useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import Fetcher from "~pages/main/fetcher"
import SendConfirm from "~pages/main/send/confirm"
import SendFrom from "~pages/main/send/from"
import SendTo from "~pages/main/send/to"
import SettingsAbout from "~pages/settings/about"
import AdvancedList from "~pages/settings/advanced/advancedList"
import DomainPermissions from "~pages/settings/advanced/permissions/permissions"
import GeneralSettings from "~pages/settings/general/general"
import SettingsList from "~pages/settings/list"
import AddCustomNetwork from "~pages/settings/networks/add"
import SwitchNetworks from "~pages/settings/networks/switch"
import SecurityAndPrivacy from "~pages/settings/securityAndPrivacy"
import AddCustomToken from "~pages/token/addToken"
import TokenPage from "~pages/token/token"
import type { StoredWallet } from "~storage/wallet"

const storage = new Storage({ area: "local" })

function IndexPopup() {
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
      <div className="bg-container">
        {signedIn && (
          <div>
            <Toaster />
            <Fetcher />
            <Router hook={useHashLocation}>
              <MenuBar activeWallet={activeWallet} />
              <div className="pt-[66px]"></div>
              <Route path="/" component={() => <Home />} />
              <Route path="/send">
                <SendFrom activeWallet={activeWallet} />
              </Route>
              <Route path="/send?/:fromAddr" component={SendTo} />
              <Route
                path="/send?/confirm/:fromAddr?/:toAddr"
                component={SendConfirm}
              />
              <Route path="/contacts">
                <Contacts />
              </Route>
              <Route path="/swap" component={Swap} />
              <Route path="/collectibles" component={Collectibles} />
              <Route path="/settings" component={SettingsList} />
              <Route path="/settings/general" component={GeneralSettings} />
              <Route path="/settings/network">
                <SwitchNetworks activeNetwork={activeNetwork} />
              </Route>
              <Route
                path="/settings/network/add"
                component={AddCustomNetwork}
              />
              <Route path="/settings/advanced" component={AdvancedList} />
              <Route
                path="/settings/advanced/permissions"
                component={DomainPermissions}
              />
              <Route path="/settings/security" component={SecurityAndPrivacy} />
              <Route path="/settings/about" component={SettingsAbout} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/accounts?/:account" key={renderKey}>
                <AccountData key={renderKey} activeWallet={activeWallet} />
              </Route>

              <Route path="/token" component={TokenPage} />
              <Route path="/token/add" component={AddCustomToken} />
            </Router>
          </div>
        )}
        {!signedIn && (
          <div className="flex flex-col justify-center items-center h-full">
            <Router hook={useHashLocation}>
              <Route path="/" component={Unlock} />
            </Router>
          </div>
        )}
      </div>
    </Provider>
  )
}

export default IndexPopup
