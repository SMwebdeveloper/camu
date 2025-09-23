import { TbBell } from "react-icons/tb";
import { PiUserBold } from "react-icons/pi";
import { CgMenuLeft } from "react-icons/cg";
import LanguageSelect from "./LanguageSelect";

export default function Header({ onToggleSidebar, onToggleMobile }) {
  return (
    <header className="w-full h-16 bg-gray-900 border-b border-gray-700 shadow-lg flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {/* Desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden md:block text-white"
        >
          <CgMenuLeft size={28} />
        </button>

        {/* Mobile toggle */}
        <button onClick={onToggleMobile} className="md:hidden text-white">
          <CgMenuLeft size={28} />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <LanguageSelect />
        <button className="relative">
          <TbBell color="white" size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
            <PiUserBold />
          </div>
          <span className="text-sm text-white font-medium">Rektor</span>
        </div>
      </div>
    </header>
  );
}
