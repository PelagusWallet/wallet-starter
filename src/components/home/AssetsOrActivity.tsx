import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import "../../style.css"

import _ from "lodash"
import React from "react"

import ActivityList from "~components/home/activity/ActivityList"
import AssetsList from "~components/home/assets/AssetsList"

const tabs = [
  { name: "Assets", href: "#", current: true },
  { name: "Activity", href: "#", current: false }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

function AssetsOrActivity() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [borderStyle, setBorderStyle] = useState({})
  const controls = useAnimation()
  const tabsRef = useRef([])

  function setCurrentTab(tab) {
    tabs.forEach((tab) => {
      tab.current = false
    })
    tab.current = true
    setActiveTab(tab)
  }

  const calculateBorderStyle = (index) => {
    const element = tabsRef.current[index]
    if (element) {
      const { offsetLeft, offsetWidth } = element
      return { left: offsetLeft, width: offsetWidth }
    }
    return {}
  }

  useEffect(() => {
    const index = tabs.findIndex((tab) => tab.current)
    const newBorderStyle = calculateBorderStyle(index)
    controls.start(newBorderStyle)
  }, [activeTab, tabs, controls])

  return (
    <div className="h-full w-full">
      <nav className="flex justify-center relative w-full" aria-label="Tabs">
        {tabs.map((tab, index) => (
          <a
            key={tab.name}
            href="#"
            className={classNames(
              "w-full justify-center whitespace-nowrap flex py-2 px-1 font-medium text-lg ",
              tab.current
                ? ""
                : "text-gray-500 hover:text-gray-700 border-b-1 border-gray-500"
            )}
            onClick={() => setCurrentTab(tab)}
            aria-current={tab.current ? "page" : undefined}
            ref={(el) => (tabsRef.current[index] = el)}>
            {tab.name}
          </a>
        ))}
        <motion.div
          className="absolute bottom-0 border-b-2 border-blue-600 dark:border-blue-400 w-full"
          style={borderStyle}
          animate={controls}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </nav>
      {activeTab.name === "Assets" ? <AssetsList /> : <ActivityList />}
    </div>
  )
}

export default AssetsOrActivity
