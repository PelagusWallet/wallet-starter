import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { Route, Router, Switch } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Complete from "~pages/setup/complete"
import { useHashLocation } from "~utils/router"

import "../style.css"

const storage = new Storage({
  area: "local"
})

export default function Welcome() {
  const [location, setLocation] = useHashLocation()

  const [setUp] = useStorage<boolean>({
    key: "is_setup",
    instance: storage
  })

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: storage
  })

  useEffect(() => {
    // if (!setUp) {
    //   chrome.tabs.create({ url: chrome.runtime.getURL("/tabs/welcome.html") })
    //   window.close()
    // }
  }, [setUp])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    window.localStorage.setItem("darkMode", "false")
  }, [darkMode])

  return (
    <div className="max-h-screen bg-container">
      <Router hook={useHashLocation}>
        <Switch location={location}>
          <Route path="/" component={motionify(Complete)} />
        </Switch>
      </Router>
    </div>
  )
}

const motionify = (PageComponent) => {
  return (props) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75 }}>
      <PageComponent {...props} />
    </motion.div>
  )
}
