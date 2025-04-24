import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
const Userdetails = () => {
    const navigate = useNavigate();
const location = useLocation();
const [data,setData]=useState('')
    useEffect(()=>{
        const { sendData } = location.state || {};
        console.log(sendData)
        const token = localStorage.getItem('token');
        axios.get(`https://backndVoo.voo-hub.com/api/admin/user/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            setData(response.data?.user??[]);
          })
          .catch(() => {
          });
    },[location.state])
  return (
    <div className='flex flex-col relative'> 
     <div className='w-full text-right absolute'> <button   className='text-3xl text-nine' onClick={()=>navigate(-1)} ><MdOutlineArrowBackIos /></button></div>

<div className='flex gap-2 items-center '>
    <svg width="24" height="21" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9998 5.13129C12.3816 5.13129 12.691 4.82136 12.691 4.43905C12.691 4.05674 12.3816 3.74683 11.9998 3.74683C11.6181 3.74683 11.3086 4.05674 11.3086 4.43905C11.3086 4.82136 11.6181 5.13129 11.9998 5.13129Z" fill="#6810B4"/>
<path d="M11.9998 6.74854V11.6544" stroke="#6810B4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M1.09324 0.943359C0.819913 0.943359 0.599854 1.16423 0.599854 1.43866V14.8594C0.599854 15.1338 0.819913 15.3548 1.09324 15.3548H4.10484V20.0569L13.3538 15.3548H17.4531H22.9064C23.1798 15.3548 23.3998 15.1338 23.3998 14.8594V1.43866C23.3998 1.16423 23.1798 0.943359 22.9064 0.943359H1.09324Z" stroke="#6810B4" stroke-width="1.5" stroke-miterlimit="6.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
 <span className='text-2xl font-medium my-6'>Users Information</span></div>

 <div className='flex flex-col gap-8'>
  <span className='text-nine text-[16px]'>Name: {data?.name ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Phone: {data?.phone ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Email: {data?.email ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Country: {data?.country?.name ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>City: {data?.city?.name ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Birthdate: {data?.birth ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Gender: {data?.gender ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Account status: {data?.account_status ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Role: {data?.role ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Total hours: {data?.total_hours ?? "N/A"}</span>
  <span className='text-nine text-[16px]'>Total events: {data?.total_events ?? "N/A"}</span>
</div>

        </div>
  )
}

export default Userdetails
