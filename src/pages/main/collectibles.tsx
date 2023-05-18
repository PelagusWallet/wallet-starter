import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"

import "../../style.css"

export default function Collectibles() {
  // router
  const [, setLocation] = useLocation()
  return (
    <>
      <div className="h-full w-full">
        <h1 className="text-md font-bold tracking-tight text-quai-off-white text-center my-auto">
          Nothing to see here.
        </h1>
      </div>
      <Footer />
    </>
  )
}
