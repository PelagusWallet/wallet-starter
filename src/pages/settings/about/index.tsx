import { Disclosure } from "@headlessui/react"
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import pelagusLogo from "url:/assets/group-68.png"
import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"

import "../../../style.css"

const links = [
  {
    name: "Terms of Service",
    url: "https://docs.quai.network/disclaimers/quai-network-wallet-terms-of-use"
  },
  {
    name: "Privacy Policy",
    url: "https://docs.quai.network/disclaimers/dashboard-privacy-policy"
  },
  {
    name: "General Disclaimer",
    url: "https://docs.quai.network/disclaimers/general-disclaimer"
  }
]

export default function SettingsAbout() {
  const [, setLocation] = useLocation()

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mt-3 space-y-1 px-2">
            <button
              onClick={() => setLocation("/settings")}
              className="text-gray-400">
              <ChevronLeftIcon
                className="h-6 w-6 quai-dark-grey"
                aria-hidden="true"
              />
            </button>
          </div>
          <img
            className="h-auto w-1/2 mb-10 mx-auto"
            src={pelagusLogo}
            alt="Pelagus"
          />
          <div className="mx-6 text-white">
            <div>
              <div className="text-white font-quai mb-1 text-lg">Version</div>
              <div className="text-blue-400 font-quai mb-1 mx-2 text-lg">
                {process.env.PLASMO_PUBLIC_PACKAGE_VERSION}
              </div>
            </div>

            <div className="text-white font-quai mb-1 text-lg">Links</div>
            {links.map(({ name, url }) => (
              <div
                key={name}
                onClick={() => window.open(url, "_blank")}
                className="text-blue-400 font-quai mb-1 mx-2 text-lg">
                {name}
              </div>
            ))}
          </div>
        </Disclosure>
      </div>
      <Footer />
    </>
  )
}
