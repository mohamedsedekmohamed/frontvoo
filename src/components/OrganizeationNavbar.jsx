import React, { useEffect, useState } from 'react';
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
    const navigate = useNavigate();
  //  useEffect(() => {
  //     const storedLang = localStorage.getItem('language');
  //     const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    
  //     const langToUse = storedLang || browserLang;
    
  //     if (i18n.language !== langToUse) {
  //       i18n.changeLanguage(langToUse)}
  //     if (!storedLang) {
  //       localStorage.setItem('language', langToUse);
  //     }
  //   }, []);
    
  
useEffect(() => {
  const token = localStorage.getItem('token');
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
  
          <i className='text-white text-2xl'><FaRegBell /></i>
        </div>
      </div>
    )
  }
  
  

export default AdminNavbar
