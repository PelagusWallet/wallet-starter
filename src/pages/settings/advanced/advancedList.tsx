import { Disclosure } from "@headlessui/react"
import { ChevronLeftIcon, GlobeAltIcon } from "@heroicons/react/24/outline"
import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"
import { signOut } from "~storage/wallet/password"

import "../../../style.css"

const userNavigation = [
  {
    name: "Site Permissions",
    href: "/permissions",
    icon: GlobeAltIcon,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-200 dark:bg-blue-700"
  }
]

export default function AdvancedList() {
  const [, setLocation] = useLocation()

  async function handleClick(item) {
    if (item.name === "Sign out") {
      await signOut()
      setLocation("/")
    } else {
      setLocation("/settings/advanced" + item.href)
    }
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mt-3 space-y-1 px-2">
            <button
              onClick={() => setLocation("/settings")}
              className="text-gray-400">
              <ChevronLeftIcon
                className="h-6 w-6 quai-dark-grey"
                aria-hidden="true"
              />
            </button>
            {userNavigation.map((item) => {
              const Icon = item.icon
              return (
                <div
                  className="cursor-pointer secondary-bg-container border-b-1 w-full flex flex-row px-4 py-2 rounded-md"
                  onClick={() => handleClick(item)}
                  key={item.name}>
                  <div
                    className={`flex items-center justify-center ${item.bgColor} rounded-full h-9 w-9 my-auto`}>
                    <Icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>

                  <Disclosure.Button
                    as="a"
                    className="block rounded-md px-3 py-2 text-base font-medium">
                    {item.name}
                  </Disclosure.Button>
                </div>
              )
            })}
          </div>
        </Disclosure>
      </div>
      <Footer />
    </>
  )
}
