import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
import Loader from "../../ui/Loader";

const Requests = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [active, setActive] = useState("task"); // task or event
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/request", {
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
            `https://backndVoo.voo-hub.com/api/admin/request/delete/${userId}`,
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

  const accept = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to accept ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/admin/request/accept/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Accepted!", `${userName} has been accepted.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to accept ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not accepted.`, "info");
      }
    });
  };

  const reject = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to reject ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/admin/request/reject/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Rejected!", `${userName} has been rejected.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to reject ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not rejected.`, "info");
      }
    });
  };

  const cheose = [
    "Filter",
    "user.name",
    "user.email",
    "task.name",
    "event.name",
    "orgnization.name",
  ];
  const labelMap = {
    Filter: "Filter",
    "user.name": "user",
    "user.email": "email",
    "task.name": "task",
    "event.name": "event",
    "orgnization.name": "orgnization",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const filteredByType = filteredData.filter(
    (item) => item.request_type === active,
  );
  const pageCount = Math.ceil(filteredByType.length / rowsPerPage);
  const sortedData = useMemo(() => {
    let sortableData = [...filteredByType];

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
  }, [filteredByType, sortKey, sortOrder]);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handleBulkAction = (action) => {
    const token = localStorage.getItem("token");
    const label = action === "accept" ? "Accepted" : "Rejected";

    Swal.fire({
      title: `Are you sure you want to ${action} ${selectedIds.length} requests?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/admin/request/${action}Group`,
            { ids: selectedIds }, // نبعت IDs مرة واحدة
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
              `All selected requests have been ${label.toLowerCase()}.`,
              "success",
            );
          })
          .catch(() => {
            Swal.fire("Error", "One or more requests failed.", "error");
          });
      }
    });
  };

  const handleBulkDelete = () => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${selectedIds.length} requests?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://backndVoo.voo-hub.com/api/admin/request/deleteGroup",
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
            setUpdate((prev) => !prev);
            setSelectedIds([]);
            Swal.fire(
              "Deleted!",
              "Selected requests have been deleted.",
              "success",
            );
          })
          .catch(() => {
            Swal.fire("Error", "Some deletions failed.", "error");
          });
      }
    });
  };
  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Type",
      render: (row) => row.request_type,
    },
    {
      header: "User",
      render: (row) => (
        <div className="flex flex-col">
          <span>{row?.user?.name}</span>
          <span className="text-gray-400">{row?.user?.email}</span>
        </div>
      ),
    },
    {
      header: active === "task" ? "Task" : "Event",
      render: (row) => (active === "task" ? row?.task?.name : row?.event?.name),
    },
    {
      header: "Date",
      render: (row) => (active === "task" ? row?.task?.date : row?.event?.date),
    },
    {
      header: "Time",
      render: (row) =>
        active === "task" ? row?.task?.start_time : row?.event?.start_time,
    },
    {
      header: "Organization",
      render: (row) => row?.orgnization?.name,
    },
    {
      header: "Action",
      render: (row) => (
        <select
          className="border px-2 py-1 bg-one text-white"
          onChange={(e) => {
            if (e.target.value === "accept") accept(row.id);
            if (e.target.value === "reject") reject(row.id);
          }}
        >
          <option value="">Select</option>
          <option value="accept">Accept</option>
          <option value="reject">Reject</option>
        </select>
      ),
    },
    {
      header: "Details",
      render: (row) => (
        <button
          className="underline  text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/admin/requestsdetails", {
              state: { sendData: row.id },
            })
          }
        >
          Details
        </button>
      ),
    },
    {
      header: "Delete",
      render: (row) => (
        <RiDeleteBin6Line
          className="cursor-pointer"
          onClick={() => handleDelete(row.id, row.request_type)}
        />
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
            placeholder="Search"
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
          <option value="">Sort By</option>

          <option value="start_time:asc"> Start Time ↑</option>
          <option value="start_time:desc"> Start Time ↓</option>
          <option value="date:asc"> Date ↑</option>
          <option value="date:desc"> Date ↓</option>
        </select>
        <div className="flex justify-center items-center gap-2 ">
          <button
            onClick={() => {
              setActive("task");
              setCurrentPage(1); // reset to first page
            }}
            className={`w-40 h-10 ${
              active === "task"
                ? "bg-one text-white"
                : "bg-white text-black border border-one"
            } rounded`}
          >
            Task
          </button>

          <button
            onClick={() => {
              setActive("event");
              setCurrentPage(1); // reset to first page
            }}
            className={`w-40 h-10 ${
              active === "event"
                ? "bg-one text-white"
                : "bg-white text-black border border-one"
            } rounded`}
          >
            Event
          </button>
        </div>
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
            Accept Selected
          </button>
          <button
            className="bg-one/70 text-white px-4 py-2 rounded"
            onClick={() => handleBulkAction("reject")}
          >
            Reject Selected
          </button>
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
          forceEnglishTitle={true}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Requests;
