import browser from "webextension-polyfill"

import { keepAlive } from "@plasmohq/persistent/background"
import { Storage } from "@plasmohq/storage"

import InitializePelagus from "~background/index"
import { walletsChangeListener } from "~storage/wallet/event"
import { getStorageConfig } from "~utils/storage"

// create storage client
const storage = new Storage(getStorageConfig())

storage.watch({
  wallets: (c) => {
    walletsChangeListener(c.newValue)
  }
})

// browser.runtime.onMessage.addListener((msg) => {})

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("/tabs/welcome.html") })
})

InitializePelagus()

keepAlive()

export {}
