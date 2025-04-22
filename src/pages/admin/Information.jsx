import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPencil } from "react-icons/hi2";
import axios from 'axios';
import { FaCrown } from "react-icons/fa6";

const Information = () => {
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
    <div className='flex flex-col'>
        <div className='bg-seven w-full h-50 flex relative'>
            {/* pic and text  */}
            <div className='flex justify-center items-center m-6'>
       <img className='w-[152px] h-[152px]'/>
            </div>
            <div className='flex flex-col my-6'>
            <span className='text-[32px] font-medium text-one mb-3'>{data.name||"no name"}</span> 
            <span className='text-[16px] font-light text-one mb-5'>{data.email||"no email"}</span> 
            <span className='text-[16px] font-light py-1 px-2 text-one bg-eight items-center justify-center  mb-3 flex gap-1'><FaCrown /><span>super Admain</span></span> 
            </div>
            <button onClick={()=>navigate('/admin/putprofile')} className=' absolute top-4 right-3  '>
            <svg width="22" height="28" viewBox="0 0 22 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.333 0.682617L20.333 4.68262L17.2837 7.73328L13.2837 3.73328L16.333 0.682617ZM0.333008 16.6666V20.6666H4.33301L15.3983 9.61728L11.3983 5.61728L0.333008 16.6666ZM0.333008 24.6666H21.6663V27.3333H0.333008V24.6666Z" fill="#730FC9"/>
</svg>

        </button>
        </div>

      
    </div>
  )
}

export default Information
