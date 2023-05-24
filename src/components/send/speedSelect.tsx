import { BoltIcon } from "@heroicons/react/20/solid"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef, useState } from "react"

const stats = [
  {
    name: "Normal",
    cost: ".01"
  },
  {
    name: "Faster",
    cost: ".1"
  },
  {
    name: "Custom",
    cost: "0"
  }
]

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

export default function SpeedSelect({ selected, handleSelect }) {
  const [custom, setCustom] = useState<string>("0")
  const [selectedName, setSelectedName] = useState<string>("Normal")
  const [borderStyle, setBorderStyle] = useState({})
  const controls = useAnimation()
  const itemsRef = useRef([])

  const calculateBorderStyle = (index) => {
    const element = itemsRef.current[index]
    if (element) {
      const { offsetLeft, offsetWidth } = element
      return { left: offsetLeft, width: offsetWidth }
    }
    return {}
  }

  useEffect(() => {
    const index = stats.findIndex((item) => item.name === selectedName)
    const newBorderStyle = calculateBorderStyle(index)
    controls.start(newBorderStyle)
  }, [selectedName, stats, controls])

  function selectItem(item) {
    setSelectedName(item.name)
    handleSelect(item.cost)
  }

  function handleSetCustom(custom: string) {
    setCustom(custom)
    handleSelect(custom)
  }

  return (
    <div className="mt-2">
      <div className="p-2 rounded-md secondary-bg-container">
        <div className="flex flex-row justify-start">
          <BoltIcon className="h-6 w-6 mr-2 self-center" />
          <dl className="flex flex-row overflow-hidden relative">
            {stats.map((item, index) => (
              <div
                ref={(el) => (itemsRef.current[index] = el)}
                key={item.name}
                className="cursor-pointer w-full px-1 mx-1"
                onClick={() => selectItem(item)}>
                <dt className="font-normal">{item.name}</dt>
                <dd className="mt-0.5 flex items-baseline justify-evenly">
                  <div className="flex items-baseline text-lg font-semibold w-full">
                    {item.name !== "Custom" ? (
                      <div>{item.cost}</div>
                    ) : (
                      <input
                        type="text"
                        id="customFee"
                        className="text-md bg-transparent w-full border-none line-height-1 focus:ring-0 h-6"
                        value={custom}
                        onChange={(event) =>
                          handleSetCustom(event.target.value)
                        }
                      />
                    )}
                    <span className="ml-1 text-sm font-medium">QUAI</span>
                  </div>
                </dd>
              </div>
            ))}
            <motion.div
              className="absolute bottom-0 border-b border-blue-600 dark:border-blue-400"
              style={borderStyle}
              animate={controls}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </dl>
        </div>
      </div>
    </div>
  )
}
