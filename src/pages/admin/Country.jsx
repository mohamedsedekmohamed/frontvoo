import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
import useCrud from "../../Hooks/useCrud";
import Loader from "../../ui/Loader";
import ErrorPage from "../../ui/ErrorPage";
import api from "../../Api/axios";

const Country = () => {
  const { data, read, loading, error } = useCrud("/admin/country", "countries");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
    read();
  }, []);
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

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
        await api.delete(`/admin/country/delete/${userId}`);

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
  const handleEdit = (id) => {
    navigate("/admin/addcountry", { state: { sendData: id } });
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const cheose = ["Filter", "name"];
  const labelMap = {
    Filter: "Filter",
    name: "country",
  };

  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Country",
      render: (row) => row?.name,
    },
    {
      header: "Flag",
      render: (row) => (
        <img
          className="w-8 h-8"
          src={
            row.flag_link?.startsWith("data:") ? row.flag_link : row.flag_link
          }
          alt="flag"
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
  if (loading) {
    return <Loader />;
  }
  if (error) {
    return <ErrorPage onRetry={read} />;
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

        {/* Right Controls */}
        <div className="flex flex-wrap items-center gap-2">
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
              className="w-20 text-[16px] md:text-[18px] bg-one text-white outline-none cursor-pointer"
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

          {/* Add Button */}
          <button
            onClick={() => navigate("/admin/addcountry")}
            className="flex justify-center items-center bg-white border-one border py-1 px-3 rounded-[8px] gap-1 hover:bg-gray-50 transition"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[18px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>

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

export default Country;
