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
import { useTranslation } from "react-i18next";
import ReusableTable from "../../ui/ReusableTable";
import Loader from "../../ui/Loader";

const Feedsor = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isVideo, setIsVideo] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/news_feeds", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.news_feeds);
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
            `https://backndVoo.voo-hub.com/api/ornization/news_feeds/delete/${userId}`,
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
    Filter: t("Filter"),
    content: t("Content"),
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );
  const handleEdit = (id) => {
    navigate("/organizeation/addFeedsor", { state: { sendData: id } });
  };
  const columns = [
    {
      header: t("S/N"),
      render: (row, i) => (currentPage - 1) * rowsPerPage + i + 1,
    },
    {
      header: t("Content"),
      render: (row) => row?.content,
    },
    {
      header: t("Image"),
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
      header: t("Video"),
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
      header: t("Action"),
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
  return (
    <div className="w-full">
      {/* TOP BAR */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        {/* SEARCH */}
        <div className="relative w-full lg:w-[30%]">
          <input
            placeholder={t("Search")}
            className="w-full h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three absolute left-2 top-3" />
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
          {/* FILTER */}
          <div className="flex items-center bg-three py-1 px-2 rounded-[8px] gap-1 h-10 w-full sm:w-auto">
            <img src={filter} className="w-4 h-4 md:w-6 md:h-6" />

            <select
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundImage: "none",
              }}
              value={selectedFilter}
              onChange={handleChange}
              className="w-full sm:w-24 text-[16px] bg-one text-white outline-none rounded-[8px] px-2"
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

          {/* ADD BUTTON */}
          <button
            onClick={() => navigate("/organizeation/addFeedsor")}
            className="flex items-center justify-center gap-1 h-10 bg-white border-one border px-3 rounded-[8px] w-full sm:w-auto"
          >
            <FaPlus className="text-one w-4 h-4" />
            <span className="text-[16px] font-medium text-one">
              {isArabic ? "أضافة" : "Add"}
            </span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="mt-6 w-full overflow-x-auto">
        <ReusableTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          pageCount={pageCount}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-4 rounded max-w-screen-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-three text-white px-3 py-1 rounded text-sm"
            >
              ×
            </button>

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

      <ToastContainer />
    </div>
  );
};

export default Feedsor;
