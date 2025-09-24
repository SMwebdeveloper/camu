import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBookOpen,
  FaRegFileAlt,
  FaBullhorn,
  FaTrophy,
  FaBook,
} from "react-icons/fa";
import Loader from "../components/Loader";
import useLanguageStore from '../store/useLanguage';
const stats = [
  {
    title: "students",
    value: 3245,
    icon: FaUserGraduate,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "teachers",
    value: 245,
    icon: FaChalkboardTeacher,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "subjects",
    value: 128,
    icon: FaBookOpen,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "applications",
    value: 54,
    icon: FaRegFileAlt,
    color: "bg-orange-100 text-orange-600",
  },
];

const recentApplications = [
  { name: "Shavkatova Malika", current: "3", time: "durationTime" },
  { name: "Karimov Aziz", current: "6", time: "durationTime" },
  { name: "Rasulova Dilnoza", current: "1", time: "durationDay" },
];

const news = [
  {
    icon: FaBullhorn,
    text: "item1",
    color: "border-orange-500",
    textColor: "text-orange-600",
  },
  {
    icon: FaTrophy,
    text: "item2",
    color: "border-yellow-500",
    textColor: "text-yellow-600",
  },
  {
    icon: FaBook,
    text: "item3",
    color: "border-green-500",
    textColor: "text-green-600",
  },
];

export default function Dashboard() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));
  const [animations, setAnimations] = useState({
    welcome: false,
    stats: false,
    applications: false,
    news: false,
  });

  // store
  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);

  // Router orqali kelgan manbani tekshirish
  const cameFromLogin = location.state?.from === "/login";
  const isFirstVisit = location.state?.firstVisit || false;

  // Login holatini tekshirish
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const hasSeenLoader = localStorage.getItem("hasSeenDashboardLoader");

    if (isLoggedIn && !hasSeenLoader) {
      // Birinchi marta login qilgan
      setIsLoading(true);

      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowContent(true);
        localStorage.setItem("hasSeenDashboardLoader", "true");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Oldin login qilgan yoki boshqa sahifadan o'tgan
      setIsLoading(false);
      setShowContent(true);
      setAnimations({
        welcome: true,
        stats: true,
        applications: true,
        news: true,
      });

      // Agar login pagedan kelgan bo'lsa, animatsiya qilmasin
      if (!cameFromLogin) {
        setAnimatedValues(stats.map((stat) => stat.value));
      }
    }
  }, [cameFromLogin]);

  // Komponentlar ketma-ket animatsiya
  useEffect(() => {
    if (!showContent) return;

    const hasAnimated = localStorage.getItem("hasAnimatedDashboard");

    if (!hasAnimated && isFirstVisit) {
      // Birinchi marta login qilganda animatsiyalar
      const timers = [
        setTimeout(
          () => setAnimations((prev) => ({ ...prev, welcome: true })),
          200
        ),
        setTimeout(
          () => setAnimations((prev) => ({ ...prev, stats: true })),
          500
        ),
        setTimeout(
          () => setAnimations((prev) => ({ ...prev, applications: true })),
          800
        ),
        setTimeout(
          () => setAnimations((prev) => ({ ...prev, news: true })),
          1100
        ),
      ];

      localStorage.setItem("hasAnimatedDashboard", "true");

      return () => timers.forEach((timer) => clearTimeout(timer));
    } else {
      // Boshqa sahifadan o'tganda yoki qayta kirganda
      setAnimations({
        welcome: true,
        stats: true,
        applications: true,
        news: true,
      });
    }
  }, [showContent, isFirstVisit]);

  // Stats raqamlarini animatsiya (FAQAT login pagedan kelganda)
  useEffect(() => {
    if (!animations.stats || !cameFromLogin) return;

    // Faqat login pagedan kelganda raqam animatsiyasi
    const duration = 1000;
    const interval = 20;
    const steps = duration / interval;

    stats.forEach((stat, index) => {
      const stepValue = stat.value / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        setAnimatedValues((prev) => {
          const newValues = [...prev];
          const newValue = Math.min(
            Math.round(stepValue * currentStep),
            stat.value
          );
          newValues[index] = newValue;
          return newValues;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setTimeout(() => {
            setAnimatedValues((prev) => {
              const finalValues = [...prev];
              finalValues[index] = stat.value;
              return finalValues;
            });
          }, 100);
        }
      }, interval);

      return () => clearInterval(timer);
    });
  }, [animations.stats, cameFromLogin]);

  // Boshqa sahifalardan o'tganda darhol yakuniy qiymatlarni ko'rsatish
  useEffect(() => {
    if (showContent && !cameFromLogin) {
      setAnimatedValues(stats.map((stat) => stat.value));
    }
  }, [showContent, cameFromLogin]);

  // Loading komponenti
  if (isLoading) {
    return (
     <Loader/>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Welcome Banner */}
      <div
        className={`bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md transition-opacity duration-700 ${
          animations.welcome ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-2xl font-bold mb-2">{t("welcome")}! 🎉</h1>
        <p className="text-sm opacity-90">{t("desc")}</p>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-opacity duration-700 ${
          animations.stats ? "opacity-100" : "opacity-0"
        }`}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.color}`}
            >
              <item.icon size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {t(`stats.${item.title.toLowerCase().replace(" ", "_")}`)}
              </p>
              <h3 className="text-2xl font-bold text-gray-800">
                {animatedValues[index].toLocaleString()}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Oxirgi arizalar */}
      <div
        className={`bg-white rounded-2xl shadow-md p-6 flex flex-col transition-opacity duration-700 ${
          animations.applications ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">{t("recent.title")}</h2>
        <div className="space-y-3 flex-1">
          {recentApplications.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl border hover:bg-gray-50 hover:shadow-sm transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FaUserGraduate className="text-blue-600" />
                </div>
                <p className="font-medium">{item.name}</p>
              </div>
              <span className="text-xs text-gray-500">
                {item.current} {t(`recent.${item.time}`)}
              </span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          {t("recent.view_all")}
        </button>
      </div>

      {/* Yangiliklar */}
      <div
        className={`bg-white rounded-2xl shadow-md p-6 flex flex-col transition-opacity duration-700 ${
          animations.news ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-lg font-bold mb-4">{t("news.title")}</h2>
        <div className="space-y-3 flex-1">
          {news.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-4 rounded-xl border-l-4 ${item.color} bg-gray-50 hover:bg-white hover:shadow-sm transition-all duration-300`}
            >
              <span className={item.textColor}>
                <item.icon className="text-xl mt-1" />
              </span>
              <p className="text-sm text-gray-700">{t(`news.${item.text}`)}</p>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full px-4 py-2 rounded-lg font-medium bg-blue-600 text-white  hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          {t("news.all_news")}
        </button>
      </div>
    </div>
  );
}
