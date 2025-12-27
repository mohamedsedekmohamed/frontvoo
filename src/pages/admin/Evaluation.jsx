import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";

const Evaluation = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const rowsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndvoo.voo-hub.com/api/admin/evaluation", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // لاحظ هنا استخدمت "evaulations" كما هي موجودة في الـ JSON الخاص بك
        setData(response.data.evaulations || []);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);

  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleDelete = (id, name) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to delete evaluation of ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`https://backndvoo.voo-hub.com/api/admin/evaluation/delete/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(() => {
            setUpdate(!update);
            Swal.fire("Deleted!", "Evaluation has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Error!", "Error occurred while deleting.", "error");
          });
      }
    });
  };

  const handleEdit = (id) => {
    // افترضت أن مسار التعديل هو /admin/addevaluation
    navigate("/admin/addevaluation", { state: { sendData: id } });
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
        value?.toString().toLowerCase().includes(query)
      );
    } else {
      return item[selectedFilter]?.toString().toLowerCase().includes(query);
    }
  });

  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const cheose = ["Filter", "name", "title", "evaulation"];
  const labelMap = {
    Filter: "Filter",
    name: "Name",
    title: "Title",
    evaulation: "Evaluation",
  };

  const truncateText = (text, maxLength = 20) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

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
            <img src={filter} className="text-white w-4 h-4 md:w-6 md:h-6" alt="filter" />
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
            <span className="text-[16px] md:text-[20px] font-medium text-one">Add</span>
          </button>
        </div>
      </div>

      <div className="mt-10 block text-left">
        <div className="min-w-[800px] overflow-x-auto">
          <table className="w-full border-y border-x border-black">
            <thead className="w-full">
              <tr className="bg-four">
                <th className="py-4 px-3">S/N</th>
                <th className="py-4 px-3">Name</th>
                <th className="py-4 px-3">Title</th>
                <th className="py-4 px-3">Evaluation</th>
                <th className="py-4 px-3">Image</th>
                <th className="py-4 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={item.id} className="border-y border-x hover:bg-four transition-all">
                  <td className="py-2 px-3 font-bold">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-3">{truncateText(item.name)}</td>
                  <td className="py-4 px-3">{truncateText(item.title)}</td>
                  <td className="py-4 px-3">{truncateText(item.evaulation)}</td>
                  <td className="py-4 px-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover border"
                      src={item.image_link}
                      alt={item.name}
                      onError={(e) => { e.target.src = "https://via.placeholder.com/40" }}
                    />
                  </td>
                  <td className="py-4 px-3 flex gap-2">
                    <CiEdit
                      className="w-[24px] h-[24px] text-six cursor-pointer"
                      onClick={() => handleEdit(item.id)}
                    />
                    <RiDeleteBin6Line
                      className="w-[24px] h-[24px] text-five cursor-pointer"
                      onClick={() => handleDelete(item.id, item.name)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="secondary"
          shape="rounded"
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Evaluation;