import useLanguageStore from "../store/useLanguage";

const FinanceTable = ({ data }) => {
    const t = useLanguageStore((state) => state.t);
    const language = useLanguageStore((state) => state.language);
  if (!data) return null;
  const rows = [
    { label: "table_item1", value: data.tolov_summa_umumiy, color: "text-green-600"},
    { label: "table_item2", value: data.tolov_umumiy, color: "text-blue-600" },
    { label: "table_item3", value: data.qarz_umumiy, color: "text-red-600" },
    { label: "table_item4", value: data.avans_umumiy, color: "text-yellow-600" },
    { label: "table_item5", value: data.goldiq_summa_umumiy, color: "text-purple-600" },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border rounded-xl overflow-hidden">
        <thead className="bg-gray-100 text-slate-600 text-left">
          <tr>
            <th className="px-4 py-2 border">{t("finance.table.indicator")}</th>
            <th className="px-4 py-2 border">{t("finance.table.value")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className={`px-4 py-2 border ${r.color}`}>{t(`finance.table.${r.label}`)}</td>
              <td className="px-4 py-2 border font-medium text-slate-700">
                {new Intl.NumberFormat("uz-UZ").format(r.value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default FinanceTable;