import React, { useEffect, useState } from "react"

import "../../style.css"

export default function TotalFeeModal({
  baseFee,
  priorityFee,
  gasLimit,
  handleEdit,
  handleCloseModal
}) {
  const [editBaseFee, setEditBaseFee] = useState(baseFee)
  const [editPriorityFee, setEditPriorityFee] = useState(priorityFee)
  const [editGasLimit, setEditGasLimit] = useState(gasLimit)

  const handleSubmit = () => {
    handleEdit(editBaseFee, editPriorityFee, editGasLimit)
    handleCloseModal()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content mx-4">
        <h2 className="font-normal">Edit Fee Details</h2>
        <label className="font-normal">
          Base Fee:
          <input
            type="number"
            value={editBaseFee}
            onChange={(e) => setEditBaseFee(e.target.value)}
            className="text-md bg-transparent w-full border-none line-height-1 focus:ring-0 h-6"
          />
        </label>
        <label className="font-normal">
          Priority Fee:
          <input
            type="number"
            value={editPriorityFee}
            onChange={(e) => setEditPriorityFee(e.target.value)}
            className="text-md bg-transparent w-full border-none line-height-1 focus:ring-0 h-6"
          />
        </label>
        <label className="font-normal">
          Gas Units:
          <input
            type="number"
            value={editGasLimit}
            onChange={(e) => setEditGasLimit(e.target.value)}
            className="text-md bg-transparent w-full border-none line-height-1 focus:ring-0 h-6"
          />
        </label>{" "}
        <div className="flex flex-row justify-center">
          <button
            onClick={handleSubmit}
            className="font-normal px-2 mx-1 btn-class-action">
            Submit
          </button>
          <button
            onClick={handleCloseModal}
            className="font-normal px-2 mx-1 btn-class-action">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
