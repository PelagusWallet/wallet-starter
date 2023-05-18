import { useLocation } from "wouter"

import Footer from "~components/navigation/Footer"

import "../../style.css"

export default function Activity() {
  // router
  const [, setLocation] = useLocation()
  return (
    <>
      <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-quai-off-white">
          Activity Coming Soon.
        </h1>
      </div>
      <Footer />
    </>
  )
}
