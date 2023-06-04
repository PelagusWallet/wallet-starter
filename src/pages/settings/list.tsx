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
import { FaDiscord, FaTwitter } from "react-icons/fa"
import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"
import { signOut } from "~storage/wallet/password"

import "../../style.css"

const userNavigation = [
  {
    name: "General",
    href: "/general",
    icon: UserIcon,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-200 dark:bg-blue-700"
  },
  {
    name: "Switch Networks",
    href: "/network",
    icon: AdjustmentsHorizontalIcon,
    iconColor: "text-red-500",
    bgColor: "bg-red-200 dark:bg-red-700"
  },
  {
    name: "Advanced",
    href: "/advanced",
    icon: CogIcon,
    iconColor: "text-green-500",
    bgColor: "bg-green-200 dark:bg-green-700"
  },
  {
    name: "Security and Privacy",
    href: "/security",
    icon: ShieldCheckIcon,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-200 dark:bg-yellow-700"
  },
  {
    name: "Submit A Ticket",
    href: "#",
    icon: ChatBubbleBottomCenterIcon,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-200 dark:bg-purple-700"
  },
  {
    name: "About",
    href: "/about",
    icon: InformationCircleIcon,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-200 dark:bg-indigo-700"
  },
  {
    name: "Sign out",
    href: "#",
    icon: ArrowLeftOnRectangleIcon,
    iconColor: "text-gray-500",
    bgColor: "bg-gray-200 dark:bg-gray-700"
  },
  {
    name: "Follow on Twitter",
    href: "https://twitter.com/your_username",
    icon: FaTwitter,
    iconColor: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-600"
  },
  {
    name: "Join Discord",
    href: "https://discord.com/invite/your_invite_code",
    icon: FaDiscord,
    iconColor: "text-indigo-400",
    bgColor: "bg-indigo-100 dark:bg-indigo-600"
  }
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
        <Disclosure as="nav">
          <div className="mt-3 space-y-1 px-3 pb-20">
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
