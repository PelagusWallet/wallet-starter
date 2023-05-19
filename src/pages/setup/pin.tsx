// Complete.tsx
import React from "react"
import complete1 from "url:/assets/complete1.png"
import complete2 from "url:/assets/complete2.png"

import Step from "~components/setup/step"

import "../../style.css"

function PinExtension({ onContinue }) {
  return (
    <div>
      <div className="font-quai text-white flex justify-center">
        <div>
          <Step stepNumber={1} imageSrc={complete1} imgWidth={225}>
            <p>Open the extensions icon in your browser.</p>
          </Step>
          <Step stepNumber={2} imageSrc={complete2} imgWidth={225}>
            <p>Pin the Pelagus extension for future use.</p>
          </Step>
        </div>
      </div>
      <div className="flex justify-center pt-10">
        <button
          onClick={() => onContinue()}
          className="flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:quai-deep-teal focus:ring-offset-2">
          Continue
        </button>
      </div>
    </div>
  )
}

export default PinExtension
