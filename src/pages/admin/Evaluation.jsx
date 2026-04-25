import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../Api/axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import ReusableTable from "../../ui/ReusableTable";
import useCrud from "../../Hooks/useCrud";
import Loader from "../../ui/Loader";
import ErrorPage from "../../ui/ErrorPage";

const Evaluation = () => {
  const { data, read, loading, error } = useCrud(
    "/admin/evaluation",
    "evaulations",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 10;

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
        await api.delete(`/admin/evaluation/delete/${userId}`);

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
    // افترضت أن مسار التعديل هو /admin/addevaluation
    navigate("/admin/addevaluation", { state: { sendData: id } });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(query),
      );
    } else {
      return item[selectedFilter]?.toString().toLowerCase().includes(query);
    }
  });

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const cheose = ["Filter", "name", "title", "evaluation"];

  const labelMap = {
    Filter: "Filter",
    name: "Name",
    title: "Title",
    evaluation: "Evaluation",
  };

  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Name",
      render: (row) => row.name,
    },
    {
      header: "Title",
      render: (row) => row.title,
    },
    {
      header: "Evaluation",
      render: (row) => row.evaulation,
    },
    {
      header: "Image",
      render: (row) => (
        <img
          src={row.image_link}
          className="w-10 h-10 rounded-full object-cover border"
          alt=""
          onError={(e) => (e.target.src = "https://via.placeholder.com/40")}
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

          {/* Add */}
          <button
            onClick={() => navigate("/admin/addevaluation")}
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

export default Evaluation;
