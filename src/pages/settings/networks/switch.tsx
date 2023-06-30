import "../../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import _ from "lodash"
import React from "react"
import { useLocation } from "wouter"

import SwitchNetworks from "~components/settings/networks/switchNetworks"

function SwitchNetworksPage({ activeNetwork }) {
  const [, setLocation] = useLocation()

  return (
    <div>
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
      <SwitchNetworks activeNetwork={activeNetwork} />
    </div>
  )
}

function arePropsEqual(prevProps, nextProps) {
  // Return true if the nextProps are equal to prevProps, otherwise return false.
  // In this case, we only compare the activeNetwork prop.
  return _.isEqual(prevProps.activeNetwork, nextProps.activeNetwork)
}

export default React.memo(SwitchNetworksPage, arePropsEqual)
