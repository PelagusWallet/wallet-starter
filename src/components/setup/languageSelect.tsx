import React, { useEffect, useRef, useState } from "react"

const languages = [
  { id: "english", name: "English" },
  { id: "spanish", name: "Spanish" },
  { id: "french", name: "French" },
  { id: "german", name: "German" },
  { id: "italian", name: "Italian" },
  { id: "portuguese", name: "Portuguese" },
  { id: "russian", name: "Russian" },
  { id: "chinese", name: "Chinese" }
]

export default function LanguageSelect() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const dropdownRef = useRef(null)

  const handleSelect = (id, name) => {
    console.log("selected language id:", id)
    setSelectedLanguage(name)
    setDropdownOpen(false)
  }

  useEffect(() => {
    const clickListener = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("click", clickListener)
    return () => {
      document.removeEventListener("click", clickListener)
    }
  }, [])

  return (
    <div className="fixed top-10 right-20" ref={dropdownRef}>
      <div
        className="flex flex-row relative w-full p-3 mx-2 text-center text-lg  bg-transparent border rounded-md border-gray-200 cursor-pointer"
        onClick={() => setDropdownOpen(!dropdownOpen)}>
        {selectedLanguage}
        <div className="m-auto">
          <svg
            className="h-6 w-6 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </div>
      {dropdownOpen && (
        <div className="absolute right-0 w-full mt-2 py-2 bg-white rounded-lg shadow-xl">
          {languages.map((language) => (
            <div
              onClick={() => handleSelect(language.id, language.name)}
              className="cursor-pointer block px-4 py-2 text-gray-800 hover:bg-zinc-950 hover:text-white"
              key={language.id}>
              {language.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
