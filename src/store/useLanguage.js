import {create} from 'zustand';
import translations from '../lib/utils/translations';

const useLanguageStore = create((set, get) => ({
  language: localStorage.getItem("language") || "uz",
  setLang: (newLang) => {
    set({ language: newLang });
    localStorage.setItem("language", newLang);
  },
  t: (key) => {
    const lang = get().language;
    const keys = key.split(".");

    let result = translations[lang];
    for (const k of keys) {
      if (result && typeof result === "object") {
        result = result[k];
      } else {
        result = null;
        break;
      }
    }

    return result || key; // agar topilmasa, kalitni qaytaradi
  },
}));

export default useLanguageStore;