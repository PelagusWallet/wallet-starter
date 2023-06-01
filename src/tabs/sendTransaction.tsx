import { quais } from "quais"
import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import { getAddress, signAndSendTransaction } from "~storage/wallet"
import type { TransactionRequest } from "~storage/wallet"

import "../style.css"

import type { Network } from "~background/services/network/chains"
import { getActiveNetwork } from "~storage/network"

interface QueryParams {
  gasLimit?: string
  gasPrice?: string
  from?: string
  to?: string
  value?: string
  data?: string
}

function SendTransaction() {
  const [gasLimit, setGasLimit] = useState("")
  const [gasPrice, setGasPrice] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [value, setValue] = useState("")
  const [data, setData] = useState("")
  const [sentTransaction, setSentTransaction] = useState(false)
  const [transactionResponse, setTransactionResponse] = useState("")

  const [activeNetwork, setActiveNetwork] = useState<Network>()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const queryParams: QueryParams = {}

    params.forEach((value, key) => {
      queryParams[key] = value
    })

    setGasLimit(queryParams.gasLimit)
    setGasPrice(queryParams.gasPrice)
    setFrom(queryParams.from)
    setTo(queryParams.to)
    setValue(queryParams.value)
    setData(queryParams.data)
  }, [])

  useEffect(() => {
    const getNetwork = async () => {
      const resp = await getActiveNetwork()
      setActiveNetwork(resp)
    }
    getNetwork().catch((err) => console.error(err))
  }, [])

  const handleSend = async () => {
    const transaction = {
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      from: from,
      to: to,
      value: value,
      data: data
    } as unknown as TransactionRequest

    let resp
    try {
      resp = await signAndSendTransaction(transaction)
      setTransactionResponse(resp.hash)
    } catch (err) {
      console.error(err)
      setTransactionResponse(err.message)
    }
    setSentTransaction(true)

    // close window
    // Get the current window
    chrome.windows.getCurrent(async (currentWindow) => {
      // Now currentWindow.id contains the window ID
      const windowId = currentWindow.id

      // Send the message
      await sendToBackground({
        name: "api/response",
        body: {
          action: "requestPermission",
          windowId: windowId,
          data: { code: 200, message: resp }
        }
      })
    })

    setTimeout(() => {
      window.close()
    }, 3000)
  }

  const handleReject = async () => {
    // close window
    // Get the current window
    chrome.windows.getCurrent(async (currentWindow) => {
      // Now currentWindow.id contains the window ID
      const windowId = currentWindow.id

      // Send the message
      await sendToBackground({
        name: "api/response",
        body: {
          action: "requestPermission",
          windowId: windowId,
          data: { code: 4001, message: "User denied the request." }
        }
      })

      window.close()
    })
  }

  if (sentTransaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">Transaction response</div>
          <div className="text-xsm overflow-auto">
            {transactionResponse.substring(0, 20) + "..."}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className=" p-4 rounded-md">
      <div className="w-full flex justify-end">
        <div className="w-1/4 border-green-400 border-2 rounded-lg p-1 mb-1 mx-2 text-center">
          {activeNetwork?.name}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex flex-wrap justify-between">
          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">From:</p>
            <p>{from}</p>
          </div>

          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">To:</p>
            <p>{to}</p>
          </div>

          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">Gas Limit:</p>
            <p>{gasLimit}</p>
          </div>

          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">Gas Price:</p>
            <p>{gasPrice}</p>
          </div>

          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">Value:</p>
            <p>{value}</p>
          </div>

          <div className="secondary-bg-container rounded-md p-2 m-2 w-full sm:w-1/2 md:w-1/3">
            <p className="font-bold">Data:</p>
            <p>{data}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between m-2">
        <button
          className="w-1/2 mr-1 bg-red-500 hover:bg-red-700 font-bold py-2 px-4 rounded-lg"
          onClick={handleReject}>
          Reject
        </button>

        <button
          className="w-1/2 ml-1 bg-blue-600 hover:bg-blue-700 font-bold py-2 px-4 rounded-lg"
          onClick={handleSend}>
          Confirm
        </button>
      </div>
    </div>
  )
}

export default SendTransaction
