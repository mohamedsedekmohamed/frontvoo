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
import ReusableTable from "../../ui/ReusableTable";
const Events = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.events);
      })
      .catch(() => {
        toast.error("Error fetching data");
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
            `https://backndVoo.voo-hub.com/api/admin/event/delete/${userId}`,
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
    navigate("/admin/addevents", { state: { sendData: id } });
  };
  const [selectedDate, setSelectedDate] = useState("");

  const handleChangedata = (e) => {
    setSelectedDate(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    // فلترة حسب التاريخ إذا كان مختار
    const isDateMatch = !selectedDate || item.date === selectedDate;

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

    return isDateMatch && isSearchMatch;
  });

  const cheose = ["Filter", "name", "date", "start_time", "location"];
  const labelMap = {
    Filter: "Filter",
    name: "event",
    date: "date",
    start_time: "time(start)",
    location: "location",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];

    if (!sortKey || !sortOrder) {
      return sortableData;
    }

    return sortableData.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "date") {
        return sortOrder === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const truncateText = (text, maxLength = 5000) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
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
          .delete("https://backndVoo.voo-hub.com/api/admin/event/deleteGroup", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              ids: selectedIds,
            },
          })
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
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Tasks",
      render: (row) => truncateText(row?.name),
    },
    {
      header: "Date",
      render: (row) => truncateText(row?.date),
    },
    {
      header: "Start Time",
      render: (row) => row?.start_time ?? "N/A",
    },
    {
      header: "End Time",
      render: (row) => row?.end_time ?? "N/A",
    },
    {
      header: "Details",
      render: (row) => (
        <button
          className="underline"
          onClick={() =>
            navigate("/admin/eventDetalis", {
              state: { sendData: row.id },
            })
          }
        >
          Details
        </button>
      ),
    },
    {
      header: "Operation",
      render: (row) => (
        <button
          className="underline"
          onClick={() =>
            navigate("/admin/operation", {
              state: { sendData: row.id },
            })
          }
        >
          Operation
        </button>
      ),
    },
    {
      header: "Location",
      render: (row) => truncateText(row?.location),
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
              setSelectedIds(paginatedData.map((item) => item.id));
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [...prev, row.id]);
            } else {
              setSelectedIds((prev) => prev.filter((id) => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center">
          <CiEdit
            className="w-[24px] h-[24px] text-six cursor-pointer hover:text-blue-500 transition"
            onClick={() => handleEdit(row.id)}
          />
          <RiDeleteBin6Line
            className="w-[24px] h-[24px] ml-2 text-five cursor-pointer hover:text-red-600 transition"
            onClick={() => handleDelete(row.id, row.name)}
          />
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="relative items-center">
          <input
            placeholder="Search"
            className="w-[100px] md:min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>
        <div className="flex items-center gap-4 my-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangedata}
            className="px-3 py-2border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={`${sortKey}:${sortOrder}`}
          onChange={(e) => {
            const [key, order] = e.target.value.split(":");
            setSortKey(key || "");
            setSortOrder(order || "");
          }}
          className="text-[14px] h-9 border border-one rounded-[8px] px-2"
        >
          <option value="">Sort By</option>

          <option value="date:asc"> Date ↑</option>
          <option value="date:desc"> Date ↓</option>
        </select>
        <div className="flex gap-2">
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
              className="flex justify-center w-15 md:w-20 text-[10px] md:text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>

          <button
            onClick={() => navigate("/admin/addevents")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            className="bg-one/80 text-white px-4 py-2 rounded"
            onClick={() => handleBulkDelete()}
          >
            Delete Selected
          </button>
        </div>
      )}
      <div className="mt-6">
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

export default Events;
