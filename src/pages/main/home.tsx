import { useLocation } from "wouter"

import AssetsOrActivity from "~components/home/AssetsOrActivity"
import Balance from "~components/home/Balance"
import FunctionButtonGroup from "~components/home/FunctionButtonGroup"
import Footer from "~components/navigation/Footer"

import "../../style.css"

export default function Home() {
  // router
  return (
    <>
      <div className="min-h-full pt-4">
        <Balance />
        <FunctionButtonGroup />
        <AssetsOrActivity />
      </div>
      <Footer />
    </>
  )
}
