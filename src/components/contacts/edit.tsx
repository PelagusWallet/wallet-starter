import { useStorage } from "@plasmohq/storage/hook"

import "../../style.css"

import { PlusCircleIcon } from "@heroicons/react/24/outline"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

import { Storage } from "@plasmohq/storage"

import {
  addContactToWallet,
  deleteContactByName,
  editContactData
} from "~storage/contacts"

class AddressAndNetwork {
  address: string
  network: string
}

function EditContact({ onContactAdded, contactData }) {
  const [contactName, setContactName] = useState("")
  const [addresses, setAddresses] = useState<AddressAndNetwork[]>([
    { address: "", network: "Colosseum" }
  ])

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {
    if (!contactData) return
    setContactName(contactData?.name)
    setAddresses(contactData?.networkAddresses)
  }, [contactData])

  useEffect(() => {}, [addresses])

  const handleContactNameChange = (event) => {
    setContactName(event.target.value)
  }

  async function editContact() {
    try {
      if (!contactData) {
        await addContactToWallet(contactName, addresses)
      } else {
        await editContactData(contactData, contactName, addresses)
      }
      onContactAdded(contactName)
    } catch (e) {
      toast(e.message), { id: "contact-error", position: "top-center" }
    }
  }

  function closeContacts() {
    onContactAdded("")
  }

  const handleContactAddressChange = (event, index) => {
    const newAddresses = [...addresses]
    newAddresses[index].address = event.target.value
    setAddresses(newAddresses)
  }

  const handleNetworkChange = (event, index) => {
    const newAddresses = [...addresses]
    newAddresses[index].network = event.target.value
    setAddresses(newAddresses)
  }

  return (
    <div
      className={`px-2 border-0 rounded-lg shadow-lg relative flex flex-col w-screen h-screen ${
        darkMode ? `bg-black` : `bg-zinc-50`
      }`}>
      {/*header*/}
      <div className="flex items-start justify-between p-5 rounded-t">
        <h3 className="text-xl font-thin">
          {contactData ? "Edit" : "Add"} Contact
        </h3>
      </div>
      {/*body*/}
      <div className="relative mx-2 pb-6 flex flex-col">
        <label>Name</label>
        <input
          className="input-class"
          onChange={handleContactNameChange}
          value={contactName}
          type="text"
        />
      </div>

      <div className="relative mx-2 flex flex-col">
        <label>Addresses</label>
      </div>
      {addresses.map((addressAndNetwork, index) => {
        return (
          <div key={index} className="pt-1 w-full flex flex-row pb-2">
            <div className="w-3/5 cols-span-4 ml-2">
              <input
                className="w-full h-full input-class"
                onChange={(e) => handleContactAddressChange(e, index)}
                type="text"
                value={addressAndNetwork.address}
              />
            </div>
            <div className="w-2/5 cols-span-2 ml-1 mr-2">
              <select
                value={addressAndNetwork.network}
                className="w-full text-sm p-2 rounded-md bg-transparent border-black dark:border-white focus:border-0 focus:ring-white"
                onChange={(e) => handleNetworkChange(e, index)}>
                <option
                  className="w-full text-sm p-2 rounded-md bg-transparent"
                  value="Colosseum">
                  Colosseum
                </option>
                <option
                  className="w-full text-sm p-2 rounded-md bg-transparent"
                  value="Garden">
                  Garden
                </option>
              </select>
            </div>
          </div>
        )
      })}
      <div className="w-full flex justify-center">
        <PlusCircleIcon
          onClick={() =>
            setAddresses([...addresses, { address: "", network: "" }])
          }
          className="h-8 w-8 flex justify-center text-gray-400 hover:text-gray-500 cursor-pointer"
        />
      </div>
      <div className="w-full pr-4 inline-flex rounded-md justify-center mt-2 absolute bottom-3 space-x-1">
        <button
          className="flex btn-class-action group w-1/3"
          type="button"
          onClick={() => closeContacts()}>
          <div className="flex flex-col items-center m-auto">
            <span className="home-button-inner">Close</span>
          </div>
        </button>
        {contactData && (
          <button
            className="flex btn-class-action group w-1/3"
            type="button"
            onClick={() => deleteContactByName(contactData.name)}>
            <div className="flex flex-col items-center m-auto">
              <span className="">Delete</span>
            </div>
          </button>
        )}
        <button
          className="flex btn-class-action group w-1/3"
          type="button"
          onClick={() => editContact()}>
          <div className="flex flex-col items-center m-auto">
            <span className="">Save</span>
          </div>
        </button>
      </div>
    </div>
  )
}

export default EditContact
