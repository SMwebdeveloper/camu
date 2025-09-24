import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FiFilter,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
  FiBarChart2,
} from "react-icons/fi";
import $axios from "../http/index";
import Loader from "../components/Loader";
import useLanguageStore from "../store/useLanguage";
import FinanceTable from "../components/FinanceTable";
import PieChart from "../components/PieChart";
import StatCard from "../components/StatCard";

// 📌 API fetch
const fetchFinanceData = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.kurs) params.append("kurs", filters.kurs);
  if (filters.guruh) params.append("guruh", filters.guruh);
  if (filters.yonalish) params.append("yonalish", filters.yonalish);
  if (filters.oquv_yili) params.append("oquv_yili", filters.oquv_yili);

  const url = `/students/hisobla/yigindi/${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  const response = await $axios.get(url);
  return response.data;
};

export default function FinanceDashboard() {
    const t = useLanguageStore((state) => state.t);
    const language = useLanguageStore((state) => state.language);
  const [filters, setFilters] = useState({
    kurs: "",
    guruh: "",
    yonalish: "",
    oquv_yili: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({});

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["finance", appliedFilters],
    queryFn: () => fetchFinanceData(appliedFilters),
    refetchOnWindowFocus: false,
  });

  const formattedData = data
    ? {
        tolov_summa_umumiy: +data.tolov_summa_umumiy || 0,
        tolov_umumiy: +data.tolov_umumiy || 0,
        qarz_umumiy: +data.qarz_umumiy || 0,
        avans_umumiy: +data.avans_umumiy || 0,
        goldiq_summa_umumiy: +data.goldiq_summa_umumiy || 0,
      }
    : null;

  if (isLoading) return <Loader />;
  if (error)
    return <div className="text-center text-red-600">{error.message}</div>;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">{t("finance.title")}</h1>
          <p className="text-sm opacity-90">
            {t("finance.description")}
          </p>
        </div>
        <button
          className="bg-white text-blue-600 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-100"
          onClick={() => setAppliedFilters(filters)}
        >
          <FiFilter /> {t("finance.filter.apply")}
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white shadow p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          placeholder={t("finance.filters.course")}
          className="border outline-blue-600 rounded-lg px-3 py-2"
          value={filters.kurs}
          onChange={(e) => setFilters({ ...filters, kurs: e.target.value })}
        />
        <input
          placeholder={t("finance.filters.group")}
          className="border outline-blue-600 rounded-lg px-3 py-2"
          value={filters.guruh}
          onChange={(e) => setFilters({ ...filters, guruh: e.target.value })}
        />
        <select
          className="border outline-blue-600 rounded-lg px-3 py-2"
          value={filters.yonalish}
          onChange={(e) => setFilters({ ...filters, yonalish: e.target.value })}
        >
          <option value="">{t("finance.filters.select.direction")}</option>
          <option value="Davolash">{t("finance.filters.select.treatment")}</option>
          <option value="Stamatologiya">{t("finance.filters.select.stomotology")}</option>
          <option value="Pediyatriya">{t("finance.filters.select.pediatrics")}</option>
        </select>
        <input
          placeholder={t("finance.filters.academic_year")}
          className="border outline-blue-600 rounded-lg px-3 py-2"
          value={filters.oquv_yili}
          onChange={(e) =>
            setFilters({ ...filters, oquv_yili: e.target.value })
          }
        />
      </div>

      {/* Statistik Kartalar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title={t("finance.stats.total_payments")}
          value={formattedData?.tolov_summa_umumiy}
          icon={<FiDollarSign className="text-green-600" />}
          bgColor="bg-green-50"
          borderColor="border-green-200"
        />
        <StatCard
          title={t("finance.stats.total_paid")}
          value={formattedData?.tolov_umumiy}
          icon={<FiTrendingUp className="text-blue-600" />}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
        />
        <StatCard
          title={t("finance.stats.total_debt")}
          value={formattedData?.qarz_umumiy}
          icon={<FiTrendingDown className="text-red-600" />}
          bgColor="bg-red-50"
          borderColor="border-red-200"
        />
        <StatCard
          title={t("finance.stats.total_advance")}
          value={formattedData?.avans_umumiy}
          icon={<FiPieChart className="text-orange-600" />}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
        />
        <StatCard
          title={t("finance.stats.total_balance")}
          value={formattedData?.goldiq_summa_umumiy}
          icon={<FiBarChart2 className="text-purple-600" />}
          bgColor="bg-purple-50"
          borderColor="border-purple-200"
        />
      </div>

      {/* Chart va Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("finance.charts.payment_distribution")}
          </h2>
          <PieChart data={formattedData} />
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">{t("finance.table.table_title")}</h2>
          <FinanceTable data={formattedData} />
        </div>
      </div>
    </div>
  );
}
