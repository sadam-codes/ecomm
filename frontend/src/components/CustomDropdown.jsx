import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../utils/cn'

const CustomDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option",
  className = "",
  disabled = false,
  variant = "default" // default, admin
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  const selectedOption = options.find(option => option.value === value)

  const baseClasses = "relative inline-block text-left"
  const buttonClasses = cn(
    "inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
    {
      // Default variant (for user pages)
      "bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:ring-blue-500": variant === "default",
      "text-gray-700": variant === "default",
      
      // Admin variant
      "bg-gray-800 border border-gray-600 rounded-md shadow-lg hover:bg-gray-700 focus:ring-blue-400": variant === "admin",
      "text-gray-200": variant === "admin",
      
      // Disabled state
      "opacity-50 cursor-not-allowed": disabled,
    },
    className
  )

  const dropdownClasses = cn(
    "absolute right-0 z-50 mt-2 w-full origin-top-right transition-all duration-200",
    {
      "opacity-0 invisible scale-95": !isOpen,
      "opacity-100 visible scale-100": isOpen,
    }
  )

  const menuClasses = cn(
    "py-1 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden",
    {
      // Default variant
      "bg-white rounded-lg": variant === "default",
      
      // Admin variant
      "bg-gray-800 rounded-md": variant === "admin",
    }
  )

  const itemClasses = cn(
    "flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors duration-150",
    {
      // Default variant
      "text-gray-700 hover:bg-gray-100": variant === "default",
      
      // Admin variant
      "text-gray-200 hover:bg-gray-700": variant === "admin",
    }
  )

  const selectedItemClasses = cn(
    "flex items-center justify-between px-4 py-2 text-sm cursor-pointer transition-colors duration-150",
    {
      // Default variant
      "text-blue-600 bg-blue-50": variant === "default",
      
      // Admin variant
      "text-blue-400 bg-gray-700": variant === "admin",
    }
  )

  return (
    <div className={baseClasses} ref={dropdownRef}>
      <button
        type="button"
        className={buttonClasses}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown 
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-200",
            {
              "rotate-180": isOpen,
              "text-gray-400": variant === "default",
              "text-gray-400": variant === "admin",
            }
          )}
        />
      </button>

      <div className={dropdownClasses}>
        <div className={menuClasses}>
          {options.map((option) => (
            <div
              key={option.value}
              className={option.value === value ? selectedItemClasses : itemClasses}
              onClick={() => handleSelect(option)}
            >
              <span className="truncate">{option.label}</span>
              {option.value === value && (
                <Check className="ml-2 h-4 w-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CustomDropdown
