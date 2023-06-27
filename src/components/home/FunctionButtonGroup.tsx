import { ArrowDownIcon, ArrowUpRightIcon } from "@heroicons/react/24/solid"
import { FaFaucet } from "react-icons/fa"
import { useLocation } from "wouter"

import { updateActiveToken } from "~slices/active-token"
import { useAppDispatch } from "~store"

import "../../style.css"

import { DEFAULT_TOKENS } from "~storage/token"

export default function FunctionButtonGroup() {
  // router
  const [location, setLocation] = useLocation()
  const dispatch = useAppDispatch()

  const openFaucet = () => {
    window.open(process.env.PLASMO_PUBLIC_FAUCET_LINK, "_blank")
  }

  function navigateToSend() {
    dispatch(updateActiveToken(DEFAULT_TOKENS[0]))
    setLocation("/send")
  }

  function navigateToReceive() {
    setLocation("/receive")
  }

  return (
    <div className="pl-3 pr-3">
      <div
        className="w-full inline-flex rounded-md justify-center h-content"
        role="group">
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button
            onClick={() => openFaucet()}
            className="flex btn-class py-2 w-full">
            <div className="flex flex-col items-center m-auto">
              <FaFaucet className="h-6 w-6" />
            </div>
          </button>
          <span className="home-button-inner">Faucet</span>
        </div>
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button
            onClick={() => navigateToReceive()}
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
      </div>
    </div>
  )
}
