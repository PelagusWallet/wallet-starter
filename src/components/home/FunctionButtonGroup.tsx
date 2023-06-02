import {
  ArrowUpRightIcon,
  ArrowsRightLeftIcon,
  PlusIcon
} from "@heroicons/react/24/solid"
import { FaFaucet } from "react-icons/fa"
import { useLocation } from "wouter"

import { updateActiveToken } from "~slices/active-token"
import { useAppDispatch } from "~store"

import "../../style.css"

import { DEFAULT_TOKENS } from "~storage/token"

export default function FunctionButtonGroup() {
  // router
  const [, setLocation] = useLocation()
  const dispatch = useAppDispatch()

  const openFaucet = () => {
    window.open(process.env.PLASMO_PUBLIC_FAUCET_LINK, "_blank")
  }

  function navigateToSend() {
    dispatch(updateActiveToken(DEFAULT_TOKENS[0]))
    setLocation("/send")
  }

  return (
    <>
      <div
        className="w-full inline-flex rounded-md justify-center pl-3 pr-3 h-content"
        role="group">
        <button
          onClick={() => openFaucet()}
          className="flex home-button-outer group w-1/3">
          <div className="flex flex-col items-center m-auto">
            <FaFaucet className="h-6 w-6" />
            <span className="home-button-inner">Faucet</span>
          </div>
        </button>
        <button
          className="flex home-button-outer group w-1/3"
          onClick={() => navigateToSend()}>
          <div className="flex flex-col items-center m-auto">
            <ArrowUpRightIcon className="h-6 w-6" />
            <span className="home-button-inner">Send</span>
          </div>
        </button>
        <button className="flex home-button-outer group w-1/3">
          <div className="flex flex-col items-center m-auto">
            <ArrowsRightLeftIcon className="h-6 w-6" />
            <span className="home-button-inner">Swap</span>
          </div>
        </button>
      </div>
    </>
  )
}
