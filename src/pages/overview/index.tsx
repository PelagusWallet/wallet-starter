import AssetsOrActivity from "~components/home/AssetsOrActivity"
import Balance from "~components/home/Balance"
import FunctionButtonGroup from "~components/home/FunctionButtonGroup"

import "../../style.css"

export default function Overview() {
  // router
  return (
    <>
      <div className="min-h-full max-w-md pt-4 m-auto">
        <Balance />
        <FunctionButtonGroup />
        <AssetsOrActivity />
      </div>
    </>
  )
}
