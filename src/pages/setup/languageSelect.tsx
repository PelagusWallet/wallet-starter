import { useLocation } from "wouter"

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
  const [, setLocation] = useLocation()

  const handleSelect = (id) => {
    // here you would probably update some global state or local storage with the selected language id
    // then navigate to the next page, or back to the previous one
    console.log("selected language id:", id)
    setLocation("/setup")
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <ul className="space-y-4 w-1/4">
        {languages.map((language) => (
          <li
            key={language.id}
            onClick={() => handleSelect(language.id)}
            className="text-white flex justify-between items-center cursor-pointer border rounded-md border-gray-200 p-4 text-center text-3xl font-quai">
            <span>{language.name}</span>
            <button className="text-blue-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
