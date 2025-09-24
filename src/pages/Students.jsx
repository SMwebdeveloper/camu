// src/pages/Students.jsx
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaPlus, FaFilter, FaChevronDown } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import $axios from "../http/index";
import useLanguageStore from "../store/useLanguage";
import CustomSelect from "../components/CustomSelect";
import SearchInput from "../components/SearchInput";

const Students = () => {
  const [filters, setFilters] = useState({
    search: "",
    course: "",
    group: "",
    status: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const t = useLanguageStore((state) => state.t);
  const queryClient = useQueryClient();

  // Ma'lumotlar ro'yxati
  const courses = [
    { id: "", name: t("students.all_courses") },
    { id: "1", name: "1-kurs" },
    { id: "2", name: "2-kurs" },
    { id: "3", name: "3-kurs" },
    { id: "4", name: "4-kurs" },
  ];

  const groups = [
    { id: "", name: t("students.all_groups") },
    { id: "101", name: "101-guruh" },
    { id: "102", name: "102-guruh" },
    { id: "201", name: "201-guruh" },
    { id: "202", name: "202-guruh" },
  ];

  const statuses = [
    { id: "", name: t("students.all_statuses") },
    { id: "active", name: t("students.status.active") },
    { id: "inactive", name: t("students.status.inactive") },
    { id: "graduated", name: t("students.status.graduated") },
  ];

  // Students ma'lumotlarini olish
  const {
    data: studentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students", filters, pagination],
    queryFn: async () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Bo'sh filterlarni olib tashlaymiz
      Object.keys(params).forEach((key) => {
        if (params[key] === "") {
          delete params[key];
        }
      });

      const response = await $axios.get("/students", { params });
      return response.data.data;
    },
    keepPreviousData: true,
  });

  // Filterlarni o'zgartirish
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Sahifa o'zgartirish
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Limit o'zgartirish
  const handleLimitChange = (newLimit) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  // Studentni o'chirish
  const handleDelete = async (studentId) => {
    if (window.confirm(t("students.delete_confirm"))) {
      try {
        await $axios.delete(`/students/${studentId}`);
        queryClient.invalidateQueries(["students"]);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  // Filterlarni tozalash
  const clearFilters = () => {
    setFilters({ search: "", course: "", group: "", status: "" });
    setPagination((prev) => ({ ...prev, page: 1 }));
    setShowMobileFilters(false);
  };

  const totalPages = studentsData?.totalPages || 1;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Sarlavha va Add button */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {t("students.title")}
            </h1>
            <p className="text-gray-600 mt-1">{t("students.description")}</p>
          </div>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                          transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <FaPlus size={16} />
            {t("students.add_student")}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Desktop Filters */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SearchInput
            value={filters.search}
            onChange={(value) => handleFilterChange("search", value)}
            placeholder={t("students.search_placeholder")}
          />

          <CustomSelect
            options={courses}
            value={filters.course}
            onChange={(value) => handleFilterChange("course", value)}
            placeholder={t("students.select_course")}
          />

          <CustomSelect
            options={groups}
            value={filters.group}
            onChange={(value) => handleFilterChange("group", value)}
            placeholder={t("students.select_group")}
          />

          <CustomSelect
            options={statuses}
            value={filters.status}
            onChange={(value) => handleFilterChange("status", value)}
            placeholder={t("students.select_status")}
          />

          <button
            onClick={clearFilters}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 
                     transition-colors border border-transparent hover:border-gray-300"
          >
            {t("students.clear_filters")}
          </button>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl 
                     flex items-center justify-between hover:bg-gray-200 transition-colors"
          >
            <span className="flex items-center gap-2">
              <FaFilter size={16} />
              {t("students.filters")}
            </span>
            <span
              className={`transform transition-transform ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            >
              <FaChevronDown size={14} />
            </span>
          </button>

          {/* Mobile Filters Dropdown */}
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 space-y-4"
            >
              <SearchInput
                value={filters.search}
                onChange={(value) => handleFilterChange("search", value)}
                placeholder={t("students.search_placeholder")}
              />

              <CustomSelect
                options={courses}
                value={filters.course}
                onChange={(value) => handleFilterChange("course", value)}
                placeholder={t("students.select_course")}
              />

              <CustomSelect
                options={groups}
                value={filters.group}
                onChange={(value) => handleFilterChange("group", value)}
                placeholder={t("students.select_group")}
              />

              <CustomSelect
                options={statuses}
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                placeholder={t("students.select_status")}
              />

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl 
                           hover:bg-gray-200 transition-colors"
                >
                  {t("students.clear")}
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl 
                           hover:bg-blue-700 transition-colors"
                >
                  {t("students.apply")}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Jadval */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.no")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.full_name")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.group")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.course")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.status")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsData?.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {student.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {student.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {student.group}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {student.course}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === "active"
                          ? "bg-green-100 text-green-800"
                          : student.status === "inactive"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t(`students.status.${student.status}`)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t("students.edit")}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t("students.delete")}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(!studentsData || studentsData?.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">{t("students.no_data")}</p>
          </div>
        )}
      </div>

      {/* Pagination - Mobile friendly */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Limit selector */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">{t("students.show")}</span>
            <CustomSelect
              options={[
                { id: 5, name: "5" },
                { id: 10, name: "10" },
                { id: 20, name: "20" },
                { id: 50, name: "50" },
              ]}
              value={pagination.limit}
              onChange={handleLimitChange}
              className="w-20"
            />
            <span className="text-sm text-gray-700">
              {t("students.entries")}
            </span>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 
                       disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <MdArrowBackIos size={14} />
            </button>

            {/* Mobile pagination - qisqartirilgan */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (pagination.page === 1) {
                  pageNum = i + 1;
                } else if (pagination.page === totalPages) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = pagination.page - 1 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      pagination.page === pageNum
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 
                       disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <MdArrowForwardIos size={14} />
            </button>
          </div>

          {/* Ma'lumotlar soni */}
          <div className="text-sm text-gray-700 text-center sm:text-right">
            {t("students.showing")}{" "}
            {(pagination.page - 1) * pagination.limit + 1}-
            {Math.min(
              pagination.page * pagination.limit,
              studentsData?.total || 0
            )}
            {t("students.of")} {studentsData?.total || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
