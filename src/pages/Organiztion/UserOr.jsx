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
const UserOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.users);
      })
      .catch(() => {
        toast.error("Error fetching data");
        console.log(token);
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
            `https://backndVoo.voo-hub.com/api/ornization/user/delete/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then(() => {
            setUpdate(!update);
            console.log(userId);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success",
            );
          })
          .catch((error) => {
            console.log(error);

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

  const cheose = [
    "Filter",
    "name",
    "email",
    "age",
    "phone",
    "country.name",
    "city.name",
    "account_status",
  ];
  const labelMap = {
    Filter: t("Filter"),
    name: t("User"),
    age: t("Age"),
    email: t("Email"),
    phone: t("Phone"),
    "country.name": t("Country"),
    "city.name": t("City"),
    account_status: t("Status"),
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

      if (sortKey === "age") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

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
  const handleEdit = (id) => {
    navigate("/organizeation/adduser", { state: { sendData: id } });
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
            "https://backndVoo.voo-hub.com/api/ornization/user/deleteGroup",
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
            toast.success("Selected users deleted successfully");
            setSelectedIds([]);
            setUpdate((prev) => !prev);
          })
          .catch(() => toast.error("Error deleting some users"));
      }
    });
  };
  const columns = [
    {
      header: t("S/N"),
      render: (_, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("User"),
      render: (row) => (
        <div className="flex flex-col">
          <span>{row.name}</span>
          <span className="text-gray-500">{row.phone}</span>
        </div>
      ),
    },
    {
      header: t("Age"),
      render: (row) => row.age,
    },
    {
      header: t("Email"),
      render: (row) => row.email,
    },
    {
      header: t("Country"),
      render: (row) => row.country?.name,
    },
    {
      header: t("City"),
      render: (row) => row.city?.name,
    },
    {
      header: t("Details"),
      render: (row) => (
        <button
          className="underline text-blue-600"
          onClick={() =>
            navigate("/organizeation/userDetails", {
              state: { sendData: row.id },
            })
          }
        >
          {t("Details")}
        </button>
      ),
    },
    {
      header: t("Organization"),
      render: (row) => row.orgnization?.name,
    },
    {
      header: t("JoinDate"),
      render: (row) =>
        row.created_at
          ? new Date(row.created_at).toISOString().split("T")[0]
          : "N/A",
    },
    {
      header: t("Status"),
      render: (row) => row.account_status,
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
      header: t("Action"),
      render: (row) => (
        <RiDeleteBin6Line
          className="w-[22px] h-[22px] text-five cursor-pointer hover:text-red-600"
          onClick={() => handleDelete(row.id, row.name)}
        />
      ),
    },
  ];
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="w-full">
      {/* TOP BAR — ONLY RESPONSIVENESS ADDED */}
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        {/* SORT (no style change) */}
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
            <option value="age:asc">{t("Ageup")}</option>
            <option value="age:desc">{t("Agedown")}</option>
            <option value="created_at:asc">{t("JoinDateup")}</option>
            <option value="created_at:desc">{t("JoinDatedown")}</option>
          </select>
        </div>

        {/* FILTER + ADD (UNCHANGED DESIGN WRAPPED ONLY) */}
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          {/* THIS IS YOUR ORIGINAL DESIGN — NOT TOUCHED */}
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

          {/* ADD BUTTON (unchanged) */}
          <button
            onClick={() => navigate("/organizeation/adduser")}
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
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={handleBulkDelete}
          >
            {t("DeleteSelected")}
          </button>
        </div>
      )}

      {/* TABLE WRAPPER ONLY */}
      <div className="mt-6 overflow-x-auto">
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

export default UserOr;
