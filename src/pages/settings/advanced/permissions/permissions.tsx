import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import React, { useEffect, useState } from "react"
import { useLocation } from "wouter"

import { Storage } from "@plasmohq/storage"

import { ApprovedDomain, revokePermissions } from "~storage/permissions"

const storage = new Storage({ area: "local" })

function DomainPermissions() {
  const [, setLocation] = useLocation()
  const [approvedDomains, setApprovedDomains] = useState<ApprovedDomain[]>([])

  useEffect(() => {
    const fetchWallets = async () => {
      const approvedDomains = await storage.get<ApprovedDomain[]>(
        "approved_domains"
      )
      setApprovedDomains(approvedDomains)
    }
    fetchWallets().catch((err) => console.error(err))
  }, [])

  const onRevoke = (url: string) => {
    revokePermissions(url)
    setApprovedDomains(
      approvedDomains.filter((approvedDomain) => approvedDomain.url !== url)
    )
  }

  return (
    <div className="text-white font-quai">
      <div className="mt-3 space-y-1 px-2">
        <button
          onClick={() => setLocation("/settings/advanced")}
          className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
      </div>
      {!approvedDomains && (
        <div className="w-full text-center">No approved domains</div>
      )}
      {approvedDomains?.map(({ url, approvedMethods, date }) => (
        <div
          key={url}
          className="bg-gray-800 text-white font-quai p-4 rounded-md mb-2 mx-2">
          <h2 className="text-2xl font-bold mb-2">{url}</h2>
          <p className="italic mb-2">
            Date granted: {new Date(date.toString()).toLocaleDateString()}
          </p>

          <ul className="list-disc list-inside bg-gray-700 rounded-md p-2 mb-2">
            {approvedMethods.map((permission) => (
              <li key={permission.method}>{permission.method}</li>
            ))}
          </ul>

          <div className="flex justify-end">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => onRevoke(url)}>
              Revoke permissions
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DomainPermissions
