import { useState } from "react"
import pelagusLogo from "url:/assets/group-68.png"

import { unlock } from "~storage/wallet/password"

export default function Unlock() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

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
        <img className="h-auto w-full mb-10" src={pelagusLogo} alt="Pelagus" />
        <label className="mt-10">Password</label>
        <input
          type="password"
          className="block mt-1 w-full bg-transparent rounded-md shadow-sm text-[13px] border focus:ring-white focus:border-0 sm:text-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => handleUnlock()}
          className="mt-2 w-full secondary-bg-container text-blue-600 dark:text-blue-400 font-thin text-sm px-6 py-3 rounded"
          type="button">
          Unlock
        </button>
        <div className="mt-6 font-semibold text-md cursor-pointer flex justify-center">
          Forgot password?
        </div>
      </div>
    </div>
  )
}
