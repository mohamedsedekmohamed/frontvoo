import React, { useEffect, useRef, useState } from 'react';
import { FaRegBell } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import '../translation/i18n';  
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { PiList } from "react-icons/pi";
const OrganizeationNavbar  = ({setIsOpen,isOpen}) => {
 
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
    <div className="w-full flex justify-between items-center relative">
      
      {/* القسم الأيمن (أو الأيسر حسب اللغة): زر الموبايل + معلومات المستخدم */}
      <div className='flex items-center gap-3 md:gap-4'>
        {/* زر إظهار القائمة للموبايل فقط */}
        <button 
          className="block lg:hidden text-white p-1 hover:bg-white/10 rounded-md" 
          onClick={() => setIsOpen(!isOpen)}
        >
          <PiList className='text-2xl md:text-3xl' />
        </button>

        {/* صورة واسم المستخدم */}
        <div className='flex items-center gap-2'>
          {data.avatar_image_link ? (
            <img src={data.avatar_image_link} className='w-8 h-8 md:w-10 md:h-10 rounded-full object-cover shadow-sm' alt="User Avatar" />
          ) : (
            <span className='w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex shrink-0' />
          )}
          <span className='text-sm md:text-xl font-bold text-white line-clamp-1'>
            {data.name || "User"}
          </span>
        </div>
      </div>

      {/* القسم المقابل: الإعدادات، الإشعارات، واللغة */}
      <div className='flex items-center gap-3 md:gap-5'>
        <button 
          onClick={() => navigate('/organizeation/informationOr')} 
          className="hover:scale-110 transition-transform hidden sm:block" // يمكن إخفاؤه في الشاشات الصغيرة جداً إن أردت
        >
          <IoPersonCircleSharp className='text-2xl md:text-3xl text-white' />
        </button>

        <button 
          className="relative hover:scale-110 transition-transform p-1" 
          onClick={() => navigate('/organizeation/newnotificationor')}
        >
          {conut > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-one text-[10px] md:text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-one font-bold">
              {conut}
            </span>
          )}
          <FaRegBell className="text-xl md:text-2xl text-white" />
        </button>

        {/* اختيار اللغة */}
        <div className="relative flex items-center bg-white/20 rounded-lg px-2 py-1 md:px-3 md:py-2">
          <GrLanguage className="text-white text-sm md:text-base mr-1 rtl:ml-1" />
          <select
            onChange={handleLanguage}
            value={i18n.language}
            className="bg-transparent text-white text-sm md:text-base font-semibold outline-none cursor-pointer appearance-none pr-4 rtl:pl-4"
          >
            <option className='text-black' value='ar'>AR</option> 
            <option className='text-black' value='en'>EN</option> 
          </select>
          <IoIosArrowDown className="text-white text-xs md:text-sm absolute right-2 rtl:left-2 rtl:right-auto pointer-events-none" />
        </div>
      </div>

      {/* نافذة التنبيهات (Popup) */}
      {showPopup && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={() => setShowPopup(false)}></div>
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-one px-6 py-6 rounded-xl shadow-2xl z-50 w-[90%] max-w-sm flex flex-col items-center gap-5 border border-one/20">
            <p className="text-base md:text-lg font-semibold text-center">{t("Youhavenewmessages")} 🔔</p>
            <div className="flex gap-4 w-full">
              <button
                onClick={() => {
                  navigate('/organizeation/newnotificationor');
                  setShowPopup(false);
                }}
                className="flex-1 bg-one text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
              >
                {t("Show")}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="flex-1 bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-200"
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrganizeationNavbar ;