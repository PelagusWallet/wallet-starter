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
        <div className="flex flex-col w-1/3 group home-button-outer justify-center">
          <button
            className="flex btn-class py-2 w-full"
            onClick={() => setLocation("/send")}>
            <div className="flex flex-col items-center m-auto">
              <ArrowUpRightIcon className="h-6 w-6" />
            </div>
          </button>
          <span className="home-button-inner">Send</span>
        </div>
      </div>
    </>
  )
}
