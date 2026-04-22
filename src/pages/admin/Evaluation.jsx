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
  const { data, read, loading, error } =
  useCrud("/admin/evaluation", "evaulations");
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
      render: (row) => row.evaluation,
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
        <div className="flex gap-2">
          <button className="flex justify-center items-center bg-three py-1 px-2 rounded-[8px] gap-1">
            <img
              src={filter}
              className="text-white w-4 h-4 md:w-6 md:h-6"
              alt="filter"
            />
            <select
              style={{ appearance: "none", paddingRight: "20px" }}
              value={selectedFilter}
              onChange={handleChange}
              className="flex justify-center w-24 text-[18px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] outline-none"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
          <button
            onClick={() => navigate("/admin/addevaluation")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              Add
            </span>
          </button>
        </div>
      </div>

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

export default Evaluation;
