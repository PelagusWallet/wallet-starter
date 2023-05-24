import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useLocation, useRoute } from "wouter"

import "../../../style.css"

import { quais } from "quais"

import ContactList from "~components/contacts/list"

export default function SendTo() {
  // router
  const [, setLocation] = useLocation()
  const [sendTo, setSendTo] = useState("")

  // get router params
  const [match, params] = useRoute("/send?/:fromAddress")

  const handleSendToChange = (event) => {
    setSendTo(event.target.value)
  }

  function handleContactSelect(address) {
    // @ts-ignore: Object is possibly 'null'.
    setLocation("/send?/confirm/" + params!.fromAddress + "/" + address)
  }

  function confirmSendTo() {
    // Validate address
    try {
      let address = quais.utils.getAddress(sendTo)
      // @ts-ignore: Object is possibly 'null'.
      setLocation("/send?/confirm/" + params!.fromAddress + "/" + sendTo)
    } catch (e) {
      // show toast
      toast.error("Invalid address")
      console.log("Invalid address")
    }
  }

  return (
    <div className=" px-4 pt-2">
      <div>
        <button onClick={() => setLocation("/send")} className="text-gray-400">
          <ChevronLeftIcon
            className="h-6 w-6 quai-dark-grey"
            aria-hidden="true"
          />
        </button>
      </div>
      <div className="text-lg">Send to</div>
      <div className="relative flex items-center">
        <input
          type="text"
          name="sendTo"
          id="sendTo"
          onChange={handleSendToChange}
          value={sendTo}
          className="block w-full border rounded-md shadow-sm text-[13px] secondary-bg-container focus:border-0 focus:ring-white sm:text-md"
        />
      </div>
      <ContactList
        selectable={true}
        onContactSelect={(e) => {
          handleContactSelect(e)
        }}
      />
      <div className="w-full absolute bottom-10 flex justify-center">
        <button
          className="active-button-bgfont-thin text-sm px-6 py-3 rounded secondary-bg-container text-blue-600 dark:text-blue-400"
          type="button"
          onClick={() => confirmSendTo()}>
          Continue
        </button>
      </div>
    </div>
  )
}
