import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import IconTasks from '../../Icons/IconTasks';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
const Requestsdetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [data,setData]=useState('')
      useEffect(()=>{
          const { sendData } = location.state || {};
          console.log(sendData)
          const token = localStorage.getItem('token');
          axios.get(`https://backndVoo.voo-hub.com/api/admin/request/${sendData}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          })
            .then(response => {
              setData(response.data?.request??[]);
            })
            .catch(() => {
            });
      },[location.state])
    return (
      <div className='flex flex-col relative'> 
       <div className='w-full text-right absolute'> <button   className='text-3xl text-nine' onClick={()=>navigate(-1)} ><MdOutlineArrowBackIos /></button></div>
  
  <div className='flex gap-2 items-center '>
     <VscGitPullRequestGoToChanges className='text-[24px] text-one'/>
   <span className='text-2xl font-medium my-6'>request Details</span></div>
  
   <div className='flex flex-col gap-8'>
    <span className='text-nine text-[16px]'>type: {data?.request_type ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>status: {data?.status  ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>user : {data?.user?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>email: {data?.user?.email ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>task: {data?.task?.name ?? "N/A"}</span>
    <span className='text-nine text-[16px]'>orgnization : {data?.orgnization?.name ?? "N/A"}</span>
   
  </div>
  
          </div>
    )
  }


export default Requestsdetails
