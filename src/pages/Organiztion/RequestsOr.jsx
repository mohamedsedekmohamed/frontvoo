import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";

const RequestsOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/orgnization/request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.requests);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);

  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();

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

  const cheose = [
    "Filter",
    "request_type",
    "user.email",
    "task.name",
    "event.name",
    "orgnization.name",
  ];
  const labelMap = {
    Filter: t("Filter"),
    request_type: t("type"),
    "user.email": t("Email"),
    "task.name": t("Task"),
    "event.name": t("Event"),
    "orgnization.name": t("Orgnization"),
  };
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleAccept = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://backndVoo.voo-hub.com/api/orgnization/request/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Request accepted successfully");
        setUpdate((prev) => !prev); // Force re-render to update the table
      })
      .catch(() => {
        toast.error("Error accepting request");
      });
  };

  const handleReject = (id) => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `https://backndVoo.voo-hub.com/api/orgnization/request/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Request rejected successfully");
        setUpdate((prev) => !prev); // Force re-render to update the table
      })
      .catch(() => {
        toast.error("Error rejecting request");
      });
  };

  // const handleAttend = (id) => {
  //     const token = localStorage.getItem('token');
  //     axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/attend/${id}`, {}, {
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //         }
  //     })
  //         .then(() => {
  //             toast.success("Attendance updated successfully");
  //             setUpdate(prev => !prev); // Force re-render to update the table
  //         })
  //         .catch(() => {
  //             toast.error("Error updating attendance");
  //         });
  // };

  // const handleLost = (id) => {
  //     const token = localStorage.getItem('token');
  //     axios.put(`https://backndVoo.voo-hub.com/api/orgnization/request/lost/${id}`, {}, {
  //         headers: {
  //             Authorization: `Bearer ${token}`,
  //         }
  //     })
  //         .then(() => {
  //             toast.success("Request marked as lost successfully");
  //             setUpdate(prev => !prev); // Force re-render to update the table
  //         })
  //         .catch(() => {
  //             toast.error("Error marking request as lost");
  //         });
  // };

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
              className="flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
        </div>
      </div>

      <div className="mt-10  block">
        <table className="w-full border-y border-x border-black">
          <thead className="w-full">
          <tr className='bg-four w-[1012px] h-[56px] text-one'>
          {isArabic ? (
                <>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-center pr-3">
                    الإجراء
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">
                    الحالة
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">
                    المؤسسة
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">
                    الحدث
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">
                    المهمه
                  </th>
              
                  <th className="w-[180px] h-[56px] text-[16px] border-b text-oneborder-b text-left ">
                  النوع
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left pr-3">
                                         المستخدم

                  </th>
                  <th className="w-[30px] h-[56px] text-[16px] border-b text-right p-2">
                    رقم
                  </th>
                </>
              ) : (
                <>
                  <th className="w-[30px] h-[56px] text-[16px] border-b text-left px-2">
                  S/N                  </th>
                  <th className="w-[75px] h-[56px] text-[16px] border-b text-left">
                    Type
                  </th>
                  <th className="w-[200px] h-[56px] text-[16px] border-b text-left">
                    User
                  </th>
                  <th className="w-[200] h-[56px] text-[16px] border-b text-left">
                    
                    Task
                  </th>
                  <th className="w-[200px] h-[56px] text-[16px] border-b  text-oneborder-b text-center">
                    Event
                  </th>
                  <th className="w-[200px] h-[56px] text-[16px] border-b text-oneborder-b text-left">
                    Orgnization
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">
                    Status
                  </th>
                  <th className="w-[400px] h-[56px] text-[16px] border-b text-center">
                    Actions
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-y hover:border-3 relative hover:bg-four"
              >
            

           
                  {/* <button
                                        className='text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleAttend(item.id)}
                                    >
                                        Attend
                                    </button>
                                    <button
                                        className='text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded-md text-[12px]'
                                        onClick={() => handleLost(item.id)}
                                    >
                                        Lost
                                    </button> */}
              </tr>
            ))}
          </tbody>
          
<tbody dir={isArabic ? "rtl" : "ltr"}>
  {paginatedData.map((item, index) => (
    <tr key={item.id} className='border-y border-x hover:border-3  relative hover:bg-four'>
      {isArabic ? (
        <>
             <td className="w-[400px] h-[56px] flex items-center justify-around px-2">
                  <select
                    className="text-white bg-one px-4 py-2 rounded-md text-[12px]"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "accept") {
                        handleAccept(item.id);
                      } else if (value === "reject") {
                        handleReject(item.id);
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      أختر
                    </option>
                    <option value="accept">قبول</option>
                    <option value="reject">رفض</option>
                  </select>
                  </td>
          <td className="w-[143px] h-[56px] text-right px-1">  
          <span className="bg-eight rounded-circle px-2 py-1 text-one">
            {item?.status ?? "N/A"}
            </span>
          </td>
          <td className="w-[143px] h-[56px] font-medium text-right px-1">
            {item?.orgnization?.name ?? "N/A"}
          </td>
          <td className="w-[143px] h-[56px] text-right px-1">
            {item?.event?.name ?? "N/A"}
          </td>
          
        
          <td className="w-[150px] h-[56px] text-right ">
                  {item?.task?.name ?? "N/A"}
                </td>
                <td className="flex flex-col w-[143px] absolute top-1 left-10 h-[56px] p-1 gap-1 items-end">
                <span className="text-[12px]">
                    {item?.user?.name ?? "N/A"}
                  </span>
                  <span className="text-[10px]">
                    {item?.user?.email ?? "N/A"}
                  </span>
                </td>
                <td className="w-[280px] h-[56px]  lg:text-[12px] xl:text-[12px] items-center ">
                  {item?.request_type ?? "N/A"}
                </td>
          <td className="w-[30px] h-[56px] font-bold text-[12px] text-left px-3">
          {(currentPage - 1) * rowsPerPage + index + 1}
          </td>
        </>
      ) : (
        <>
       <td className="w-[30px] h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="w-[75px] h-[56px] lg:text-[12px]  xl:text-[12px]">
                  {item?.request_type ?? "N/A"}
                </td>
                <td className="flex flex-col w-[200px] absolute top-1 h-[56px] p-1 gap-1">
                  <span className="text-[12px]">
                    {item?.user?.name ?? "N/A"}
                  </span>
                  <span className="text-[10px]">
                    {item?.user?.email ?? "N/A"}
                  </span>
                </td>
                <td className="w-[250px] h-[56px] lg:text-[12px] xl:text-[14px]">
                  {item?.task?.name ?? "N/A"}
                </td>
                <td className="w-[250px] h-[56px] lg:text-[12px] xl:text-[14px]">
                  {item?.event?.name ?? "N/A"}
                </td>
                <td className="w-[250px] h-[56px] lg:text-[12px] xl:text-[14px]">
                  {item?.orgnization?.name ?? "N/A"}
                </td>
                <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px] text-three ">
                  <span className="bg-eight rounded-circle px-2 py-1">
                    {item?.status ?? "N/A"}
                  </span>
                </td>
                <td className="w-[400px] h-[56px] flex items-center justify-around px-2">
                  <select
                    className="text-white bg-one px-4 py-2 rounded-md text-[12px]"
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "accept") {
                        handleAccept(item.id);
                      } else if (value === "reject") {
                        handleReject(item.id);
                      }
                    }}
                    defaultValue=""
                  >
                   <option value="" disabled>
                      Select
                    </option>
                    <option value="accept">Accept</option>
                    <option value="reject">Reject</option>
                  </select>
                  </td>
        </>
      )}
    </tr>
  ))}
</tbody>

        </table>
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

export default RequestsOr;
