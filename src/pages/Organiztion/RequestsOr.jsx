import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import filter from "../../assets/filter.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import Pagination from "@mui/material/Pagination";
import Swal from "sweetalert2";

const RequestsOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [selectedIds, setSelectedIds] = useState([]);

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
    return Object.values(item).some(value =>
      typeof value === "object"
        ? Object.values(value || {}).some(sub =>
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

  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const truncateTextar = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? "..." + text.slice(0, maxLength) : text;
  };
  const handleBulkAction = (action) => {
  const token = localStorage.getItem("token");
  const label = action === "accept" ? "Accepted" : "Rejected";

  Swal.fire({
    title: `Are you sure you want to ${action} ${selectedIds.length} requests?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
  }).then((result) => {
    if (result.isConfirmed) {
      const requests = selectedIds.map((id) =>
        axios.put(
          `https://backndVoo.voo-hub.com/api/orgnization/request/${action}/${id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      Promise.all(requests)
        .then(() => {
          setUpdate((prev) => !prev);
          setSelectedIds([]);
          Swal.fire(`${label}!`, `All selected requests have been ${label.toLowerCase()}.`, "success");
        })
        .catch(() => {
          Swal.fire("Error", "One or more requests failed.", "error");
        });
    }
  });
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
 {selectedIds.length > 0 && (
  <div className="flex gap-2 mt-4">
    <button
      className="bg-one/60 text-white px-4 py-2 rounded"
      onClick={() => handleBulkAction("accept")}
    >
      Accept Selected
    </button>
    <button
      className="bg-one/70 text-white px-4 py-2 rounded"
      onClick={() => handleBulkAction("reject")}
    >
      Reject Selected
    </button>
 
  </div>
)}
      <div className="mt-10 block text-left overflow-x-auto">
        <div className="min-w-[800px]">
          <table className="w-full border-y border-x border-black">
            <thead dir={isArabic ? "rtl" : "ltr"}>
              <tr className="bg-four">
                {isArabic ? (
                  <>

                    <th className="py-4 px-3">الإجراء</th>
                         <th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {<th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {
        setSelectedIds([]);
      }
    }}
  />
</th>

        setSelectedIds([]);
      }
    }}
  />
</th>
                    <th className="py-4 px-3">الحالة</th>
                    <th className="py-4 px-3">المؤسسة</th>
                    <th className="py-4 px-3">الحدث</th>
                    <th className="py-4 px-3">المهمه</th>
                    <th className="py-4 px-3">النوع</th>
                    <th className="py-4 px-3">المستخدم</th>
                    <th className="py-4 px-3">رقم</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-3">S/N </th>
                    <th className="py-4 px-3">Type</th>
                    <th className="py-4 px-3">User</th>
                    <th className="py-4 px-3">Task</th>
                    <th className="py-4 px-3">Event</th>
                    <th className="py-4 px-3">Orgnization</th>
                    <th className="py-4 px-3">Status</th>
                         <th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {<th className="py-4 px-3">
  <input
    type="checkbox"
    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedIds(paginatedData.map(item => item.id));
      } else {
        setSelectedIds([]);
      }
    }}
  />
</th>

        setSelectedIds([]);
      }
    }}
  />
</th>
                    <th className="py-4 px-3">Actions</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-y hover:border-3 relative hover:bg-four"
                ></tr>
              ))}
            </tbody>

            <tbody dir={isArabic ? "rtl" : "ltr"}>
              {paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-y border-x hover:border-3  relative hover:bg-four"
                >
                  {isArabic ? (
                    <>
                      <td className=" h-[56px] flex items-center justify-end px-2">
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
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, item.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                        />
                      </td>
                      <td className="py-4 px-3">
                        <span className="bg-eight rounded-circle px-2 py-1 text-one">
                          {item?.status ?? "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        {truncateTextar(item?.orgnization?.name)}
                      </td>
                      <td className="py-4 px-3 h-[56px] ">
                        {truncateTextar(item?.event?.name) }
                      </td>

                      <td className="py-4 px-3 h-[56px] ">
                        {truncateTextar(item?.task?.name)}
                      </td>
                      <td className="py-4 px-3 ">
                        <div className="flex gap-0.5 flex-col">
                          <span className="text-[12px]">
                            {truncateTextar(item?.user?.name) }
                          </span>
                          <span className="text-[10px]">
                            {truncateTextar(item?.user?.email) }
                          </span>
                        </div>
                      </td>
                      <td className=" h-[56px]  lg:text-[12px] xl:text-[12px] items-center ">
                        {truncateTextar(item?.request_type) }
                      </td>
                      <td className=" h-[56px] font-bold text-[12px] text-left px-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className=" h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>
                      <td className="h-[56px] lg:text-[12px]  xl:text-[12px]">
                        {truncateText(item?.request_type) }
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[12px]">
                            {truncateText(item?.user?.name) }
                          </span>
                          <span className="text-[10px]">
                            {truncateText(item?.user?.email)}
                          </span>
                        </div>
                      </td>
                      <td className=" h-[56px] lg:text-[12px] xl:text-[14px]">
                        {truncateText(item?.task?.name) }
                      </td>
                      <td className=" h-[56px]  lg:text-[12px] xl:text-[14px]">
                        {truncateText(item?.event?.name) }
                      </td>
                      <td className="h-[56px] lg:text-[12px] xl:text-[14px]">
                        {truncateText(item?.orgnization?.name)}
                      </td>
                      <td className=" h-[56px] lg:text-[12px] xl:text-[14px] text-three ">
                        <span className="bg-eight rounded-circle px-2 py-1">
                          {item?.status ?? "N/A"}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds(prev => [...prev, item.id]);
                            } else {
                              setSelectedIds(prev => prev.filter(id => id !== item.id));
                            }
                          }}
                        />
                      </td>
                      <td className="h-[56px] flex items-center justify-start  px-2">
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
