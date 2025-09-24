import {
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useLanguageStore from "../store/useLanguage";
const COLORS = ["#2563eb", "#dc2626", "#f59e0b", "#9333ea"];

const PieChart = ({ data }) => {
  const t = useLanguageStore((state) => state.t);
  const language = useLanguageStore((state) => state.language);
  if (!data) return null;
  const pieData = [
    { name: t("finance.charts.paid"), value: data.tolov_umumiy },
    { name: t("finance.charts.debt"), value: data.qarz_umumiy },
    { name: t("finance.charts.advance"), value: data.avans_umumiy },
    { name: t("finance.charts.balance"), value: data.goldiq_summa_umumiy },
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <RePieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={50}
          fill="#8884d8"
          dataKey="value"
        >
          {pieData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </RePieChart>
    </ResponsiveContainer>
  );
};
export default PieChart;