import {
  ArrowDownIcon,
  ArrowUpRightIcon,
  ArrowsRightLeftIcon
} from "@heroicons/react/24/solid"
import { FaFaucet } from "react-icons/fa"
import { useLocation } from "wouter"

import { updateActiveToken } from "~slices/active-token"
import { useAppDispatch } from "~store"

import "../../style.css"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { DEFAULT_TOKENS } from "~storage/token"
import type { StoredWallet } from "~storage/wallet"

const storage = new Storage({ area: "local" })

export default function FunctionButtonGroup() {
  // router
  const [location, setLocation] = useLocation()
  const dispatch = useAppDispatch()

  const [activeWallet] = useStorage<StoredWallet>({
    key: "active_wallet",
    instance: storage
  })

  const openFaucet = () => {
    window.open(process.env.PLASMO_PUBLIC_FAUCET_LINK, "_blank")
  }

  function navigateToSend() {
    dispatch(updateActiveToken(DEFAULT_TOKENS[0]))
    setLocation("/send")
  }

  function navigateToAccounts() {
    // if location contains /accounts, go to home
    // else go to /accounts
    if (location.includes("accounts")) {
      setLocation("/")
    } else {
      setLocation("/accounts?/" + activeWallet.pubkey)
    }
  }

  return (
    <div className="pl-3 pr-3">
      <div className="px-1">
        <button
          onClick={() => openFaucet()}
          className="flex btn-class-secondary font-medium w-full py-2">
          <div className="flex flex-row items-center m-auto">
            <FaFaucet className="h-6 w-6" />
            <span className="home-button-inner pl-1">Faucet</span>
          </div>
        </button>
      </div>
      <div
        className="w-full inline-flex rounded-md justify-center h-content"
        role="group">
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button
            onClick={() => navigateToAccounts()}
            className="flex btn-class py-2 w-full">
            <div className="flex flex-col items-center m-auto">
              <ArrowDownIcon className="h-6 w-6" />
            </div>
          </button>
          <span className="home-button-inner">Receive</span>
        </div>
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button
            className="flex btn-class py-2 w-full"
            onClick={() => navigateToSend()}>
            <div className="flex flex-col items-center m-auto">
              <ArrowUpRightIcon className="h-6 w-6" />
            </div>
          </button>
          <span className="home-button-inner">Send</span>
        </div>
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button className="flex btn-class py-2 w-full">
            <div className="flex flex-col items-center m-auto">
              <ArrowsRightLeftIcon className="h-6 w-6" />
            </div>
          </button>
          <span className="home-button-inner">Swap</span>
        </div>
      </div>
    </div>
  )
}
