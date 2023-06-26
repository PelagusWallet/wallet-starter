import { Listbox } from "@headlessui/react"
import { ChevronUpDownIcon } from "@heroicons/react/24/outline"

interface OptionType {
  value: string
  label: string
}

interface ListboxProps {
  options: OptionType[]
  selectedOption: OptionType
  setSelectedOption: (option: OptionType) => void
}

const SelectListbox: React.FC<ListboxProps> = ({
  options,
  selectedOption,
  setSelectedOption
}) => {
  return (
    <Listbox value={selectedOption} onChange={setSelectedOption}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-leftrounded-lg bg-white dark:bg-zinc-950 dark:text-white cursor-pointer focus:outline-none sm:text-sm text-md">
          <span className="block truncate">
            {selectedOption ? selectedOption.label : "Select an option"}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronUpDownIcon
              className="w-5 h-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-zinc-950 dark:text-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option, optionIndex) => (
            <Listbox.Option key={optionIndex} value={option}>
              {({ selected, active }) => (
                <div
                  className={`${
                    active
                      ? "dark:text-pelagus-light-blue text-pelagus-dark-blue bg-zinc-300 font-bold"
                      : "text-black dark:text-white"
                  } cursor-pointer select-none relative py-2 pl-10 pr-4 text-md`}>
                  {selected ? (
                    <span
                      className={`${
                        active ? "text-amber-600" : "text-amber-600"
                      } absolute inset-y-0 left-0 flex items-center pl-3`}>
                      {/* Replace with your preferred icon */}
                      {/* <CheckIcon className="w-5 h-5" aria-hidden="true" /> */}
                    </span>
                  ) : null}
                  {option.label}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  )
}

export default SelectListbox
