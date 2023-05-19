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
    // setLocation("/setup")
  }

  return (
    <div className="fixed top-10 right-10 text-white">
      <div className="w-full">
        <select
          onChange={(event) => handleSelect(event.target.value)}
          className="text-white w-full p-3 mx-2 text-center text-lg font-quai bg-transparent border rounded-md border-gray-200 cursor-pointer">
          {languages.map((language) => (
            <option className="mx-2" key={language.id} value={language.id}>
              {language.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
