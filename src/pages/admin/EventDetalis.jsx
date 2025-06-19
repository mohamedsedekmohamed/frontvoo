import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import {   FaCalendarAlt } from "react-icons/fa"; 
       import IconDash from '../../ui/IconDash'

import { FaUser } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { SlOrganization } from "react-icons/sl";
import { HiClock } from "react-icons/hi2";
const EventDetalis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userscount,setuserscount]=useState();
  const [data,setData]=useState('')
  const [activeTab, setActiveTab] = useState('info');
    useEffect(()=>{
        const { sendData } = location.state || {};
        const token = localStorage.getItem('token');
        axios.get(`https://backndVoo.voo-hub.com/api/admin/event/${sendData}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            setData(response.data.event??[]);
            setuserscount(response.data.users_count??0)
          })
          .catch(() => {
          });
    },[location.state])
    const renderContent = () => {
      switch (activeTab) {
        case 'info':
          return <div className='flex flex-col gap-3'>   
      <div className='flex gap-2 items-center '>
      <FaCalendarAlt className='h-10 w-10 text-one'/>
    <span className='text-2xl font-medium my-6'>Event Information</span>
    </div>
    <div className='flex justify-between'>

  <div className='flex flex-col gap-2 justify-between'>
      <span className='text-nine text-[16px]'>location: {data?.location ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>google maps : <a className='underline' href={data?.google_maps_location}>{data?.google_maps_location?? "N/A"}</a></span>
          <span className='text-nine text-[16px]'>Country: {data?.country?.name ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>City: {data?.city?.name ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>Description:{data?.description ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>Status: {data?.status ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>Current attendees: {userscount ?? "N/A"}</span>
       </div>
    
    </div>
          </div>;
        case 'events':
          return  <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800">Event Benefits:</p>
          <div className="mt-2">
            {data?.event_benfits?.length > 0 ? (
              data.event_benfits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`text-lg ${benefit.status === 'inactive' ? 'text-red-500' : 'text-green-600'}`}>
                    {benefit.benfit}
                  </span>
                  {benefit.status === 'inactive' && (
                    <span className="text-sm text-red-500">(Inactive)</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-600">N/A</span>
            )}
          </div>
        </div>;
        case 'tasks':
          return<div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <p className="text-xl font-semibold text-gray-800">Event Requirements:</p>
          <div className="mt-2">
            {data?.event_requirments?.length > 0 ? (
              data.event_requirments.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className={`text-lg ${requirement.status === 'inactive' ? 'text-red-500' : 'text-green-600'}`}>
                    {requirement.requirment}
                  </span>
                  {requirement.status === 'inactive' && (
                    <span className="text-sm text-red-500">(Inactive)</span>
                  )}
                </div>
              ))
            ) : (
              <span className="text-gray-600">N/A</span>
            )}
          </div>
        </div>
 ;
        default:
          return <div> </div>;
      }
    };
       return (
         <div>

<div  className=' flex  pl-5'>
    <button onClick={()=>navigate(-1)}>
    <IconDash width={28} height={28} tone="#6810B4"
     icon="M14.369 15.9496L22.5296 7.88571C22.959 7.45891 23.2 6.88156 23.2 6.27976C23.2 5.67796 22.959 5.10061 22.5296 4.67381C22.3153 4.4603 22.0604 4.29084 21.7795 4.17519C21.4985 4.05954 21.1972 4 20.8929 4C20.5886 4 20.2873 4.05954 20.0064 4.17519C19.7254 4.29084 19.4705 4.4603 19.2562 4.67381L9.48188 14.3323C9.26581 14.5441 9.09431 14.796 8.97728 15.0736C8.86024 15.3512 8.79999 15.6489 8.79999 15.9496C8.79999 16.2504 8.86024 16.5481 8.97728 16.8257C9.09431 17.1033 9.26581 17.3552 9.48188 17.567L19.2562 27.3394C19.4716 27.5505 19.727 27.7175 20.0079 27.8309C20.2888 27.9442 20.5895 28.0017 20.8929 28C21.1963 28.0017 21.497 27.9442 21.7779 27.8309C22.0588 27.7175 22.3142 27.5505 22.5296 27.3394C22.959 26.9126 23.2 26.3352 23.2 25.7334C23.2 25.1316 22.959 24.5543 22.5296 24.1275L14.369 15.9496Z" 
    />
    </button>
        </div>
            <div className='grid grid:cols-1 md:grid-cols-3 gap-4 mx-auto my-5'>
         <button
           className={`rounded-2xl h-15 ${activeTab === 'info' ? 'bg-one text-white' : 'bg-gray-200'}`}
           onClick={() => setActiveTab('info')}
         >
           Info
         </button>
         <button
           className={`rounded-2xl h-15 ${activeTab === 'events' ? 'bg-one text-white' : 'bg-gray-200'}`}
           onClick={() => setActiveTab('events')}
         >
           Benefits
         </button>
         <button
           className={`rounded-2xl h-15 ${activeTab === 'tasks' ? 'bg-one text-white' : 'bg-gray-200'}`}
           onClick={() => setActiveTab('tasks')}
         >
           Requirements
         </button>
       </div>

       <div className='grid grid-cols-3 gap-4 mx-auto my-5 '>
 
       <div className='h-30 bg-eight W-[25%] flex  items-center  md:p-4 gap-1 md:gap-4 '>
     <i> <FaUser className=' md:h-10 md:w-10 text-one'/></i>
         <div className='flex flex-col gap-1'>
          <span className='text-nine text-[10px] md:text-[16px]'>Name </span>   
        <span className=' text-[8px] md:text-[16px] lg:text-[20px] text-one'>{data?.name ?? "N/A"}</span>
         </div>
         </div>

         {/*  */}
       <div className='h-30 bg-eight W-[25%] flex  items-center  md:p-4 gap-1 md:gap-4 '>
          <i> <SlOrganization className=' md:h-10 md:w-10 text-one'/></i>

         <div className='flex flex-col gap-1'>
          <span className='text-nine text-[10px] md:text-[16px]'>orgnization </span>
        <span className='text-[8px]md:text-[16px] lg:text-[20px] text-one'>{data?.orgnization?.name ?? "N/A"}</span>
         </div>
         </div>
         {/*  */}
       <div className='h-30 bg-eight W-[25%] flex  items-center  md:p-4 gap-1 md:gap-4 '>
               <i> <HiClock className=' md:h-10 md:w-10 text-one'/></i>

         <div className='flex flex-col gap-1'>
          <span className='text-nine text-[10px] md:text-[16px]'>time  </span>
          <div className='flex  flex-col gap-0.5'>
          <span className=' text-[8px] md:text-[16px] lg:text-[20px] text-one'> start:{data?.start_time ?? "N/A"}</span>
          <span className='text-[8px] md:text-[16px] lg:text-[20px] text-one'>end:{data?.end_time ?? "N/A"}</span>
          </div>

         </div>
         </div>
     
    
 </div>
 
       <div>
         {renderContent()}
       </div>
     </div>
    
       )  
}



export default EventDetalis
