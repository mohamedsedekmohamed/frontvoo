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
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";
import ReusableTable from "../../ui/ReusableTable";

const Organizeation = () => {
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
      .get("https://backndVoo.voo-hub.com/api/admin/organization", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.orgnization);
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
            `https://backndVoo.voo-hub.com/api/admin/organization/delete/${userId}`,
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
    navigate("/admin/addorganizeation", { state: { sendData: id } });
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

      if (sortKey === "created_at") {
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
  const cheose = [
    "Filter",
    "name",
    "phone",
    "email",
    "country.name",
    "city.name",
  ];
  const labelMap = {
    Filter: "Filter",
    name: "organization",
    phone: "phone",
    email: "Gmail",
    "country.name": "Country",
    "city.name": "City",
  };
  const changestutes = (id, newStatus) => {
    const token = localStorage.getItem("token");

    axios
      .put(
        `https://backndVoo.voo-hub.com/api/admin/user/status/${id}`,
        { account_status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        setUpdate(!update);
        toast.success("updated Status");
      });
  };
  //  Export filtered data to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((d, index) => ({
        SL: index + 1,
        Name: d.name || "-",
        Email: d.email || "-",
        Phone: d.phone || "-",
        City: d.city?.name || "-",
        Country: d.country?.name || "-",
        Total_hours: d.total_hours || "-",
        Total_events: d.total_events || "-",
        Total_tasks: d.total_tasks || "-",
        Account_status: d.account_status || "-",
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "VooOrganizeation");
    XLSX.writeFile(workbook, "VooOrganizeation.xlsx");
  };
  const truncateText = (text, maxLength = 5000) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const token = localStorage.getItem("token");

    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete selected users!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(
            "https://backndVoo.voo-hub.com/api/admin/organization/deleteGroup",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              data: {
                ids: selectedIds.map((user) => user.id), // body لازم يكون جوا data
              },
            },
          )
          .then(() => {
            toast.success("Selected organization deleted successfully");
            setSelectedIds([]);
            setUpdate((prev) => !prev);
          })
          .catch(() => toast.error("Error deleting some users"));
      }
    });
  };

  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0) return;

    const token = localStorage.getItem("token");

    const newStatus = selectedIds.every((user) => user.status === "active")
      ? "inactive"
      : "active";

    axios
      .put(
        "https://backndVoo.voo-hub.com/api/admin/organization/statusGroup",
        {
          ids: selectedIds.map((user) => user.id),
          account_status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then(() => {
        toast.success("Status updated for selected organization");
        setSelectedIds([]);
        setUpdate((prev) => !prev);
      })
      .catch(() => toast.error("Error updating status for some organization"));
  };
  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Organization",
      render: (row) => (
        <div className="flex flex-col">
          <span>{truncateText(row?.name)}</span>
          <span className="text-gray-400">{truncateText(row?.phone)}</span>
        </div>
      ),
    },
    {
      header: "Gmail",
      render: (row) => truncateText(row?.email),
    },
    {
      header: "Country",
      render: (row) => truncateText(row?.country?.name),
    },
    {
      header: "City",
      render: (row) => truncateText(row?.city?.name),
    },
    {
      header: "Join Date",
      render: (row) =>
        row?.created_at
          ? new Date(row.created_at).toISOString().split("T")[0]
          : "N/A",
    },
    {
      header: "Status",
      render: (row) => (
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={row.account_status === "active"}
            onChange={() =>
              changestutes(
                row.id,
                row.account_status === "active" ? "inactive" : "active",
              )
            }
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 relative transition">
            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-5"></div>
          </div>
          <span className="ml-2 text-sm">
            {row.account_status === "active" ? "Active" : "Inactive"}
          </span>
        </label>
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
                paginatedData.map((item) => ({
                  id: item.id,
                  status: item.account_status,
                })),
              );
            } else {
              setSelectedIds([]);
            }
          }}
        />
      ),
      render: (row) => (
        <input
          type="checkbox"
          checked={selectedIds.some((u) => u.id === row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [
                ...prev,
                { id: row.id, status: row.account_status },
              ]);
            } else {
              setSelectedIds((prev) => prev.filter((u) => u.id !== row.id));
            }
          }}
        />
      ),
    },
    {
      header: "Details",
      render: (row) => (
        <button
          className="underline"
          onClick={() =>
            navigate("/admin/organizeationdatali", {
              state: { sendData: row.id },
            })
          }
        >
          Details
        </button>
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
          <option value="created_at:asc">Join Date ↑</option>
          <option value="created_at:desc">Join Date ↓</option>
        </select>
        <button
          onClick={() => exportToExcel()}
          className="p-2 bg-one text-white rounded-[10px] animate-pulse flex gap-2 items-center "
        >
          <span>Export To Excel</span>
          <i>
            <FaDownload />
          </i>
        </button>
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
          <button
            onClick={() => navigate("/admin/addorganizeation")}
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
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={handleBulkStatusChange}
          >
            Change Status
          </button>
          <button
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={handleBulkDelete}
          >
            Delete All
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

export default Organizeation;
