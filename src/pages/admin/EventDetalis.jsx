import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import {   FaCalendarAlt } from "react-icons/fa"; 

import { FaUser } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { SlOrganization } from "react-icons/sl";
import { HiClock } from "react-icons/hi2";
const EventDetalis = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
            setData(response.data??[]);
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
          <span className='text-nine text-[16px]'>google maps : {data?.google_maps_location ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>Country: {data?.country?.name ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>City: {data?.city?.name ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>description: {data?.description ?? "N/A"}</span>
          <span className='text-nine text-[16px]'>status: {data?.status ?? "N/A"}</span>
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
          <span className=' text-[8px] md:text-[16px] lg:text-[20px] text-one'> strat:{data?.start_time ?? "N/A"}</span>
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
