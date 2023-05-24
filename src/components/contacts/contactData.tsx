import { PencilIcon } from "@heroicons/react/24/outline"
import { AnimatePresence, motion } from "framer-motion"

import type { NetworkAddresses, WalletContact } from "~storage/contacts"

import "../../style.css"

import { useEffect, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import type { Network } from "~background/services/network/chains"
import EditContact from "~components/contacts/edit"

export default function ContactData({ contact, selectable, onContactSelect }) {
  const [active, setActive] = useState(false)
  const [contactAddresses, setContactAddresses] = useState<NetworkAddresses[]>(
    []
  )
  const [showEditContactModal, setShowEditContactModal] = useState(false)

  const [activeNetwork] = useStorage<Network>({
    key: "active_network",
    instance: new Storage({
      area: "local"
    })
  })

  function autoSelectContactAddress(address: WalletContact) {
    onContactSelect(address)
  }

  function contactAdded(name: string) {
    setShowEditContactModal(false)
  }

  useEffect(() => {
    console.log("contact", contact)
    console.log("activeNetwork", activeNetwork)
    if (contact && activeNetwork) {
      console.log("contact.networkAddresses", contact.networkAddresses)
      const networkAddresses = contact.networkAddresses?.filter(
        (item) => item.chainID === Number(activeNetwork.chainCode)
      )
      setContactAddresses(networkAddresses)
    }
  }, [contact, activeNetwork])

  return (
    <div
      className={
        "shard-data-height rounded-md relative secondary-bg-container transition-[height] ease-in-out duration-500 max-height " +
        (active ? "" : "bg-transparent")
      }>
      <div
        className={
          "w-full h-full absolute rounded-md " +
          (active ? "fadeIn shard-data-div-active" : "fadeOut")
        }></div>
      <div className="p-2 opacity-100 flex-col">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-thin">{contact.name}</div>
          <PencilIcon
            className="h-5 w-5 cursor-pointer z-20"
            onClick={() => setShowEditContactModal(true)}
          />
        </div>
        <div className="flex flex-row justify-between">
          {selectable && (
            <div
              className="text-[14px] font-thin"
              onClick={() => autoSelectContactAddress(contact)}>
              Auto Select
            </div>
          )}
          <div
            onClick={() => setActive(!active)}
            className="z-20	cursor-pointer text-[14px] font-thin">
            {contactAddresses?.length + " Total Addresses"}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {active && (
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
              className="overflow-hidden">
              {contactAddresses?.map((address, i) => (
                <div
                  key={i}
                  className="my-1 w-full flex flex-row justify-between">
                  <div className="w-full flex flex-row justify-between border rounded-sm">
                    <div className="m-1 w-full">{address.address}</div>
                    {selectable && (
                      <div
                        onClick={() => onContactSelect(address.address)}
                        className="m-1 text-gray-400 cursor-pointer">
                        Select
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
      {showEditContactModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-20 outline-none focus:outline-none">
            <div className="relative w-full mx-6">
              <EditContact
                onContactAdded={contactAdded}
                contactData={contact}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
