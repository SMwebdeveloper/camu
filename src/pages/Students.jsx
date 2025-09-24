import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { motion } from "framer-motion";
import $axios from "../http/index";
import useLanguageStore from "../store/useLanguage";
import CustomSelect from "../components/CustomSelect";
import SearchInput from "../components/SearchInput";
import Loader from "../components/Loader";

const Students = () => {
  const [filters, setFilters] = useState({
    search: "",
    kurs: "",
    group: "",
    status: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });

  const t = useLanguageStore((state) => state.t);
  const queryClient = useQueryClient();

  const courses = [
    { id: "", name: t("students.all_courses") },
    { id: "1", name: "1-kurs" },
    { id: "2", name: "2-kurs" },
    { id: "3", name: "3-kurs" },
    { id: "4", name: "4-kurs" },
  ];

  const statuses = [
    { id: "", name: t("students.all_statuses") },
    { id: "studying", name: t("students.table.status_value.studying") },
    { id: "expelled", name: t("students.table.status_value.expelled") },
    { id: "graduated", name: t("students.table.status_value.graduated") },
  ];

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ["students", filters, pagination],
    queryFn: async () => {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (filters.search) {
        params.search = filters.search;
      }
      if (filters.kurs) {
        params.kurs = filters.kurs;
      }
      if (filters.status) {
        params.status = filters.status;
      }
      if (filters.group) {
        params.guruh = filters.group; // encodeURIComponent OLMASLIK KERAK
      }

      const response = await $axios.get("/students", {
        params: params,
        paramsSerializer: (params) => {
          return new URLSearchParams(params).toString();
        },
      });
      return response.data;
    },
    keepPreviousData: true,
  });

  const handleTempFilterChange = (key, value) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    const defaultFilters = { search: "", kurs: "", group: "", status: "" };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (studentsData?.pages || 1)) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleLimitChange = (newLimit) => {
    setPagination({ limit: newLimit, page: 1 });
  };

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

  const totalPages = studentsData?.pages || 1;
  const studentsList = studentsData?.data || [];
  const totalEntries = studentsData?.total || 0;

  const getStatusKey = (status) => {
    switch (status) {
      case "o'qimoqda":
        return "studying";
      case "chetlatilgan":
        return "expelled";
      case "bitirgan":
        return "graduated";
      default:
        return "";
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const { page } = pagination;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      if (page > 3) {
        pageNumbers.push("...");
      }
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pageNumbers.push(i);
      }
      if (page < totalPages - 2) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }
    return pageNumbers.filter(
      (item, index, arr) => !(item === "..." && arr[index - 1] === "...")
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      {/* Page Header and Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {t("students.title")}
            </h1>
            <p className="text-sm md:text-base text-gray-600 mt-1">
              {t("students.description")}
            </p>
          </div>
          <button
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                          transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <FaPlus size={16} />
            {t("students.add_student")}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-grow">
            <SearchInput
              value={tempFilters.search}
              onChange={(value) => handleTempFilterChange("search", value)}
              placeholder={t("students.search_placeholder")}
            />
            <CustomSelect
              options={courses}
              value={tempFilters.kurs}
              onChange={(value) => handleTempFilterChange("kurs", value)}
              placeholder={t("students.select_course")}
            />
            <SearchInput
              value={tempFilters.group}
              onChange={(value) => handleTempFilterChange("group", value)}
              placeholder={t("students.all_groups")}
            />
            {/* <CustomSelect
              options={statuses}
              value={tempFilters.status}
              onChange={(value) => handleTempFilterChange("status", value)}
              placeholder={t("students.select_status")}
            /> */}
          </div>
          <div className="flex gap-2 mt-4 lg:mt-0 w-full sm:w-auto">
            <button
              onClick={applyFilters}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              {t("students.apply")}
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              {t("students.clear_filters")}
            </button>
          </div>
        </div>
      </div>

      {/* Students List (Mobile - Cards) */}
      <div className="lg:hidden space-y-4">
        {studentsList.length > 0 ? (
          studentsList.map((student) => (
            <motion.div
              key={student.id}
              className="bg-white rounded-2xl shadow-sm p-4 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {student.fish}
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.tel_nomer1}
                  </div>
                </div>
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
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">
                    {t("students.table.group")}:
                  </span>{" "}
                  <span className="text-gray-900">{student.guruh}</span>
                </p>
                <p>
                  <span className="font-medium">
                    {t("students.table.direction")}:
                  </span>{" "}
                  <span className="text-gray-900">{student.yonalish}</span>
                </p>
                <p>
                  <span className="font-medium">
                    {t("students.table.course")}:
                  </span>{" "}
                  <span className="text-gray-900">{student.kurs}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="font-medium">
                    {t("students.table.status_header")}:
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusKey(student.holat) === "studying"
                        ? "bg-green-100 text-green-800"
                        : getStatusKey(student.holat) === "expelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {t(
                      `students.table.status_value.${
                        student.holat === "o'qimoqda"
                          ? "studying"
                          : student.holat === "chetlatilgan"
                          ? "expelled"
                          : "graduated"
                      }`
                    )}
                  </span>
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-sm text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-500 text-lg">{t("students.no_data")}</p>
          </div>
        )}
      </div>

      {/* Students Table (Desktop) */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.no")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.full_name")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.group")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.course")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.direction")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.status_header")}
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t("students.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {studentsList.length > 0 ? (
                studentsList.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4 text-sm text-gray-900">
                      {(studentsData.current_page - 1) * pagination.limit +
                        index +
                        1}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.fish}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.tel_nomer1}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {student.guruh}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {student.kurs}
                    </td>
                    <td className="p-4 text-sm text-gray-900">
                      {student.yonalish}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          getStatusKey(student.holat) === "studying"
                            ? "bg-green-100 text-green-800"
                            : getStatusKey(student.holat) === "expelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {t(
                          `students.table.status_value.${getStatusKey(
                            student.holat
                          )}`
                        )}
                      </span>
                    </td>
                    <td className="p-4">
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">📊</div>
                    <p className="text-gray-500 text-lg">
                      {t("students.no_data")}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <MdArrowBackIos size={14} />
            </button>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span key={index} className="px-3 py-1 text-gray-500">
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 rounded-lg border text-sm transition-colors ${
                    pagination.page === pageNum
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
            >
              <MdArrowForwardIos size={14} />
            </button>
          </div>

          <div className="text-sm text-gray-700 text-center sm:text-right">
            {t("students.showing")}{" "}
            {(studentsData?.current_page - 1) * pagination.limit + 1}-
            {Math.min(
              studentsData?.current_page * pagination.limit,
              totalEntries
            )}{" "}
            {t("students.of")} {totalEntries}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Students;
