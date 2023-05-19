import { Disclosure } from "@headlessui/react"
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  ChatBubbleBottomCenterIcon,
  ChevronLeftIcon,
  CogIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  UserIcon
} from "@heroicons/react/24/outline"
import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"
import { signOut } from "~storage/wallet/password"

import "../../style.css"

const userNavigation = [
  { name: "General", href: "/general", icon: UserIcon },
  {
    name: "Switch Networks",
    href: "/network",
    icon: AdjustmentsHorizontalIcon
  },
  { name: "Advanced", href: "/advanced", icon: CogIcon },
  { name: "Security and Privacy", href: "/security", icon: ShieldCheckIcon },
  { name: "Submit A Ticket", href: "#", icon: ChatBubbleBottomCenterIcon },
  { name: "About", href: "/about", icon: InformationCircleIcon },
  { name: "Sign out", href: "#", icon: ArrowLeftOnRectangleIcon }
]

export default function SettingsList() {
  const [, setLocation] = useLocation()

  async function handleClick(item) {
    if (item.name === "Sign out") {
      await signOut()
      setLocation("/")
    } else {
      setLocation("/settings" + item.href)
    }
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-transparent">
          <div className="mt-3 space-y-1 px-3">
            {userNavigation.map((item) => {
              const Icon = item.icon
              return (
                <div
                  className="cursor-pointer border-b-1 w-full flex flex-row border-white bg-zinc-950 px-4 py-2 rounded-md"
                  onClick={() => handleClick(item)}
                  key={item.name}>
                  <Icon className="h-6 w-6 text-blue-400 my-auto" />
                  <Disclosure.Button
                    as="a"
                    className="block font-quai rounded-md px-3 py-2 text-base font-medium text-blue-400">
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
