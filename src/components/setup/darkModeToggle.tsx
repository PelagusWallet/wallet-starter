import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform
} from "framer-motion"
import React, { useEffect } from "react"
import { FaMoon, FaSun } from "react-icons/fa"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

  const controls = useAnimation()
  const x = useMotionValue(darkMode ? 25 : 0)

  useEffect(() => {
    controls.start({
      x: darkMode ? 25 : 0,
      transition: { type: "spring", stiffness: 200, damping: 60 }
    })
  }, [darkMode, controls])

  const handleToggleClick = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div
      className="flex items-center space-x-4 fixed left-10"
      onClick={handleToggleClick}>
      <FaSun className="text-yellow-500 w-6 h-6" />
      <motion.div className="relative w-12 h-6 rounded-full overflow-hidden bg-zinc-400">
        <motion.div
          className="bg-black dark:bg-white w-6 h-6 rounded-full shadow-md absolute top-0 left-0 cursor-pointer"
          drag="x"
          dragConstraints={{ left: 0, right: 6 }}
          animate={controls}
          style={{ x }}
        />
      </motion.div>
      <FaMoon className="text-blue-500 w-6 h-6" />
    </div>
  )
}

export default DarkModeToggle
