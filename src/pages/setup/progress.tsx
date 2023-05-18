import { CheckIcon } from "@heroicons/react/24/solid"
import { useEffect } from "react"

const steps = [
  {
    id: "01",
    name: "Create Password",
    href: "welcome.html/generate",
    status: "current",
    page: 0
  },
  {
    id: "02",
    name: "Copy Secure Phrase",
    href: "#",
    status: "upcoming",
    page: 1
  },
  {
    id: "03",
    name: "Verify Secure Phrase",
    href: "#",
    status: "upcoming",
    page: 2
  }
]

export default function ProgressBar({ page, setPage }) {
  useEffect(() => {
    console.log("page", page)
  }, [])

  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="divide-y divide-gray-300 rounded-t-lg border border-gray-300 md:flex md:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.page < page ? (
              <a
                onClick={() => setPage(step.page)}
                className="group flex w-full items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white group-hover:bg-gray-400">
                    <CheckIcon
                      className="h-6 w-6 text-black"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-200">
                    {step.name}
                  </span>
                </span>
              </a>
            ) : step.page === page ? (
              <a
                className="flex items-center px-6 py-4 text-sm font-medium"
                aria-current="step">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-white">
                  <span className="text-white">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-white">
                  {step.name}
                </span>
              </a>
            ) : (
              <a className="group flex items-center">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-400 group-hover:text-gray-200">
                      {step.id}
                    </span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-400 group-hover:text-gray-200">
                    {step.name}
                  </span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div
                  className="absolute top-0 right-0 hidden h-full w-5 md:block"
                  aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none">
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  )
}
