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

const Feedsor = () => {
  const { data, read, loading, error } = useCrud(
    "/admin/news_feeds",
    "news_feeds",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

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
        await api.delete(`/admin/news_feeds/delete/${userId}`);

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
  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) => {
        if (value === null || value === undefined) return false;

        if (typeof value === "object") {
          return (
            value &&
            Object.values(value || {}).some((sub) =>
              sub?.toString().toLowerCase().includes(query),
            )
          );
        }

        return value.toString().toLowerCase().includes(query);
      });
    } else {
      const keys = selectedFilter.split(".");
      let value = item;
      for (let key of keys) {
        value = value?.[key];
      }

      return value?.toString().toLowerCase().includes(query);
    }
  });

  const cheose = ["Filter", "content"];
  const labelMap = {
    Filter: "Filter",
    content: "content",
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const handleEdit = (id) => {
    navigate("/admin/addfeeds", { state: { sendData: id } });
  };

  const columns = [
    {
      header: "S/N",
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: "Content",
      render: (row) => row?.content,
    },
    {
      header: "Image",
      render: (row) => {
        const imageSrc = row?.image_link
          ? row.image_link.includes("http")
            ? row.image_link
            : `data:image/png;base64,${row.image_link}`
          : null;

        return imageSrc ? (
          <img
            src={imageSrc}
            className="w-20 h-12 object-cover cursor-pointer"
            onClick={() => {
              setModalContent(imageSrc);
              setIsVideo(false);
              setIsModalOpen(true);
            }}
          />
        ) : (
          <span>None</span>
        );
      },
    },
    {
      header: "Video",
      render: (row) => {
        const videoSrc = row?.video_link || row?.video;

        return videoSrc ? (
          <video
            className="w-20 h-12 object-cover cursor-pointer"
            onClick={() => {
              setModalContent(videoSrc);
              setIsVideo(true);
              setIsModalOpen(true);
            }}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : (
          <span>None</span>
        );
      },
    },

    {
      header: "Action",
      render: (row) => (
        <div className="flex items-center gap-2">
          <CiEdit
            className="w-[24px] h-[24px] text-six cursor-pointer"
            onClick={() => handleEdit(row.id)}
          />
          <RiDeleteBin6Line
            className="w-[24px] h-[24px] text-five cursor-pointer hover:text-red-600"
            onClick={() => handleDelete(row.id, row.content)}
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
              className="w-20 text-[14px] md:text-[16px] bg-one text-white outline-none"
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
            onClick={() => navigate("/admin/addfeeds")}
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

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg w-full max-w-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-three text-white px-3 py-1 rounded"
            >
              ×
            </button>

            {/* Media */}
            {isVideo ? (
              <video controls className="w-full max-h-[70vh] object-contain">
                <source src={modalContent} type="video/mp4" />
              </video>
            ) : (
              <img
                src={modalContent}
                alt="Selected"
                className="w-full max-h-[70vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedsor;
