import { getActiveWallet, setActiveWallet } from "~storage/wallet"
import type { StoredWallet } from "~storage/wallet"

/**
 * Added wallets change listener.
 * Fixup active address in case the current
 * active address' wallet has been removed.
 */
export async function walletsChangeListener(wallets: StoredWallet[]) {
  // remove if there are no wallets added
  if (!wallets || wallets.length === 0) {
    return await setActiveWallet(undefined)
  }

  // get current address
  const activeWallet = await getActiveWallet()

  // check if the active wallet has been removed
  if (!activeWallet) {
    // update active wallet
    // return setActiveWallet(wallets[0].pubkey)
  }
}
