import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
import Loader from "../../ui/Loader";

const TasksOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.tasks);
      })
      .catch(() => {
        toast.error("Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [update]);
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };
  const handleDelete = (userId, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            `https://backndVoo.voo-hub.com/api/ornization/task/delete/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            setUpdate(!update);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success",
            );
          })
          .catch(() => {
            Swal.fire(
              "Error!",
              `There was an error while deleting ${userName}.`,
              "error",
            );
          });
      } else {
        Swal.fire("Cancelled", `${userName} was not deleted.`, "info");
      }
    });
  };

  const handleEdit = (id) => {
    navigate("/organizeation/addtasksor", { state: { sendData: id } });
  };
  const [selectedDate, setSelectedDate] = useState("");

  const handleChangedata = (e) => {
    setSelectedDate(e.target.value); // value هي بصيغة YYYY-MM-DD
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    // فلترة حسب التاريخ إذا كان مختار
    const isDateMatch = !selectedDate || item.date === selectedDate;

    // فلترة حسب البحث
    let isSearchMatch;
    if (selectedFilter === "Filter" || selectedFilter === "") {
      isSearchMatch = Object.values(item).some((value) =>
        typeof value === "object"
          ? Object.values(value || {}).some((sub) =>
              sub?.toString().toLowerCase().includes(query),
            )
          : value?.toString().toLowerCase().includes(query),
      );
    } else {
      const keys = selectedFilter.split(".");
      let value = item;
      for (let key of keys) {
        value = value?.[key];
      }

      isSearchMatch = value?.toString().toLowerCase().includes(query);
    }

    // شرط نهائي: لازم يطابق التاريخ + البحث
    return isDateMatch && isSearchMatch;
  });

  const cheose = ["Filter", "name", "date", "start_time", "description"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("Task"),
    date: t("date"),
    start_time: t("start"),
    description: t("description"),
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];

    if (!sortKey || !sortOrder) {
      return sortableData;
    }

    return sortableData.sort((a, b) => {
      if (sortKey === "date") {
        return sortOrder === "asc"
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      }

      if (sortKey === "start_time") {
        const aDateTime = new Date(`${a.date}T${a.start_time}`);
        const bDateTime = new Date(`${b.date}T${b.start_time}`);
        return sortOrder === "asc"
          ? aDateTime - bDateTime
          : bDateTime - aDateTime;
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleBulkDelete = () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${selectedIds.length} Task`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://backndVoo.voo-hub.com/api/ornization/task/deleteGroup",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: {
                ids: selectedIds,
              },
            },
          )
          .then(() => {
            toast.success("Selected Taskdeleted successfully");
            setSelectedIds([]);
            setUpdate((prev) => !prev);
          })
          .catch(() => toast.error("Error deleting some Task؟"));
      }
    });
  };
  const columns = [
    {
      header: t("S/N"),
      render: (_, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("Task"),
      render: (row) => row.name,
    },
    {
      header: t("start"),
      render: (row) => row.start_time,
    },
    {
      header: t("description"),
      render: (row) => row.description,
    },
    {
      header: t("date"),
      render: (row) => row.date,
    },
    {
      header: t("Details"),
      render: (row) => (
        <button
          className="underline   text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/organizeation/tasksdetails", {
              state: { sendData: row.id },
            })
          }
        >
          {t("Details")}
        </button>
      ),
    },
    {
      header: t("Operation"),
      render: (row) => (
        <button
          className="underline  text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/organizeation/operationTasksOr", {
              state: { sendData: row.id },
            })
          }
        >
          {t("Operation")}
        </button>
      ),
    },
    {
      header: (
        <input
          type="checkbox"
          checked={
            selectedIds.length === paginatedData.length &&
            paginatedData.length > 0
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds(paginatedData.map((i) => i.id));
            } else setSelectedIds([]);
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((p) => [...p, row.id]);
            } else {
              setSelectedIds((p) => p.filter((id) => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      header: t("Action"),
      render: (row) => (
        <div className="flex items-center">
          <CiEdit
            className="w-[22px] h-[22px] text-six cursor-pointer"
            onClick={() => handleEdit(row.id)}
          />
          <RiDeleteBin6Line
            className="w-[22px] h-[22px] ml-2 text-red-500 cursor-pointer"
            onClick={() => handleDelete(row.id, row.name)}
          />
        </div>
      ),
    },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      {/* TOP BAR - RESPONSIVE ONLY */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* SEARCH (unchanged design) */}
        <div className="relative items-center w-full md:w-auto flex-1">
          <input
            placeholder={t("Search")}
            className="min-w-[50%] w-full md:w-auto h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>

        {/* DATE */}
        <div className="w-full md:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangedata}
            className="w-full md:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm"
          />
        </div>

        {/* SORT */}
        <div className="w-full md:w-auto">
          <select
            value={`${sortKey}:${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split(":");
              setSortKey(key || "");
              setSortOrder(order || "");
            }}
            className="text-[14px] h-9 border border-one rounded-[8px] px-2 w-full md:w-auto"
          >
            <option value="">{t("SortBy")}</option>
            <option value="start_time:asc">{t("StartTimeup")}</option>
            <option value="start_time:desc">{t("StartTimedown")}</option>
            <option value="date:asc">{t("Dateup")}</option>
            <option value="date:desc">{t("Datedown")}</option>
          </select>
        </div>

        {/* FILTER + ADD (NO DESIGN CHANGE) */}
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          {/* FILTER (UNCHANGED EXACTLY) */}
          <button className="flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1">
            <img src={filter} className="text-white w-4 h-4 md:w-6 md:h-6" />
            <select
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                paddingRight: "20px",
                backgroundImage: "none",
              }}
              value={selectedFilter}
              onChange={handleChange}
              className="flex justify-center w-20 text-[16px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>

          {/* ADD BUTTON (UNCHANGED) */}
          <button
            onClick={() => navigate("/organizeation/addtasksor")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              {isArabic ? "أضافة" : "Add"}
            </span>
          </button>
        </div>
      </div>

      {/* BULK DELETE */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            className="bg-one/80 text-white px-4 py-2 rounded w-full md:w-auto"
            onClick={handleBulkDelete}
          >
            {t("DeleteSelected")}
          </button>
        </div>
      )}

      {/* TABLE WRAPPER (important fix) */}
      <div className="mt-6 w-full overflow-x-auto">
        <ReusableTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />
      </div>

      <ToastContainer />
    </div>
  );
};

export default TasksOr;
