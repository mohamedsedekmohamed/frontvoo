import React, { useEffect, useMemo, useState } from "react";
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

const UserOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.users);
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
            `https://backndVoo.voo-hub.com/api/ornization/user/delete/${userId}`,
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
      return Object.values(item).some((value) =>
        typeof value === "object"
          ? Object.values(value || {}).some((sub) =>
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
    "name",
    "email",
    "age",
    "phone",
    "country.name",
    "city.name",
    "account_status",
  ];
  const labelMap = {
    Filter: t("Filter"),
    name: t("User"),
    age: t("age"),
    email: t("Email"),
    phone: t("Phone"),
    "country.name": t("Country"),
    "city.name": t("City"),
    account_status: t("Status"),
  };

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const sortedData = useMemo(() => {
    let sortableData = [...filteredData];

    if (!sortKey || !sortOrder) {
      return sortableData;
    }

    return sortableData.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (sortKey === "age") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (sortKey === "created_at") {
        return sortOrder === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  const paginatedData = sortedData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handleEdit = (id) => {
    navigate("/organizeation/adduser", { state: { sendData: id } });
  };
  const truncateText = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const truncateTextar = (text, maxLength = 15) => {
    if (!text) return "N/A";
    return text.length > maxLength ? "..." + text.slice(0, maxLength) : text;
  };
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;

    Swal.fire({
      title: "Are you sure?",
      text: "This action will delete selected users!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        Promise.all(
          selectedIds.map((user) =>
            axios.delete(
              `https://backndVoo.voo-hub.com/api/ornization/user/delete/${user.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
          )
        )
          .then(() => {
            toast.success("Selected users deleted successfully");
            setSelectedIds([]);
            setUpdate((prev) => !prev);
          })
          .catch(() => toast.error("Error deleting some users"));
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
        <select
          value={`${sortKey}:${sortOrder}`}
          onChange={(e) => {
            const [key, order] = e.target.value.split(":");
            setSortKey(key || "");
            setSortOrder(order || "");
          }}
          className="text-[14px] h-9 border border-one rounded-[8px] px-2"
        >
          <option value="">{t("SortBy")}</option>
          <option value="age:asc">{t("Ageup")}</option>
          <option value="age:desc">{t("Agedown")}</option>
          <option value="created_at:asc">{t("JoinDateup")}</option>
          <option value="created_at:desc">{t("JoinDatedown")}</option>
        </select>
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
            onClick={() => navigate("/organizeation/adduser")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              {isArabic ? "أضافة" : "Add"}
            </span>
          </button>
        </div>
      </div>
      {selectedIds.length > 0 && (
        <div className="flex gap-2 mt-4">
          <button
            className="bg-one/60 text-white px-4 py-2 rounded"
            onClick={handleBulkDelete}
          >
            {t("DeleteSelected")}
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
                    <th className="py-4 px-3">رقم</th>
                    <th className="py-4 px-3">المستخدم</th>
                    <th className="py-4 px-3">العمر</th>
                    <th className="py-4 px-3">الإيميل</th>
                    <th className="py-4 px-3">الدولة</th>
                    <th className="py-4 px-3">المدينة</th>
                    <th className="py-4 px-3">تفاصيل</th>
                    <th className="py-4 px-3">المؤسسة</th>
                    <th className="py-4 px-3">يوم التسجيل</th>
                    <th className="py-4 px-3">الحالة</th>
                    <th className="py-4 px-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(
                              paginatedData.map((item) => ({
                                id: item.id,
                                status: item.account_status,
                              }))
                            );
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="py-4 px-3">الإجراء</th>
                  </>
                ) : (
                  <>
                    <th className="py-4 px-3">S/N</th>
                    <th className="py-4 px-3">User</th>
                    <th className="py-4 px-3">Age</th>
                    <th className="py-4 px-3">Gmail</th>
                    <th className="py-4 px-3">Country</th>
                    <th className="py-4 px-3">City</th>
                    <th className="py-4 px-3">Details</th>
                    <th className="py-4 px-3">Organization</th>
                    <th className="py-4 px-3">join date</th>
                    <th className="py-4 px-3">Status</th>
                    <th className="py-4 px-3">
                      <input
                        type="checkbox"
                        checked={
                          selectedIds.length === paginatedData.length &&
                          paginatedData.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(
                              paginatedData.map((item) => ({
                                id: item.id,
                                status: item.account_status,
                              }))
                            );
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
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
                  <td className="py-2 px-3">
                    {(currentPage - 1) * rowsPerPage + index + 1}
                  </td>
                  <td className=" h-[56px] py-2 px-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[12px] font-normal">
                        {truncateText(item?.name)}
                      </span>
                      <span className="text-[12px] font-normal">
                        {truncateText(item?.phone)}
                      </span>
                    </div>
                  </td>
                  <td className=" h-[56px] text-[12px]">
                    {truncateText(item?.age)}
                  </td>
                  <td className=" h-[56px] text-[12px]">
                    {truncateText(item?.email)}
                  </td>
                  <td className=" h-[56px] text-[12px] px-1">
                    {truncateText(item?.country?.name)}
                  </td>
                  <td className="h-[56px] text-[12px] px-1">
                    {truncateText(item?.city?.name)}
                  </td>
                  <td className=" h-[56px] text-[12px] px-1">
                    <button
                      className="underline"
                      onClick={() =>
                        navigate("/organizeation/userDetails", {
                          state: { sendData: item.id },
                        })
                      }
                    >
                      Details
                    </button>
                  </td>
                  <td className=" h-[56px] text-[12px] font-medium px-1">
                    {truncateText(item?.orgnization?.name)}
                  </td>
                  <td className="py-2 px-3 ">
                    {item?.created_at
                      ? new Date(item.created_at).toISOString().split("T")[0]
                      : "N/A"}{" "}
                  </td>

                  <td className=" h-[56px] text-[12px] text-six px-1">
                    {item?.account_status ?? "N/A"}
                  </td>
                  <td className="py-4 px-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.some((user) => user.id === item.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds((prev) => [
                            ...prev,
                            { id: item.id, status: item.account_status },
                          ]);
                        } else {
                          setSelectedIds((prev) =>
                            prev.filter((user) => user.id !== item.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className={` h-[56px] lg:text-[12px] xl:text-[16px] ${isArabic?"justify-center":"justify-start"} flex  items-center px-1 `}>
                    <RiDeleteBin6Line
                      className="w-[24px] h-[24px] ml-2 text-five cursor-pointer hover:text-red-600 transition"
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

export default UserOr;
