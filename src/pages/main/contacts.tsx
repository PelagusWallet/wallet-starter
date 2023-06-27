import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import "../../style.css"

import { useEffect } from "react"

import ContactList from "~components/contacts/list"
import type { WalletContact } from "~storage/contacts"

export default function Contacts() {
  // contacts
  const [contacts] = useStorage<WalletContact[]>({
    key: "contacts",
    instance: new Storage({
      area: "local"
    })
  })

  useEffect(() => {}, [contacts])

  return (
    <div>
      <div className="p-3">
        <ContactList selectable={false} onContactSelect={undefined} />
      </div>
    </div>
  )
}
