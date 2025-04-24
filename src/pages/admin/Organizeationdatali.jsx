import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { RiOrganizationChart } from "react-icons/ri";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
const Organizeationdatali = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data,setData]=useState([])
        useEffect(()=>{
            const { sendData } = location.state || {};
            const token = localStorage.getItem('token');
            axios.get(`https://backndVoo.voo-hub.com/api/admin/organization`, {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            })
              .then(response => {
                const organiz = response.data?.orgnization.find(o => o.id === sendData);
                if (organiz) {
                  setData(organiz)}

              })
              .catch(() => {
              });
        },[location.state])
      return (
        <div className='flex flex-col relative'> 
         <div className='w-full text-right absolute'> <button   className='text-3xl text-nine' onClick={()=>navigate(-1)} ><MdOutlineArrowBackIos /></button></div>
    
    <div className='flex gap-2 items-center '>
    <RiOrganizationChart className='text-[32px] text-one'/>
     <span className='text-2xl font-medium my-6'>Organizeation Details</span></div>
    
     <div className='flex flex-col gap-8'>
    <span className='text-nine text-[16px]'>Name: {data?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>email: {data?.email ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>phone: {data?.phone ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>role: {data?.role ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>verified: {data?.is_email_verified===0?"No verified":"verified"}</span>
    <span className='text-nine text-[16px]'>status: {data?.account_status ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>Country: {data?.country?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>City: {data?.city?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>Birthdate: {data?.birth ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>Total hours: {data?.total_hours ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>Total events: {data?.total_events ?? "N/A"}</span>
  </div>
    
            </div>
      )
    }

export default Organizeationdatali
