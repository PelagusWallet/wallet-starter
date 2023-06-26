import React, { useEffect, useState } from "react"
import { useLocation } from "wouter"

import "../../style.css"

export default function MenuPopup({ activeWallet }) {
  const [location, setLocation] = useLocation()

  function clickAccountButton() {
    // if location contains /accounts, go to home
    // else go to /accounts
    if (location.includes("accounts")) {
      setLocation("/")
    } else {
      setLocation("/accounts?/" + activeWallet.pubkey)
    }
  }

  return (
    <div className="menu-popup-modal">
      <div className="modal-content secondary-bg-container mx-4">
        <div>Menu Popup</div>
        <div onClick={clickAccountButton}>Accounts</div>
        <div>Contacts</div>
        <div> Settings</div>
      </div>
    </div>
  )
}
