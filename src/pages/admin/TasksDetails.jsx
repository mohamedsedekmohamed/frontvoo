import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import IconTasks from '../../Icons/IconTasks';

import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
const TasksDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data,setData]=useState('')
      useEffect(()=>{
          const { sendData } = location.state || {};
          console.log(sendData)
          const token = localStorage.getItem('token');
          axios.get(`https://backndVoo.voo-hub.com/api/admin/task/${sendData}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              setData(response.data?.task??[]);
            })
            .catch(() => {
            });
      },[location.state])
    return (
      <div className='flex flex-col relative'> 
       <div className='w-full text-right absolute'> <button   className='text-3xl text-nine' onClick={()=>navigate(-1)} ><MdOutlineArrowBackIos /></button></div>
  
  <div className='flex gap-2 items-center '>
     <IconTasks variant/>
   <span className='text-2xl font-medium my-6'>Tasks Details</span></div>
  
   <div className='flex flex-col gap-8'>
    <span className='text-nine text-[16px]'>Name: {data?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>date: {data?.date  ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>start time: {data?.start_time ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>Country: {data?.to_zone?.city?.country?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>City: {data?.to_zone?.city?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>zone: {data?.to_zone?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>number needed: {data?.number_of_voo_needed ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>status: {data?.status ?? "N/A"}</span>
   
  </div>
  
          </div>
    )
  }

export default TasksDetails
