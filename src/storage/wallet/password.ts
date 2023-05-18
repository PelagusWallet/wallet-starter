import browser from "webextension-polyfill"

import { Storage } from "@plasmohq/storage"
import { SecureStorage } from "@plasmohq/storage/secure"

import { getKeyfiles, getWallets } from "./index"

const storage = new Storage({ area: "local" })
const secureStorage = new SecureStorage({ area: "local" })

/**
 * Unlock wallets and save decryption key
 *
 * **Warning**: SHOULD ONLY BE CALLED FROM THE AUTH VIEW / VIEWS
 *
 * @param password Password for unlocking
 */
export async function unlock(password: string) {
  // validate password
  if (!(await checkPassword(password))) {
    return false
  }

  // save decryption key
  await storage.set("decryption_key", password)
  await storage.set("signed_in", true)

  // schedule the key for removal
  await watchKeyRemoval()

  return true
}

/**
 * Check password against decryption key
 * or try to decrypt with it.
 *
 * @param password Password to check
 */
export async function checkPassword(password: string) {
  // try to check it agains the decryption key
  const oldDecryptionKey = await storage.get<string>("decryption_key")
  await storage.set("decryption_key", password)

  // try decrypting
  const keyfiles = await getKeyfiles()

  // No keyfiles means password did not work
  if (keyfiles.length === 0) {
    await storage.set("decryption_key", oldDecryptionKey)
    return false
  }

  try {
    return true
  } catch {
    await storage.remove("decryption_key")
    await storage.set("decryption_key", oldDecryptionKey)
    return false
  }
}

export async function signOut() {
  await storage.remove("decryption_key")
  await storage.remove("signed_in")
}

/**
 * Schedule removing the decryption key.
 * Removal occurs after one day or on window close event.
 */
export async function watchKeyRemoval() {
  // fetch current tab (auth window) for later verification
  //  const tab = await getActiveTab()

  // handle key remove alarm event
  const keyRemoveAlarmListener = async (alarm: browser.Alarms.Alarm) => {
    if (alarm.name !== "remove_decryption_key_scheduled") return
    await keyRemover()
  }

  // handle window close key removal event
  //   const keyRemoveWindowCloseListener = async (windowId: number) => {
  //     if (tab.windowId === windowId) return
  //     await keyRemover()
  //   }

  // remove decyrption key and listeners
  const keyRemover = async () => {
    await storage.remove("decryption_key")
    await storage.remove("signed_in")
    browser.windows.onRemoved.removeListener(keyRemover)
    browser.alarms.onAlarm.removeListener(keyRemoveAlarmListener)
    await browser.alarms.clear("remove_decryption_key_scheduled")
  }

  // remove the key on window close events
  // browser.windows.onRemoved.addListener(keyRemoveWindowCloseListener)

  // schedule removal of the key for security reasons
  browser.alarms.create("remove_decryption_key_scheduled", {
    delayInMinutes: 60 // 1 hour
  })
  browser.alarms.onAlarm.addListener(keyRemoveAlarmListener)
}
