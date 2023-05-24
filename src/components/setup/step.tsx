// Step.tsx
import React from "react"

function Step({ stepNumber, imageSrc, children, imgWidth }) {
  return (
    <div className="w-full step-container flex items-center my-4">
      <div className="flex flex-col justify-center space-y-4">
        <div className="flex flex-row space-x-4">
          <div className="step-number-container bg-blue-400 text-lg rounded-full w-6 h-6 flex items-center justify-center">
            <span className="step-number">{stepNumber}</span>
          </div>
          <div className="text-center my-auto justify-center text-lg">
            {children}
          </div>
        </div>
        <img
          className="step-image mx-4"
          src={imageSrc}
          alt={`Step ${stepNumber}`}
          style={{ width: imgWidth || "auto" }}
        />
      </div>
    </div>
  )
}

export default Step
