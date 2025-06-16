import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import IconTasks from '../../Icons/IconTasks';
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
       import IconDash from '../../ui/IconDash'


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

<div  className=' flex  pl-5'>
    <button onClick={()=>navigate(-1)}>
    <IconDash width={28} height={28} tone="#6810B4"
     icon="M14.369 15.9496L22.5296 7.88571C22.959 7.45891 23.2 6.88156 23.2 6.27976C23.2 5.67796 22.959 5.10061 22.5296 4.67381C22.3153 4.4603 22.0604 4.29084 21.7795 4.17519C21.4985 4.05954 21.1972 4 20.8929 4C20.5886 4 20.2873 4.05954 20.0064 4.17519C19.7254 4.29084 19.4705 4.4603 19.2562 4.67381L9.48188 14.3323C9.26581 14.5441 9.09431 14.796 8.97728 15.0736C8.86024 15.3512 8.79999 15.6489 8.79999 15.9496C8.79999 16.2504 8.86024 16.5481 8.97728 16.8257C9.09431 17.1033 9.26581 17.3552 9.48188 17.567L19.2562 27.3394C19.4716 27.5505 19.727 27.7175 20.0079 27.8309C20.2888 27.9442 20.5895 28.0017 20.8929 28C21.1963 28.0017 21.497 27.9442 21.7779 27.8309C22.0588 27.7175 22.3142 27.5505 22.5296 27.3394C22.959 26.9126 23.2 26.3352 23.2 25.7334C23.2 25.1316 22.959 24.5543 22.5296 24.1275L14.369 15.9496Z" 
    />
    </button>
        </div>
  
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
