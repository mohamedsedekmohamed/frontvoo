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
import Loader from "../../ui/Loader";

const Zone = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
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

        {/* Filter + Add */}
        <div className="flex gap-2 flex-wrap w-full md:w-auto">
          {/* Filter */}
          <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10 w-full md:w-auto">
            <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

            <select
              value={selectedFilter}
              onChange={handleChange}
              className="w-full md:w-24 text-[14px] md:text-[16px] bg-transparent text-white outline-none cursor-pointer"
              style={{ appearance: "none" }}
            >
              {cheose.map((option) => (
                <option
                  key={option}
                  value={option}
                  className="text-black bg-white"
                >
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </div>

          {/* Add */}
          <button
            onClick={() => navigate("/admin/addzone")}
            className="flex justify-center items-center h-10 bg-white border-one border py-1 px-3 rounded-[8px] gap-1 hover:bg-gray-50 transition w-full md:w-auto"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] font-medium text-one">Add</span>
          </button>
        </div>
      </div>

      {/* Table */}
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

export default Zone;
