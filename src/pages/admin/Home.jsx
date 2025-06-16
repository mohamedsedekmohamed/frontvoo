import React, { useEffect, useState } from 'react'
import { FaUsers } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";import BarChart from "../../ui/BarChart"
import { FaTableCells } from "react-icons/fa6";
import { VscCheck } from "react-icons/vsc";
import { RxLapTimer } from "react-icons/rx";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImUsers } from "react-icons/im";
import { FaHouseFlag } from "react-icons/fa6";

const Home = () => {


  const [data, setData] = useState([]);

 useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get("https://backndVoo.voo-hub.com/api/admin/Home", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then(response => {
        setData(response.data);
    })
      .catch(() => {
        toast.error("Error fetching data");
      });
  }, []);
 
  return (
    <div className='w-full mt-6 '>
      {/* boxs */}
  <div class="grid  grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2 h-full mx-5">
    {/* one */}
<div className='w-[23%} h-[159px] bg-threeteen  text-three flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><FaUsers className='text-three'/></i><span>Active Volunteers    </span> </div>
  <span className='text-2xl'>{data.users_volunters} </span>
</div>
{/* two */}
<div className='w-[23%} h-[159px] bg-fourteen  text-one flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl items-center'><i><FaTableCells active/></i><span>Current Tasks </span> </div>
  <span className='text-2xl'> {data.current_tasks_count}</span>
</div>

{/* threr */}

<div className='w-[23%} h-[159px] bg-threeteen text-three  text-one flex flex-col  gap-6 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[20px] lg:text-2xl  items-center'><i><VscCheck active/></i><span>Completed Tasks  </span> </div>
  <span className='text-2xl'> {data.ended_tasks_count}</span>
</div>
{/* four */}
<div className='w-[23%} h-[159px] bg-fourteen  text-one flex flex-col  gap-4 p-8'>
  <div className='flex gap-1  text-[16px] md:text-[18px] lg:text-[20px]  items-center'><i><ImUsers /></i><span>Users Count   </span> </div>
  <span className='text-2xl'> {data.users_count}</span>
</div>
</div>
<div>
<BarChart  All={data.user_year}/>
</div>
<div className='flex justify-start pl-2'>
<div className='flex flex-col'>
<div className='bg-threeteen w-[95%] mt-10 mx-[10px] '>
  <div className='flex items-center text-three gap-1  text-[18px] md:text-2x1 lg:text-3xl'> 
<i><FaLocationDot/> </i>
<h2 className='p-3 text-three'>Top cities by request volume</h2>
  </div>
</div>
 <div className="space-y-2 p-4 bg-white rounded shadow-md">
{data?.cities
  ?.slice(0, 5)
  ?.map((item) => (
    <div key={item.id} className="flex items-center space-x-2">
      <span className="text-gray-800">{item.name}</span>
    </div>
))}

    </div>
</div>
<div className='flex flex-col'>
  <div className='bg-threeteen w-[95%] mt-10 mx-[10px] '>
  <div className='flex items-center text-three gap-1  text-[18px] md:text-2x1 lg:text-3xl'> 
<i><FaHouseFlag/> </i>
<h2 className='p-3 text-three'>Top countries</h2>
  </div>
</div>
 <div className="space-y-2 p-4 bg-white rounded shadow-md">
{data?.countries
  ?.slice(0, 3)
  ?.map((item) => (
    <div key={item.id} className="flex items-center space-x-2">
      <span className="text-gray-800">{item.name}</span>
      <span className="text-sm font-bold text-gray-500">({item.users_count})</span>
    </div>
))}

    </div>
</div>
</div>
{/*  */}
          <ToastContainer />
    
    </div>
  )}
export default Home;