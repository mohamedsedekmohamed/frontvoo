import React, { useEffect, useState } from 'react';
import { FaRegBell  } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { GrLanguage } from "react-icons/gr";
import axios from 'axios';
import { IoPersonCircleSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
const AdminNavbar = () => {
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
    <div className="flex justify-between items-center">
<div className=' flex items-center gap-3'>
  <span  className='w-10 h-10 bg-gray-200 rounded-full' />
  <div className='flex flex-col gap-0.5'>
  <span className='text-2xl font-bold text-white'>{data.name||"no name"}</span> 
  </div>
  </div> 
     <div className='flex items-center gap-3'>
      <button onClick={()=>navigate('/admin/information')}>
     <IoPersonCircleSharp className='  text-2xl text-white'  />
      </button>
      <span className='flex gap-1 items-center justify-center text-white'> <GrLanguage/> <span className='pb-1'> En</span>  <IoIosArrowDown /></span>
      <i className='text-white text-2xl'><FaRegBell  /></i>
    </div>
  </div>
  )
}

export default AdminNavbar
