import React, { useEffect, useState } from "react";
import { CiSearch, CiEdit } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import filter from "../../assets/filter.svg";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { RiDeleteBin6Line } from "react-icons/ri";
import Pagination from '@mui/material/Pagination';

const TasksOr = () => {
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("https://backndVoo.voo-hub.com/api/ornization/task", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.tasks);
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
            `https://backndVoo.voo-hub.com/api/ornization/task/delete/${userId}`,
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
    navigate("/organizeation/addtasksor", { state: { sendData: id } });
  };
    const [selectedDate, setSelectedDate] = useState('');
  
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
  const cheose = ["Filter", "name", "date", "start_time", "description"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("Task"),
    date: t("date"),
    start_time: t("start"),
    description: t("description"),
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
              className='flex justify-center w-20 text-[20px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1'
            >
              {cheose.map((option, index) => (
                <option key={index} value={option}>
                  {labelMap[option] || option}
                </option>
              ))}
            </select>
          </button>
          <button
            onClick={() => navigate("/organizeation/addtasksor")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className='text-[16px] md:text-[20px] font-medium text-one'>{isArabic ? 'أضافة' : 'Add'}</span>

          </button>
        </div>
      </div>
      <div className="mt-10  block">
        <table className="w-full border-y border-x border-black">
          <thead className="w-full">
          <tr className='bg-four w-[1012px] h-[56px] text-one'>
              
              {isArabic ? (
      <>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">الإجراء</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right">العمليات</th>

        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">تفاصيل</th>

        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">الوقت</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-right pr-3">الوصف</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left pr-3">الميعاد</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left pr-3">المهمة</th>
        <th className="w-[30px] h-[56px] text-[16px] border-b text-right p-2">رقم</th>
      </>
    ) : (
      <>
        <th className="w-[30px] h-[56px] text-[16px] border-b text-left pl-3">S/N</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left pl-3">Task</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Time</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Description</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Date</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Details</th>
        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Operation</th>

        <th className="w-[158px] h-[56px] text-[16px] border-b text-oneborder-b text-left">Action</th>
      </>
    )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr
                key={item.id}
                className="border-y hover:border-3 relative hover:bg-four"
              >
           
  {isArabic ? (
    <>
      <td className="w-[143px] h-[56px] flex justify-start px-5 items-center">
        <RiDeleteBin6Line
          className="w-[24px] h-[24px] mr-2 text-five cursor-pointer hover:text-red-600 transition"
          onClick={() => handleDelete(item.id, item.name)}
        />
        <CiEdit
          className="w-[24px] h-[24px] text-six cursor-pointer"
          onClick={() => handleEdit(item.id)}
        />
      </td>
      <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
  <button className='underline ' onClick={() => navigate('/organizeation/operationTasksOr', { state: { sendData: item.id } })}>
  عملية 
</button>

    </td>
      <td className="w-[143px] h-[56px]  text-right px-1">
        <button
          className="underline"
          onClick={() =>
            navigate("/organizeation/tasksdetails", {
              state: { sendData: item.id },
            })
          }
        >
          التفاصيل
        </button>
      </td>
      <td className="w-[160px] h-[56px] text-right   px-1">
        {item?.start_time ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] text-right txet-[10px] px-1">
        {item?.description ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] text-left px-1">
        {item?.date ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] text-left px-1">
        {item?.name ?? "N/A"}
      </td>
      <td className="w-[30px] h-[56px] font-bold text-[12px] text-left px-3">
      {(currentPage - 1) * rowsPerPage + index + 1}
      </td>
    </>
  ) : (
    <>
      <td className="w-[30px] h-[56px] font-bold text-[12px] px-3">
      {(currentPage - 1) * rowsPerPage + index + 1}
      </td>
      <td className="w-[160px] h-[56px] px-1">
        {item?.name ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] px-1">
        {item?.start_time ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] txet-[10px]  px-1">
        {item?.description ?? "N/A"}
      </td>
      <td className="w-[160px] h-[56px] px-1">
        {item?.date ?? "N/A"}
      </td>
      <td className="w-[143px] h-[56px] px-1">
        <button
          className="underline"
          onClick={() =>
            navigate("/organizeation/tasksdetails", {
              state: { sendData: item.id },
            })
          }
        >
          Details
        </button>
      </td>
      <td className="w-[143px] h-[56px] lg:text-[12px] xl:text-[16px]  px-1">
  <button className='underline ' onClick={() => navigate('/organizeation/operationTasksOr', { state: { sendData: item.id } })}>
  operation
</button>

    </td>
      <td className="w-[143px] h-[56px] flex justify-start items-center px-5">
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

export default TasksOr;
