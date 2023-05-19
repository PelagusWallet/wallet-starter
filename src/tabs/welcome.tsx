import { AnimatePresence, motion } from "framer-motion"
import { Route, Router, Switch } from "wouter"

import LanguageSelect from "~components/setup/languageSelect"
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

  return (
    <div className="max-h-screen">
      <Router hook={useHashLocation}>
        <Switch location={location}>
          <Route path="/intro" component={motionify(IntroScreen)} />
          <Route path="/language" component={motionify(LanguageSelect)} />
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
