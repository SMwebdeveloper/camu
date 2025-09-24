const StatCard = ({ title, value, icon, bgColor, borderColor }) => (
  <div
    className={`p-5 rounded-xl border ${borderColor} shadow-sm ${bgColor} hover:shadow-md transition`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h3 className="text-xl font-semibold text-gray-800 mt-1 truncate">
          {value ? new Intl.NumberFormat("uz-UZ").format(value) : 0}
        </h3>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);
export default StatCard;