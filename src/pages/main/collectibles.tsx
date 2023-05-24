import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"

import "../../style.css"

export default function Collectibles() {
  // router
  const [, setLocation] = useLocation()
  return (
    <>
      <div className="h-full w-full">
        <div className="text-md font-bold tracking-tight text-center m-auto mt-[140px]">
          Nothing to see here.
        </div>
      </div>
      <Footer />
    </>
  )
}
