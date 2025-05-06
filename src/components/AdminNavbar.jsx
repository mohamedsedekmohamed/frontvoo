import React, { useEffect, useState } from 'react';
import { FaRegBell  } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { PiList } from "react-icons/pi";

import { useNavigate } from 'react-router-dom';
const AdminNavbar = ({isOpen,setIsOpen}) => {
    const [data, setData] = useState([]);
            const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/admin/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data.user)
      })
  }, []);
  return (
 
    <div className=" w-full flex   justify-between items-center">
<div className=' flex items-center gap-0.5'>
{data.avatar_image_link ?(
  <img src={data.avatar_image_link} className='w-4 md:w-10 h-4 rounded-full' />
  
):( 
  <span className='w-4 md:w-10 h-4 md:h-10 bg-gray-200 rounded-full' />
)}  <div className='flex flex-col gap-0.5'>
  <span className='text-[12px] md:text-2xl font-bold text-white'>{data.name||"no name"}</span> 
  </div>
  </div> 
     <div className='flex items-center gap-0.5'>
              {!isOpen&& <button className='bg-white text-[12px] md:text-2xl' onClick={()=>setIsOpen(!isOpen)}><PiList className='text-one text-[12px] md:text-2xl'/></button>} 
      
      <button onClick={()=>navigate('/admin/information')}>
     <IoPersonCircleSharp className=' text-[12px] md:text-2xl text-white'  />
      </button>
      {/* <span className='flex gap-1 items-center justify-center text-white'> <GrLanguage/> <span className='pb-1'> En</span>  <IoIosArrowDown /></span> */}
      <i className='text-white text-[12px] md:text-2xl'><FaRegBell  /></i>
    </div>
  </div>


  )
}

export default AdminNavbar
