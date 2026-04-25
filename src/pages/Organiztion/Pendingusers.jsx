import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import Loader from "../../ui/Loader";
import ReusableTable from "../../ui/ReusableTable";

const Pendingusers = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("https://backndVoo.voo-hub.com/api/orgnization/bnyadm", {
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
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/accept/${id}`,
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
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/reject/${id}`,
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
    Filter: t("Filter"),
    "user.name": t("User"),
    "orgnization.name": t("Orgnization"),
    "user.email": t("Email"),
    status: t("Status"),
  };

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
        const requests = selectedIds.map((id) =>
          axios.put(
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/${action}/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        );

        Promise.all(requests)
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
  const columns = [
    {
      header: t("S/N"),
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("User"),
      render: (row) => (
        <div>
          <div>{row?.user?.name || "N/A"}</div>
          <div className="text-xs">{row?.user?.email}</div>
        </div>
      ),
    },
    {
      header: t("Organization"),
      render: (row) => row?.orgnization?.name || "N/A",
    },
    {
      header: t("Status"),
      render: (row) => row.status || "N/A",
    },
    {
      header: t("Accept"),
      render: (row) => (
        <button onClick={() => accept(row.id, row?.user?.name)}>Accept</button>
      ),
    },
    {
      header: t("Reject"),
      render: (row) => (
        <button onClick={() => reject(row.id, row?.user?.name)}>Reject</button>
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
              setSelectedIds(
                paginatedData.map((i) => ({
                  id: i.id,
                  status: i.account_status,
                })),
              );
            } else setSelectedIds([]);
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.some((u) => u.id === row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((p) => [
                ...p,
                { id: row.id, status: row.account_status },
              ]);
            } else {
              setSelectedIds((p) => p.filter((u) => u.id !== row.id));
            }
          }}
        />
      ),
    },
    {
      header: t("Details"),
      render: (row) => (
        <button
          className="underline  text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/admin/pendingusersDetaklis", {
              state: { sendData: row.id },
            })
          }
        >
          t("Details")
        </button>
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

        {/* FILTER */}
        <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10 w-full sm:w-auto">
          <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

          <select
            style={{
              appearance: "none",
              WebkitAppearance: "none",
              MozAppearance: "none",
              backgroundImage: "none",
            }}
            value={selectedFilter}
            onChange={handleChange}
            className="w-full sm:w-24 text-[16px] bg-one text-white outline-none rounded-[8px] px-2"
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

      {/* BULK ACTIONS */}
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
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
export default Pendingusers;
