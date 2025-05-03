import React, { useEffect, useState } from 'react'
import { CiCircleMore } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdDateRange } from "react-icons/md";
import { IoPerson } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { VscExpandAll } from "react-icons/vsc";
import IconRequirements from '../../../Icons/IconRequirements';
import { HiMiniCheck } from "react-icons/hi2";
import axios from 'axios';
import { GiTrophyCup } from "react-icons/gi";

import 'react-toastify/dist/ReactToastify.css';
 const EventDetails = ({id}) => {
      const [data, setData] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem('token');
        axios.get(`https://backndVoo.voo-hub.com/api/orgnization/getTaskDetails/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
          .then(response => {
            setData(response.data.data);
          })
          .catch(() => {
          });
      }, []);
  return (
    <div className='flex  flex-col  justify-center items-center w-full gap-4'>
        {/* one and two */}
<div className='flex gap-5'>

<div className='flex flex-col gap-3 bg-eight w-[500px] h-[335px] p-5'>
    <div className='flex gap-2 my-1 items-center'>
    <CiCircleMore className='text-[24px] text-one'/> <span className='text-one font-medium text-[24px]'> Details</span> 
    </div>
    <span className='text-one  font-normal text-[20px] mt-2'> {data?.name??"N/A"}</span>
    
    <div className='flex gap-1 my-1 items-center'>
    <CiLocationOn className='text-[14px] text-ten '/> <span className='text-ten font-medium text-[16px]'>{data?.to_zone?.name??"N/A"} between {data?.from_zone?.name??"N/A"}</span> 
    </div>
    <div className='flex gap-1 my-1 items-center'>
    <MdDateRange className='text-[14px] text-ten '/> <span className='text-ten font-medium text-[12px]'> {data?.date??"N/A"}|{data?.start_time??"N/A"}</span> 
    </div>
    <div className='flex gap-1 my-1 items-center'>
    <GiTrophyCup className='text-[14px] text-ten '/> <span className='text-ten font-medium text-[16px]'> {data?.orgnization?.name ??"N/A"}</span> 
    </div>
    <div className='flex gap-1 my-1 items-center'>
    <IoPerson className='text-[14px] text-ten '/> <span className='text-ten font-medium text-[16px]'>volunteers {data?.number_of_volunteers??"N/A"} </span> 
    </div>
    <div className='flex gap-1 my-1 items-center'>
    <CiClock2    className='text-[14px] text-ten '/> <span className='text-ten font-medium text-[16px]'> hours {data?.task_hours??"N/A"} </span> 
    </div>
</div>
{/* start two */}
<div className='flex flex-col gap-3 bg-eight w-[500px] h-[335px] p-5'>
<div className='flex gap-2 my-1 items-center'>
    <CiLocationOn className='text-[24px] text-one'/> <span className='text-one font-medium text-[24px]'>Location </span> 
    </div>
    <span className='text-one  font-normal text-[20px] mt-2'> {data?.to_zone?.city?.name??"N/A"} & {data?.to_zone?.city?.country?.name??"N/A"} </span>
    <span className='text-ten  font-normal text-[14px] mt-2'> {data?.location??"N/A"}</span>
    <a href={data?.google_map_location??"null"} className='text-ten  font-normal text-[14px] mt-2'> google_map: {data?.google_map_location??"N/A"}</a>
    <span className='text-one  font-normal text-[20px] mt-6'> description </span>
    <span className='text-ten  font-normal text-[14px] mt-2'> {data?.description ??"N/A"}</span>
</div>
</div>
{/* three and four  */}
<div className='flex gap-5'>

<div className='flex flex-col gap-3 bg-eight w-[500px] h-[335px] p-5'>
<div className='flex gap-2 my-1 items-center'>
    <IconRequirements variant className='text-[24px] text-one'/> <span className='text-one font-medium text-[24px]'>Requirements </span> 
    </div>
    <span className='text-one  font-normal text-[20px] mt-2'> Requirements</span>
    {data?.task_requirments?.length > 0 ? (
  data.task_requirments.map((req) => (
    <div key={req.id} className='flex gap-1 my-1 items-center'>
      <HiMiniCheck className='text-[14px] text-one' />
      <span className='text-ten font-medium text-[16px]'>{req.requirment}</span>
    </div>
  ))
) : (
  <span className="text-ten">No requirements available</span>
)}
    
</div>
{/* four */}
<div className='flex flex-col gap-3 bg-eight w-[500px] h-[335px] p-5'>
<div className='flex gap-2 my-1 items-center'>
    <VscExpandAll    variant className='text-[24px] text-one'/> <span className='text-one font-medium text-[24px]'>Benefits </span> 
    </div>
    <span className='text-one  font-normal text-[20px] mt-2'> Benefits</span>
    {data?.task_benfits?.length > 0 ? (
  data.task_benfits.map((req) => (
    <div key={req.id} className='flex gap-1 my-1 items-center'>
      <HiMiniCheck className='text-[14px] text-one' />
      <span className='text-ten font-medium text-[16px]'>{req.benfit}</span>
    </div>
  ))
) : (
  <span className="text-ten">No requirements available</span>
)}
    
</div>        
    </div>
    
    </div>
  )
}
export default EventDetails