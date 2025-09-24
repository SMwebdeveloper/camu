// src/components/SearchInput.jsx
import { motion } from "framer-motion";
import { FaSearch, FaTimes } from "react-icons/fa";

const SearchInput = ({
  value = "",
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  const clearSearch = () => {
    onChange("");
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className="text-gray-400" size={16} />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 transition-all duration-200"
      />

      {value && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={clearSearch}
          className="absolute inset-y-0 right-0 pr-3 flex items-center 
                   text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={14} />
        </motion.button>
      )}
    </div>
  );
};

export default SearchInput;
