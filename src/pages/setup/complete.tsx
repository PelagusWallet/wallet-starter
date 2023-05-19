import React from "react"
import Confetti from "react-confetti"
// Import icons
import { FaDiscord, FaTwitter, FaYoutube } from "react-icons/fa"

import "../../style.css"

function Complete() {
  return (
    <div>
      <div className="font-quai congratulations-container">
        <Confetti
          numberOfPieces={800}
          recycle={false}
          tweenDuration={10000}
          initialVelocityX={10}
          initialVelocityY={10}
        />
        <h1 className="congratulations-title">Congratulations!</h1>
        <p className="congratulations-subtitle">
          You've successfully created your Pelagus Crypto Wallet.
        </p>

        <div className="flex justify-around mt-6 space-x-12">
          <div
            className="cursor-pointer flex flex-col items-center border border-zinc-600 rounded-md p-4"
            style={{ width: "200px" }}>
            <FaTwitter className="text-blue-400 h-14 w-14" />
            <span
              className="mt-2 text-lg font-bold"
              style={{ width: "100%", textAlign: "center" }}>
              Follow Pelagus on Twitter
            </span>
          </div>

          <div
            className="cursor-pointer flex flex-col items-center border border-zinc-600 rounded-md p-4"
            style={{ width: "200px" }}>
            <FaDiscord className="text-blue-600 h-14 w-14" />
            <span
              className="mt-2 text-lg font-bold"
              style={{ width: "100%", textAlign: "center" }}>
              Join Pelagus Discord
            </span>
          </div>

          <div
            className="cursor-pointer flex flex-col items-center border border-zinc-600 rounded-md p-4"
            style={{ width: "200px" }}>
            <FaYoutube className="text-red-500 h-14 w-14" />
            <span
              className="mt-2 text-lg font-bold"
              style={{ width: "100%", textAlign: "center" }}>
              Learn more on YouTube
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Complete
