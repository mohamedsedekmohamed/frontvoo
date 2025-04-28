import React, { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { FaUser } from "react-icons/fa";
import { MdOutlineArrowBackIos } from "react-icons/md";
import 'react-toastify/dist/ReactToastify.css';
import { SlOrganization } from "react-icons/sl";
import { HiClock } from "react-icons/hi2";
import { TbTimelineEvent } from "react-icons/tb";

const Organizeationdatali = () => {
   const navigate = useNavigate();
      const location = useLocation();
      const [data,setData]=useState('')
      const [activeTab, setActiveTab] = useState('info');
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
        const renderContent = () => {
          switch (activeTab) {
            case 'info':
              return <div className='flex flex-col gap-3'>   
          <div className='flex gap-2 items-center '>
          <SlOrganization className='h-10 w-10 text-one'/>

        <span className='text-2xl font-medium my-6'>orgnization
        Information</span>
        </div>
        <div className='flex justify-between'>
  
      <div className='flex flex-col gap-2 justify-between'>
          <span className='text-nine text-[16px]'>Phone: {data?.phone ?? "N/A"}</span>
              <span className='text-nine text-[16px]'>Email: {data?.email ?? "N/A"}</span>
              <span className='text-nine text-[16px]'>Country: {data?.country?.name ?? "N/A"}</span>
              <span className='text-nine text-[16px]'>City: {data?.city?.name ?? "N/A"}</span>
              <span className='text-nine text-[16px]'>Birthdate: {data?.birth ?? "N/A"}</span>
              <span className='text-nine text-[16px]'>Gender: {data?.gender ?? "N/A"}</span>
           </div>
           <div className='w-[50%]  flex flex-wrap '>
              {Array.isArray(data?.user_papers) && data.user_papers.length > 0 && (
          <>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">Back Identity</span>
      <img className="h-30" src={data?.user_papers?.[0]?.back_identity ?? ""} alt="back_identity" />
    </div>
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">Front Identity</span>
      <img className="h-30" src={data?.user_papers?.[0]?.front_identity ?? ""} alt="front_identity" />
    </div>
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">Selfie Image</span>
      <img className="h-30" src={data?.user_papers?.[0]?.selfi_image ?? ""} alt="selfi_image" />
    </div>
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">Organization Paper</span>
      <img className="h-30" src={data?.user_papers?.[0]?.orgnization_paper ?? ""} alt="organization_paper" />
    </div>
  </div>
  
     
          </>
        )}
              </div>
        </div>
              </div>;
            case 'events':
              return <div>events</div>;
            case 'tasks':
              return <div>tasks</div>;
            default:
              return <div> </div>;
          }
        };
        
      return (
          <div>
  
             <div className='grid grid-cols-3 gap-4 mx-auto my-5'>
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
            Events
          </button>
          <button
            className={`rounded-2xl h-15 ${activeTab === 'tasks' ? 'bg-one text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </div>
        <div className='grid grid-cols-3 gap-4 mx-auto my-5'>
        <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
      <SlOrganization className='h-10 w-10 text-one'/>
          <div className='flex flex-col gap-1'>
           <span className='text-nine text-[16px]'>orgnization </span>
         <span className=' text-[24px] text-one'>{data?.name ?? "N/A"}</span>
          </div>
          </div>
          <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
      <TbTimelineEvent className='h-10 w-10 text-one'/>
          <div className='flex flex-col gap-1'>
           <span className='text-nine text-[16px]'>Total events </span>
         <span className=' text-[24px] text-one'>{data?.total_events ?? "N/A"}</span>
          </div>
          </div>
          {/*  */}
      
          {/*  */}
        <div className='h-30 bg-eight W-[25%] flex items-center p-4 gap-4'>
      <HiClock className='h-10 w-10 text-one'/>
          <div className='flex flex-col gap-1'>
           <span className='text-nine text-[16px]'>Total hours </span>
         <span className=' text-[24px] text-one'>{data?.total_hours ?? "N/A"}</span>
          </div>
          </div>
      
     
  </div>
        <div>
          {renderContent()}
        </div>
      </div>
     
        )
    }

export default Organizeationdatali
