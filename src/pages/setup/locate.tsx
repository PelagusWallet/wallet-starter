import React, { useEffect, useState } from "react"

import "../../style.css"

import { QuaiContext } from "~background/services/network/chains"
import {
  getQuaiContextForLocation,
  setActiveLocation
} from "~storage/wallet/location"

function LocateShard({ onContinue }) {
  const [context, setContext] = useState<QuaiContext>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude
        var lon = position.coords.longitude

        let context = getQuaiContextForLocation(lat, lon)
        console.log("Latitude: " + lat + ", Longitude: " + lon)
        setContext(context)
        setActiveLocation(context.shard)
      },
      function (error) {
        console.error(
          "Error occurred while fetching geolocation: " + error.message
        )
      }
    )
  }, [])

  return (
    <div>
      <div className=" flex justify-center">
        <div>{context?.shard}</div>
      </div>
      <div className="flex justify-center pt-10">
        <button
          data-testid="pinExtensionButton"
          onClick={() => onContinue()}
          className="btn-class">
          Continue
        </button>
      </div>
    </div>
  )
}

export default LocateShard
