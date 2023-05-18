// Complete.tsx
import React from "react"
import Confetti from "react-confetti"
import complete1 from "url:/assets/complete1.png"
import complete2 from "url:/assets/complete2.png"

import Step from "~components/setup/step"

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
        <div>
          <Step stepNumber={1} imageSrc={complete1} imgWidth={300}>
            <p>Open the extensions icon in your browser.</p>
          </Step>
          <Step stepNumber={2} imageSrc={complete2} imgWidth={300}>
            <p>Pin the Pelagus extension for future use.</p>
          </Step>
        </div>
      </div>
    </div>
  )
}

export default Complete
