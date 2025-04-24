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
       

        <div className=' mt-5 w-full   flex-wrap flex gap-2'> 
          <div className='bg-seven w-full h-fit flex flex-col p-5'>
            <div className='flex gap-1 items-center'>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 0C5.81875 0 0 5.81875 0 13C0 20.1812 5.81875 26 13 26C20.1812 26 26 20.1812 26 13C26 5.81875 20.1812 0 13 0ZM12.7188 6.5C13.4125 6.5 13.9688 7.0625 13.9688 7.75C13.9688 8.4375 13.4062 9 12.7188 9C12.0312 9 11.4688 8.4375 11.4688 7.75C11.4688 7.0625 12.025 6.5 12.7188 6.5ZM15 19H11V18.5H12V11H11V10.5H14V18.5H15V19Z" fill="#730FC9"/>
</svg>
            <span className='text-2xl font-medium text-one'>Personal Information</span>
            </div>

<div className='flex flex-col gap-2 my-2'>
  <span className='text-[20px] font-normal text-one'>Phone Number: {data.phone}</span>
  <span className='text-[20px] font-normal text-one'>birth birth: {data.birth}</span>
  <span className='text-[20px] font-normal text-one'>gender : {data.gender}</span>
  
  
  </div>        
          </div>
          
        </div>
    </div>
  )
}

export default Information
