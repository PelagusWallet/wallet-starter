import { AnimatePresence, motion } from "framer-motion"
import { Route, Router, Switch } from "wouter"

import Complete from "~pages/setup/complete"
import Generate from "~pages/setup/generate"
import Home from "~pages/setup/home"
import LanguageSelect from "~pages/setup/languageSelect"
import LedgerSetup from "~pages/setup/ledger"
import IntroScreen from "~pages/setup/welcome"
import { useHashLocation } from "~utils/router"

import "../style.css"

export default function Welcome() {
  const [location, setLocation] = useHashLocation()

  return (
    <div className="max-h-screen">
      <Router hook={useHashLocation}>
        <Switch location={location}>
          <Route path="/" component={motionify(IntroScreen)} />
          <Route path="/language" component={motionify(LanguageSelect)} />
          <Route path="/setup" component={motionify(Home)} />
          <Route path="/generate" component={motionify(Generate)} />
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
