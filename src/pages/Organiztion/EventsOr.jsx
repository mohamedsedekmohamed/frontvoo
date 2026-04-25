import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import ReusableTable from "../../ui/ReusableTable";
import Loader from "../../ui/Loader";

const EventsOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.events);
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
            `https://backndVoo.voo-hub.com/api/ornization/event/delete/${userId}`,
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
    navigate("/organizeation/addeventsor", { state: { sendData: id } });
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
  const cheose = ["Filter", "name", "date", "start_time", "location"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("Events"),
    date: t("date"),
    start_time: t("start"),
    location: t("location"),
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
      title: `Are you sure you want to delete ${selectedIds.length} event?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://backndVoo.voo-hub.com/api/ornization/event/deleteGroup",
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
            toast.success("Selected event deleted successfully");
            setSelectedIds([]);
            setUpdate((prev) => !prev);
          })
          .catch(() => toast.error("Error deleting some event"));
      }
    });
  };
  const columns = [
    {
      header: t("S/N"),
      render: (_, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("Events"),
      render: (row) => row.name,
    },
    {
      header: t("date"),
      render: (row) => row.date,
    },
    {
      header: t("start"),
      render: (row) => row.start_time || "N/A",
    },
    {
      header: t("end"),
      render: (row) => row.end_time || "N/A",
    },
    {
      header: t("Details"),
      render: (row) => (
        <button
          className=" underline  text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/organizeation/eventsdetails", {
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
          className="underline   text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/organizeation/OperationOr", {
              state: { sendData: row.id },
            })
          }
        >
          {t("Operation")}
        </button>
      ),
    },
    {
      header: t("location"),
      render: (row) => row.location,
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
      {/* TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        {/* SEARCH */}
        <div className="relative w-full lg:w-[30%]">
          <input
            placeholder={t("Search")}
            className="w-full h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three absolute left-2 top-3" />
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* DATE */}
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangedata}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-auto"
          />

          {/* SORT */}
          <select
            value={`${sortKey}:${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split(":");
              setSortKey(key || "");
              setSortOrder(order || "");
            }}
            className="text-[14px] h-10 border border-one rounded-[8px] px-2 w-full sm:w-auto"
          >
            <option value="">{t("SortBy")}</option>
            <option value="start_time:asc">{t("StartTimeup")}</option>
            <option value="start_time:desc">{t("StartTimedown")}</option>
            <option value="date:asc">{t("Dateup")}</option>
            <option value="date:desc">{t("Datedown")}</option>
          </select>

          {/* FILTER */}
          <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10 w-full sm:w-auto">
            <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

            <select
              value={selectedFilter}
              onChange={handleChange}
              className="w-full sm:w-24 text-[16px] bg-transparent text-white outline-none"
              style={{ appearance: "none" }}
            >
              {cheose.map((option, index) => (
                <option key={index} value={option} className="text-black">
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </div>

          {/* ADD BUTTON */}
          <button
            onClick={() => navigate("/organizeation/addeventsor")}
            className="flex items-center justify-center gap-1 h-10 bg-white border-one border px-3 rounded-[8px] w-full sm:w-auto"
          >
            <FaPlus className="text-one w-4 h-4" />
            <span className="text-[16px] font-medium text-one">
              {isArabic ? "أضافة" : "Add"}
            </span>
          </button>
        </div>
      </div>

      {/* BULK DELETE */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className="bg-one/80 text-white px-4 py-2 rounded"
            onClick={handleBulkDelete}
          >
            {t("DeleteSelected")}
          </button>
        </div>
      )}

      {/* TABLE */}
      <div className="w-full overflow-x-auto">
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

export default EventsOr;
