import { BsPersonVcard } from "react-icons/bs"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "../../style.css"

import { useEffect, useState } from "react"

import EditContact from "~components/contacts/edit"
import type { WalletContact } from "~storage/contacts"

import ContactData from "./contactData"

const storage = new Storage({
  area: "local"
})

export default function ContactList({ selectable, onContactSelect }) {
  const [showEditContactModal, setShowEditContactModal] = useState(false)

  // contacts
  const [contacts] = useStorage<WalletContact[]>({
    key: "contacts",
    instance: storage
  })

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: storage
  })

  useEffect(() => {}, [contacts])

  function contactAdded(name: string) {
    setShowEditContactModal(false)
  }

  return (
    <div className="my-3">
      <div className="flex flex-row justify-between items-baseline">
        <div className="cursor-default text-lg font-thin">Contacts</div>
        <div
          className="cursor-pointer text-md font-thin align-text-bottom"
          onClick={() => setShowEditContactModal(true)}>
          +Add Contacts
        </div>
      </div>
      <div className="space-y-2">
        {contacts ? (
          <div>
            {contacts?.map((contact, i) => (
              <div className="my-2">
                <ContactData
                  key={i}
                  contact={contact}
                  selectable={selectable}
                  onContactSelect={(e) => {
                    onContactSelect(e)
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex justify-center flex-col mt-[120px]">
            <BsPersonVcard
              className={`h-12 w-auto ${
                darkMode ? `text-blue-400` : `text-blue-600`
              }`}></BsPersonVcard>
            <div className="flex justify-center">
              No contacts, try adding some
            </div>
          </div>
        )}
      </div>
      {showEditContactModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none">
            <div className="relative w-full mx-6">
              <EditContact onContactAdded={contactAdded} contactData={null} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
