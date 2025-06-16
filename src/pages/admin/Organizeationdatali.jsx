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
       import IconDash from '../../ui/IconDash'
import { IoPersonSharp } from "react-icons/io5";
import IconDate from '../../Icons/IconDate';
import { IoLocationSharp } from "react-icons/io5";
import { RiOrganizationChart } from "react-icons/ri";
import { TbFileDescription } from "react-icons/tb";
const Organizeationdatali = () => {
   const navigate = useNavigate();
      const location = useLocation();
      const [data,setData]=useState('')
      const [activeTab, setActiveTab] = useState('info');
        useEffect(()=>{
          const { sendData } = location.state || {};
          console.log(sendData)
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

        <span className='text-2xl font-medium my-6'>Orgnization
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
              <span className='text-nine text-[16px]'>
  Created : {data?.created_at ? new Date(data.created_at).toISOString().split('T')[0] : "N/A"}
</span>
        
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
    <div className="flex flex-col items-center">
      <span className="mb-2 text-sm text-gray-700">Organization </span>
      <img className="h-30" src={data?.user_papers?.[0]?.orgnization_paper ?? ""} alt="organization_paper" />
    </div>
  </div>
  
     
          </>
        )}
              </div>
        </div>
              </div>;
                  case 'events':
            return<div className="flex flex-col gap-4">
  <h2 className="text-2xl font-semibold text-three mb-6">All Events</h2>

  {data?.events?.map((event,index) => (
    <details
      key={event.id}
      className=" rounded-md shadow-md  bg-elven" 
    >
      <summary className="cursor-pointer  my-4 text-lg font-semibold text-white">
{index+1}  Event  
  </summary>

      <div className=" bg-four text-sm mt-4 flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-4">
        <div className='p-4 space-y-2'>

  <div className=" rounded flex gap-2 items-center  "> 
  <IoPersonSharp  className='text-three text-2xl font-medium'/>
  <span className='text-three font-semibold text-[20px]'>   Event name</span>
        </div>
        <span className='text-twelve font-semibold text-[16px]'>{event.name ?? "N/A"}</span>
  
  </div>

  <div className='p-4 space-y-2'>

<div className=" rounded flex gap-2 items-center  "> 
<IconDate variant/>
<span className='text-three font-semibold text-[20px]'>Date & Time Details </span>
      </div>
      <div className='flex flex-col gap-4'>
      <span className='text-twelve font-semibold text-[16px]'>Date: {event.date  ?? "N/A"}</span>
      <span className='text-twelve font-semibold text-[16px]'>Start Time : {event.start_time  ?? "N/A"}</span>
      <span className='text-twelve font-semibold text-[16px]'>End Time: {event.end_time  ?? "N/A"}</span>
      </div>

</div>


<div className='p-4 space-y-2'>

<div className=" rounded flex gap-2 items-center  "> 
<IoLocationSharp  className='text-three text-2xl font-medium'/>
<span className='text-three font-semibold text-[20px]'>Location & Map Link </span>
      </div>
      <div className='flex flex-col gap-4'>
      <span className='text-twelve font-semibold text-[16px]'>Location: <a href={event.location}>{event.location  ?? "N/A"}</a></span>
      <span className='text-twelve font-semibold   text-[16px]'>Map Link :<a   className="underline" href={event.google_maps_location }>{event.google_maps_location  ?? "N/A"}</a></span>
      </div>

</div>


<div className='p-4 space-y-2'>

<div className=" rounded flex gap-2 items-center  "> 
<TbFileDescription  className='text-three text-2xl font-medium'/>
<span className='text-three font-semibold text-[20px]'>Description  </span>
      </div>
      <span className='text-twelve font-semibold text-[16px]'> {event.description  ?? "N/A"}</span>

</div>
  
<div className='p-4 space-y-2'>

<div className=" rounded flex gap-2 items-center  "> 
<RiOrganizationChart  className='text-three text-2xl font-medium'/>
<span className='text-three font-semibold text-[20px]'>Volunteers & Organizers Info </span>
      </div>
      <div className='flex flex-col gap-4'>
      <span className='text-twelve font-semibold text-[16px]'>Number of Volunteers: {event.number_of_volunteers  ?? "N/A"}</span>
      <span className='text-twelve font-semibold text-[16px]'>Available Volunteers:: {event.available_volunteers  ?? "N/A"}</span>
      <span className='text-twelve font-semibold text-[16px]'> Number Of Organizers:: {event.number_of_organizers  ?? "N/A"}</span>
      <span className='text-twelve font-semibold text-[16px]'>Event Hours : {event.event_hours  ?? "N/A"}</span>
      </div>
      
</div>
</div>
      </div>
    </details>
  ))}
</div>

             case 'tasks':
            return <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold text-three mb-6">All Tasks</h2>
          
            {data?.tasks?.map((event,index) => (
              <details
                key={event.id}
                className=" rounded-md shadow-md  bg-elven" 
              >
                <summary className="cursor-pointer  my-4 text-lg font-semibold text-white">
          {index+1}  Task  
            </summary>
          
                <div className=" bg-four text-sm mt-4 flex flex-col gap-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className='p-4 space-y-2'>
          
            <div className=" rounded flex gap-2 items-center  "> 
            <IoPersonSharp  className='text-three text-2xl font-medium'/>
            <span className='text-three font-semibold text-[20px]'>   Event name</span>
                  </div>
                  <span className='text-twelve font-semibold text-[16px]'>{event.name ?? "N/A"}</span>
            
            </div>
          
            <div className='p-4 space-y-2'>
          
          <div className=" rounded flex gap-2 items-center  "> 
          <IconDate variant/>
          <span className='text-three font-semibold text-[20px]'>Date & Time Details </span>
                </div>
                <div className='flex flex-col gap-4'>
                <span className='text-twelve font-semibold text-[16px]'>Date: {event.date  ?? "N/A"}</span>
                <span className='text-twelve font-semibold text-[16px]'>Start Time : {event.start_time  ?? "N/A"}</span>
                <span className='text-twelve font-semibold text-[16px]'> Task Hours: {event.task_hours  ?? "N/A"}</span>

                </div>
          
          </div>
          
          
          <div className='p-4 space-y-2'>
          
          <div className=" rounded flex gap-2 items-center  "> 
          <IoLocationSharp  className='text-three text-2xl font-medium'/>
          <span className='text-three font-semibold text-[20px]'>Location & Map Link </span>
                </div>
                <div className='flex flex-col gap-4'>
                <span className='text-twelve font-semibold text-[16px]'>Location: {event.location  ?? "N/A"}</span>
                <span className='text-twelve font-semibold   text-[16px]'>Map Link :<a   className="underline" href={event.google_maps_location }>{event.google_map_location  ?? "N/A"}</a></span>
                </div>
          
          </div>
          
          
          <div className='p-4 space-y-2'>
          
          <div className=" rounded flex gap-2 items-center  "> 
          <TbFileDescription  className='text-three text-2xl font-medium'/>
          <span className='text-three font-semibold text-[20px]'>Description  </span>
                </div>
                <span className='text-twelve font-semibold text-[16px]'> {event.description  ?? "N/A"}</span>
          
          </div>
            
 
          </div>
                </div>
              </details>
            ))}
          </div>
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
