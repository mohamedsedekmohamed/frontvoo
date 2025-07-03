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
import Pagination from "@mui/material/Pagination";

const Feedsor = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedVideo, setSelectedVideo] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);
  useEffect(() => {
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
            }
          )
          .then(() => {
            setUpdate(!update);
            console.log(userId);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success"
            );
          })
          .catch((error) => {
            console.log(error);

            Swal.fire(
              "Error!",
              `There was an error while deleting ${userName}.`,
              "error"
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
              sub?.toString().toLowerCase().includes(query)
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
    content: t("content"),
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleEdit = (id) => {
    navigate("/organizeation/addFeedsor", { state: { sendData: id } });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="relative items-center">
          <input
            placeholder={t("Search")}
            className="min-w-[50%] h-10 lg:h-[48px] border-2 border-two rounded-[8px] pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <CiSearch className="w-4 h-4 md:w-6 text-three font-medium absolute left-2 top-3 md:h-6" />
        </div>
        <div className="flex gap-2">
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
          <button
            onClick={() => navigate("/organizeation/addFeedsor")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              {isArabic ? "أضافة" : "Add"}
            </span>
          </button>
        </div>
      </div>
      <div className="mt-10 block text-left overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead dir={isArabic ? "rtl" : "ltr"}>
              <tr className="bg-four">
                {isArabic ? (
                  <>
                    <th className="py-4 px-3">الإجراء</th>
                    <th className="py-4 px-3">الفديو</th>
                    <th className="py-4 px-3">الصورة</th>
                    <th className="py-4 px-3">المحتوي</th>
                    <th className="py-4 px-3">رقم</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-3">S/N</th>
                    <th className="py-4 px-3">content</th>
                    <th className="py-4 px-3">Image</th>
                    <th className="py-4 px-3">Video</th>
                    <th className="py-4 px-3">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody dir={isArabic ? "rtl" : "ltr"}>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-y border-x hover:border-3 relative hover:bg-four h-[56px]"
                >
                  {isArabic ? (
                    <>
                      <td className="  px-2 flex justify-end gap-2">
                        <div className=" h-[56px] lg:text-[12px] xl:text-[16px] flex gap-2  justify-end  items-center px-3">
                          <RiDeleteBin6Line
                            className="w-[24px] h-[24px] mr-2 text-five cursor-pointer hover:text-red-600 transition"
                            onClick={() => handleDelete(item.id, item.content)}
                          />
                          <CiEdit
                            className="w-[24px] h-[24px] text-six cursor-pointer"
                            onClick={() => handleEdit(item.id)}
                          />
                        </div>
                      </td>
                      <td className="  px-2">
                        <div className=" flex justify-end">
                          <video
                            className="w-20 h-12 object-cover cursor-pointer"
                            onClick={() =>
                              setSelectedVideo(item.video_link || item.video)
                            }
                          >
                            <source
                              src={item.video_link || item.video}
                              type="video/mp4"
                            />
                            {isArabic
                              ? "المتصفح لا يدعم الفيديو"
                              : "Your browser does not support the video tag"}
                          </video>
                        </div>
                      </td>
                      <td className="px-2">
                        <div className=" flex justify-end">
                      <img
  src={
    item.image_link == null
      ? `data:image/png;base64,${item.image_link}`
      : item.image_link
  }
  className="w-20 h-12 object-cover cursor-pointer"
  onClick={() => setSelectedImage(item.image_link)}
/>

                        </div>
                      </td>
                      <td className="  px-2">{item.content || "بدون محتوى"}</td>

                      <td className="  px-2">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="  px-2">
                        {index + 1 + (currentPage - 1) * rowsPerPage}
                      </td>
                      <td className="  px-2">{item.content || "No Content"}</td>
                      <td className="  px-2">
                      <img
  src={
    item.image_link == null
      ? `data:image/png;base64,${item.image_link}`
      : item.image_link
  }
  className="w-20 h-12 object-cover cursor-pointer"
  onClick={() => setSelectedImage(item.image_link)}
/>

                      </td>
                      <td className="  px-2">
                        {item.video ? (
                          <video
                            className="w-20 h-12 object-cover cursor-pointer"
                            onClick={() =>
                              setSelectedVideo(item.video_link || item.video)
                            }
                          >
                            <source
                              src={item.video_link || item.video}
                              type="video/mp4"
                            />
                            {isArabic
                              ? "المتصفح لا يدعم الفيديو"
                              : "Your browser does not support the video tag"}
                          </video>
                        ) : (
                          <span>None</span>
                        )}
                      </td>
                      <td className="  px-2 flex justify-start gap-2">
                        <div className=" h-[56px] lg:text-[12px] xl:text-[16px] flex gap-2  justify-end  items-center px-3">
                          <RiDeleteBin6Line
                            className="w-[24px] h-[24px] mr-2 text-five cursor-pointer hover:text-red-600 transition"
                            onClick={() => handleDelete(item.id, item.content)}
                          />
                          <CiEdit
                            className="w-[24px] h-[24px] text-six cursor-pointer"
                            onClick={() => handleEdit(item.id)}
                          />
                        </div>
                      </td>
                    </>
                  )}
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
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="bg-black p-2 rounded relative w-[90%] md:w-[70%] lg:w-[50%]"
            onClick={(e) => e.stopPropagation()} // يمنع إغلاق المودال عند الضغط داخل الفيديو
          >
            <video
              src={selectedVideo}
              controls
              autoPlay
              className="w-full h-auto rounded"
            />
            <button
              onClick={() => setSelectedVideo(null)}
        className="absolute top-2 right-2 text-one text-6xl"
            >
              ✕
            </button>
          </div>
        </div>
      )}
{selectedImage && (
  <div
    className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
    onClick={() => setSelectedImage(null)}
  >
    <div
      className="bg-black p-2 rounded relative w-[90%] md:w-[70%] lg:w-[50%]"
      onClick={(e) => e.stopPropagation()} // يمنع الإغلاق عند الضغط داخل الصورة
    >
      <img
        src={selectedImage}
        alt="Full Size"
        className="w-full h-auto rounded"
      />
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-2 right-2 text-one text-6xl"
      >
        ✕
      </button>
    </div>
  </div>
)}

      <ToastContainer />
    </div>
  );
};

export default Feedsor;
