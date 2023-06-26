import { useState } from "react"
import pelagusLgBlack from "url:/assets/logos/black/png/vertical-lockup.png"
import pelagusLgWhite from "url:/assets/logos/white/png/vertical-lockup.png"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import { unlock } from "~storage/wallet/password"

export default function Unlock() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

  async function handleUnlock() {
    const passwordCorrect = await unlock(password)
    if (passwordCorrect) {
    } else {
      setError("Incorrect password.")
    }
  }

  return (
    <div className=" flex flex-col h-screen p-6 m-auto">
      <div className="m-auto">
        {darkMode ? (
          <img
            className="h-36 w-auto mb-10"
            src={pelagusLgWhite}
            alt="Pelagus"
          />
        ) : (
          <img
            className="h-36 w-auto mb-10"
            src={pelagusLgBlack}
            alt="Pelagus"
          />
        )}
        <form
          onSubmit={(event) => {
            handleUnlock()
            event.preventDefault()
          }}>
          <label>Password</label>
          <input
            type="password"
            className="block mt-1 w-full bg-transparent rounded-md shadow-sm text-[13px] border focus:ring-white focus:border-0 sm:text-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="mt-2 w-full secondary-bg-container text-blue-600 dark:text-blue-400 font-thin text-sm px-6 py-3 rounded"
            type="submit">
            Unlock
          </button>
          <div className="mt-6 font-semibold text-md cursor-pointer flex justify-center">
            Forgot password?
          </div>
        </form>
      </div>
    </div>
  )
}
