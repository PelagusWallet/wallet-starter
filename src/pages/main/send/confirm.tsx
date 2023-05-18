import {
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  QuestionMarkCircleIcon
} from "@heroicons/react/24/outline"
import { toast } from "react-hot-toast"
import { useLocation, useRoute } from "wouter"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import { getShardFromAddress, signAndSendTransaction } from "~storage/wallet"

import "../../../style.css"

import { quais } from "quais"
import { useEffect, useState } from "react"

import { getExplorerURLForShard } from "~background/services/network/chains"
import AddressLabel from "~components/accounts/addressLabel"
import SpeedSelect from "~components/send/speedSelect"

export default function SendConfirm() {
  // router
  const [, setLocation] = useLocation()
  const [, params] = useRoute("/send?/confirm/:fromAddress/:toAddress")
  const [fromAddress, setFromAddress] = useState<string>()
  const [toAddress, setToAddress] = useState<string>()
  const [fromBalanace, setFromBalance] = useState<number>()
  const [toBalance, setToBalance] = useState<number>()
  const [amount, setAmount] = useState<string>("0.0")
  const [speed, setSpeed] = useState<string>(".01")

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    // @ts-ignore: Object is possibly 'null'.
    setFromAddress(params!.fromAddress)
    // @ts-ignore: Object is possibly 'null'.
    setToAddress(params!.toAddress)
  }, [])

  // Get latest balance directly from provider instead of using local storage
  async function getFromBalance() {
    const resp = await sendToBackground({
      name: "get-balance",
      body: {
        address: fromAddress
      }
    })

    if (resp.balance) {
      setFromBalance(Number(parseFloat(Number(resp.balance).toFixed(4))))
    }
  }

  // Get latest balance directly from provider instead of using local storage
  async function getToBalance() {
    const resp = await sendToBackground({
      name: "get-balance",
      body: {
        address: toAddress
      }
    })

    if (resp.balance) {
      setToBalance(Number(parseFloat(Number(resp.balance).toFixed(4))))
    }
  }

  useEffect(() => {
    if (fromAddress != undefined) {
      getFromBalance()
    }
    // if (toAddress != undefined) {
    //   getToBalance()
    // }
  }, [fromAddress, toAddress])

  function removeNonNumericDecimal(input: string): string {
    let result = ""
    let hasDecimal = false
    for (const ch of input) {
      if (ch >= "0" && ch <= "9") {
        result += ch
      } else if (ch === "." && !hasDecimal) {
        result += ch
        hasDecimal = true
      }
    }
    return result
  }

  function handleAmountChange(e) {
    const result = removeNonNumericDecimal(e.target.value)
    setAmount(result)
  }

  function handleSpeedChange(newSpeed) {
    setSpeed(newSpeed)
  }

  function formatAddress(address: string): string {
    if (address == undefined) {
      return ""
    }
    return address.slice(0, 6) + "..." + address.slice(-4)
  }

  // Support Quaiscan by default
  function linkToExplorer(txHash: string): string {
    let shard = getShardFromAddress(fromAddress)[0]
    if (shard == undefined || txHash == undefined) {
      return ""
    }
    const explorerURL = getExplorerURLForShard(activeNetwork, shard.shard)
    const url = explorerURL + "/tx/" + txHash
    window.open(url, "_blank")
  }

  async function confirmSend() {
    var signedTx
    try {
      signedTx = await signAndSendTransaction({
        from: fromAddress,
        to: toAddress,
        value: quais.utils.parseUnits(amount, "ether").toString(),
        gasLimit: 21000
      })
    } catch (error: any) {
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-slide-in-top" : "animate-slide-out-top"
          } max-w-md w-full bg-zinc-950 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="text-blue-400 h-10 w-10 m-auto" />
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">
                  Transaction Failed
                </p>
                <div className="flex flex-row">
                  <p className="mt-1 text-sm text-white underline">
                    {error.reason}
                  </p>
                  <QuestionMarkCircleIcon className="h-5 w-5 text-blue-400 m-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
      return
    }

    toast.custom((t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-md w-full bg-zinc-950 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="h-10 w-10 m-auto text-blue-400" />
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-blue-400">
                Transaction Successful
              </p>
              <p
                className="cursor-pointer mt-1 text-sm text-white underline"
                onClick={() => linkToExplorer(signedTx.hash)}>
                View on Quaiscan
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-white">
            Close
          </button>
        </div>
      </div>
    ))
    setTimeout(async () => {
      setLocation("/")
    }, 2500)
  }

  return (
    <div className="font-quai">
      <div className="relative">
        <div className="text-white flex items-center justify-center">
          <div className="w-1/2 p-2 rounded-md bg-zinc-950 flex flex-col justify-start">
            <div>{formatAddress(fromAddress)}</div>
            <div className="flex flex-row justify-between">
              <AddressLabel address={fromAddress} />
            </div>
          </div>
          <div className="w-1/2 p-2 text-white rounded-md bg-zinc-950 flex flex-col justify-end">
            <div className="flex justify-end">{formatAddress(toAddress)}</div>
            <div className="flex flex-row justify-end">
              <AddressLabel address={toAddress} />
            </div>
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-blue-400 rounded-full p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 text-blue-400">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
      <div className="m-4">
        <button
          onClick={() => setLocation("/send?/" + fromAddress)}
          className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
        <div className="relative flex items-center flex-col mb-8">
          <input
            type="text"
            name="amount"
            id="amount"
            onChange={(e) => handleAmountChange(e)}
            value={amount}
            className="block w-full bg-transparent rounded-md shadow-sm text-white text-3xl border-none sm:text-md text-center active:border-none focus:ring-0"
          />
          <div className="text-white text-lg">QUAI</div>
          <div className="text-white">Your Balance: {fromBalanace}</div>
        </div>

        <SpeedSelect selected={speed} handleSelect={handleSpeedChange} />

        <div className="mb-0">
          <div className="text-white mt-10 flex flex-row justify-between text-lg">
            <div>Total Transaction Cost</div>
            <div className="ml-auto">
              {parseFloat(amount) + parseFloat(speed)} QUAI
            </div>
          </div>
          <div className="w-full mt-1 flex justify-center">
            <button
              className="w-full text-blue-400 text-sm px-6 py-3 rounded bg-zinc-950"
              type="button"
              onClick={() => confirmSend()}>
              Send Transaction
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
