import useLanguageStore from "../store/useLanguage";
const Loader = () => {
  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 mt-2">{t("loading")}</p>
      </div>
    </div>
  );
}

export default Loader