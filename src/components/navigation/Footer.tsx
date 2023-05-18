import "../../style.css"

import {
  Cog6ToothIcon,
  HomeIcon,
  IdentificationIcon,
  PhotoIcon
} from "@heroicons/react/24/solid"
import { useLocation } from "wouter"

export default function Footer() {
  // router
  const [, setLocation] = useLocation()
  return (
    <div className="footer-bg fixed bottom-0 w-full">
      <div className="relative ml-3 mr-3">
        {/* <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div> */}
      </div>
      <div className="flex w-full h-14" role="group">
        <button
          type="button"
          onClick={() => setLocation("/")}
          className="footer-button">
          <HomeIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setLocation("/collectibles")}
          className="footer-button">
          <PhotoIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setLocation("/contacts")}
          className="footer-button">
          <IdentificationIcon className="h-7 w-7" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setLocation("/settings")}
          className="footer-button">
          <Cog6ToothIcon className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
