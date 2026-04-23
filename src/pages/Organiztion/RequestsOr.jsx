import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import filter from "../../assets/filter.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import ReusableTable from "../../ui/ReusableTable";
import Swal from "sweetalert2";
import Loader from "../../ui/Loader";

const RequestsOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loading , setLoading] = useState(false);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/orgnization/request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.requests);
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

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
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

      return value?.toString().toLowerCase().includes(query);
    }
  });

  const cheose = [
    "Filter",
    "request_type",
    "user.email",
    "task.name",
    "event.name",
    "orgnization.name",
  ];
  const labelMap = {
    Filter: t("Filter"),
    request_type: t("Type"),
    "user.email": t("Email"),
    "task.name": t("Task"),
    "event.name": t("Event"),
    "orgnization.name": t("Orgnization"),
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
      const aSource = a.request_type === "event" ? a.event : a.task;
      const bSource = b.request_type === "event" ? b.event : b.task;

      if (!aSource || !bSource) return 0;

      // sort by date
      if (sortKey === "date") {
        return sortOrder === "asc"
          ? new Date(aSource.date) - new Date(bSource.date)
          : new Date(bSource.date) - new Date(aSource.date);
      }

      // sort by start_time (with date)
      if (sortKey === "start_time") {
        const aDateTime = new Date(`${aSource.date}T${aSource.start_time}`);
        const bDateTime = new Date(`${bSource.date}T${bSource.start_time}`);
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

  const handleAccept = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://backndVoo.voo-hub.com/api/orgnization/request/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success("Request accepted successfully");
        setUpdate((prev) => !prev); // Force re-render to update the table
      })
      .catch(() => {
        toast.error("Error accepting request");
      });
  };

  const handleReject = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://backndVoo.voo-hub.com/api/orgnization/request/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success("Request rejected successfully");
        setUpdate((prev) => !prev); // Force re-render to update the table
      })
      .catch(() => {
        toast.error("Error rejecting request");
      });
  };


  const handleBulkAction = (action) => {
    const token = localStorage.getItem("token");
    const label = action === "accept" ? "Accepted" : "Rejected";

    Swal.fire({
      title: `Are you sure you want to ${action} ${selectedIds.length} Pending?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/${action}Group`,
            { ids: selectedIds },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            setUpdate((prev) => !prev);
            setSelectedIds([]);
            Swal.fire(
              `${label}!`,
              `All selected Pending have been ${label.toLowerCase()}.`,
              "success",
            );
          })
          .catch(() => {
            Swal.fire("Error", "One or more Pending failed.", "error");
          });
      }
    });
  };
  const columns = [
  {
    header: t("S/N"),
    render: (_, __, index) =>
      (currentPage - 1) * rowsPerPage + index + 1,
  },
  {
    header: t("Type"),
    accessor: "request_type",
    render: (item) => (item?.request_type),
  },
  {
    header: t("User"),
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-[12px]">
          {(item?.user?.name)}
        </span>
        <span className="text-[10px]">
          {(item?.user?.email)}
        </span>
      </div>
    ),
  },
  {
    header: t("Event/Task"),
    render: (item) =>
      item?.event?.name
        ? (item?.event?.name)
        : (item?.task?.name),
  },
  {
    header: t("Date"),
    render: (item) =>
      item?.event?.date || item?.task?.date,
  },
  {
    header: t("Time"),
    render: (item) =>
      item?.event?.start_time || item?.task?.start_time,
  },
  {
    header: t("Organization"),
    render: (item) => (item?.orgnization?.name),
  },
  {
    header: t("Status"),
    render: (item) => (
      <span className="bg-eight rounded-circle px-2 py-1 text-three">
        {item?.status ?? "N/A"}
      </span>
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
          } else {
            setSelectedIds([]);
          }
        }}
      />
    ),
    render: (item) => (
      <input
        type="checkbox"
        checked={selectedIds.includes(item.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setSelectedIds((prev) => [...prev, item.id]);
          } else {
            setSelectedIds((prev) =>
              prev.filter((id) => id !== item.id)
            );
          }
        }}
      />
    ),
  },
  {
    header: t("Action"),
    render: (item) => (
      <select
        className="text-white bg-one px-4 py-2 rounded-md text-[12px]"
        onChange={(e) => {
          if (e.target.value === "accept") handleAccept(item.id);
          if (e.target.value === "reject") handleReject(item.id);
        }}
        defaultValue=""
      >
        <option value="" disabled>
          Select
        </option>
        <option value="accept">Accept</option>
        <option value="reject">Reject</option>
      </select>
    ),
  },
]; 
if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="relative items-center">
          <input
            placeholder={t("Search")}
            className="min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
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
          <option value="">{t("SortBy")}</option>
          <option value="start_time:asc">{t("StartTimeup")}</option>
          <option value="start_time:desc">{t("StartTimedown")}</option>
          <option value="date:asc">{t("Dateup")}</option>
          <option value="date:desc">{t("Datedown")}</option>
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
              className="flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("accept")}
          >
            {t("AcceptSelected")}
          </button>
          <button
            className="bg-one/70 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("reject")}
          >
            {t("RejectSelected")}
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

export default RequestsOr;
