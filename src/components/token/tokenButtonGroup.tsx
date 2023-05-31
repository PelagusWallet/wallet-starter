import {
  ArrowUpRightIcon,
  ArrowsRightLeftIcon,
  PlusIcon
} from "@heroicons/react/24/solid"
import { useLocation } from "wouter"

import "../../style.css"

export default function TokenButtonGroup() {
  // router
  const [, setLocation] = useLocation()

  const openFaucet = () => {
    window.open(process.env.PLASMO_PUBLIC_FAUCET_LINK, "_blank")
  }

  return (
    <>
      <div
        className="w-full inline-flex rounded-md justify-center pl-3 pr-3 h-content"
        role="group">
        <button
          className="flex home-button-outer group w-1/3"
          onClick={() => setLocation("/send")}>
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
