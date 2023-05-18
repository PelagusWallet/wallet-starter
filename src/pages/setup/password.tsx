import "../../style.css"

import { useState } from "react"

function PasswordSetup({ onPasswordSubmit }) {
  // active page
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value)
  }

  function submitPassword() {
    if (password != passwordConfirm) {
      return
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters")
      return
    }

    onPasswordSubmit(password)
  }

  return (
    <main className="font-quai flex bg-transparent">
      <div className="mx-auto max-w-md mt-0">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-white">
          Enter a password to generate a secure phrase.
        </label>
        <div className="relative mt-2 flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            onChange={handlePasswordChange}
            value={password}
            className="block w-full rounded-md border-gray-300 pr-12 shadow-sm px-2 py-1  focus:border-gray-700 focus:ring-gray-700 sm:text-md"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <kbd className="inline-flex items-center rounded border border-gray-200 px-2 font-sans text-sm font-medium text-gray-700">
              {showPassword ? "hide" : "show"}
            </kbd>
          </div>
        </div>
        <div className="relative mt-1 flex items-center">
          <input
            type="password"
            name="passwordConfirm"
            id="passwordConfirm"
            onChange={handlePasswordConfirmChange}
            value={passwordConfirm}
            className="block w-full rounded-md border-gray-300 pr-12 shadow-sm px-2 py-1  focus:border-gray-700 focus:ring-gray-700 sm:text-md"
          />
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => submitPassword()}
            className="flex justify-center rounded-md border border-white bg-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2">
            Submit Password
          </button>
        </div>
        <div>
          {errorMessage && (
            <div className="text-red-500 text-center mt-4 font-bold text-md">
              {errorMessage}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default PasswordSetup
