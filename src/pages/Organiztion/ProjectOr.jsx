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
import { useTranslation } from "react-i18next";

const ProjectOr = () => {
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
      .get("https://backndVoo.voo-hub.com/api/ornization/project", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.projects);
      })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, [update]);

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
            `https://backndVoo.voo-hub.com/api/ornization/project/delete/${userId}`,
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
    navigate("/organizeation/addprojector", { state: { sendData: id } });
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


  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const cheose = ["Filter", "name","description"];
  const labelMap = {
    Filter: t("Filter"),
    name: t("name"),
    description: t("Description"),
  };
  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };
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
          <button
            onClick={() => navigate("/organizeation/addprojector")}
            className="flex justify-center items-center bg-white border-one border-1 py-1 px-2 rounded-[8px] gap-1"
          >
            <FaPlus className="text-one w-4 h-4 md:w-6 md:h-6" />
            <span className="text-[16px] md:text-[20px] font-medium text-one">
              {t("add")}
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
                       <th className="py-4 px-3">وصف</th>
                       <th className="py-4 px-3">الأسم</th>
                       <th className="py-4 px-3">رقم</th>
                     </>
                   ) : (
                     <>
                       <th className="py-4 px-3">S/N</th>
                       <th className="py-4 px-3">Name</th>
                       <th className="py-4 px-3">Description</th>
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
                     
                       
                         <td className="  px-2">{truncateTextar(item.description)}</td>
                         <td className="  px-2">{truncateTextar(item.name)}</td>
   
                         <td className="  px-2">
                           {index + 1 + (currentPage - 1) * rowsPerPage}
                         </td>
                       </>
                     ) : (
                       <>
                         <td className="  px-2">
                           {index + 1 + (currentPage - 1) * rowsPerPage}
                         </td>
                         <td className="  px-2">{truncateText(item.name)}</td>
                         <td className="  px-2">{truncateText(item.description)}</td>
                     
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

      <ToastContainer />
    </div>
  );
};

export default ProjectOr;
