import React, { useEffect, useState } from "react";
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

const Pendingusers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/admin/bnyadm", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data || []);
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
          ? Object.values(value).some((sub) =>
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
            `https://backndVoo.voo-hub.com/api/admin/bnyadm/accept/${id}`,
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
            `https://backndVoo.voo-hub.com/api/admin/bnyadm/reject/${id}`,
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const cheose = [
    "Filter",
    "user.name",
    "orgnization.name",
    "user.email",
    "status",
  ];
  const labelMap = {
    Filter: "Filter",
    "user.name": "User",
    "orgnization.name": "orgnization",
    "user.email": "email",
    status: "status",
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
            `https://backndVoo.voo-hub.com/api/admin/bnyadm/${action}Group`,
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
      header: "",
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds([...selectedIds, row.id]);
            } else {
              setSelectedIds(selectedIds.filter((id) => id !== row.id));
            }
          }}
        />
      ),
    },
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "User",
      render: (row) => (
        <div>
          <div>{row?.user?.name || "N/A"}</div>
          <div className="text-xs">{row?.user?.email}</div>
        </div>
      ),
    },
    {
      header: "Organization",
      render: (row) => row?.orgnization?.name || "N/A",
    },
    {
      header: "Status",
      render: (row) => row.status || "N/A",
    },
    {
      header: "Accept",
      render: (row) => (
        <button onClick={() => accept(row.id, row?.user?.name)}>Accept</button>
      ),
    },
    {
      header: "Reject",
      render: (row) => (
        <button onClick={() => reject(row.id, row?.user?.name)}>Reject</button>
      ),
    },
    {
      header: "Details",
      render: (row) => (
        <button
          className="underline  text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/admin/pendingusersDetaklis", {
              state: { sendData: row.id },
            })
          }
        >
          Details
        </button>
      ),
    },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      {/* Top Controls */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full md:w-auto">
          <input
            placeholder="Search"
            className="w-full md:min-w-[250px] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>

        {/* Filter */}
        <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10">
          <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

          <select
            value={selectedFilter}
            onChange={handleChange}
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundImage: "none",
            }}
            className="w-20 text-[14px] md:text-[16px] bg-one text-white outline-none"
          >
            {cheose.map((option, index) => (
              <option
                key={index}
                value={option}
                className="text-black bg-white"
              >
                {labelMap[option] || option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
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
        </div>
      )}

      {/* TABLE WRAPPER → FIX OVERFLOW */}
      <div className="w-full overflow-x-auto">
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
export default Pendingusers;
