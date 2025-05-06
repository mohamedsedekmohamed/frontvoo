import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from "@mui/material/Pagination";
import { useTranslation } from "react-i18next";

const Pendingusers = () => {
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
      .get("https://backndVoo.voo-hub.com/api/orgnization/bnyadm", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data || []);
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

  const accept = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to accept ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/accept/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Accepted!", `${userName} has been accepted.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to accept ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not accepted.`, "info");
      }
    });
  };

  const reject = (id, userName) => {
    const token = localStorage.getItem("token");

    Swal.fire({
      title: `Are you sure you want to reject ${userName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(
            `https://backndVoo.voo-hub.com/api/orgnization/bnyadm/reject/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then(() => {
            setUpdate((prev) => !prev);
            Swal.fire("Rejected!", `${userName} has been rejected.`, "success");
          })
          .catch(() => {
            Swal.fire("Error!", `Failed to reject ${userName}.`, "error");
          });
      } else {
        Swal.fire("Cancelled", `The request was not rejected.`, "info");
      }
    });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const cheose = [
    "Filter",
    "user.name",
    "orgnization.name",
    "user.email",
    "status",
  ];
  const labelMap = {
    Filter: t("Filter"),
    "user.name": t("User"),
    "orgnization.name": t("Orgnization"),
    "user.email": t("Email"),
    status: t("Status"),
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
              className='flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1'
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
            <tr className="bg-four w-[1012px] text-one h-[56px]">
              {isArabic ? (
                <>
    <th className="w-[30px] h-[56px] text-[16px] border-b text-right p-2">رقم</th>
    <th className="w-[200px] h-[56px] text-[16px] border-b text-right pr-3">المستخدم</th>
    <th className="w-[158px] h-[56px] text-[16px] border-b text-right pr-3">المؤسسة</th>
    <th className="w-[158px] h-[56px] text-[16px] border-b text-right pr-3">القبول</th>
    <th className="w-[158px] h-[56px] text-[16px] border-b text-right pr-3">الرفض</th>
    <th className="w-[158px] h-[56px] text-[16px] border-b text-right pr-3">الحالة</th>
    <th className="w-[158px] h-[56px] text-[16px] border-b text-right pr-3">تفاصيل</th>
                </>
              ) : (
                <>
                  <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">
                  S/N
                  </th>
                  <th className="w-[200px] h-[56px] text-[16px] border-b text-left">
                    user
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-left">
                    orgnization
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-left">
                    Accept
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-left">
                    Reject
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-left">
                    status
                  </th>
                  <th className="w-[158px] h-[56px] text-[16px] border-b text-left">
                    details
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody dir={isArabic ? "rtl" : "ltr"}>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className="border-y border-x hover:border-3  relative hover:bg-four"
              >
                {isArabic ? (
                  <>
                     <td className="w-[30px] h-[56px] font-bold text-center">
        {(currentPage - 1) * rowsPerPage + index + 1}
      </td>

      {/* المستخدم */}
      <td className="w-[200px] h-[56px] p-2">
        <div className="flex flex-col items-strat">
          <span className="text-[12px]">{item?.user?.name ?? "N/A"}</span>
          <span className="text-[10px]">{item?.user?.email ?? "N/A"}</span>
        </div>
      </td>

      {/* المؤسسة */}
      <td className="w-[158px] h-[56px] text-strat">
        {item?.orgnization?.name ?? "N/A"}
      </td>

      {/* القبول */}
      <td className="w-[158px] h-[56px] text-strat">
        <button
          className="text-white bg-three px-2 py-1 rounded-full"
          onClick={() => accept(item.id, item?.user?.name)}
        >
          قبول
        </button>
      </td>

      {/* الرفض */}
      <td className="w-[158px] h-[56px] text-strat">
        <button
          className="text-white bg-three px-2 py-1 rounded-full"
          onClick={() => reject(item.id, item?.user?.name)}
        >
          رفض
        </button>
      </td>

      {/* الحالة */}
      <td className="w-[158px] h-[56px] text-strat">
        <span className="bg-eight text-one  rounded-full px-2 py-1">
          {item?.status ?? "N/A"}
        </span>
      </td>

      {/* تفاصيل */}
      <td className="w-[158px] h-[56px] text-strat">
        <button
          className="underline"
          onClick={() =>
            navigate("/organizeation/pendingusersDetaklis", {
              state: { sendData: item.id },
            })
          }
        >
          تفاصيل
        </button>
      </td>
                  </>
                ) : (
                  <>
                    <td className="w-[30px] h-[56px] font-bold lg:text-[12px] xl:text-[12px] px-3">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="flex flex-col w-[200px] absolute top-1 h-[56px] p-1 gap-1">
                      <span className="text-[12px]">
                        {item?.user?.name ?? "N/A"}
                      </span>
                      <span className="text-[10px]">
                        {item?.user?.email ?? "N/A"}
                      </span>
                    </td>
                    <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px]">
                      {item?.orgnization?.name ?? "N/A"}
                    </td>
                    <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px]">
                      <button
                        className="text-white bg-three px-2 py-1 rounded-full"
                        onClick={() => accept(item.id, item?.user?.name)}
                      >
                        Accept
                      </button>
                    </td>
                    <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px]">
                      <button
                        className="text-white bg-three px-2 py-1 rounded-full"
                        onClick={() => reject(item.id, item?.user?.name)}
                      >
                        Reject
                      </button>
                    </td>
                    <td className="w-[160px] h-[56px] lg:text-[12px] xl:text-[14px] text-three ">
                      {" "}
                      <span className="bg-eight rounded-circle px-2 py-1">
                        {item?.status ?? "N/A"}
                      </span>
                    </td>
                    <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
                      <button
                        className="underline "
                        onClick={() =>
                          navigate("/organizeation/pendingusersDetaklis", {
                            state: { sendData: item.id },
                          })
                        }
                      >
                        Details
                      </button>
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
export default Pendingusers;
