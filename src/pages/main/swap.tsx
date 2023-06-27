import { useLocation } from "wouter"

import "../../style.css"

export default function Swap() {
  // router
  const [, setLocation] = useLocation()
  return (
    <>
      <main>
        <div className="rounded-lg bg-quai-black/20 shadow-lg px-8 mt-10"></div>
      </main>
    </>
  )
}
