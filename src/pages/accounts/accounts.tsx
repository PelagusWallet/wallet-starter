import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import Jdenticon from "react-jdenticon"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Address, StoredWallet } from "~storage/wallet"

import "../../style.css"

import { useEffect, useState } from "react"
import pelagusLogo from "url:/assets/pelagus-logo.png"

import type NetworkController from "~background/services/network/controller"
import Footer from "~components/navigation/Footer"

export default function Accounts() {
  // router
  const [, setLocation] = useLocation()
  const [walletBalances, setWalletBalances] = useState({})

  // wallets
  const [wallets, setWallets] = useStorage<StoredWallet[]>({
    key: "wallets",
    instance: new Storage({
      area: "local"
    })
  })

  // wallets
  const [activeWallet] = useStorage<string>({
    key: "active_wallet",
    instance: new Storage({
      area: "local"
    })
  })

  // network controller
  const [networkController] =
    useStorage<NetworkController>("network_controller")

  useEffect(() => {
    wallets.forEach((item) => {
      let itemKey = item.pubkey
      let balance = 0

      if (activeWallet == itemKey) {
        // Iterating on the active wallet, we have the balance in our network controller.
        balance = networkController?.addresses.reduce((accumulator, object) => {
          return accumulator + object.balance
        }, 0)
      } else {
        // balance = lookupAggregateBalance(item)
      }
      setWalletBalances((walletBalances) => ({
        ...walletBalances,
        [itemKey]: balance
      }))
    })
  }, [wallets.length, networkController])

  function getAddressCount(wallet: StoredWallet) {
    let activeChainCode = networkController.activeNetwork.chainCode
    const derivationPath = wallet.derivations.find(
      (derivation) => derivation.chainCode === activeChainCode
    )
    return derivationPath.addresses?.length
  }

  async function lookupAggregateBalance(wallet: StoredWallet) {
    // let balance = networkController.lookupTotalBalance(wallet)
  }

  return (
    <div className="max-h-screen font-quai">
      <ul role="list" className="pl-3 pr-3">
        {wallets.map((item, i) => (
          <li
            onClick={() => setLocation("/accounts?/" + item.pubkey)}
            key={i}
            className="cursor-pointer flex overflow-hidden w-full rounded-md bg-transparent p-2 shadow border border-border-teal">
            <div className="w-content">
              <div className="border-2 max-w-fit max-h-fit rounded-full border-white">
                <Jdenticon
                  color="white"
                  size="46"
                  value={item.pubkey ? item.pubkey : "test"}
                />
              </div>
            </div>
            <div className="flex-col mx-2">
              <h1 className="text-white text-xl">{item.nickname}</h1>
              <h1 className="text-white text-xl font-thin">
                {walletBalances[item.pubkey] ? walletBalances[item.pubkey] : 0}
              </h1>
            </div>
            <div className="flex-col flex ml-auto justify-end text-end">
              <div className="font-thin text-quai-off-white">{item.type}</div>
              <div className="font-thin text-md text-white">
                {getAddressCount(item)} Total Addresses
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="fixed bottom-12 mb-5 px-6 w-full">
        <div className="cursor-pointer first-line:my-1 text-md font-thin text-white">
          Generate New Wallet
        </div>
        <div className="cursor-pointer my-1 text-md font-thin text-white">
          Add New Wallet
        </div>
        <div className="cursor-pointer my-1 text-md font-thin text-white">
          Connect Hardware Wallet
        </div>
        <button className="w-full bg-white rounded-lg py-4 text-lg">
          Lock Account
        </button>
      </div>
      <Footer />
    </div>
  )
}
