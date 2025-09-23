import React, { useState, useRef, useEffect } from "react";
import useLanguageStore from "../store/useLanguage"; // yo‘lini o‘zingnikiga mosla

const LANGS = [
  { code: "uz", emoji: "🇺🇿" },
  { code: "en", emoji: "🇬🇧" },
  { code: "ru", emoji: "🇷🇺" },
];

export default function LanguageSelect() {
  const language = useLanguageStore((s) => s.language);
  const setLang = useLanguageStore((s) => s.setLang);

  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, []);

  const active = LANGS.find((l) => l.code === language) || LANGS[1];

  return (
    <div ref={rootRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-800 text-gray-100 hover:bg-gray-700 transition"
      >
        <span className="text-lg">{active.emoji}</span>
        <span className="uppercase">{active.code}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <ul
        className={`absolute right-0 mt-2 w-full bg-gray-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-30 z-50 
    transition-all duration-200 ease-out 
    ${
      open
        ? "opacity-100 scale-100 translate-y-0"
        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
    }`}
      >
        {LANGS.map((l) => (
          <li
            key={l.code}
            onClick={() => {
              setLang(l.code);
              setOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
              l.code === language
                ? "bg-gray-800 text-white font-medium"
                : "text-gray-200 hover:bg-gray-800"
            }`}
          >
            <span className="text-lg">{l.emoji}</span>
            <span className="uppercase">{l.code}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
