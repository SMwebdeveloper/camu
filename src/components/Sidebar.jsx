import { NavLink, Link } from "react-router-dom";
import Logo from "../../public/logo.jpg";
import { IoHomeOutline } from "react-icons/io5";
import { TbReportAnalytics } from "react-icons/tb";
import useLanguageStore from "../store/useLanguage";

export default function Sidebar() {
  const linkClasses =
    "flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800 transition-colors";
  const t = useLanguageStore(state => state.t)
  const language = useLanguageStore(state => state.language)
  return (
    <aside className="w-64 h-[100%] bg-gray-900 text-gray-100 flex flex-col">
      <div className="p-4 h-16 text-xl font-bold border-b border-gray-700">
        <Link to={"/"} className="flex items-center gap-4">
          <img
            src={Logo}
            alt="logo"
            className="w-10 h-10 object-cover rounded-full"
          />
          CAMU CRM
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <IoHomeOutline />
          {t("sidebar.dashboard")}
        </NavLink>
        <NavLink
          to="/students"
          className={({ isActive }) =>
            `${linkClasses} ${
              isActive
                ? "bg-gray-800 text-white"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            }`
          }
        >
          <TbReportAnalytics />
          {t("sidebar.reports")}
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
        © 2025 Admin
      </div>
    </aside>
  );
}
