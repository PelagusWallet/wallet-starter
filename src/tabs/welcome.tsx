import { AnimatePresence, motion } from "framer-motion"
import { useEffect } from "react"
import { Route, Router, Switch } from "wouter"

import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

import Complete from "~pages/setup/complete"
import Generate from "~pages/setup/generate"
import Home from "~pages/setup/home"
import ImportMnemonic from "~pages/setup/import"
import LedgerSetup from "~pages/setup/ledger"
import IntroScreen from "~pages/setup/welcome"
import { useHashLocation } from "~utils/router"

import "../style.css"

export default function Welcome() {
  const [location, setLocation] = useHashLocation()

  const [darkMode] = useStorage<boolean>({
    key: "dark_mode",
    instance: new Storage({
      area: "local"
    })
  })

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
          <Route path="/intro" component={motionify(IntroScreen)} />
          <Route path="/" component={motionify(Home)} />
          <Route path="/generate" component={motionify(Generate)} />
          <Route path="/import" component={motionify(ImportMnemonic)} />
          <Route path="/ledger" component={motionify(LedgerSetup)} />
          <Route path="/complete" component={motionify(Complete)} />
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
