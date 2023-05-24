// import "../style.css"
// PermissionRequest.tsx
import React, { useEffect, useState } from "react"

import { approveDomainPermissions } from "~storage/permissions/index"

import "../style.css"

interface QueryParams {
  url?: string
  requestedMethods?: string
  // Add any other data types you want to pass
}

function PermissionRequest() {
  const [permissionRequested, setPermissionRequested] = useState(false)
  const [url, setUrl] = useState("")
  const [requestedMethods, setRequestedMethods] = useState<string[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParams: QueryParams = {}

    params.forEach((value, key) => {
      queryParams[key] = value
    })

    setUrl(queryParams.url)
    setRequestedMethods(queryParams.requestedMethods.split(","))
  }, [])

  const handleAllow = async () => {
    setPermissionRequested(true)
    await approveDomainPermissions(url, requestedMethods)
    window.close()
  }

  const handleDeny = () => {
    window.close()
  }

  if (permissionRequested) {
    return <div>Permission request processed.</div>
  }

  return (
    <div className="p-4 rounded-md">
      <p className="text-lg font-bold mb-4">
        Do you want to allow permissions for the following URL?
      </p>

      <div className="rounded-md p-2 mb-4 secondary-bg-container">
        <p className="font-bold">Requested Methods:</p>
        <p>{requestedMethods.join(", ")}</p>
      </div>

      <div className="rounded-md p-2 mb-4 secondary-bg-container">
        <p className="font-bold">URL:</p>
        <p>{url}</p>
      </div>

      <div className="flex justify-end space-x-2 w-full">
        <button
          className="w-1/2 bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded"
          onClick={handleDeny}>
          Deny
        </button>
        <button
          className="w-1/2 bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded"
          onClick={handleAllow}>
          Allow
        </button>
      </div>
    </div>
  )
}

export default PermissionRequest
