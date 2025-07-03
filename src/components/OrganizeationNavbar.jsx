import React, { useEffect, useRef, useState } from 'react';
import { FaRegBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import '../translation/i18n';  
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
 
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
        const [conut,setConut]= useState(0);
    
    const navigate = useNavigate();
const [showPopup, setShowPopup] = useState(false);
  const prevCount = useRef(0);
    
  
  const token = localStorage.getItem('token');
useEffect(() => {
  axios.get("https://backndVoo.voo-hub.com/api/ornization/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(response => {
      setData(response.data.Orgnization);
    });
}, []);
const handleLanguage = (event) => {
  const newLang = event.target.value;
  i18n.changeLanguage(newLang);
  localStorage.setItem('language', newLang);
};

   useEffect(() => {
  const fetchCount = () => {
    axios.get("https://backndVoo.voo-hub.com/api/ornization/noti/notification_num", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
   .then(response => {
          const newCount = response.data.requests_count;

          if (newCount > prevCount.current) {
            setShowPopup(true);
          }

          prevCount.current = newCount;
          setConut(newCount);
        })
        .catch(err => {
          console.error("Failed to fetch notification count", err);
        });
    };

    fetchCount(); // أول مرة
    const interval = setInterval(fetchCount, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, []);
    return (
      <div className="flex justify-between items-center">
        <div className='flex items-center gap-3'>
{data.avatar_image_link ?(
            <img src={data.avatar_image_link} className='w-10 h-10 rounded-full' />

):( 
           <span className='w-10 h-10 bg-gray-200 rounded-full' />
)}

          <div className='flex flex-col gap-0.5'>
            <span className='text-2xl font-bold text-white'>{data.name || "no name"}</span>
          </div>
        </div>
  
        <div className='flex items-center gap-3'>
            <button onClick={() => navigate('/organizeation/informationOr')}>
            <IoPersonCircleSharp className='text-2xl text-white' />
          </button>
  <div className="relative" onClick={() => navigate('/organizeation/newnotificationor')}>
      <span className="absolute -top-1 -right-1 bg-white text-one text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-one font-bold">
        {conut}
      </span>
    <i >
      <FaRegBell className="text-white text-[12px] md:text-2xl" />
    </i>
  </div>
          <select
  onChange={handleLanguage}
  value={i18n.language}
  className="flex gap-1 items-center justify-center bg-one text-white"
>
            <GrLanguage />
            <option className='pb-1' value='ar'>AR</option> 
            <option className='pb-1 ' value='en'>EN</option> 
            <IoIosArrowDown />
          </select>
  
        </div>
         {showPopup && (
  <>
   <div className="fixed inset-0 bg-black/40 z-40"></div>

    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-one px-6 py-5 rounded-xl shadow-2xl z-50 w-[90%] max-w-sm flex flex-col items-center gap-4 border border-one">
      <p className="text-lg font-semibold text-center">  {t("Youhavenewmessages")} 🔔 </p>
      <div className="flex gap-4">
        <button
          onClick={() => {
            navigate('/organizeation/newnotificationor');
            setShowPopup(false);
          }}
          className="bg-one text-white px-4 py-2 rounded-lg hover:opacity-90"
        >
          {t("Show")}
        </button>
        <button
          onClick={() => setShowPopup(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400"
        >
          {t("Close")}
        </button>
      </div>
    </div>
  </>
)}

      </div>
    )
  }
  
  

export default AdminNavbar
