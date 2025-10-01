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
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
  {/* واحد */}
  <div className="h-[160px] bg-threeteen text-three flex flex-col justify-between p-6 rounded-2xl shadow-md">
    <div className="flex items-center gap-2 text-lg md:text-xl  font-medium">
      <FaUsers className="text-three" />
      <span>Active Volunteers</span>
    </div>
    <span className="text-3xl font-bold">{data.users_volunters}</span>
  </div>

  {/* اتنين */}
  <div className="h-[160px] bg-fourteen text-one flex flex-col justify-between p-6 rounded-2xl shadow-md">
    <div className="flex items-center gap-2 text-lg md:text-xl  font-medium">
      <FaTableCells />
      <span>Current Tasks</span>
    </div>
    <span className="text-3xl font-bold">{data.current_tasks_count}</span>
  </div>

  {/* تلاتة */}
  <div className="h-[160px] bg-threeteen text-three flex flex-col justify-between p-6 rounded-2xl shadow-md">
    <div className="flex items-center gap-2 text-lg md:text-xl  font-medium">
      <VscCheck />
      <span>Completed Tasks</span>
    </div>
    <span className="text-3xl font-bold">{data.ended_tasks_count}</span>
  </div>

  {/* أربعة */}
  <div className="h-[160px] bg-fourteen text-one flex flex-col justify-between p-6 rounded-2xl shadow-md">
    <div className="flex items-center gap-2 text-lg md:text-xl  font-medium">
      <ImUsers />
      <span>Users Count</span>
    </div>
    <span className="text-3xl font-bold">{data.users_count}</span>
  </div>
</div>

<div>
<BarChart  All={data.user_year}/>
</div>
<div className='flex justify-start pl-2 flex-wrap'>
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