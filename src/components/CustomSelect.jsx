// src/components/CustomSelect.jsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const CustomSelect = ({
  options = [],
  value = "",
  onChange,
  placeholder = "Select...",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  // Tashqariga click qilganda yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.id === value) || {};

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select trigger */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          transition-all duration-200 flex items-center justify-between
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:border-gray-400"
          }
          ${isOpen ? "ring-2 ring-blue-500 border-transparent" : ""}
        `}
      >
        <span
          className={`truncate ${!value ? "text-gray-400" : "text-gray-800"}`}
        >
          {selectedOption.name || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          <FaChevronDown size={14} />
        </motion.div>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border border-gray-200 
                     rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <motion.div
                  key={option.id}
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  transition={{ duration: 0.1 }}
                  className={`
                    px-4 py-3 cursor-pointer flex items-center justify-between
                    transition-colors duration-150
                    ${value === option.id ? "bg-blue-50" : ""}
                  `}
                  onClick={() => handleSelect(option)}
                >
                  <span className="text-gray-800">{option.name}</span>
                  {value === option.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-blue-600"
                    >
                      <FaCheck size={14} />
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
