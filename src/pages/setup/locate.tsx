import React, { useEffect, useState } from "react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

import "../../style.css"

import { QuaiContext } from "~background/services/network/chains"
import {
  getCountriesForContext,
  getQuaiContextForLocation
} from "~storage/wallet/shard"
import worldGeoJSON from "~utils/map/worldgeo.json"

function LocateShard({ onContinue }) {
  const [context, setContext] = useState<QuaiContext>(null)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var lat = position.coords.latitude
        var lon = position.coords.longitude

        let context = getQuaiContextForLocation(lat, lon)
        let selectedCountries = getCountriesForContext(context.shard)
        setContext(context)
        setSelectedCountries(selectedCountries)
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
      <div className="flex flex-col justify-center w-full">
        <ComposableMap
          projectionConfig={{
            scale: 150, // adjust map size
            center: [0, 0] // values represent [longitude, latitude]
          }}>
          <Geographies geography={worldGeoJSON}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = selectedCountries.includes(
                  geo.properties.name
                )
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? "blue" : "white"}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>
        <div className="text-center">
          Based off your location, the best shard for you to operate in is:
        </div>
        <div className="text-center text-lg font-bold">{context?.shard}</div>
      </div>
      <div className="flex justify-center pt-10">
        <button
          data-testid="pinExtensionButton"
          onClick={() => onContinue(context.shard)}
          className="btn-class">
          Continue
        </button>
      </div>
    </div>
  )
}

export default LocateShard
