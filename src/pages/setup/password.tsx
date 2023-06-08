import "../../style.css"

import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid"
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
      setErrorMessage("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters")
      return
    }

    onPasswordSubmit(password)
  }

  return (
    <main className=" flex bg-transparent">
      <div className="mx-auto max-w-md mt-0">
        <form
          onSubmit={(event) => {
            submitPassword()
            event.preventDefault()
          }}>
          <label htmlFor="password" className="block text-sm font-medium">
            Enter a password to generate a secure phrase.
          </label>
          <div className="relative mt-2 flex items-center">
            <input
              data-testid="passwordInput"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              onChange={handlePasswordChange}
              value={password}
              className="input-class"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              {showPassword ? (
                <EyeSlashIcon className="cursor-pointer inline-flex items-center px-2 font-sans text-sm font-medium"></EyeSlashIcon>
              ) : (
                <EyeIcon className="cursor-pointer inline-flex items-center px-2 font-sans text-sm font-medium"></EyeIcon>
              )}
            </div>
          </div>
          <div className="relative mt-1 flex items-center">
            <input
              data-testid="passwordConfirmInput"
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              onChange={handlePasswordConfirmChange}
              value={passwordConfirm}
              className="input-class"
            />
          </div>
          <div className="flex justify-center mt-10">
            <button
              type="submit" // making this a submit button
              data-testid="submitPasswordButton"
              className="btn-class">
              Submit Password
            </button>
          </div>
          <div>
            {errorMessage && (
              <div
                data-testid="passwordErrorMessage"
                className="text-red-500 text-center mt-4 font-bold text-md">
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}

export default PasswordSetup
