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

const EventsOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/event", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.events);
      })
      .catch(() => {
        toast.error("Error fetching data");
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
            `https://backndVoo.voo-hub.com/api/ornization/event/delete/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate(!update);
            Swal.fire(
              "Deleted!",
              `${userName} has been deleted successfully.`,
              "success"
            );
          })
          .catch(() => {
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
  const handleEdit = (id) => {
    navigate("/organizeation/addeventsor", { state: { sendData: id } });
  };

  const [selectedDate, setSelectedDate] = useState("");

  const handleChangedata = (e) => {
    setSelectedDate(e.target.value); // value هي بصيغة YYYY-MM-DD
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    if (selectedDate && item.date !== selectedDate) {
      return false;
    }
    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item).some((value) =>
        typeof value === "object"
          ? Object.values(value).some((sub) =>
              sub?.toString().toLowerCase().includes(query)
            )
          : value?.toString().toLowerCase().includes(query)
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
  const cheose = ["Filter", "name", "date", "start_time", "location"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("Events"),
    date: t("date"),
    start_time: t("start"),
    location: t("location"),
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const truncateTextar = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? "..." + text.slice(0, maxLength) : text;
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
        <div className="flex items-center gap-4 my-4">
          <input
            type="date"
            value={selectedDate}
            onChange={handleChangedata}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
              className="flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
          <button
            onClick={() => navigate("/organizeation/addeventsor")}
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
                    <th className="py-4 px-3">المكان</th>
                    <th className="py-4 px-3">العمليات</th>
                    <th className="py-4 px-3">تفاصيل</th>
                    <th className="py-4 px-3">الوقت </th>
                    <th className="py-4 px-3">الميعاد</th>
                    <th className="py-4 px-3">الحدث</th>
                    <th className="py-4 px-3">رقم</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-3">S/N</th>
                    <th className="py-4 px-3">Event</th>
                    <th className="py-4 px-3">Date</th>
                    <th className="py-4 px-3">Time</th>
                    <th className="py-4 px-3">Details</th>
                    <th className="py-4 px-3"> Operation</th>
                    <th className="py-4 px-3">location</th>
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
                  {" "}
                  {isArabic ? (
                    <>
                      <td className=" h-[56px] lg:text-[12px] xl:text-[16px] flex gap-2  justify-end items-center px-3">
                        <CiEdit
                          className="w-[24px] h-[24px] text-six cursor-pointer"
                          onClick={() => handleEdit(item.id)}
                        />
                        <RiDeleteBin6Line
                          className="w-[24px] h-[24px] mr-2 text-five cursor-pointer hover:text-red-600 transition"
                          onClick={() => handleDelete(item.id, item.name)}
                        />
                      </td>

                      <td className="py-2 px-3">
                        {truncateTextar(item?.location)}
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="underline"
                          onClick={() =>
                            navigate("/organizeation/OperationOr", {
                              state: { sendData: item.id },
                            })
                          }
                        >
                          عملية
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="underline"
                          onClick={() =>
                            navigate("/organizeation/eventsdetails", {
                              state: { sendData: item.id },
                            })
                          }
                        >
                          التفاصيل
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        بداية{item?.start_time ?? "N/A"} أنتهاء
                        {item?.end_time ?? "N/A"}
                      </td>
                      <td className="py-2 px-3">{item?.date ?? "N/A"}</td>
                      <td className="py-2 px-3">
                        {truncateTextar(item?.name)}
                      </td>

                      <td className="py-2 px-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="py-2 px-3">{truncateText(item?.name)}</td>
                      <td className="py-2 px-3">{truncateText(item?.date)}</td>
                      <td className="py-2 px-3">
                        start{item?.start_time ?? "N/A"} end
                        {item?.end_time ?? "N/A"}
                      </td>

                      <td className="py-2 px-3">
                        <button
                          className="underline "
                          onClick={() =>
                            navigate("/organizeation/eventsdetails", {
                              state: { sendData: item.id },
                            })
                          }
                        >
                          Details
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          className="underline "
                          onClick={() =>
                            navigate("/organizeation/OperationOr", {
                              state: { sendData: item.id },
                            })
                          }
                        >
                          Operation
                        </button>
                      </td>
                      <td className="py-2 px-3">
                        {truncateText(item?.location)}
                      </td>

                      <td className=" h-[56px] lg:text-[12px] xl:text-[16px] flex justify-start items-center">
                        <CiEdit
                          className="w-[24px] h-[24px] text-six cursor-pointer"
                          onClick={() => handleEdit(item.id)}
                        />
                        <RiDeleteBin6Line
                          className="w-[24px] h-[24px] ml-2 text-five cursor-pointer hover:text-red-600 transition"
                          onClick={() => handleDelete(item.id, item.name)}
                        />
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
      <ToastContainer />
    </div>
  );
};

export default EventsOr;
