import { useLocation } from "wouter"

import AssetsOrActivity from "~components/home/AssetsOrActivity"
import Balance from "~components/home/Balance"
import FunctionButtonGroup from "~components/home/FunctionButtonGroup"
import SelectedAddressHeader from "~components/home/SelectedAddressHeader"

import "../../style.css"

export default function Home() {
  // router
  return (
    <>
      <div className="min-h-full flex flex-col space-y-2">
        <SelectedAddressHeader />
        <Balance />
        <FunctionButtonGroup />
        <AssetsOrActivity />
      </div>
    </>
  )
}
