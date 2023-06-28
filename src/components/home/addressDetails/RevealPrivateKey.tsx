import React, { useEffect, useState } from "react"

import "../../../style.css"

import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function RevealPrivateKey({ setPage }) {
  return (
    <div className="z-10 h-full">
      <button onClick={() => setPage("details")} className="text-gray-400">
        <ChevronLeftIcon
          className="h-6 w-6 quai-dark-grey"
          aria-hidden="true"
        />
      </button>
      <div className="flex flex-row justify-between">Key: </div>
    </div>
  )
}
