import React, { useEffect, useState } from "react"

import "../../../style.css"

import DetailsPage from "~components/home/addressDetails/DetailsPage"
import RevealPrivateKey from "~components/home/addressDetails/RevealPrivateKey"

export default function AddressDetails({ onClicked }) {
  const [activePage, setActivePage] = useState<string>("details")

  const onSetPage = (page) => {
    setActivePage(page)
  }

  useEffect(() => {
    setActivePage("details")
  }, [])

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute w-full h-full" onClick={onClicked}></div>
      <div
        className="modal-content secondary-bg-container border border-3 border-black dark:border-white p-10 m-4 z-10 w-11/12 min-h-[72%]"
        onClick={(e) => e.stopPropagation()}>
        <div>
          {activePage === "details" && <DetailsPage setPage={onSetPage} />}
          {activePage === "revealPrivateKey" && (
            <RevealPrivateKey setPage={onSetPage} />
          )}
        </div>
      </div>
    </div>
  )
}
