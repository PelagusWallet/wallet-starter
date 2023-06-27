import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useLocation, useRoute } from "wouter"

import {
  type Address,
  type QuaiContextAddresses,
  addAdddressByShard
} from "~storage/wallet"

import "../../style.css"

import { useState } from "react"

import { Storage } from "@plasmohq/storage"

import { QUAI_CONTEXTS } from "~background/services/network/chains"
import SelectListbox from "~components/form/Listbox"

export default function AddAddress() {
  const options = QUAI_CONTEXTS?.map((context) => ({
    value: context.shard,
    label: context.name
  }))

  const [, setLocation] = useLocation()
  const [name, setName] = useState<string>("")
  const [selectedShard, setSelectedShard] = useState<{
    value: string
    label: string
  }>(options[0])

  function handleNameChange(event) {
    setName(event.target.value)
  }

  function handleShardChange(selectedOption) {
    console.log(selectedOption)
    setSelectedShard(selectedOption)
  }

  async function createAddress() {
    if (!selectedShard) return
    await addAdddressByShard(selectedShard.value, name)
    setLocation("/")
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={(event) => {
          createAddress()
          event.preventDefault()
        }}>
        <div className="w-full flex justify-center">
          <input
            data-testid="addAddressNameInput"
            type="input"
            name="name"
            id="name"
            placeholder="New Address Name"
            onChange={handleNameChange}
            value={name}
            className="input-class w-1/2 h-10"
          />
        </div>
        <div className="w-1/2 mt-4 mx-auto">
          <SelectListbox
            options={options}
            selectedOption={selectedShard}
            setSelectedOption={handleShardChange}
          />
        </div>
        <div className="flex flex-row m-4">
          <button className="btn-class m-3 w-1/2">Cancel</button>
          <button
            type="submit" // making this a submit button
            data-testid="submitPasswordButton"
            className="btn-class m-3 w-1/2">
            Add Address
          </button>
        </div>
      </form>
    </div>
  )
}
