import React, { useEffect, useState } from "react"

import "../../style.css"

import { quais } from "quais"

import TotalFeeModal from "./totalFeeModal"

export default function TotalFee({
  baseFee,
  priorityFee,
  gasLimit,
  handleEdit
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [totalFee, setTotalFee] = useState(0)

  const handleOpenModal = () => {
    console.log("open modal")
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    console.log("close modal")
  }

  useEffect(() => {
    console.log("modal open", modalOpen)
  }, [setModalOpen])

  useEffect(() => {
    const totalFee = (Number(baseFee) + Number(priorityFee)) * Number(gasLimit)
    setTotalFee(totalFee)
  }, [baseFee, priorityFee, gasLimit])

  const formatTotalFee = () => {
    let inBaseUnits = quais.utils.formatEther(totalFee)
    // round the decimal to 6 places
    let rounded = Math.round(Number(inBaseUnits) * 1000000) / 1000000
    return rounded
  }

  return (
    <div className="p-4 shadow-lg rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <div className="font-bold text-sm">
          Total Fee: {formatTotalFee()} QUAI
        </div>
        <button className="btn-class-secondary py-2" onClick={handleOpenModal}>
          Edit
        </button>
      </div>
      {modalOpen && (
        <TotalFeeModal
          baseFee={baseFee}
          priorityFee={priorityFee}
          gasLimit={gasLimit}
          handleEdit={handleEdit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  )
}
