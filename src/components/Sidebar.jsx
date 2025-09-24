import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.jpg";
import { IoHomeOutline } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import { FiChevronDown } from "react-icons/fi";
import { PiStudent } from "react-icons/pi";
import { FaBullhorn, FaChartLine } from "react-icons/fa";
import useLanguageStore from "../store/useLanguage";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Sidebar({
  isOpen,
  mobileOpen,
  onToggleSidebar,
  onClose,
}) {
  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);

  const links = [
    { to: "/", label: "Dashboard", icon: <IoHomeOutline size={20} /> },
    {
      to: "/reports",
      label: "Reports",
      icon: <TbReportAnalytics size={20} />,
      dropdown: true,
      submenu: [
        {
          to: "/reports/finance",
          label: "reports_finance",
          icon: <FaChartLine size={16} />,
        },
        {
          to: "/reports/marketing",
          label: "reports_marketting",
          icon: <FaBullhorn size={16} />,
        },
      ],
    },
    { to: "/students", label: "Students", icon: <PiStudent size={20} /> },
  ];

  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  // Dropdown toggle funksiyasi
  const toggleDropdown = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isOpen) onToggleSidebar();
    setOpenDropdown(openDropdown === index ? null : index);
  };

  // Dropdown ni tashqariga bosganda yopish
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Location o'zgarganda dropdown ni ochish
  useEffect(() => {
    const currentPath = location.pathname;

    // Agar joriy yo'l Reports ichida bo'lsa, dropdown ni ochiq qilish
    if (
      links[1].submenu.some(
        (sub) => currentPath.startsWith(sub.to) || currentPath === "/reports"
      )
    ) {
      setOpenDropdown(1);
    }
  }, [location.pathname]);

  // Asosiy havola aktivligini tekshirish
  const isMainLinkActive = (link, index) => {
    if (link.to === location.pathname) return true;

    // Reports va uning submenu sahifalari
    if (index === 1) {
      return (
        location.pathname.startsWith("/reports") ||
        links[1].submenu.some((sub) => sub.to === location.pathname)
      );
    }

    return false;
  };

  // Link klasslari - YANGILANDI (faqat active stillar)
  const linkClasses = (isActive) =>
    `flex items-center h-10 gap-2 p-2 rounded-lg transition-colors duration-300 relative ${
      isActive
        ? "bg-[rgba(255,255,255,0.3)] text-white shadow-lg border-l-4 border-blue-400"
        : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.2)]"
    }`;

  // Dropdown link klasslari - YANGILANDI
  const dropdownLinkClasses = (isActive) =>
    `flex items-center h-9 gap-2 p-2 pl-4 rounded-lg transition-colors duration-200 text-sm ${
      isActive
        ? "bg-[rgba(255,255,255,0.3)] text-white font-medium border-l-2 border-blue-400"
        : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.2)]"
    }`;

  // Dropdown tugmasi klasslari - YANGI
  const dropdownButtonClasses = (isActive) =>
    `flex items-center justify-between w-full h-10 gap-2 p-2 rounded-lg transition-colors duration-300 ${
      isActive || openDropdown === 1
        ? "bg-[rgba(255,255,255,0.3)] text-white shadow-lg border-l-4 border-blue-400"
        : "text-gray-300 hover:text-white hover:bg-[rgba(255,255,255,0.2)]"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden md:flex flex-col bg-gradient-to-b from-gray-900 to-blue-900 text-gray-100 h-full transition-all duration-300 border-r border-gray-700",
          isOpen ? "w-64" : "w-[70px]"
        )}
      >
        <div className="p-4 h-16 flex items-center border-b border-gray-700">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span
              className={`font-bold text-xl block transition-opacity ${
                isOpen
                  ? "opacity-100 duration-300 delay-200"
                  : "opacity-0 duration-100 delay-0 pointer-events-none"
              }`}
            >
              CAMU CRM
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link, idx) => (
            <div key={link.to} ref={idx === 1 ? dropdownRef : null}>
              {link.dropdown ? (
                // Dropdown menyu
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(idx, e)}
                    className={dropdownButtonClasses(
                      isMainLinkActive(link, idx)
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div>{link.icon}</div>
                      <span
                        className={`transition-opacity ${
                          isOpen
                            ? "opacity-100 duration-300 delay-200"
                            : "opacity-0 duration-100 delay-0 pointer-events-none"
                        }`}
                      >
                        {t(`sidebar.${link.label.toLowerCase()}`)}
                      </span>
                    </div>
                    <FiChevronDown
                      className={clsx(
                        "transition-transform duration-300",
                        openDropdown === idx ? "rotate-180" : "rotate-0",
                        !isOpen && "opacity-0"
                      )}
                      size={16}
                    />
                  </button>

                  {/* Dropdown content */}
                  <div
                    className={clsx(
                      "overflow-hidden transition-all duration-300",
                      openDropdown === idx && isOpen
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-2 space-y-1 border-l-2 border-gray-600 pl-3">
                      {link.submenu.map((subLink) => (
                        <NavLink
                          key={subLink.to}
                          to={subLink.to}
                          className={({ isActive }) =>
                            dropdownLinkClasses(isActive)
                          }
                          onClick={onClose}
                        >
                          <div className="flex items-center gap-2">
                            {subLink.icon}
                            <span className="truncate">
                              {t(
                                `sidebar.${subLink.label
                                  .toLowerCase()
                                  .replace(" ", "_")}`
                              )}
                            </span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Oddiy havola
                <NavLink
                  to={link.to}
                  className={({ isActive }) => linkClasses(isActive)}
                >
                  <div>{link.icon}</div>
                  <span
                    className={`transition-opacity ${
                      isOpen
                        ? "opacity-100 duration-300 delay-200"
                        : "opacity-0 duration-100 delay-0 pointer-events-none"
                    }`}
                  >
                    {t(`sidebar.${link.label.toLowerCase()}`)}
                  </span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={clsx(
          "fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity",
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={onClose}
      ></div>

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-gray-100 transform transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-4 h-16 flex items-start justify-between border-b border-gray-700">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="font-bold text-xl">CAMU CRM</span>
          </Link>
          <button className="text-lg text-gray-300" onClick={onClose}>&times;</button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {links.map((link, idx) => (
            <div key={link.to}>
              {link.dropdown ? (
                // Mobile dropdown menyu
                <div className="relative">
                  <button
                    onClick={(e) => toggleDropdown(idx, e)}
                    className={dropdownButtonClasses(
                      isMainLinkActive(link, idx)
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div>{link.icon}</div>
                      <span>{t(`sidebar.${link.label.toLowerCase()}`)}</span>
                    </div>
                    <FiChevronDown
                      className={clsx(
                        "transition-transform duration-300",
                        openDropdown === idx ? "rotate-180" : "rotate-0"
                      )}
                      size={16}
                    />
                  </button>

                  {/* Mobile dropdown content */}
                  <div
                    className={clsx(
                      "overflow-hidden transition-all duration-300",
                      openDropdown === idx
                        ? "max-h-40 opacity-100 mt-1"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="ml-2 space-y-1 border-l-2 border-gray-600 pl-3">
                      {link.submenu.map((subLink) => (
                        <NavLink
                          key={subLink.to}
                          to={subLink.to}
                          className={({ isActive }) =>
                            dropdownLinkClasses(isActive)
                          }
                          onClick={onClose}
                        >
                          <div className="flex items-center gap-2">
                            {subLink.icon}
                            <span>
                              {t(
                                `sidebar.${subLink.label
                                  .toLowerCase()
                                  .replace(" ", "_")}`
                              )}
                            </span>
                          </div>
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Mobile oddiy havola
                <NavLink
                  to={link.to}
                  className={({ isActive }) => linkClasses(isActive)}
                  onClick={onClose}
                >
                  <div>{link.icon}</div>
                  <span>{t(`sidebar.${link.label.toLowerCase()}`)}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
