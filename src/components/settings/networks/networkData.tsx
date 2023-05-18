import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"
import React from "react"

import { deleteCustomNetwork } from "~storage/network"

import "~style.css"

import { useState } from "react"

import { Network } from "~background/services/network/chains"

NetworkData.prototype = {
  network: Network,
  selected: Boolean,
  editable: Boolean,
  onNetworkSelect: Function,
  onNetworkUpdate: Function // new prop for the update function
}

function NetworkData({
  network,
  selected,
  editable,
  onNetworkSelect,
  onNetworkUpdate // destructuring the new prop
}) {
  const [active, setActive] = useState(false)
  const [editing, setEditing] = useState(false)

  // new state variable to hold the updated network object
  const [updatedNetwork, setUpdatedNetwork] = useState(network)

  const handleNetworkSelect = (e, network) => {
    onNetworkSelect(network)
    e.stopPropagation()
  }

  let selectButton
  if (selected) {
    selectButton = (
      <div className="cursor-default flex items-center justify-center h-8 w-8 bg-zinc-950 rounded-full text-blue-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    )
  } else {
    selectButton = (
      <div
        className="cursor-pointer flex items-center justify-center h-8 w-8 border border-blue-400 rounded-full text-blue-400"
        onClick={(e) => handleNetworkSelect(e, network)}></div>
    )
  }

  const attemptSetActive = () => {
    if (editing) {
      return
    }
    setActive(!active)
  }

  const deleteNetwork = () => {
    // call the new function to delete the network
    setEditing(false)
    deleteCustomNetwork(network)
  }

  // new function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault()
    onNetworkUpdate(network, updatedNetwork)
    setEditing(false)
  }

  return (
    <div
      className={
        "shard-data-height rounded-md relative bg-zinc-950 transition-[height] ease-in-out duration-500 max-height " +
        (active ? "" : "")
      }
      onClick={() => attemptSetActive()}>
      <div
        className={
          "w-full h-full rounded-md " +
          (active ? "fadeIn shard-data-div-active absolute" : "fadeOut")
        }></div>
      <div className="p-2 opacity-100 flex-col z-60 font-quai text-white">
        {editing ? (
          <div className="w-full z-20">
            <div className="flex flex-row justify-between items-center">
              <XMarkIcon
                className="h-5 w-5 text-gray-400 cursor-pointer z-20"
                onClick={(e) => setEditing(!editing)}
              />
              <TrashIcon
                className="h-5 w-5 text-gray-400 cursor-pointer z-20"
                onClick={(e) => deleteNetwork()}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  className="text-md p-2 rounded-md  bg-zinc-950"
                  value={updatedNetwork.name}
                  onChange={(event) =>
                    setUpdatedNetwork({
                      ...updatedNetwork,
                      name: event.target.value
                    })
                  }
                />
                <div className="w-full grid grid-cols-2">
                  <div className="flex flex-col">
                    <label htmlFor="name">Chain Code:</label>
                    <input
                      type="number"
                      id="chainCode"
                      className="text-md p-2 rounded-md  bg-zinc-950 mr-1"
                      value={updatedNetwork.chainCode}
                      onChange={(event) =>
                        setUpdatedNetwork({
                          ...updatedNetwork,
                          chainCode: event.target.value
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="name">Chain ID:</label>
                    <input
                      type="number"
                      id="chainID"
                      className="text-md p-2 rounded-md  bg-zinc-950 ml-1"
                      value={updatedNetwork.chainID}
                      onChange={(event) =>
                        setUpdatedNetwork({
                          ...updatedNetwork,
                          chainID: event.target.value
                        })
                      }
                    />
                  </div>
                </div>
                {updatedNetwork.chains.map((chain, i) => (
                  <div
                    key={`chain-${i}`}
                    className="my-1 w-full flex flex-col justify-between">
                    <label htmlFor={`chain-name-${i}`}>{chain.name}</label>
                    <label htmlFor={`chain-rpc-${i}`}>RPC:</label>
                    <input
                      type="text"
                      className="text-sm p-1 rounded-md  bg-zinc-950"
                      id={`chain-rpc-${i}`}
                      value={chain.rpc}
                      onChange={(event) =>
                        setUpdatedNetwork({
                          ...updatedNetwork,
                          chains: updatedNetwork.chains.map((c, j) =>
                            i === j ? { ...c, rpc: event.target.value } : c
                          )
                        })
                      }
                    />
                    <label htmlFor={`chain-block-explorer-${i}`}>
                      Block Explorer URL:
                    </label>
                    <input
                      type="text"
                      id={`chain-block-explorer-${i}`}
                      value={chain.blockExplorerUrl}
                      className="text-sm p-1 rounded-md  bg-zinc-950"
                      onChange={(event) =>
                        setUpdatedNetwork({
                          ...updatedNetwork,
                          chains: updatedNetwork.chains.map((c, j) =>
                            i === j
                              ? { ...c, blockExplorerUrl: event.target.value }
                              : c
                          )
                        })
                      }
                    />
                  </div>
                ))}
                <button
                  className=" z-20 active-button-bg active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                  type="button"
                  onClick={(e) => handleSubmit(e)}>
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex flex-row justify-between">
            <div className="p-1 text-lg font-thin cursor-default flex flex-row">
              {network.name}
              {editable && (
                <PencilIcon
                  className="h-5 w-5 m-auto ml-2 text-gray-400 cursor-pointer z-20"
                  onClick={(e) => setEditing(!editing)}
                />
              )}
            </div>
            {selectButton}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {active && !editing && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 }
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden p-2 text-white font-quai">
            <div className="flex flex-row justify-evenly">
              <div>Chain code: {network.chainCode}</div>
              <div>Chain ID: {network.chainID}</div>
            </div>
            {network.chains?.map((chain, i) => (
              <div
                key={i}
                className="my-1 w-full flex flex-col justify-between">
                <div className="text-white w-full">{chain.name}</div>
                <div className="text-white w-full">
                  {chain.rpc ? chain.rpc : "None"}
                </div>
                <div className="text-white w-full">
                  {chain.blockExplorerUrl ? chain.blockExplorerUrl : "None"}
                </div>
              </div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}

export default React.memo(NetworkData)
