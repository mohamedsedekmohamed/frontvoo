import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCrown } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { FaUserEdit } from "react-icons/fa";
import '../../translation/i18n';  
import { useTranslation } from 'react-i18next';

const InformationOr = ({ setorganiztionLayout, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const storedLang = localStorage.getItem('language');

    if (storedLang) {
      i18n.changeLanguage(storedLang);
    } else {
      // إذا لم تكن موجودة، نحدد اللغة بناءً على المتصفح
      const userLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
      i18n.changeLanguage(userLang);
      localStorage.setItem('language', userLang);  // تخزين اللغة في localStorage
    }
  }, [i18n]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/ornization/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then(response => {
      setData(response.data.Orgnization);
    })
    .catch(error => {
      console.log('Error fetching data', error);
    });
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsLoggedIn(false);
    setorganiztionLayout(false);
    navigate('/login', { replace: true });
  };

  // نحدد هل اللغة عربية أم لا
  const isArabic = i18n.language === 'ar';

  return (
    <div className='flex flex-col' dir={isArabic ? 'rtl' : 'ltr'}>
      <div className='bg-seven w-full h-50 flex relative'>
        <div className='flex justify-center items-center m-6'>
          <img src={data?.avatar_image_link ?? null} className='w-[152px] h-[152px]' alt="avatar" />
        </div>
        <div className='flex flex-col my-6'>
          <span className='text-[32px] font-medium text-one mb-3'>{data.name || "no name"}</span>
          <span className='text-[16px] font-light text-one mb-5'>{data.email || "no email"}</span>
          <span className='text-[16px] font-light py-1 px-2 text-one bg-eight items-center justify-center mb-3 flex gap-1'>
            <FaCrown />
            <span>{t("Organiztion")}</span>
          </span>
        </div>

        {/* زرار تسجيل الخروج */}
        <button onClick={handleLogout} className={`absolute top-4 ${isArabic ? 'left-3' : 'right-3'}`}>
          <CiLogout className="text-one text-3xl" />
        </button>

        {/* زرار التعديل */}
        <button onClick={() => navigate('/organizeation/AddInformationor')} className={`absolute top-16 ${isArabic ? 'left-3' : 'right-3'}`}>
          <FaUserEdit className="text-one text-3xl" />
        </button>
      </div>

      <div className='mt-5 w-full flex-wrap flex gap-2'>
        <div className='bg-seven w-full h-fit flex flex-col p-5'>
          <div className='flex gap-1 items-center'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 0C5.81875 0 0 5.81875 0 13C0 20.1812 5.81875 26 13 26C20.1812 26 26 20.1812 26 13C26 5.81875 20.1812 0 13 0ZM12.7188 6.5C13.4125 6.5 13.9688 7.0625 13.9688 7.75C13.9688 8.4375 13.4062 9 12.7188 9C12.0312 9 11.4688 8.4375 11.4688 7.75C11.4688 7.0625 12.025 6.5 12.7188 6.5ZM15 19H11V18.5H12V11H11V10.5H14V18.5H15V19Z" fill="#730FC9"/>
            </svg>
            <span className='text-2xl font-medium text-one'>{t('Personal')}</span>
          </div>

          <div className='flex flex-col gap-2 my-2'>
            <span className='text-[20px] font-normal text-one'>{t("phonenuberinfor")}: {data.phone || "No phone"}</span>
            <span className='text-[20px] font-normal text-one'>{t("Gender")}: {data.gender || "No gender"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationOr;
