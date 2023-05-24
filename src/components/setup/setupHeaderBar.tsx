import React, { useEffect, useRef } from "react"

import DarkModeToggle from "./darkModeToggle"
import LanguageSelect from "./languageSelect"

const SetupHeaderBar = () => {
  return (
    <div className="fixed top-10">
      <DarkModeToggle />
      <LanguageSelect />
    </div>
  )
}

export default SetupHeaderBar
