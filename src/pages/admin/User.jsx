import React, { useEffect, useMemo, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg"; // تأكد من مسار الصورة
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa";

// استدعاء المكونات الخاصة بك (تأكد من صحة المسارات)
import ReusableTable from "../../ui/ReusableTable";
import Loader from "../../ui/Loader";
import ErrorPage from "../../ui/ErrorPage";
import useCrud from "../../Hooks/useCrud";
import api from "../../Api/axios";

const User = () => {
  const { data, read, error, loading } = useCrud("/admin/users", "users");
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const token = localStorage.getItem("token");
  const rowsPerPage = 10;

  // إضافة حالات التحميل والخطأ

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // دالة مخصصة لجلب البيانات حتى يمكننا تمريرها لزر "إعادة المحاولة"
  const fetchUsers = () => {
    read();
  };

  // استدعاء دالة الجلب في useEffect
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => setSelectedFilter(e.target.value);

  const handleDelete = async (userId, userName) => {
    const result = await Swal.fire({
      title: `Are you sure you want to delete ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });

    if (result.isConfirmed) {
      try {
        // Direct API call to handle the specific /delete/ route
        await api.delete(`/admin/user/delete/${userId}`);

        // Refresh the list after deletion
        read();

        Swal.fire(
          "Deleted!",
          `${userName} has been deleted successfully.`,
          "success",
        );
      } catch (error) {
        Swal.fire(
          "Error!",
          `There was an error while deleting ${userName}.`,
          "error",
        );
      }
    } else {
      Swal.fire("Cancelled", `${userName} was not deleted.`, "info");
    }
  };
  const handleEdit = (id) =>
    navigate("/admin/addUser", { state: { sendData: id } });

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
    "name",
    "age",
    "email",
    "phone",
    "country.name",
    "city.name",
  ];
  const labelMap = {
    Filter: "Filter",
    name: "User",
    email: "Email",
    age: "Age",
    phone: "Phone",
    "country.name": "Country",
    "city.name": "City",
  };

  const changestutes = (id, newStatus) => {
    axios
      .put(
        `https://backndVoo.voo-hub.com/api/admin/organization/status/${id}`,
        { account_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        fetchUsers(); // Refresh the list after status change
        toast.success("Updated Status");
      });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((d, index) => ({
        SL: index + 1,
        Name: d.name || "-",
        Email: d.email || "-",
        Phone: d.phone || "-",
        City: d.city?.name || "-",
        country: d.country?.name || "-",
        total_hours: d.total_hours || "-",
        total_events: d.total_events || "-",
        total_tasks: d.total_tasks || "-",
        Account_status: d.account_status || "-",
      })),
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Voousers");
    XLSX.writeFile(workbook, "Voousers.xlsx");
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
          .delete("https://backndVoo.voo-hub.com/api/admin/user/deleteGroup", {
            headers: { Authorization: `Bearer ${token}` },
            data: { ids: selectedIds.map((user) => user.id) },
          })
          .then(() => {
            toast.success("Selected users deleted successfully");
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
        "https://backndVoo.voo-hub.com/api/admin/user/statusGroup",
        { ids: selectedIds.map((user) => user.id), account_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then(() => {
        toast.success("Status updated for selected users");
        setSelectedIds([]);
        setUpdate((prev) => !prev);
      })
      .catch(() => toast.error("Error updating status for some users"));
  };

  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];
    if (!sortKey || !sortOrder) return sortableData;
    return sortableData.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (sortKey === "age")
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      if (sortKey === "created_at") {
        return sortOrder === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  // ==========================================
  // تجهيز أعمدة الجدول (Columns Definition)
  // ==========================================
  const columns = [
    {
      header: "S/N",
      render: (row, rowIndex) => (currentPage - 1) * rowsPerPage + rowIndex + 1,
    },
    {
      header: "User",
      render: (row) => (
        <div className="flex flex-col justify-center">
          <span>{row?.name}</span>
          <span className="text-gray-500">{row?.phone}</span>
        </div>
      ),
    },
    {
      header: "Age",
      render: (row) => row?.age,
    },
    {
      header: "Gmail",
      render: (row) => row?.email,
    },
    {
      header: "Country",
      render: (row) => row?.country?.name,
    },
    {
      header: "City",
      render: (row) => row?.city?.name,
    },
    {
      header: "Details",
      render: (row) => (
        <button
          className="underline text-blue-600 hover:text-blue-800"
          onClick={() =>
            navigate("/admin/userdetails", { state: { sendData: row.id } })
          }
        >
          Details
        </button>
      ),
    },
    {
      header: "Organization",
      render: (row) => row?.orgnization?.name,
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
          checked={selectedIds.some((user) => user.id === row.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedIds((prev) => [
                ...prev,
                { id: row.id, status: row.account_status },
              ]);
            } else {
              setSelectedIds((prev) =>
                prev.filter((user) => user.id !== row.id),
              );
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

  // ==========================================
  // فحص حالات التحميل والخطأ
  // ==========================================
  if (loading) {
    return <Loader />;
  }

  if (error) {
    // تمرير الدالة للزر ليعيد المحاولة
    return <ErrorPage onRetry={fetchUsers} />;
  }

  return (
    <div className="w-full">
      {/* جزء التحكم والأزرار العلوية */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="relative items-center w-full md:w-auto">
          <input
            placeholder="Search"
            className="w-full md:min-w-[250px] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
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
          className="text-[14px] h-10 border border-one rounded-[8px] px-2 outline-none"
        >
          <option value="">Sort By</option>
          <option value="age:asc">Age ↑</option>
          <option value="age:desc">Age ↓</option>
          <option value="created_at:asc">Join Date ↑</option>
          <option value="created_at:desc">Join Date ↓</option>
        </select>

        <button
          onClick={exportToExcel}
          className="p-2 h-10 bg-one text-white rounded-[10px] hover:bg-opacity-90 transition flex gap-2 items-center"
        >
          <span>Export</span>
          <FaDownload />
        </button>

        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10">
            <img src={filter} alt="filter" className="w-4 h-4 md:w-6 md:h-6" />

            <select
              value={selectedFilter}
              onChange={handleChange}
              className="w-20 text-[16px] md:text-[20px] bg-transparent text-white outline-none cursor-pointer"
              style={{ appearance: "none" }}
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

          <button
            onClick={() => navigate("/admin/addUser")}
            className="flex justify-center items-center h-10 bg-white border-one border py-1 px-3 rounded-[8px] gap-1 hover:bg-gray-50 transition"
          >
            <FaPlus className="text-one w-4 h-4" />
            <span className="text-[16px] font-medium text-one">Add</span>
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            className="bg-one text-white px-4 py-2 rounded hover:bg-opacity-80 transition"
            onClick={handleBulkStatusChange}
          >
            Change Status
          </button>

          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={handleBulkDelete}
          >
            Delete Selected
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

export default User;
