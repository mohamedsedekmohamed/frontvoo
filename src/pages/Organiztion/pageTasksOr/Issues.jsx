import React, { useEffect, useState } from "react";
import axios from "axios";
import filter from "../../../assets/filter.svg";
import { CiSearch } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiCircleMore } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";
import IconSuggest  from "../../../Icons/IconSuggest";
import { IoCallSharp } from "react-icons/io5";
import { useTranslation } from 'react-i18next';

 const Issues = ({id}) => {
    const [data, setData] = useState([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [selectedFilter, setSelectedFilter] = useState("");
      const [currentPage, setCurrentPage] = useState(1);
      const [selectedEvent, setSelectedEvent] = useState(null);
        const [showModal, setShowModal] = useState(false);
           const { t, i18n } = useTranslation();
                const isArabic = i18n.language === 'ar';
      useEffect(() => {
        setCurrentPage(1);
      }, [searchQuery]);
    
  useEffect(() => {
    const token = localStorage.getItem("token");
   
    // ss
    axios
    .get(`https://backndVoo.voo-hub.com/api/orgnization/getTaskShakawy/${id}`, {
      headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setData(response.data.data || []);
      })
      .catch(() => {
        toast.error('faild network');});
  }, [ ]); 


  const handleChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
  
    if (selectedFilter === "Filter" || selectedFilter === "") {
      return Object.values(item.user || {}).some((value) =>
        value?.toString().toLowerCase().includes(query)
      ) || Object.values(item).some((value) => // إضافة فلترة على خصائص الشكوى نفسها
        (typeof value === 'string' && value.toLowerCase().includes(query))
      );
    } else if (selectedFilter === "user.name") {
      return item.user?.name?.toLowerCase().includes(query);
    } else {
      const value = item[selectedFilter];
      return value?.toString().toLowerCase().includes(query);
    }
  });
  
    
  const rowsPerPage = 10;
  const pageCount = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const cheose = ["Filter", "shakwa_title", "shakwa_description", "user.name"];
  const labelMap = {
    Filter: t("Filter"),
    "shakwa_title": t("title"),
    "shakwa_description": t("description"),
    "user.name":t("Name") 
  };
  const fetchEventDetails = async (eventId) => {
    if(eventId === null) {

        return toast.error("No Issues found  ");
    }
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `https://backndVoo.voo-hub.com/api/orgnization/getEventShakawy/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setSelectedEvent(response.data.data[0]); 
    console.log(eventId);
    setShowModal(true);
  } catch (error) {
    console.error("Error fetching event details:", error);
  }
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
                      className="flex justify-center w-20 text-[12px] items-center h-9 text-white bg-one py-1 px-1 rounded-[8px] gap-1"
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

              <div className="mt-10 overflow-x-auto w-full">
  <table 
    dir={isArabic ? "rtl" : "ltr"}
    className="min-w-full border border-black"
  >
    <thead>
    <tr className="bg-four h-[56px] text-one">
    {isArabic ? (
  <>
    <th className="w-[30px] text-[16px] border-b text-right pr-3">رقم</th>
    <th className="w-[158px] text-[16px] border-b text-right pr-3">العنوان</th>
    <th className="w-[158px] text-[16px] border-b text-right pr-3">ألأسم</th>
    <th className="w-[158px] text-[16px] border-b text-right pr-3">الوصف</th>
    <th className="w-[158px] text-[16px] border-b text-right pr-3">الإجراء</th>
  </>
) : (
  <>
    <th className="w-[30px] text-[16px] border-b text-left pl-3">ID</th>
    <th className="w-[158px] h-[56px]  text-[16px] border-b text-left">     title      </th>
    <th className="w-[158px] text-[16px] border-b text-left">Description</th>
    <th className="w-[158px] text-[16px] border-b text-left">Name</th>
    <th className="w-[158px] text-[16px] border-b text-left">Action</th>
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
                <td className="w-[30px]  h-[56px]  font-bold text-[12px] px-3">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
                <td className="w-[160px]  h-[56px]  text-[14px]">
                  {item.shakwa_title ?? "N/A"}
                </td>
                <td className="w-[190px] h-[56px]  text-[12px]">
                  {item.user?.name ?? "N/A"}
                </td>
                <td className="w-[220px] h-[56px]  text-[12px]">
                  {item.shakwa_description ?? "N/A"}
                </td>
              
                <td className="w-[190px] h-[56px] text-white text-[16px]">
                  <button
                    onClick={() => {
                        fetchEventDetails(item.event_id)
                    }}
                    className="text-white w-20 bg-one px-2 py-1 text-[16px] rounded-[8px]"
                  >
                    {t("View")}
                    </button>
                </td>
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
            {showModal && selectedEvent && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
    <div className="bg-white p-6 rounded-md  w-full shadow-xl text-black overflow-y-auto max-h-[90vh]">
      <div className=" font-bold mb-4 flex items-center "> 
        <CiCircleMore className="text-one text-[50px] py-2"/> <span className="text-one font-medium">{t("Problem")}</span>
        </div>
      <div className="s">
      <span className="text-one my-3">{t("AudioProblem")} </span> 
        <p>{selectedEvent.shakwa_description??"N/A"} </p>
      </div>

   
          <div className="flex flex-col mt-2 gap-1">
          
              <div className='flex gap-5 my-2 items-center'>
                 <IoPerson className='text-[14px] text-ten '/> {t("Name")}: <span className='text-ten font-medium text-[12px]'>{selectedEvent?.user?.name??"N/A"}</span> 
                 </div>
            
              <div className='flex gap-5 my-1 items-center'>
                 <IconSuggest /> {t("Subject")}: <span className='text-ten font-medium text-[12px]'>{selectedEvent?.event.name??"N/A"}</span> 
                 </div>
              <div className='flex gap-5 my-1 items-center'>
                 <IoCallSharp className='text-[14px] text-ten '/>{t("phonenumber")}: <span className='text-ten font-medium text-[12px]'>{selectedEvent?.user?.phone??"N/A"}</span> 
                 </div>
          </div>

      <div className="mt-6 text-right">
        <button
          onClick={() => setShowModal(false)}
          className="bg-one text-white px-4 py-2 rounded"
        >
                     {t("close")}

        </button>
      </div>
    </div>
  </div>
)}
                <ToastContainer/>
    </div>
  )
}
export default Issues
