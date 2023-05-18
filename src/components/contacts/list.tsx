import { ChevronLeftIcon } from "@heroicons/react/24/outline"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "../../style.css"

import { useEffect, useState } from "react"

import EditContact from "~components/contacts/edit"
import type { WalletContact } from "~storage/contacts"

import ContactData from "./contactData"

export default function ContactList({ selectable, onContactSelect }) {
  const [showEditContactModal, setShowEditContactModal] = useState(false)

  // contacts
  const [contacts] = useStorage<WalletContact[]>({
    key: "contacts",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {}, [contacts])

  function contactAdded(name: string) {
    setShowEditContactModal(false)
  }

  return (
    <div className="my-3">
      <div className="flex flex-row justify-between items-baseline">
        <div className="cursor-default text-lg font-thin text-white">
          Contacts
        </div>
        <div
          className="cursor-pointer text-md font-thin text-white align-text-bottom"
          onClick={() => setShowEditContactModal(true)}>
          +Add Contacts
        </div>
      </div>
      <div className="space-y-2">
        {contacts?.map((contact, i) => (
          <ContactData
            key={i}
            contact={contact}
            selectable={selectable}
            onContactSelect={(e) => {
              onContactSelect(e)
            }}
          />
        ))}
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
