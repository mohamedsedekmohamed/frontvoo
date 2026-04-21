import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";

const Zone = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  const navigate = useNavigate();

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("https://backndVoo.voo-hub.com/api/admin/zone", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const zones = res?.data?.[0]?.zones || [];
        setData(zones);
      })
      .catch(() => toast.error("Error fetching data"));
  }, [update]);

  const handleChange = (e) => setSelectedFilter(e.target.value);

  const handleDelete = (id, name) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://backndVoo.voo-hub.com/api/admin/zone/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire("Deleted!", "", "success");
          })
          .catch(() => Swal.fire("Error!", "", "error"));
      }
    });
  };

  const handleEdit = (id) => {
    navigate("/admin/addzone", { state: { sendData: id } });
  };

  // 🔍 FILTER + SEARCH (نفس منطقك لكن متظبط)
  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (!selectedFilter || selectedFilter === "Filter") {
      return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(query),
      );
    }

    const keys = selectedFilter.split(".");
    let value = item;

    for (let key of keys) {
      value = value?.[key];
    }

    return value?.toString().toLowerCase().includes(query);
  });

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const cheose = ["Filter", "name", "city", "country_name"];

  const labelMap = {
    Filter: "Filter",
    name: "zone",
    city: "city",
    country_name: "country",
  };

  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Zone",
      render: (row) => row?.name,
    },
    {
      header: "City",
      render: (row) => row?.city_name,
    },
    {
      header: "Country",
      render: (row) => row?.country_name,
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
      {/* 🔎 SEARCH + FILTER + ADD (نفس التصميم 100%) */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <input
            placeholder="Search"
            className="min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="absolute left-2 top-3 text-three" />
        </div>

        <div className="flex gap-2">
          <button className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1">
            <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

            <select
              value={selectedFilter}
              onChange={handleChange}
              className="w-20 text-[20px] h-9 text-white bg-one rounded-[8px]"
              style={{ appearance: "none", backgroundImage: "none" }}
            >
              {cheose.map((option) => (
                <option key={option} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>

          <button
            onClick={() => navigate("/admin/addzone")}
            className="flex items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>

      {/* 📊 TABLE */}
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

export default Zone;
