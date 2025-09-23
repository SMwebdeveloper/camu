import { NavLink, Link, useLocation } from "react-router-dom";
import Logo from "../../public/logo.jpg";
import { IoHomeOutline } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import useLanguageStore from "../store/useLanguage";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export default function Sidebar({ isOpen, mobileOpen, onClose }) {
  const t = useLanguageStore((state) => state.t);

  const links = [
    { to: "/", label: "Dashboard", icon: <IoHomeOutline size={20} /> },
    {
      to: "/students",
      label: "Reports",
      icon: <TbReportAnalytics size={20} />,
    },
  ];

  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const linkRefs = useRef([]);
  const navRef = useRef(null);

  useEffect(() => {
    const index = links.findIndex((link) => link.to === location.pathname);
    setActiveIndex(index === -1 ? 0 : index);
  }, [location.pathname]);

  // Indicator positionni hisoblash - soddalashtirilgan versiya
  const [indicatorStyle, setIndicatorStyle] = useState({
    height: "40px", // default height
    top: "0px",
    opacity: 1, // qo'shimcha
  });

  useEffect(() => {
    // Kichik timeout bilan DOM yangilanishini kutamiz
    const timer = setTimeout(() => {
      if (linkRefs.current[activeIndex] && navRef.current) {
        const activeLink = linkRefs.current[activeIndex];

        console.log("Active link found:", activeLink);
        console.log("Offset height:", activeLink.offsetHeight);
        console.log("Offset top:", activeLink.offsetTop);

        setIndicatorStyle({
          height: `${activeLink.offsetHeight}px`,
          top: `${activeLink.offsetTop}px`,
          opacity: 1,
        });
      } else {
        console.log("Active link not found");
        // Fallback values
        setIndicatorStyle({
          height: "40px",
          top: "8px",
          opacity: 1,
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeIndex, isOpen, mobileOpen, location.pathname]);

  const linkClasses = (isActive) =>
    `flex items-center h-10 gap-2 p-2 rounded-lg transition-colors duration-300 relative ${
      isActive
        ? "bg-gray-800 text-white"
        : "text-gray-300 hover:text-white hover:bg-gray-700"
    }`;

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden md:flex flex-col bg-gray-900 text-gray-100 h-full transition-all duration-300 border-r border-gray-700",
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

        <nav ref={navRef} className="relative flex-1 p-4 space-y-2">
          {/* Indicator - batafsil stil */}
          <div
            className="absolute right-0 w-1 bg-blue-500 rounded-l transition-all duration-300 z-10"
            style={indicatorStyle}
          ></div>

          {links.map((link, idx) => (
            <NavLink
              key={link.to}
              to={link.to}
              ref={(el) => {
                linkRefs.current[idx] = el;
                // Ref o'zgarganida yangilash
                if (el && idx === activeIndex) {
                  setTimeout(() => {
                    if (el && navRef.current) {
                      setIndicatorStyle({
                        height: `${el.offsetHeight}px`,
                        top: `${el.offsetTop}px`,
                        opacity: 1,
                      });
                    }
                  }, 50);
                }
              }}
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
        <div className="p-4 h-16 flex items-center border-b border-gray-700">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={Logo}
              alt="logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="font-bold text-xl">CAMU CRM</span>
          </Link>
        </div>

        <nav ref={navRef} className="relative flex-1 p-4 space-y-2">
          {/* Mobile uchun indicator */}
          <div
            className="absolute right-0 w-1 bg-blue-500 rounded-l transition-all duration-300 z-10"
            style={indicatorStyle}
          ></div>

          {links.map((link, idx) => (
            <NavLink
              key={link.to}
              to={link.to}
              ref={(el) => (linkRefs.current[idx] = el)}
              className={({ isActive }) => linkClasses(isActive)}
              onClick={onClose}
            >
              <div>{link.icon}</div>
              <span>{t(`sidebar.${link.label.toLowerCase()}`)}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
