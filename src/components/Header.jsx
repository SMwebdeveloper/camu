import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiMail,
  FiShield,
} from "react-icons/fi";
import clsx from "clsx";
import { CgMenuLeft } from "react-icons/cg";
import LanguageSelect from "./LanguageSelect";
import useLanguageStore from "../store/useLanguage";
import useAuthStore from "../store/useAuth";
import toast from "react-hot-toast";

export default function Header({ onToggleSidebar, onToggleMobile }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);

  const logOut = useAuthStore((state) => state.logOut);

  const navigate = useNavigate();
  // Profile modalni tashqariga bosganda yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // User ma'lumotlari (API dan keladi)
  const userData = {
    name: "Rektor",
    email: "rector@camu.uz",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  };
  const handleLogout = () => {
    logOut();
    sessionStorage.removeItem("accessToken");
    navigate("/login");
    toast.success(t("profile.logout_success"));
  };
  return (
    <header className="w-full h-16 bg-gradient-to-r from-gray-900 to-blue-900 border-b border-gray-700 shadow-lg flex items-center justify-between px-6">
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

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 g-gradient-to-r from-blue-600 to-blue-700 hover:bg-blue-600 rounded-lg px-3 py-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{t("role")}</p>
              <p className="text-xs text-blue-100">{t("super_admin")}</p>
            </div>

            {/* User avatar */}
            <div className="relative">
              <img
                className="h-8 w-8 rounded-full border-2 border-white"
                src={userData.avatar}
                alt={userData.name}
              />
              <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-1 border-2 border-blue-600">
                <div className="h-1.5 w-1.5 rounded-full bg-white"></div>
              </div>
            </div>

            <FiChevronDown
              className={clsx(
                "text-blue-200 transition-transform duration-200",
                isProfileOpen ? "rotate-180" : "rotate-0"
              )}
              size={16}
            />
          </button>

          {/* Profile Modal */}

          <div
            className={clsx(
              "absolute right-0 mt-2 w-80 bg-white transition-all duration-300 rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50",
              isProfileOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            )}
          >
            {/* Profile header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6">
              <div className="flex items-center space-x-4">
                <img
                  className="h-14 w-14 rounded-full border-3 border-white shadow-md"
                  src={userData.avatar}
                  alt={userData.name}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-white truncate">
                    {t("role")}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiShield className="text-blue-200" size={14} />
                    <span className="text-blue-200 text-sm">
                      {t("super_admin")}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <FiMail className="text-blue-200" size={12} />
                    <span className="text-blue-200 text-xs truncate">
                      {userData.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
            <div className="py-3">
              <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 group">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiUser className="text-blue-600" size={16} />
                </div>
                <div className="text-left">
                  <p className="font-medium">{t("profile.profile_title")}</p>
                  <p className="text-xs text-gray-500">
                    {t("profile.profile_subtitle")}
                  </p>
                </div>
              </button>

              <button className="flex items-center w-full px-6 py-3 text-sm text-gray-700 hover:bg-blue-50 transition-all duration-200 group">
                <div className="mr-4 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiSettings className="text-blue-600" size={16} />
                </div>
                <div className="text-left">
                  <p className="font-medium">{t("profile.settings_title")}</p>
                  <p className="text-xs text-gray-500">
                    {t("profile.settings_subtitle")}
                  </p>
                </div>
              </button>
            </div>

            {/* Logout button */}
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
              >
                <div className="mr-4 p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <FiLogOut className="text-red-600" size={16} />
                </div>
                <div className="text-left">
                  <p className="font-medium">{t("profile.logout_title")}</p>
                  <p className="text-xs text-red-500">
                    {t("profile.logout_subtitle")}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
